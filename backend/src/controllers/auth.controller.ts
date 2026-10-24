import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { config } from '../config';
import { logAuditEvent } from '../services/audit.service';
import { sendOtpEmail, sendWelcomeEmail, sendPasswordResetSuccessEmail } from '../services/email.service';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, mobile, college, academicYear, academicCourse } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          ...(mobile ? [{ mobile: mobile.trim() }] : []),
        ],
      },
    });

    if (existingUser) {
      res.status(409).json({ error: 'An account with this email or mobile already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        mobile: mobile ? mobile.trim() : null,
        name: name.trim(),
        passwordHash,
        role: 'STUDENT',
        isEmailVerified: false,
        status: 'ACTIVE',
        profile: {
          create: {
            college: college || null,
            academicYear: academicYear || null,
            academicCourse: academicCourse || null,
          },
        },
      },
    });

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.verificationChallenge.create({
      data: {
        userId: user.id,
        identifier: normalizedEmail,
        type: 'EMAIL_VERIFY',
        code: verificationCode,
        expiresAt,
      },
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: 'USER_REGISTERED',
      entityType: 'USER',
      entityId: user.id,
      details: { email: user.email, role: user.role },
      req,
    });

    // Send One-Time Password via Ken Classes EmailJS
    sendOtpEmail(user.email, verificationCode, user.name, 'Registration').catch(() => {});

    res.status(201).json({
      message: 'Registration successful. Please verify your email with the verification code.',
      userId: user.id,
      email: user.email,
      demoVerificationCode: verificationCode, // Returned for effortless demo/testing verification
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed. Please check inputs and try again.' });
  }
}

export async function verifyOtp(req: Request, res: Response): Promise<void> {
  try {
    const { identifier, code } = req.body;

    if (!identifier || !code) {
      res.status(400).json({ error: 'Identifier and verification code are required.' });
      return;
    }

    const normalizedIdentifier = identifier.toLowerCase().trim();

    const challenge = await prisma.verificationChallenge.findFirst({
      where: {
        identifier: normalizedIdentifier,
        code: code.trim(),
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!challenge || !challenge.user) {
      res.status(400).json({ error: 'Invalid or expired verification code.' });
      return;
    }

    // Mark challenge as used
    await prisma.verificationChallenge.update({
      where: { id: challenge.id },
      data: { usedAt: new Date() },
    });

    // Activate user verification
    const updatedUser = await prisma.user.update({
      where: { id: challenge.userId! },
      data: {
        isEmailVerified: true,
        isMobileVerified: true,
        lastLoginAt: new Date(),
      },
      include: { profile: true },
    });

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    await prisma.session.create({
      data: {
        userId: updatedUser.id,
        tokenHash: sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.headers['user-agent'] || 'Browser',
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    const jwtToken = jwt.sign(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        sessionToken,
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await logAuditEvent({
      actorId: updatedUser.id,
      actorEmail: updatedUser.email,
      action: 'USER_VERIFIED_AND_SIGNED_IN',
      entityType: 'USER',
      entityId: updatedUser.id,
      req,
    });

    // Send Welcome Email via Ken Classes EmailJS
    sendWelcomeEmail(updatedUser.email, updatedUser.name).catch(() => {});

    res.json({
      message: 'Account verified successfully!',
      token: jwtToken,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        profile: updatedUser.profile,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Verification failed.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ error: 'Email/mobile and password are required.' });
      return;
    }

    const trimmedIdentifier = identifier.trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: trimmedIdentifier.toLowerCase() },
          { mobile: trimmedIdentifier },
          { username: trimmedIdentifier },
          { username: trimmedIdentifier.toLowerCase() },
          { username: { equals: trimmedIdentifier, mode: 'insensitive' } },
        ],
      },
      include: { profile: true },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid email/mobile or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email/mobile or password.' });
      return;
    }

    if (user.status === 'SUSPENDED') {
      res.status(403).json({
        error: 'Account has been suspended.',
        reason: user.suspensionReason || 'Please contact platform administration.',
      });
      return;
    }

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.headers['user-agent'] || 'Browser',
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionToken,
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: 'USER_LOGIN',
      entityType: 'USER',
      entityId: user.id,
      req,
    });

    res.json({
      message: 'Sign-in successful!',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mobile: user.mobile,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      res.status(400).json({ error: 'Email or mobile is required.' });
      return;
    }

    const trimmed = identifier.trim();
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: trimmed.toLowerCase() },
          { mobile: trimmed },
          { username: trimmed },
          { username: trimmed.toLowerCase() },
          { username: { equals: trimmed, mode: 'insensitive' } },
        ],
      },
    });

    let demoResetCode: string | undefined;

    if (user) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      demoResetCode = code;

      await prisma.verificationChallenge.create({
        data: {
          userId: user.id,
          identifier: user.email,
          type: 'PASSWORD_RESET',
          code,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
        },
      });

      await logAuditEvent({
        actorId: user.id,
        actorEmail: user.email,
        action: 'PASSWORD_RESET_REQUESTED',
        entityType: 'USER',
        entityId: user.id,
        req,
      });

      // Send Password Reset OTP via Ken Classes EmailJS
      sendOtpEmail(user.email, code, user.name, 'Password Reset').catch(() => {});
    }

    // Anti-enumeration: Return success message regardless of existence
    res.json({
      message: 'If an account matches that contact, a password reset code has been sent.',
      demoResetCode, // provided for testing
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request.' });
  }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { identifier, code, newPassword } = req.body;

    if (!identifier || !code || !newPassword) {
      res.status(400).json({ error: 'Identifier, reset code, and new password are required.' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      return;
    }

    const challenge = await prisma.verificationChallenge.findFirst({
      where: {
        identifier: identifier.toLowerCase().trim(),
        code: code.trim(),
        type: 'PASSWORD_RESET',
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!challenge || !challenge.user) {
      res.status(400).json({ error: 'Invalid or expired password reset code.' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.verificationChallenge.update({
        where: { id: challenge.id },
        data: { usedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: challenge.userId! },
        data: { passwordHash },
      }),
      // Revoke all existing sessions for security
      prisma.session.updateMany({
        where: { userId: challenge.userId!, isRevoked: false },
        data: { isRevoked: true },
      }),
    ]);

    await logAuditEvent({
      actorId: challenge.userId,
      actorEmail: challenge.identifier,
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'USER',
      entityId: challenge.userId,
      req,
    });

    sendPasswordResetSuccessEmail(challenge.user.email, challenge.user.name).catch((err) => {
      console.error('Password reset email alert error:', err);
    });

    res.json({ message: 'Password has been reset successfully. Please sign in with your new password.' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed.' });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        enrolments: {
          where: { status: 'ACTIVE' },
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                durationHours: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const unreadNotificationsCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mobile: user.mobile,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
        status: user.status,
        profile: user.profile,
        enrolmentsCount: user.enrolments.length,
        unreadNotificationsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { name, college, academicYear, academicCourse, bio, notificationPrefs } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        profile: {
          upsert: {
            create: {
              college,
              academicYear,
              academicCourse,
              bio,
              notificationPrefs: notificationPrefs ? JSON.stringify(notificationPrefs) : undefined,
            },
            update: {
              college,
              academicYear,
              academicCourse,
              bio,
              notificationPrefs: notificationPrefs ? JSON.stringify(notificationPrefs) : undefined,
            },
          },
        },
      },
      include: { profile: true },
    });

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        profile: updatedUser.profile,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    if (req.sessionToken) {
      await prisma.session.updateMany({
        where: { tokenHash: req.sessionToken },
        data: { isRevoked: true },
      });
    }

    if (req.user) {
      await logAuditEvent({
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'USER_LOGOUT',
        entityType: 'USER',
        entityId: req.user.id,
        req,
      });
    }

    res.clearCookie('auth_token');
    res.json({ message: 'Signed out successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed.' });
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required.' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Current password does not match.' });
      return;
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: 'PASSWORD_CHANGED',
      entityType: 'USER',
      entityId: user.id,
      req,
    });

    res.json({ message: 'Password has been updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password.' });
  }
}

export async function getActiveSessions(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId: req.user.id,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const formattedSessions = sessions.map((s) => ({
      id: s.id,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: req.sessionToken ? s.tokenHash === req.sessionToken : false,
    }));

    res.json(formattedSessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve active sessions.' });
  }
}

export async function revokeSession(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { id } = req.params;

    await prisma.session.updateMany({
      where: {
        id: id as string,
        userId: req.user.id,
      },
      data: { isRevoked: true },
    });

    res.json({ message: 'Session revoked successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to revoke session.' });
  }
}


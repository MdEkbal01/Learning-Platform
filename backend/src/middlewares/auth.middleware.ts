import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { config } from '../config';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      sessionToken?: string;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.auth_token) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      res.status(401).json({ error: 'Authentication required. Please sign in.' });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      email: string;
      role: string;
      sessionToken?: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        status: true,
        suspensionReason: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'User account not found.' });
      return;
    }

    if (user.status === 'SUSPENDED') {
      res.status(403).json({
        error: 'Account suspended.',
        reason: user.suspensionReason || 'Please contact platform support for assistance.',
      });
      return;
    }

    // Inactivity timeout check (PRD AUTH-07)
    if (decoded.sessionToken) {
      const session = await prisma.session.findUnique({
        where: { tokenHash: decoded.sessionToken },
      });

      if (!session || session.isRevoked) {
        res.status(401).json({ error: 'Session revoked. Please sign in again.' });
        return;
      }

      const now = new Date();
      const diffMinutes = (now.getTime() - session.lastActiveAt.getTime()) / (1000 * 60);

      if (diffMinutes > config.sessionInactivityTimeoutMinutes) {
        await prisma.session.update({
          where: { id: session.id },
          data: { isRevoked: true },
        });
        res.status(401).json({
          error: 'Session expired due to inactivity. Please sign in again.',
          code: 'SESSION_INACTIVITY_TIMEOUT',
        });
        return;
      }

      // Refresh last active timestamp asynchronously
      prisma.session
        .update({
          where: { id: session.id },
          data: { lastActiveAt: now },
        })
        .catch(() => {});
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    req.sessionToken = decoded.sessionToken;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired session token. Please sign in again.' });
  }
}

// Optional authentication helper (e.g. for course preview where anonymous visitor is also allowed)
export async function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.auth_token) {
      token = req.cookies.auth_token;
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret) as {
        userId: string;
        email: string;
        role: string;
      };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true, name: true, status: true },
      });
      if (user && user.status === 'ACTIVE') {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        };
      }
    }
  } catch {
    // Ignore error for optional auth
  }
  next();
}

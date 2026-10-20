import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function getPreferences(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: {
        theme: true,
        language: true,
        notificationPrefs: true,
      },
    });

    res.json({
      theme: profile?.theme || 'light',
      language: profile?.language || 'en',
      notificationPrefs: profile?.notificationPrefs
        ? JSON.parse(profile.notificationPrefs)
        : { email: true, sms: false, doubts: true, announcements: true },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve preferences.' });
  }
}

export async function updatePreferences(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { theme, language, notificationPrefs } = req.body;

    if (theme && !['light', 'dark'].includes(theme)) {
      res.status(400).json({ error: 'Invalid theme. Only "light" and "dark" are supported.' });
      return;
    }

    if (language && !['en', 'hi'].includes(language)) {
      res.status(400).json({ error: 'Invalid language. Only "en" and "hi" are supported.' });
      return;
    }

    const updated = await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        theme: theme || 'light',
        language: language || 'en',
        notificationPrefs: notificationPrefs ? JSON.stringify(notificationPrefs) : undefined,
      },
      update: {
        ...(theme ? { theme } : {}),
        ...(language ? { language } : {}),
        ...(notificationPrefs ? { notificationPrefs: JSON.stringify(notificationPrefs) } : {}),
      },
    });

    res.json({
      message: 'Preferences updated successfully.',
      preferences: {
        theme: updated.theme,
        language: updated.language,
        notificationPrefs: updated.notificationPrefs ? JSON.parse(updated.notificationPrefs) : {},
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences.' });
  }
}

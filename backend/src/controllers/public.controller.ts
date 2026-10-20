import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../prisma';
import { config } from '../config';

export async function verifyCertificate(req: Request, res: Response): Promise<void> {
  try {
    const code = req.params.code as string;

    const cert = await prisma.certificate.findUnique({
      where: { certificateCode: code.trim().toUpperCase() },
      include: {
        course: { select: { id: true, title: true, instructorName: true, durationHours: true } },
        user: { select: { id: true, name: true } },
      },
    });

    if (!cert) {
      res.status(404).json({
        isValid: false,
        error: 'Certificate not found. The certificate code is invalid or does not exist.',
      });
      return;
    }

    res.json({
      isValid: true,
      certificateCode: cert.certificateCode,
      studentName: cert.studentName,
      courseTitle: cert.courseTitle,
      issuedAt: cert.issuedAt,
      instructorName: cert.course.instructorName,
      durationHours: cert.course.durationHours,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify certificate.' });
  }
}

export async function serveUpload(req: Request, res: Response): Promise<void> {
  try {
    const filename = req.params.filename as string;

    const safeFilename = path.basename(filename);
    const filePath = path.join(config.uploadDir, safeFilename);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found.' });
      return;
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: 'Failed to serve file.' });
  }
}

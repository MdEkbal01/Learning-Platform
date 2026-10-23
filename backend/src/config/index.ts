import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'lms_secure_super_secret_jwt_key_2026_xyz',
  jwtExpiresIn: '7d', // Token lifetime
  sessionInactivityTimeoutMinutes: parseInt(process.env.SESSION_TIMEOUT_MINUTES || '120', 10), // 2 hours
  uploadDir: path.join(__dirname, '../../uploads/secure'),
  corsOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://auralms-platform.pages.dev',
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()) : []),
  ],
};

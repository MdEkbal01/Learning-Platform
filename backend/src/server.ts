import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { prisma } from './prisma';

import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import studentRoutes from './routes/student.routes';
import paymentRoutes from './routes/payment.routes';
import doubtRoutes from './routes/doubt.routes';
import forumRoutes from './routes/forum.routes';
import mentorRoutes from './routes/mentor.routes';
import contentRoutes from './routes/content.routes';
import financeRoutes from './routes/finance.routes';
import moderatorRoutes from './routes/moderator.routes';
import adminRoutes from './routes/admin.routes';
import publicRoutes from './routes/public.routes';
import preferencesRoutes from './routes/preferences.routes';
import feedbackRoutes from './routes/feedback.routes';
import supportRoutes from './routes/support.routes';

const app = express();

// Security: Enable CORS with allowed origins and credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        config.corsOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Abuse & Brute-force rate limiting (PRD AUTH-08)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 auth attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Public maintenance status endpoint for frontend banner
app.get('/api/maintenance/status', async (req: Request, res: Response) => {
  try {
    const flags = await prisma.maintenanceFlag.findMany();
    res.json(flags);
  } catch (error) {
    res.json([]);
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', courseRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/moderator', moderatorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/support', supportRoutes);
app.use('/api', publicRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'Online Learning & Course Management Platform',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'An unexpected internal server error occurred.',
  });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` LMS API Server running on http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Session inactivity timeout: ${config.sessionInactivityTimeoutMinutes} minutes`);
  console.log(`=======================================================`);
});

export default app;

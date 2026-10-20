import { Router } from 'express';
import {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  logout,
  changePassword,
  getActiveSessions,
  revokeSession,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected auth endpoints
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);
router.get('/sessions', authenticate, getActiveSessions);
router.delete('/sessions/:id', authenticate, revokeSession);
router.post('/logout', authenticate, logout);

export default router;

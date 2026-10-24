import { Router } from 'express';
import {
  submitFeedback,
  getFeedbacks,
  updateFeedbackStatus,
} from '../controllers/feedback.controller';
import { optionalAuthenticate, authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Submit feedback (visitors or logged in users)
router.post('/', optionalAuthenticate, upload.single('attachment'), submitFeedback);

// View feedback (students see own, staff see all)
router.get('/', authenticate, getFeedbacks);

// Staff triage workflow
router.patch('/:id/status', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'FINANCE_SUPPORT', 'MODERATOR'), updateFeedbackStatus);

export default router;

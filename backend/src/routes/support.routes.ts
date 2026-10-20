import { Router } from 'express';
import {
  getFaqs,
  createSupportTicket,
  getSupportTickets,
  getSupportTicketDetails,
  addTicketMessage,
  updateTicketStatus,
  submitTicketFeedback,
} from '../controllers/support.controller';
import { optionalAuthenticate, authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Public FAQs (English & Hindi)
router.get('/faqs', getFaqs);

// Submit support ticket (accessible to logged-in users & account-recovery sign-in problems)
router.post('/tickets', optionalAuthenticate, upload.single('attachment'), createSupportTicket);

// View tickets
router.get('/tickets', authenticate, getSupportTickets);
router.get('/tickets/:id', authenticate, getSupportTicketDetails);
router.post('/tickets/:id/messages', authenticate, upload.single('attachment'), addTicketMessage);
router.post('/tickets/:id/feedback', authenticate, submitTicketFeedback);

// Staff ticket management
router.patch('/tickets/:id/status', authenticate, requireRoles('SUPER_ADMIN', 'FINANCE_SUPPORT', 'MODERATOR'), updateTicketStatus);

export default router;

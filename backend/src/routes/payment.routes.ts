import { Router } from 'express';
import { createOrder, verifyPayment, simulateWebhook } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { checkMaintenance } from '../middlewares/maintenance.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/create-order', checkMaintenance('PAYMENT_CHECKOUT'), createOrder);
router.post('/verify', checkMaintenance('PAYMENT_CHECKOUT'), verifyPayment);
// Secure gateway simulation: Only Super Admin can simulate webhooks
router.post('/simulate-webhook', requireRoles('SUPER_ADMIN'), simulateWebhook);

export default router;

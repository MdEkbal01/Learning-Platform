import { Router } from 'express';
import { createOrder, verifyPayment, simulateWebhook } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { checkMaintenance } from '../middlewares/maintenance.middleware';

const router = Router();

router.use(authenticate);

router.post('/create-order', checkMaintenance('PAYMENT_CHECKOUT'), createOrder);
router.post('/verify', checkMaintenance('PAYMENT_CHECKOUT'), verifyPayment);
router.post('/simulate-webhook', simulateWebhook);

export default router;

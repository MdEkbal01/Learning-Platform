import { Router } from 'express';
import {
  getFinanceOverview,
  getAllOrders,
  processRefund,
  reconcileOrder,
} from '../controllers/finance.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, requireRoles('FINANCE_SUPPORT', 'SUPER_ADMIN'));

router.get('/overview', getFinanceOverview);
router.get('/orders', getAllOrders);
router.post('/refund', processRefund);
router.post('/reconcile/:orderId', reconcileOrder);

export default router;

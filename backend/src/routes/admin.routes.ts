import { Router } from 'express';
import {
  getAdminAnalytics,
  getUsers,
  updateUserRole,
  updateUserStatus,
  manualEnrolmentGrant,
  getAuditLogs,
  getMaintenanceFlags,
  toggleMaintenanceFlag,
} from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, requireRoles('SUPER_ADMIN'));

router.get('/analytics', getAdminAnalytics);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.post('/enrolments/manual', manualEnrolmentGrant);
router.get('/audit-logs', getAuditLogs);
router.get('/maintenance', getMaintenanceFlags);
router.post('/maintenance', toggleMaintenanceFlag);

export default router;

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

// Require valid authentication token for all admin endpoints
router.use(authenticate);

// Operational routes: Accessible by both Admin and Super Admin
router.get('/analytics', requireRoles('ADMIN', 'SUPER_ADMIN'), getAdminAnalytics);
router.get('/users', requireRoles('ADMIN', 'SUPER_ADMIN'), getUsers);
router.patch('/users/:id/role', requireRoles('ADMIN', 'SUPER_ADMIN'), updateUserRole);
router.patch('/users/:id/status', requireRoles('ADMIN', 'SUPER_ADMIN'), updateUserStatus);
router.post('/enrolments/manual', requireRoles('ADMIN', 'SUPER_ADMIN'), manualEnrolmentGrant);

// Critical Infrastructure & Security Audit routes: STRICTLY SUPER_ADMIN ONLY
router.get('/audit-logs', requireRoles('SUPER_ADMIN'), getAuditLogs);
router.get('/maintenance', requireRoles('SUPER_ADMIN'), getMaintenanceFlags);
router.post('/maintenance', requireRoles('SUPER_ADMIN'), toggleMaintenanceFlag);

export default router;

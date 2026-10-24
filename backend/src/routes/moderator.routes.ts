import { Router } from 'express';
import { getModerationQueue, takeModerationAction } from '../controllers/moderator.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, requireRoles('MODERATOR', 'ADMIN', 'SUPER_ADMIN'));

router.get('/queue', getModerationQueue);
router.post('/reports/:reportId/action', takeModerationAction);

export default router;

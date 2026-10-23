import { Router } from 'express';
import {
  getMentorDashboard,
  getMentorCourses,
  scheduleLiveClass,
  updateLiveClass,
  publishLiveClassRecording,
} from '../controllers/mentor.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, requireRoles('MENTOR', 'SUPER_ADMIN'));

router.get('/dashboard', getMentorDashboard);
router.get('/courses', getMentorCourses);
router.post('/live-classes', scheduleLiveClass);
router.patch('/live-classes/:id', updateLiveClass);
router.post('/live-classes/:id/publish-recording', publishLiveClassRecording);

export default router;

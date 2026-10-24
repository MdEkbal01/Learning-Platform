import { Router } from 'express';
import {
  getAllCourses,
  createCourse,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
  addModule,
  addLesson,
  updateLesson,
  deleteLesson,
  createOrUpdateQuiz,
} from '../controllers/content.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, requireRoles('CONTENT_MANAGER', 'ADMIN', 'SUPER_ADMIN'));

router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.patch('/courses/:id/status', updateCourseStatus);

router.post('/courses/:courseId/modules', addModule);
router.post('/modules/:moduleId/lessons', addLesson);
router.put('/lessons/:lessonId', updateLesson);
router.delete('/lessons/:lessonId', deleteLesson);

router.post('/modules/:moduleId/quiz', createOrUpdateQuiz);

export default router;

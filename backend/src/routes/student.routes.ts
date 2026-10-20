import { Router } from 'express';
import {
  getMyCourses,
  getClassroom,
  updateLessonProgress,
  getModuleQuiz,
  submitModuleQuiz,
  getOrGenerateCertificate,
  getStudentOrders,
  getStudentLiveClasses,
} from '../controllers/student.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/my-courses', getMyCourses);
router.get('/classroom/:courseId', getClassroom);
router.post('/lessons/:lessonId/progress', updateLessonProgress);
router.get('/quizzes/:moduleId', getModuleQuiz);
router.post('/quizzes/:moduleId/submit', submitModuleQuiz);
router.get('/certificates/:courseId', getOrGenerateCertificate);
router.get('/orders', getStudentOrders);
router.get('/live-classes', getStudentLiveClasses);

export default router;

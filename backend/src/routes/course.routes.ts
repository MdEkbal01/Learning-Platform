import { Router } from 'express';
import { getCourses, getCourseDetails, getCategories } from '../controllers/course.controller';
import { optionalAuthenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/courses', getCourses);
router.get('/courses/:idOrSlug', optionalAuthenticate, getCourseDetails);
router.get('/categories', getCategories);

export default router;

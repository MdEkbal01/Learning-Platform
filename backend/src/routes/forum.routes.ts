import { Router } from 'express';
import {
  getTopics,
  createTopic,
  getTopicDetails,
  addPost,
  reportContent,
} from '../controllers/forum.controller';
import { optionalAuthenticate, authenticate } from '../middlewares/auth.middleware';
import { checkMaintenance } from '../middlewares/maintenance.middleware';

const router = Router();

router.get('/courses/:courseId/topics', optionalAuthenticate, getTopics);
router.get('/topics/:topicId', optionalAuthenticate, getTopicDetails);

// Writing requires authentication & maintenance check
router.post('/courses/:courseId/topics', authenticate, checkMaintenance('COMMUNITY_FORUM'), createTopic);
router.post('/topics/:topicId/posts', authenticate, checkMaintenance('COMMUNITY_FORUM'), addPost);
router.post('/report', authenticate, reportContent);

export default router;

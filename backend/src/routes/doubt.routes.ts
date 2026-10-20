import { Router } from 'express';
import {
  createDoubt,
  getDoubts,
  getDoubtDetails,
  addDoubtMessage,
  updateDoubtStatus,
} from '../controllers/doubt.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(authenticate);

router.post('/', upload.single('attachment'), createDoubt);
router.get('/', getDoubts);
router.get('/:id', getDoubtDetails);
router.post('/:id/messages', upload.single('attachment'), addDoubtMessage);
router.patch('/:id/status', updateDoubtStatus);

export default router;

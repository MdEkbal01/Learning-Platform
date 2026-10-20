import { Router } from 'express';
import { verifyCertificate, serveUpload } from '../controllers/public.controller';

const router = Router();

router.get('/verify-certificate/:code', verifyCertificate);
router.get('/uploads/:filename', serveUpload);

export default router;

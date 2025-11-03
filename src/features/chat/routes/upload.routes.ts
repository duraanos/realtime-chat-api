import express from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../../../shared/middlewares/auth';
import { uploadMiddleware } from '../middlewares/upload';

const router = express.Router();

router.post('/', authMiddleware, uploadMiddleware, uploadController.uploadFile);

export default router

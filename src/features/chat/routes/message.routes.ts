import express from 'express';
import { messageController } from '../controllers/message.controller';

const router = express.Router();

router.get('/history/:roomName', messageController.handleRoomHistory);

export default router;

import express from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../../../shared/middlewares/auth';

const router = express.Router();

router.get('/', authMiddleware, userController.handleGetAllUsers);
router.get('/:id', authMiddleware, userController.handleGetUserById);
router.patch('/:id', authMiddleware, userController.handleUpdateUser);
router.delete('/id', authMiddleware, userController.handleDeleteUser);

export default router;

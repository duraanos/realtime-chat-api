import express from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../../../shared/middlewares/auth';
import { authorizeRoles } from '../../../shared/middlewares/role';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  authorizeRoles('admin'),
  userController.handleGetAllUsers
);
router.get(
  '/:id',
  authMiddleware,
  authorizeRoles('user', 'admin'),
  userController.handleGetUserById
);
router.patch(
  '/:id',
  authMiddleware,
  authorizeRoles('admin'),
  userController.handleUpdateUser
);
router.delete(
  '/id',
  authMiddleware,
  authorizeRoles('admin'),
  userController.handleDeleteUser
);
router.post(
  '/fcm-token',
  authMiddleware,
  authorizeRoles('user'),
  userController.handleRegisterFCMToken
);

export default router;

import express from 'express';
import {
  register,
  login,
  getProfile,
  requestPasswordReset,
  resetPassword,
  changePassword,
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, requestPasswordReset);
router.post('/reset-password', validateResetPassword, resetPassword);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/change-password', authenticateToken, validateChangePassword, changePassword);

export default router; 
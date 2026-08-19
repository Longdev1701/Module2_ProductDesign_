import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from './controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const authRouter = Router();

// Rate limiter for login: 20 attempts per minute per IP
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 1 phút.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post('/register', AuthController.register);
authRouter.post('/login', loginLimiter, AuthController.login);
authRouter.post('/logout', authMiddleware, AuthController.logout);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post('/reset-password', AuthController.resetPassword);
authRouter.get('/me', authMiddleware, AuthController.getMe);
authRouter.patch('/profile', authMiddleware, AuthController.updateProfile);

export default authRouter;

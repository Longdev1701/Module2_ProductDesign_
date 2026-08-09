import { Request, Response, NextFunction } from 'express';
import { AuthService } from './service';
import { registerSchema, loginSchema, updateProfileSchema, forgotPasswordSchema, resetPasswordSchema } from './schema';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dữ liệu nhập vào không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await AuthService.register(validation.data, req.ip);

      return res.status(201).json({
        data: result,
        meta: {
          requestId: req.requestId || '',
        },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dữ liệu nhập vào không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await AuthService.login(validation.data, req.ip);

      return res.status(200).json({
        data: result,
        meta: {
          requestId: req.requestId || '',
        },
      });
    } catch (err: any) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHENTICATED',
          message: err.message || 'Đăng nhập thất bại',
        },
      });
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Chưa đăng nhập',
          },
        });
      }

      const result = await AuthService.getMe(req.user.id);

      return res.status(200).json({
        data: result,
        meta: {
          requestId: req.requestId || '',
        },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Chưa đăng nhập',
          },
        });
      }

      const validation = updateProfileSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dữ liệu cập nhật không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await AuthService.updateProfile(req.user.id, validation.data);

      return res.status(200).json({
        data: result,
        meta: {
          requestId: req.requestId || '',
        },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(200).json({
          data: { message: 'Đăng xuất thành công' },
          meta: { requestId: req.requestId || '' },
        });
      }

      const result = await AuthService.logout(req.user.id, req.ip);

      return res.status(200).json({
        data: result,
        meta: {
          requestId: req.requestId || '',
        },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = forgotPasswordSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email không đúng định dạng',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await AuthService.forgotPassword(validation.data.email, req.ip);

      return res.status(200).json({
        data: result,
        meta: {
          requestId: req.requestId || '',
        },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = resetPasswordSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dữ liệu không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await AuthService.resetPassword(validation.data.email, validation.data.newPassword, req.ip);

      return res.status(200).json({
        data: result,
        meta: {
          requestId: req.requestId || '',
        },
      });
    } catch (err: any) {
      return res.status(400).json({
        error: {
          code: 'RESET_PASSWORD_FAILED',
          message: err.message || 'Đặt lại mật khẩu thất bại',
        },
      });
    }
  }
}

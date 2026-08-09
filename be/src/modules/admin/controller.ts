import { Request, Response, NextFunction } from 'express';
import { AdminService } from './service';
import { adminCreateOrgSchema, adminAssignMemberSchema } from './schema';

export class AdminController {
  static async createOrganization(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Chưa đăng nhập' } });
      }

      const validation = adminCreateOrgSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dữ liệu doanh nghiệp không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await AdminService.createOrganization(req.user.id, validation.data, req.ip);

      return res.status(201).json({
        data: result,
        meta: { requestId: req.requestId || '' },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async assignMember(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Chưa đăng nhập' } });
      }

      const orgId = req.params.id;
      const validation = adminAssignMemberSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Thông tin phân quyền không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await AdminService.assignMember(req.user.id, orgId, validation.data, req.ip);

      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId || '' },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async getAllOrganizations(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getAllOrganizations();
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId || '' },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getAllUsers();
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId || '' },
      });
    } catch (err: any) {
      return next(err);
    }
  }
}

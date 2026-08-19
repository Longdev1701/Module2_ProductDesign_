import { Request, Response, NextFunction } from 'express';
import { AdminService } from './service';
import {
  adminCreateOrgSchema,
  adminUpdateOrgSchema,
  adminAssignMemberSchema,
  adminChangePlatformRoleSchema,
  adminQuerySchema,
  adminCiferQuerySchema,
  adminAuditLogQuerySchema,
} from './schema';

export class AdminController {
  /**
   * 1. Tổng quan hệ thống (Overview)
   */
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getOverview();
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId || '' },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  /**
   * 2. Quản lý Doanh nghiệp (Organizations)
   */
  static async getAllOrganizations(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = adminQuerySchema.safeParse(req.query);
      const query = validation.success ? validation.data : undefined;
      const result = await AdminService.getAllOrganizations(query);

      return res.status(200).json({
        data: result.items,
        meta: {
          requestId: req.requestId || '',
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
        },
      });
    } catch (err: any) {
      return next(err);
    }
  }

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

  static async updateOrganization(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Chưa đăng nhập' } });
      }

      const orgId = req.params.id;
      const validation = adminUpdateOrgSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dữ liệu cập nhật không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await AdminService.updateOrganization(req.user.id, orgId, validation.data, req.ip);

      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId || '' },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async deleteOrganization(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Chưa đăng nhập' } });
      }

      const orgId = req.params.id;
      const result = await AdminService.deleteOrganization(req.user.id, orgId, req.ip);

      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId || '' },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  /**
   * 3. Quản lý Tài khoản & Phân quyền (Users & RBAC)
   */
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = adminQuerySchema.safeParse(req.query);
      const query = validation.success ? validation.data : undefined;
      const result = await AdminService.getAllUsers(query);

      return res.status(200).json({
        data: result.items,
        meta: {
          requestId: req.requestId || '',
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
        },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async changeUserPlatformRole(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Chưa đăng nhập' } });
      }

      const targetUserId = req.params.id;
      const validation = adminChangePlatformRoleSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Vai trò nền tảng không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await AdminService.changeUserPlatformRole(req.user.id, targetUserId, validation.data.platformRole, req.ip);

      return res.status(200).json({
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

  static async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Chưa đăng nhập' } });
      }

      const { id: orgId, userId } = req.params;
      const result = await AdminService.removeMember(req.user.id, orgId, userId, req.ip);

      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId || '' },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  /**
   * 4. Quản lý Đồng bộ Pháp lý (Legal Sync)
   */
  static async getLegalSyncStats(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getLegalSyncStats();
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId || '' },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async triggerLegalSync(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Chưa đăng nhập' } });
      }

      const result = await AdminService.triggerLegalSync(req.user.id, req.ip);
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId || '' },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  /**
   * 5. Cơ sở Dữ liệu CIFER Trung Quốc (CIFER China Registry)
   */
  static async getCiferRegistries(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = adminCiferQuerySchema.safeParse(req.query);
      const query = validation.success ? validation.data : undefined;
      const result = await AdminService.getCiferRegistries(query);

      return res.status(200).json({
        data: result.items,
        meta: {
          requestId: req.requestId || '',
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
        },
      });
    } catch (err: any) {
      return next(err);
    }
  }

  /**
   * 6. Nhật ký Kiểm toán Hệ thống (Audit Logs)
   */
  static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = adminAuditLogQuerySchema.safeParse(req.query);
      const query = validation.success ? validation.data : undefined;
      const result = await AdminService.getAuditLogs(query);

      return res.status(200).json({
        data: result.items,
        meta: {
          requestId: req.requestId || '',
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
        },
      });
    } catch (err: any) {
      return next(err);
    }
  }
}

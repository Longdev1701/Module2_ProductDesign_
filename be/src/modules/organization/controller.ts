import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from './service';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  inviteMemberSchema,
  joinOrganizationSchema,
} from './schema';

export class OrganizationController {
  static async createOrganization(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Chưa đăng nhập',
          },
        });
      }

      const validation = createOrganizationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Thông tin Onboarding không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await OrganizationService.createOrganization(req.user.id, validation.data, req.ip);

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

  static async getMyOrganizations(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Chưa đăng nhập',
          },
        });
      }

      const result = await OrganizationService.getMyOrganizations(req.user.id);

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

  static async getOrganizationDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.params.id;
      const result = await OrganizationService.getOrganizationDetails(orgId);

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

  static async updateOrganization(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Chưa đăng nhập',
          },
        });
      }

      const orgId = req.params.id;
      const validation = updateOrganizationSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Thông tin cập nhật không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await OrganizationService.updateOrganization(orgId, req.user.id, validation.data, req.ip);

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

  static async inviteMember(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Chưa đăng nhập',
          },
        });
      }

      const orgId = req.params.id;
      const validation = inviteMemberSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Thông tin lời mời không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await OrganizationService.inviteMember(orgId, req.user.id, validation.data, req.ip);

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

  static async joinOrganization(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Chưa đăng nhập',
          },
        });
      }

      const validation = joinOrganizationSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Mã lời mời không hợp lệ',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await OrganizationService.joinOrganization(req.user.id, req.user.email, validation.data, req.ip);

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
}

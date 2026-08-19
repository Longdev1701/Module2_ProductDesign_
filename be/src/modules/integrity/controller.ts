import { Request, Response, NextFunction } from 'express';
import { IntegrityService } from './service';
import { listAuditLogsQuerySchema } from './schema';
import { ApiError } from '../../lib/api-error';

export class IntegrityController {
  /**
   * GET /api/integrity/logs - Lấy danh sách Audit Logs có phân trang
   */
  static async listLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const query = listAuditLogsQuerySchema.parse(req.query);
      const data = await IntegrityService.listLogs(orgId, query);

      return res.json({
        data,
        meta: {
          requestId: req.requestId ?? '',
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/integrity/stats - Thống kê Liêm chính & Chuỗi Băm
   */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const data = await IntegrityService.getStats(orgId);

      return res.json({
        data,
        meta: {
          requestId: req.requestId ?? '',
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/integrity/verify/:hash - Tra cứu công khai (Public Verification)
   */
  static async verifyHash(req: Request, res: Response, next: NextFunction) {
    try {
      const { hash } = req.params;
      if (!hash) {
        throw new ApiError(400, 'BAD_REQUEST', 'Thiếu tham số hash');
      }

      const data = await IntegrityService.verifyHash(hash);

      return res.json({
        data,
        meta: {
          requestId: req.requestId ?? '',
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

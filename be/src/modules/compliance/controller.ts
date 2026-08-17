import { Request, Response, NextFunction } from 'express';
import { complianceService } from './service';

export class ComplianceController {
  async listChecks(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || undefined;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 30;

      const result = await complianceService.listChecks(orgId, page, pageSize);
      res.json({
        data: result.data,
        meta: { ...result.meta, requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async getCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await complianceService.getCheckById(id);
      res.json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const complianceController = new ComplianceController();

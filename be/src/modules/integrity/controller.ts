import { Request, Response, NextFunction } from 'express';
import { integrityService } from './service';

export class IntegrityController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const stats = await integrityService.getStats(orgId);
      res.json({
        data: stats,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const logs = await integrityService.getLogs(orgId);
      res.json({
        data: logs,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyHash(req: Request, res: Response, next: NextFunction) {
    try {
      const { hash } = req.params;
      const result = await integrityService.verifyHash(hash);
      res.json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const integrityController = new IntegrityController();

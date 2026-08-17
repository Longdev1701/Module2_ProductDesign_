import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './service';

export class DashboardController {
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const summary = await dashboardService.getSummary(orgId);
      res.json({
        data: summary,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const dashboardController = new DashboardController();

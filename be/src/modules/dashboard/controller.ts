import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './service';

export class DashboardController {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || undefined;
      const overview = await dashboardService.getOverview(orgId);
      res.json({
        data: overview,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || undefined;
      const summary = await dashboardService.getSummary(orgId);
      res.json({
        data: summary,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async getRecentBatches(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || undefined;
      const batches = await dashboardService.getRecentBatches(orgId);
      res.json({
        data: batches,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async getTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || undefined;
      const trends = await dashboardService.getTrends(orgId);
      res.json({
        data: trends,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async getActionItems(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || undefined;
      const actionItems = await dashboardService.getActionItems(orgId);
      res.json({
        data: actionItems,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const dashboardController = new DashboardController();

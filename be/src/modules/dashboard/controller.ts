import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './service';

export class DashboardController {
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const overview = await DashboardService.getOverview(orgId);
      return res.json({
        data: overview,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const summary = await DashboardService.getSummary(orgId);
      return res.json({
        data: summary,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getRecentBatches(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const recentBatches = await DashboardService.getRecentBatches(orgId, limit);
      return res.json({
        data: recentBatches,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getActionItems(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const actionItems = await DashboardService.getActionItems(orgId);
      return res.json({
        data: actionItems,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const trends = await DashboardService.getTrends(orgId);
      return res.json({
        data: trends,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }
}

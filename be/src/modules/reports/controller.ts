import { Request, Response, NextFunction } from 'express';
import { reportService } from './service';
import { createReportSchema } from './schema';

export class ReportController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const reports = await reportService.getReports(orgId);
      res.json({
        data: reports,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const report = await reportService.getReportById(req.params.id, orgId);
      res.json({
        data: report,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const userId = req.user?.id || 'sys-admin';
      const input = createReportSchema.parse(req.body);
      const report = await reportService.createReport(orgId, userId, input);
      res.status(201).json({
        data: report,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { hash } = req.params;
      const result = await reportService.verifyReportHash(hash);
      res.json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const reportController = new ReportController();

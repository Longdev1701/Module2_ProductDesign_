import { Request, Response, NextFunction } from 'express';
import { ReportService } from './service';
import { approveReportSchema } from './schema';

export class ReportController {
  static async getReportById(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const report = await ReportService.getReportById(orgId, req.params.id);
      return res.json({
        data: report,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getReportByBatchId(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const report = await ReportService.getReportById(orgId, req.params.batchId);
      return res.json({
        data: report,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async approveReport(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const userId = req.user!.id;
      const parsedInput = approveReportSchema.parse(req.body);

      const approvedReport = await ReportService.approveReport(orgId, userId, req.params.id, parsedInput);
      return res.json({
        data: approvedReport,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }
}

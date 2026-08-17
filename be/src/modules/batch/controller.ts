import { Request, Response, NextFunction } from 'express';
import { BatchService } from './service';
import {
  createBatchSchema,
  updateBatchSchema,
  listBatchesQuerySchema,
} from './schema';

export class BatchController {
  static async listBatches(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const query = listBatchesQuerySchema.parse(req.query);

      const result = await BatchService.listBatches(orgId, query);
      return res.status(200).json({
        data: result.data,
        meta: {
          ...result.meta,
          requestId: req.requestId ?? '',
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getBatchById(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const { id } = req.params;

      const result = await BatchService.getBatchById(orgId, id);
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async createBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const userId = req.user!.id;
      const input = createBatchSchema.parse(req.body);

      const result = await BatchService.createBatch(orgId, userId, input, req.ip);
      return res.status(201).json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const userId = req.user!.id;
      const { id } = req.params;
      const input = updateBatchSchema.parse(req.body);

      const result = await BatchService.updateBatch(orgId, userId, id, input, req.ip);
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const userId = req.user!.id;
      const { id } = req.params;

      const result = await BatchService.deleteBatch(orgId, userId, id, req.ip);
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }
}

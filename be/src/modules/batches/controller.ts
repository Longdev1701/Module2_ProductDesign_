import { Request, Response, NextFunction } from 'express';
import { batchService } from './service';
import { createBatchSchema, updateBatchSchema } from './schema';

export class BatchController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const batches = await batchService.getBatches(orgId);
      res.json({
        data: batches,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const batch = await batchService.getBatchById(req.params.id, orgId);
      res.json({
        data: batch,
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
      const input = createBatchSchema.parse(req.body);
      const batch = await batchService.createBatch(orgId, userId, input);
      res.status(201).json({
        data: batch,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const userId = req.user?.id || 'sys-admin';
      const input = updateBatchSchema.parse(req.body);
      const batch = await batchService.updateBatch(req.params.id, orgId, userId, input);
      res.json({
        data: batch,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const userId = req.user?.id || 'sys-admin';
      await batchService.deleteBatch(req.params.id, orgId, userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export const batchController = new BatchController();

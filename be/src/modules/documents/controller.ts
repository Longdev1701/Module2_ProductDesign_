import { Request, Response, NextFunction } from 'express';
import { documentService } from './service';
import { createDocumentSchema } from './schema';

export class DocumentController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const batchId = req.query.batchId as string | undefined;
      const docs = await documentService.getDocuments(orgId, batchId);
      res.json({
        data: docs,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const doc = await documentService.getDocumentById(req.params.id, orgId);
      res.json({
        data: doc,
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
      const input = createDocumentSchema.parse(req.body);
      const doc = await documentService.createDocument(orgId, userId, input);
      res.status(201).json({
        data: doc,
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
      await documentService.deleteDocument(req.params.id, orgId, userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export const documentController = new DocumentController();

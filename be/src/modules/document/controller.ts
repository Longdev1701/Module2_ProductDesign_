import { Request, Response, NextFunction } from 'express';
import { DocumentService } from './service';
import {
  uploadDocumentSchema,
  listDocumentsQuerySchema,
} from './schema';

export class DocumentController {
  /**
   * GET /api/batches/:batchId/documents
   * Lấy danh sách chứng từ và trạng thái 4 Khóa Tuân thủ của Lô hàng
   */
  static async getBatchDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const { batchId } = req.params;

      const result = await DocumentService.getBatchDocuments(orgId, batchId);
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/batches/:batchId/documents
   * Tải lên và gắn chứng từ vào Lô hàng
   */
  static async uploadBatchDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const userId = req.user!.id;
      const { batchId } = req.params;
      const input = uploadDocumentSchema.parse(req.body);

      const result = await DocumentService.uploadBatchDocument(
        orgId,
        batchId,
        userId,
        input,
        req.ip
      );
      return res.status(201).json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * DELETE /api/batches/:batchId/documents/:docId
   * Gỡ bỏ / Xóa chứng từ khỏi Lô hàng
   */
  static async removeBatchDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const userId = req.user!.id;
      const { batchId, docId } = req.params;

      await DocumentService.removeBatchDocument(
        orgId,
        batchId,
        docId,
        userId,
        req.ip
      );
      return res.status(200).json({
        data: { message: 'Đã xóa chứng từ khỏi Lô hàng thành công' },
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/documents
   * Danh mục toàn bộ chứng từ của Doanh nghiệp
   */
  static async listDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const query = listDocumentsQuerySchema.parse(req.query);

      const result = await DocumentService.listOrganizationDocuments(orgId, query);
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
}

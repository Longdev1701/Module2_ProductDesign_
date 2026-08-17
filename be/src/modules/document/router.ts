import { Router } from 'express';
import { DocumentController } from './controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { orgMiddleware } from '../../middleware/orgMiddleware';
import { rbacMiddleware } from '../../middleware/rbacMiddleware';

export const documentRouter = Router();

// Protect all document routes
documentRouter.use(authMiddleware);
documentRouter.use(orgMiddleware());

// Tổ chức - Kho chứng từ
documentRouter.get('/', rbacMiddleware('report.view'), DocumentController.listDocuments);

export const batchDocumentRouter = Router({ mergeParams: true });
batchDocumentRouter.use(authMiddleware);
batchDocumentRouter.use(orgMiddleware());

// Lô hàng - 4 Khóa Tuân thủ & Chứng từ đính kèm
batchDocumentRouter.get('/', rbacMiddleware('report.view'), DocumentController.getBatchDocuments);
batchDocumentRouter.post('/', rbacMiddleware('document.upload'), DocumentController.uploadBatchDocument);
batchDocumentRouter.delete('/:docId', rbacMiddleware('document.delete'), DocumentController.removeBatchDocument);

export default documentRouter;

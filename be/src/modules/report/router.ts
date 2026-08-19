import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { orgMiddleware } from '../../middleware/orgMiddleware';
import { ReportController } from './controller';

const reportRouter = Router();

// Yêu cầu xác thực JWT và ngữ cảnh tổ chức
reportRouter.use(authMiddleware);
reportRouter.use(orgMiddleware());

reportRouter.get('/history', ReportController.getHistory);
reportRouter.get('/batch/:batchId', ReportController.getReportByBatchId);
reportRouter.get('/:id', ReportController.getReportById);
reportRouter.post('/:id/approve', ReportController.approveReport);

export default reportRouter;


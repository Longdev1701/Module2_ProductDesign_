import { Router } from 'express';
import { BatchController } from './controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { orgMiddleware } from '../../middleware/orgMiddleware';
import { rbacMiddleware } from '../../middleware/rbacMiddleware';

const batchRouter = Router();

// Protect all batch routes
batchRouter.use(authMiddleware);
batchRouter.use(orgMiddleware());

batchRouter.get('/', rbacMiddleware('report.view'), BatchController.listBatches);
batchRouter.get('/:id', rbacMiddleware('report.view'), BatchController.getBatchById);
batchRouter.post('/', rbacMiddleware('batch.create'), BatchController.createBatch);
batchRouter.patch('/:id', rbacMiddleware('batch.manage'), BatchController.updateBatch);
batchRouter.delete('/:id', rbacMiddleware('batch.delete'), BatchController.deleteBatch);

export default batchRouter;

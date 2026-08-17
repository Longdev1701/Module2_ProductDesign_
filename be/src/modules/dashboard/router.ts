import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { orgMiddleware } from '../../middleware/orgMiddleware';
import { DashboardController } from './controller';

const dashboardRouter = Router();

// Tất cả các routes dashboard yêu cầu xác thực và ngữ cảnh tổ chức
dashboardRouter.use(authMiddleware);
dashboardRouter.use(orgMiddleware());

dashboardRouter.get('/overview', DashboardController.getOverview);
dashboardRouter.get('/summary', DashboardController.getSummary);
dashboardRouter.get('/recent-batches', DashboardController.getRecentBatches);
dashboardRouter.get('/action-items', DashboardController.getActionItems);
dashboardRouter.get('/trends', DashboardController.getTrends);

export default dashboardRouter;

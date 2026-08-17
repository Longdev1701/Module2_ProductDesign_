import { Router } from 'express';
import { dashboardController } from './controller';

const dashboardRouter = Router();

dashboardRouter.get('/overview', (req, res, next) => dashboardController.getOverview(req, res, next));
dashboardRouter.get('/summary', (req, res, next) => dashboardController.getSummary(req, res, next));
dashboardRouter.get('/recent-batches', (req, res, next) => dashboardController.getRecentBatches(req, res, next));
dashboardRouter.get('/recent-checks', (req, res, next) => dashboardController.getRecentBatches(req, res, next));
dashboardRouter.get('/trends', (req, res, next) => dashboardController.getTrends(req, res, next));
dashboardRouter.get('/action-items', (req, res, next) => dashboardController.getActionItems(req, res, next));

export default dashboardRouter;

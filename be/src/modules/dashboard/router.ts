import { Router } from 'express';
import { dashboardController } from './controller';

const dashboardRouter = Router();

dashboardRouter.get('/summary', (req, res, next) => dashboardController.getSummary(req, res, next));

export default dashboardRouter;

import { Router } from 'express';
import { complianceController } from './controller';

const complianceRouter = Router();

complianceRouter.get('/checks', (req, res, next) => complianceController.listChecks(req, res, next));
complianceRouter.get('/checks/:id', (req, res, next) => complianceController.getCheck(req, res, next));

export default complianceRouter;

import { Router } from 'express';
import { integrityController } from './controller';

const integrityRouter = Router();

integrityRouter.get('/stats', (req, res, next) => integrityController.getStats(req, res, next));
integrityRouter.get('/logs', (req, res, next) => integrityController.getLogs(req, res, next));
integrityRouter.get('/audit-log', (req, res, next) => integrityController.getLogs(req, res, next));
integrityRouter.get('/verify/:hash', (req, res, next) => integrityController.verifyHash(req, res, next));

export default integrityRouter;

import { Router } from 'express';
import { reportController } from './controller';

const reportRouter = Router();

reportRouter.get('/', (req, res, next) => reportController.list(req, res, next));
reportRouter.get('/:id', (req, res, next) => reportController.getOne(req, res, next));
reportRouter.post('/', (req, res, next) => reportController.create(req, res, next));
reportRouter.get('/verify/:hash', (req, res, next) => reportController.verify(req, res, next));

export default reportRouter;

import { Router } from 'express';
import { batchController } from './controller';

const batchRouter = Router();

batchRouter.get('/', (req, res, next) => batchController.list(req, res, next));
batchRouter.get('/:id', (req, res, next) => batchController.getOne(req, res, next));
batchRouter.post('/', (req, res, next) => batchController.create(req, res, next));
batchRouter.patch('/:id', (req, res, next) => batchController.update(req, res, next));
batchRouter.delete('/:id', (req, res, next) => batchController.delete(req, res, next));

export default batchRouter;

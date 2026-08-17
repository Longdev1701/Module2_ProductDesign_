import { Router } from 'express';
import { documentController } from './controller';

const documentRouter = Router();

documentRouter.get('/', (req, res, next) => documentController.list(req, res, next));
documentRouter.get('/:id', (req, res, next) => documentController.getOne(req, res, next));
documentRouter.post('/', (req, res, next) => documentController.create(req, res, next));
documentRouter.delete('/:id', (req, res, next) => documentController.delete(req, res, next));

export default documentRouter;

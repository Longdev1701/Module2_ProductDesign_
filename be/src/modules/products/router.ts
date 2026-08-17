import { Router } from 'express';
import { productController } from './controller';

const productRouter = Router();

productRouter.get('/', (req, res, next) => productController.list(req, res, next));
productRouter.get('/:id', (req, res, next) => productController.getOne(req, res, next));
productRouter.post('/', (req, res, next) => productController.create(req, res, next));
productRouter.patch('/:id', (req, res, next) => productController.update(req, res, next));
productRouter.delete('/:id', (req, res, next) => productController.delete(req, res, next));

export default productRouter;

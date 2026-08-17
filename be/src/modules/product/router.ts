import { Router } from 'express';
import { ProductController } from './controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { orgMiddleware } from '../../middleware/orgMiddleware';
import { rbacMiddleware } from '../../middleware/rbacMiddleware';

const productRouter = Router();

// Protect all product routes
productRouter.use(authMiddleware);
productRouter.use(orgMiddleware());

productRouter.get('/', rbacMiddleware('report.view'), ProductController.listProducts);
productRouter.get('/:id', rbacMiddleware('report.view'), ProductController.getProductById);
productRouter.post('/', rbacMiddleware('product.create'), ProductController.createProduct);
productRouter.patch('/:id', rbacMiddleware('product.manage'), ProductController.updateProduct);
productRouter.delete('/:id', rbacMiddleware('product.delete'), ProductController.deleteProduct);

export default productRouter;

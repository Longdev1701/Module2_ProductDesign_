import { Request, Response, NextFunction } from 'express';
import { productService } from './service';
import { createProductSchema, updateProductSchema } from './schema';

export class ProductController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const products = await productService.getProducts(orgId);
      res.json({
        data: products,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const product = await productService.getProductById(req.params.id, orgId);
      res.json({
        data: product,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const userId = req.user?.id || 'sys-admin';
      const input = createProductSchema.parse(req.body);
      const product = await productService.createProduct(orgId, userId, input);
      res.status(201).json({
        data: product,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const userId = req.user?.id || 'sys-admin';
      const input = updateProductSchema.parse(req.body);
      const product = await productService.updateProduct(req.params.id, orgId, userId, input);
      res.json({
        data: product,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = (req.headers['x-organization-id'] as string) || (req.user as any)?.organizationId || '';
      const userId = req.user?.id || 'sys-admin';
      await productService.deleteProduct(req.params.id, orgId, userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();

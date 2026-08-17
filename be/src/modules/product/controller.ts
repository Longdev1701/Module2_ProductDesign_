import { Request, Response, NextFunction } from 'express';
import { ProductService } from './service';
import {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
} from './schema';

export class ProductController {
  static async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const query = listProductsQuerySchema.parse(req.query);

      const result = await ProductService.listProducts(orgId, query);
      return res.status(200).json({
        data: result.data,
        meta: {
          ...result.meta,
          requestId: req.requestId ?? '',
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const { id } = req.params;

      const result = await ProductService.getProductById(orgId, id);
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const userId = req.user!.id;
      const input = createProductSchema.parse(req.body);

      const result = await ProductService.createProduct(orgId, userId, input, req.ip);
      return res.status(201).json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const userId = req.user!.id;
      const { id } = req.params;
      const input = updateProductSchema.parse(req.body);

      const result = await ProductService.updateProduct(orgId, userId, id, input, req.ip);
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.orgMember!.organizationId;
      const userId = req.user!.id;
      const { id } = req.params;

      const result = await ProductService.deleteProduct(orgId, userId, id, req.ip);
      return res.status(200).json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }
}

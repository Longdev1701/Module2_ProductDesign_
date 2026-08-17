import { prisma } from '../../lib/prisma';
import { CreateProductInput, UpdateProductInput } from './schema';
import { createAuditLog } from '../../services/auditLogService';

export class ProductService {
  async getProducts(organizationId: string) {
    return prisma.product.findMany({
      where: { organizationId },
      include: {
        batches: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductById(id: string, organizationId: string) {
    const product = await prisma.product.findFirst({
      where: { id, organizationId },
      include: { batches: true },
    });
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }
    return product;
  }

  async createProduct(organizationId: string, userId: string, data: CreateProductInput) {
    const product = await prisma.product.create({
      data: {
        organizationId,
        name: data.name,
        category: data.category,
        hsCode: data.hsCode,
        origin: data.origin ?? 'Việt Nam',
        description: data.description,
      },
    });

    await createAuditLog({
      userId,
      action: 'CREATE_PRODUCT',
      entity: 'PRODUCT',
      entityId: product.id,
      metadata: { name: product.name, organizationId },
    });

    return product;
  }

  async updateProduct(id: string, organizationId: string, userId: string, data: UpdateProductInput) {
    const existing = await this.getProductById(id, organizationId);

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        category: data.category,
        hsCode: data.hsCode,
        origin: data.origin,
        description: data.description,
      },
    });

    await createAuditLog({
      userId,
      action: 'UPDATE_PRODUCT',
      entity: 'PRODUCT',
      entityId: updated.id,
      metadata: { name: updated.name, organizationId },
    });

    return updated;
  }

  async deleteProduct(id: string, organizationId: string, userId: string) {
    const existing = await this.getProductById(id, organizationId);

    await prisma.product.delete({
      where: { id: existing.id },
    });

    await createAuditLog({
      userId,
      action: 'DELETE_PRODUCT',
      entity: 'PRODUCT',
      entityId: id,
      metadata: { name: existing.name, organizationId },
    });

    return { success: true };
  }
}

export const productService = new ProductService();

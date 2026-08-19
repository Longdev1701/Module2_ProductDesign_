import { prisma } from '../../lib/prisma';
import { ApiError } from '../../lib/api-error';
import { createAuditLog } from '../../services/auditLogService';
import { CreateProductInput, UpdateProductInput, ListProductsQuery } from './schema';

export class ProductService {
  /**
   * Lấy danh sách sản phẩm theo tổ chức kèm phân trang, tìm kiếm, lọc danh mục
   */
  static async listProducts(organizationId: string, query: ListProductsQuery) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = {
      organizationId,
    };

    if (query.search && query.search.trim()) {
      const s = query.search.trim();
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { hsCode: { contains: s, mode: 'insensitive' } },
        { origin: { contains: s, mode: 'insensitive' } },
        { description: { contains: s, mode: 'insensitive' } },
      ];
    }

    if (query.category && query.category.trim()) {
      where.category = { contains: query.category.trim(), mode: 'insensitive' };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (query.sort === 'createdAt:asc') orderBy = { createdAt: 'asc' };
    if (query.sort === 'name:asc') orderBy = { name: 'asc' };
    if (query.sort === 'name:desc') orderBy = { name: 'desc' };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          marketRequirements: true,
          _count: {
            select: { batches: true },
          },
        },
      }),
    ]);

    const data = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      hsCode: p.hsCode,
      description: p.description,
      origin: p.origin,
      organizationId: p.organizationId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      marketRequirements: p.marketRequirements.map((m) => ({
        marketCode: m.marketCode,
        marketName: m.marketName,
      })),
      batchesCount: p._count.batches,
    }));

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Lấy chi tiết 1 sản phẩm kèm các Lô hàng và Tiêu chuẩn thị trường
   */
  static async getProductById(organizationId: string, productId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        organizationId,
      },
      include: {
        marketRequirements: true,
        batches: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { documents: true, complianceChecks: true },
            },
          },
        },
      },
    });

    if (!product) {
      throw new ApiError(404, 'NOT_FOUND', 'Sản phẩm không tồn tại hoặc bạn không có quyền truy cập');
    }

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      hsCode: product.hsCode,
      description: product.description,
      origin: product.origin,
      organizationId: product.organizationId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      marketRequirements: product.marketRequirements.map((m) => ({
        marketCode: m.marketCode,
        marketName: m.marketName,
      })),
      batches: product.batches.map((b) => ({
        id: b.id,
        batchCode: b.batchCode,
        quantity: b.quantity,
        unit: b.unit,
        status: b.status,
        producedAt: b.producedAt,
        expiresAt: b.expiresAt,
        createdAt: b.createdAt,
        documentsCount: b._count.documents,
        checksCount: b._count.complianceChecks,
      })),
    };
  }

  /**
   * Tạo sản phẩm mới
   */
  static async createProduct(
    organizationId: string,
    userId: string,
    input: CreateProductInput,
    ipAddress?: string
  ) {
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: input.name.trim(),
          category: input.category.trim(),
          hsCode: input.hsCode?.trim() || null,
          description: input.description?.trim() || null,
          origin: input.origin?.trim() || null,
          organizationId,
        },
      });

      if (input.markets && input.markets.length > 0) {
        await tx.productMarketRequirement.createMany({
          data: input.markets.map((m) => ({
            productId: created.id,
            marketCode: m.marketCode.trim(),
            marketName: m.marketName.trim(),
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: created.id },
        include: { marketRequirements: true },
      });
    });

    if (!product) {
      throw new ApiError(500, 'INTERNAL_ERROR', 'Không thể tạo sản phẩm');
    }

    await createAuditLog({
      userId,
      action: 'product.created',
      entity: 'Product',
      entityId: product.id,
      metadata: { name: product.name, hsCode: product.hsCode, organizationId },
      ipAddress,
    });

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      hsCode: product.hsCode,
      description: product.description,
      origin: product.origin,
      organizationId: product.organizationId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      marketRequirements: product.marketRequirements.map((m) => ({
        marketCode: m.marketCode,
        marketName: m.marketName,
      })),
      batchesCount: 0,
    };
  }

  /**
   * Cập nhật thông tin sản phẩm
   */
  static async updateProduct(
    organizationId: string,
    userId: string,
    productId: string,
    input: UpdateProductInput,
    ipAddress?: string
  ) {
    const existing = await prisma.product.findFirst({
      where: { id: productId, organizationId },
    });

    if (!existing) {
      throw new ApiError(404, 'NOT_FOUND', 'Sản phẩm không tồn tại hoặc bạn không có quyền truy cập');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updateData: any = {};
      if (input.name !== undefined) updateData.name = input.name.trim();
      if (input.category !== undefined) updateData.category = input.category.trim();
      if (input.hsCode !== undefined) updateData.hsCode = input.hsCode?.trim() || null;
      if (input.description !== undefined) updateData.description = input.description?.trim() || null;
      if (input.origin !== undefined) updateData.origin = input.origin?.trim() || null;

      await tx.product.update({
        where: { id: productId },
        data: updateData,
      });

      if (input.markets !== undefined) {
        await tx.productMarketRequirement.deleteMany({
          where: { productId },
        });

        if (input.markets.length > 0) {
          await tx.productMarketRequirement.createMany({
            data: input.markets.map((m) => ({
              productId,
              marketCode: m.marketCode.trim(),
              marketName: m.marketName.trim(),
            })),
          });
        }
      }

      return tx.product.findUnique({
        where: { id: productId },
        include: {
          marketRequirements: true,
          _count: { select: { batches: true } },
        },
      });
    });

    if (!updated) {
      throw new ApiError(500, 'INTERNAL_ERROR', 'Không thể cập nhật sản phẩm');
    }

    await createAuditLog({
      userId,
      action: 'product.updated',
      entity: 'Product',
      entityId: updated.id,
      metadata: { changes: input, organizationId },
      ipAddress,
    });

    return {
      id: updated.id,
      name: updated.name,
      category: updated.category,
      hsCode: updated.hsCode,
      description: updated.description,
      origin: updated.origin,
      organizationId: updated.organizationId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      marketRequirements: updated.marketRequirements.map((m) => ({
        marketCode: m.marketCode,
        marketName: m.marketName,
      })),
      batchesCount: updated._count.batches,
    };
  }

  /**
   * Xóa sản phẩm
   */
  static async deleteProduct(
    organizationId: string,
    userId: string,
    productId: string,
    ipAddress?: string
  ) {
    const existing = await prisma.product.findFirst({
      where: { id: productId, organizationId },
      include: {
        _count: { select: { batches: true } },
      },
    });

    if (!existing) {
      throw new ApiError(404, 'NOT_FOUND', 'Sản phẩm không tồn tại hoặc bạn không có quyền truy cập');
    }

    if (existing._count.batches > 0) {
      throw new ApiError(
        400,
        'BAD_REQUEST',
        `Không thể xóa sản phẩm này vì đang có ${existing._count.batches} Lô hàng liên kết. Hãy xóa các Lô hàng trước.`
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    await createAuditLog({
      userId,
      action: 'product.deleted',
      entity: 'Product',
      entityId: productId,
      metadata: { name: existing.name, organizationId },
      ipAddress,
    });

    return { success: true, deletedId: productId };
  }
}

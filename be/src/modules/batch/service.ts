import { prisma } from '../../lib/prisma';
import { ApiError } from '../../lib/api-error';
import { createAuditLog } from '../../services/auditLogService';
import { CreateBatchInput, UpdateBatchInput, ListBatchesQuery } from './schema';

export class BatchService {
  /**
   * Lấy danh sách Lô hàng theo tổ chức (lọc theo productId, status, search)
   */
  static async listBatches(organizationId: string, query: ListBatchesQuery) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = {
      product: {
        organizationId,
      },
    };

    if (query.productId) {
      where.productId = query.productId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim()) {
      const s = query.search.trim();
      where.OR = [
        { batchCode: { contains: s, mode: 'insensitive' } },
        { product: { name: { contains: s, mode: 'insensitive' } } },
        { product: { hsCode: { contains: s, mode: 'insensitive' } } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (query.sort === 'createdAt:asc') orderBy = { createdAt: 'asc' };
    if (query.sort === 'batchCode:asc') orderBy = { batchCode: 'asc' };
    if (query.sort === 'batchCode:desc') orderBy = { batchCode: 'desc' };

    const [total, batches] = await Promise.all([
      prisma.batch.count({ where }),
      prisma.batch.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              hsCode: true,
              origin: true,
            },
          },
          _count: {
            select: { documents: true, complianceChecks: true },
          },
        },
      }),
    ]);

    const data = batches.map((b) => ({
      id: b.id,
      batchCode: b.batchCode,
      productId: b.productId,
      productName: b.product.name,
      productCategory: b.product.category,
      hsCode: b.product.hsCode,
      origin: b.product.origin,
      quantity: b.quantity,
      unit: b.unit,
      status: b.status,
      producedAt: b.producedAt,
      expiresAt: b.expiresAt,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      documentsCount: b._count.documents,
      checksCount: b._count.complianceChecks,
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
   * Lấy chi tiết 1 Lô hàng kèm Sản phẩm và Chứng từ đính kèm
   */
  static async getBatchById(organizationId: string, batchId: string) {
    const batch = await prisma.batch.findFirst({
      where: {
        id: batchId,
        product: {
          organizationId,
        },
      },
      include: {
        product: {
          include: {
            marketRequirements: true,
          },
        },
        documents: {
          include: {
            document: true,
          },
        },
        complianceChecks: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!batch) {
      throw new ApiError(404, 'NOT_FOUND', 'Lô hàng không tồn tại hoặc bạn không có quyền truy cập');
    }

    return {
      id: batch.id,
      batchCode: batch.batchCode,
      productId: batch.productId,
      product: {
        id: batch.product.id,
        name: batch.product.name,
        category: batch.product.category,
        hsCode: batch.product.hsCode,
        origin: batch.product.origin,
        markets: batch.product.marketRequirements.map((m) => ({
          marketCode: m.marketCode,
          marketName: m.marketName,
          requiredDocuments: m.requiredDocuments || ['PHYTO', 'LAB_REPORT', 'CO', 'PACKING_LIST'],
          requirementDetails: m.requirementDetails,
        })),
      },
      quantity: batch.quantity,
      unit: batch.unit,
      status: batch.status,
      producedAt: batch.producedAt,
      expiresAt: batch.expiresAt,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
      documents: batch.documents.map((bd) => ({
        id: bd.document.id,
        title: bd.document.title,
        type: bd.document.type,
        fileUrl: bd.document.fileUrl,
        fileSize: bd.document.fileSize,
        mimeType: bd.document.mimeType,
        createdAt: bd.document.createdAt,
      })),
      complianceChecks: batch.complianceChecks.map((c) => ({
        id: c.id,
        market: c.market,
        checkStatus: c.checkStatus,
        result: c.result,
        aiConfidence: c.aiConfidence,
        summary: c.summary,
        createdAt: c.createdAt,
      })),
    };
  }

  /**
   * Tạo mới Lô hàng
   */
  static async createBatch(
    organizationId: string,
    userId: string,
    input: CreateBatchInput,
    ipAddress?: string
  ) {
    // 1. Kiểm tra sản phẩm thuộc về tổ chức
    const product = await prisma.product.findFirst({
      where: {
        id: input.productId,
        organizationId,
      },
    });

    if (!product) {
      throw new ApiError(400, 'BAD_REQUEST', 'Sản phẩm được chọn không thuộc tổ chức của bạn');
    }

    // 2. Kiểm tra tính duy nhất của batchCode
    const existing = await prisma.batch.findUnique({
      where: { batchCode: input.batchCode.trim() },
    });

    if (existing) {
      throw new ApiError(409, 'CONFLICT', `Mã Lô hàng '${input.batchCode}' đã tồn tại trong hệ thống`);
    }

    const batch = await prisma.batch.create({
      data: {
        batchCode: input.batchCode.trim(),
        productId: input.productId,
        quantity: input.quantity ?? null,
        unit: input.unit ?? 'tấn',
        status: input.status,
        producedAt: input.producedAt ?? null,
        expiresAt: input.expiresAt ?? null,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            hsCode: true,
            origin: true,
          },
        },
      },
    });

    await createAuditLog({
      userId,
      action: 'batch.created',
      entity: 'Batch',
      entityId: batch.id,
      metadata: { batchCode: batch.batchCode, productId: batch.productId, organizationId },
      ipAddress,
    });

    return {
      id: batch.id,
      batchCode: batch.batchCode,
      productId: batch.productId,
      productName: batch.product.name,
      productCategory: batch.product.category,
      hsCode: batch.product.hsCode,
      origin: batch.product.origin,
      quantity: batch.quantity,
      unit: batch.unit,
      status: batch.status,
      producedAt: batch.producedAt,
      expiresAt: batch.expiresAt,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
      documentsCount: 0,
      checksCount: 0,
    };
  }

  /**
   * Cập nhật Lô hàng
   */
  static async updateBatch(
    organizationId: string,
    userId: string,
    batchId: string,
    input: UpdateBatchInput,
    ipAddress?: string
  ) {
    const existing = await prisma.batch.findFirst({
      where: {
        id: batchId,
        product: { organizationId },
      },
    });

    if (!existing) {
      throw new ApiError(404, 'NOT_FOUND', 'Lô hàng không tồn tại hoặc bạn không có quyền truy cập');
    }

    if (input.batchCode && input.batchCode !== existing.batchCode) {
      const duplicate = await prisma.batch.findUnique({
        where: { batchCode: input.batchCode.trim() },
      });
      if (duplicate && duplicate.id !== batchId) {
        throw new ApiError(409, 'CONFLICT', `Mã Lô hàng '${input.batchCode}' đã tồn tại trong hệ thống`);
      }
    }

    if (input.productId && input.productId !== existing.productId) {
      const validProduct = await prisma.product.findFirst({
        where: { id: input.productId, organizationId },
      });
      if (!validProduct) {
        throw new ApiError(400, 'BAD_REQUEST', 'Sản phẩm mới không thuộc tổ chức của bạn');
      }
    }

    const updateData: any = {};
    if (input.batchCode !== undefined) updateData.batchCode = input.batchCode.trim();
    if (input.productId !== undefined) updateData.productId = input.productId;
    if (input.quantity !== undefined) updateData.quantity = input.quantity;
    if (input.unit !== undefined) updateData.unit = input.unit;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.producedAt !== undefined) updateData.producedAt = input.producedAt;
    if (input.expiresAt !== undefined) updateData.expiresAt = input.expiresAt;

    const updated = await prisma.batch.update({
      where: { id: batchId },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            hsCode: true,
            origin: true,
          },
        },
        _count: {
          select: { documents: true, complianceChecks: true },
        },
      },
    });

    await createAuditLog({
      userId,
      action: 'batch.updated',
      entity: 'Batch',
      entityId: updated.id,
      metadata: { changes: input, organizationId },
      ipAddress,
    });

    return {
      id: updated.id,
      batchCode: updated.batchCode,
      productId: updated.productId,
      productName: updated.product.name,
      productCategory: updated.product.category,
      hsCode: updated.product.hsCode,
      origin: updated.product.origin,
      quantity: updated.quantity,
      unit: updated.unit,
      status: updated.status,
      producedAt: updated.producedAt,
      expiresAt: updated.expiresAt,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      documentsCount: updated._count.documents,
      checksCount: updated._count.complianceChecks,
    };
  }

  /**
   * Xóa Lô hàng
   */
  static async deleteBatch(
    organizationId: string,
    userId: string,
    batchId: string,
    ipAddress?: string
  ) {
    const existing = await prisma.batch.findFirst({
      where: {
        id: batchId,
        product: { organizationId },
      },
      include: {
        complianceChecks: true,
      },
    });

    if (!existing) {
      throw new ApiError(404, 'NOT_FOUND', 'Lô hàng không tồn tại hoặc bạn không có quyền truy cập');
    }

    // Nếu Lô hàng đã hoàn tất thẩm định AI và có kết quả COMPLIANT/NON_COMPLIANT, lưu ý
    await prisma.batch.delete({
      where: { id: batchId },
    });

    await createAuditLog({
      userId,
      action: 'batch.deleted',
      entity: 'Batch',
      entityId: batchId,
      metadata: { batchCode: existing.batchCode, organizationId },
      ipAddress,
    });

    return { success: true, deletedId: batchId };
  }
}

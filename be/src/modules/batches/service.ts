import { prisma } from '../../lib/prisma';
import { CreateBatchInput, UpdateBatchInput } from './schema';
import { createAuditLog } from '../../services/auditLogService';
import { BatchStatus } from '@prisma/client';

export class BatchService {
  async getBatches(organizationId: string) {
    return prisma.batch.findMany({
      where: {
        product: { organizationId },
      },
      include: {
        product: true,
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBatchById(id: string, organizationId: string) {
    const batch = await prisma.batch.findFirst({
      where: {
        id,
        product: { organizationId },
      },
      include: { product: true, documents: true },
    });
    if (!batch) {
      throw new Error('BATCH_NOT_FOUND');
    }
    return batch;
  }

  async createBatch(organizationId: string, userId: string, data: CreateBatchInput) {
    const statusEnumValue = (Object.values(BatchStatus).includes(data.status as BatchStatus)
      ? data.status
      : 'COLLECTING_DOCUMENTS') as BatchStatus;

    const batch = await prisma.batch.create({
      data: {
        productId: data.productId,
        batchCode: data.batchCode,
        quantity: data.quantity,
        unit: data.unit,
        producedAt: data.harvestDate ? new Date(data.harvestDate) : null,
        expiresAt: data.expiryDate ? new Date(data.expiryDate) : null,
        status: statusEnumValue,
      },
      include: { product: true },
    });

    await createAuditLog({
      userId,
      action: 'CREATE_BATCH',
      entity: 'BATCH',
      entityId: batch.id,
      metadata: { batchCode: batch.batchCode, quantity: batch.quantity, organizationId },
    });

    return batch;
  }

  async updateBatch(id: string, organizationId: string, userId: string, data: UpdateBatchInput) {
    const existing = await this.getBatchById(id, organizationId);

    const statusEnumValue = data.status && Object.values(BatchStatus).includes(data.status as BatchStatus)
      ? (data.status as BatchStatus)
      : undefined;

    const updated = await prisma.batch.update({
      where: { id: existing.id },
      data: {
        quantity: data.quantity,
        unit: data.unit,
        status: statusEnumValue,
        producedAt: data.harvestDate ? new Date(data.harvestDate) : undefined,
        expiresAt: data.expiryDate ? new Date(data.expiryDate) : undefined,
      },
      include: { product: true },
    });

    await createAuditLog({
      userId,
      action: 'UPDATE_BATCH',
      entity: 'BATCH',
      entityId: updated.id,
      metadata: { batchCode: updated.batchCode, status: updated.status, organizationId },
    });

    return updated;
  }

  async deleteBatch(id: string, organizationId: string, userId: string) {
    const existing = await this.getBatchById(id, organizationId);

    await prisma.batch.delete({
      where: { id: existing.id },
    });

    await createAuditLog({
      userId,
      action: 'DELETE_BATCH',
      entity: 'BATCH',
      entityId: id,
      metadata: { batchCode: existing.batchCode, organizationId },
    });

    return { success: true };
  }
}

export const batchService = new BatchService();

import { prisma } from '../lib/prisma';

export interface AuditLogParams {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export async function createAuditLog(params: AuditLogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: params.metadata as any,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Silent fail for audit logs to not block business transactions, but log to console
    return null;
  }
}

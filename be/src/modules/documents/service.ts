import { prisma } from '../../lib/prisma';
import { CreateDocumentInput } from './schema';
import { createAuditLog } from '../../services/auditLogService';
import { DocumentType } from '@prisma/client';

export class DocumentService {
  async getDocuments(organizationId: string, _batchId?: string) {
    return prisma.document.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocumentById(id: string, organizationId: string) {
    const document = await prisma.document.findFirst({
      where: { id, organizationId },
    });
    if (!document) {
      throw new Error('DOCUMENT_NOT_FOUND');
    }
    return document;
  }

  async createDocument(organizationId: string, userId: string, data: CreateDocumentInput) {
    const docType = (Object.values(DocumentType).includes(data.type as DocumentType)
      ? data.type
      : 'OTHER') as DocumentType;

    const document = await prisma.document.create({
      data: {
        organizationId,
        title: data.fileName,
        type: docType,
        fileUrl: data.fileUrl ?? `https://storage.themis.vn/docs/${data.fileName}`,
        fileSize: data.fileSize ?? 1024500,
        mimeType: data.mimeType ?? 'application/pdf',
      },
    });

    await createAuditLog({
      userId,
      action: 'UPLOAD_DOCUMENT',
      entity: 'DOCUMENT',
      entityId: document.id,
      metadata: { title: document.title, type: document.type, organizationId },
    });

    return document;
  }

  async deleteDocument(id: string, organizationId: string, userId: string) {
    const existing = await this.getDocumentById(id, organizationId);

    await prisma.document.delete({
      where: { id: existing.id },
    });

    await createAuditLog({
      userId,
      action: 'DELETE_DOCUMENT',
      entity: 'DOCUMENT',
      entityId: id,
      metadata: { title: existing.title, organizationId },
    });

    return { success: true };
  }
}

export const documentService = new DocumentService();

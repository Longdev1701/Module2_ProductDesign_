import { prisma } from '../../lib/prisma';
import { ApiError } from '../../lib/api-error';
import { createAuditLog } from '../../services/auditLogService';
import { DocumentType } from '@prisma/client';
import {
  DocumentItemDTO,
  BatchDocumentChecklistDTO,
  GateKeyStatus,
  UploadBatchDocumentDTO,
  ListDocumentsQueryDTO,
} from './types';

export class DocumentService {
  /**
   * Lấy danh sách chứng từ và tính toán 4 Khóa Tuân thủ (Compliance Gate) cho 1 Lô hàng
   */
  static async getBatchDocuments(
    organizationId: string,
    batchId: string
  ): Promise<BatchDocumentChecklistDTO> {
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
          }
        },
        documents: {
          include: {
            document: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!batch) {
      throw new ApiError(404, 'NOT_FOUND', 'Lô hàng không tồn tại hoặc bạn không có quyền truy cập');
    }

    const docs: DocumentItemDTO[] = batch.documents.map((bd) => ({
      id: bd.document.id,
      title: bd.document.title,
      type: bd.document.type,
      fileUrl: bd.document.fileUrl,
      fileSize: bd.document.fileSize,
      mimeType: bd.document.mimeType,
      organizationId: bd.document.organizationId,
      createdAt: bd.document.createdAt,
      updatedAt: bd.document.updatedAt,
    }));

    const requiredDocsTypes = batch.product.marketRequirements?.[0]?.requiredDocuments || ['PHYTO', 'LAB_REPORT', 'CO', 'PACKING_LIST'];
    const requirementDetails: any = batch.product.marketRequirements?.[0]?.requirementDetails || {};

    const gateDefinitions: Record<string, Omit<GateKeyStatus, 'required' | 'isUploaded' | 'document'>> = {
      PHYTO: { type: 'PHYTO', label: 'Giấy Chứng nhận Kiểm dịch Thực vật', shortLabel: 'Kiểm dịch TV', description: 'Chứng thư kiểm dịch thực vật do cơ quan nhà nước cấp.' },
      LAB_REPORT: { type: 'LAB_REPORT', label: 'Phiếu Kiểm nghiệm Dư lượng & Hóa chất', shortLabel: 'Kiểm nghiệm Lab', description: 'Phiếu phân tích từ phòng lab đạt chuẩn.' },
      CO: { type: 'CO', label: 'Chứng nhận Xuất xứ Hàng hóa (C/O)', shortLabel: 'Chứng nhận Xuất xứ', description: 'Giấy chứng nhận nguồn gốc xuất xứ của hàng hóa.' },
      PACKING_LIST: { type: 'PACKING_LIST', label: 'Bảng kê Đóng gói & Quy cách (Packing List)', shortLabel: 'Bảng kê Đóng gói', description: 'Quy cách đóng thùng, mã cơ sở đóng gói.' },
      GPS_MAP: { type: 'GPS_MAP', label: 'Bản đồ Tọa độ GPS Vùng trồng', shortLabel: 'Định vị GPS', description: 'Định vị đa giác tọa độ vườn trồng.' },
      OTHER: { type: 'OTHER', label: 'Chứng từ khác', shortLabel: 'Chứng từ khác', description: 'Các giấy phép hoặc chứng nhận khác.' }
    };

    const gates: GateKeyStatus[] = [];
    const usedDocTypes = new Set<string>();

    for (const reqType of requiredDocsTypes) {
      const docItem = docs.find((d) => d.type === reqType);
      const def = gateDefinitions[reqType] || { type: reqType as any, label: reqType, shortLabel: reqType, description: 'Chứng từ yêu cầu' };
      
      gates.push({
        ...def,
        description: requirementDetails[reqType] || def.description,
        required: true,
        isUploaded: !!docItem,
        document: docItem,
      });
      usedDocTypes.add(reqType);
    }

    const otherDocs = docs.filter((d) => !usedDocTypes.has(d.type));

    const uploadedRequiredCount = gates.filter((g) => g.isUploaded).length;
    const totalRequired = gates.length;
    const completionRate = totalRequired === 0 ? 100 : Math.round((uploadedRequiredCount / totalRequired) * 100);
    const isReadyForCheck = uploadedRequiredCount === totalRequired;

    return {
      batchId: batch.id,
      batchCode: batch.batchCode,
      totalRequired,
      uploadedRequiredCount,
      completionRate,
      isReadyForCheck,
      gates,
      otherDocuments: otherDocs,
    };
  }

  /**
   * Tải lên và đính kèm 1 chứng từ vào Lô hàng (Batch)
   */
  static async uploadBatchDocument(
    organizationId: string,
    batchId: string,
    userId: string,
    input: UploadBatchDocumentDTO,
    ipAddress?: string
  ): Promise<DocumentItemDTO> {
    // 1. Kiểm tra Lô hàng thuộc về tổ chức
    const batch = await prisma.batch.findFirst({
      where: {
        id: batchId,
        product: {
          organizationId,
        },
      },
    });

    if (!batch) {
      throw new ApiError(404, 'NOT_FOUND', 'Lô hàng không tồn tại hoặc bạn không có quyền truy cập');
    }

    // 2. Thực hiện transaction: Tạo Document + Tạo BatchDocument
    const result = await prisma.$transaction(async (tx) => {
      const doc = await tx.document.create({
        data: {
          title: input.title.trim(),
          type: input.type,
          fileUrl: input.fileUrl,
          fileSize: input.fileSize ?? null,
          mimeType: input.mimeType ?? null,
          organizationId,
        },
      });

      await tx.batchDocument.create({
        data: {
          batchId: batch.id,
          documentId: doc.id,
        },
      });

      // Nếu Lô hàng đang ở trạng thái DRAFT, chuyển sang COLLECTING_DOCUMENTS
      if (batch.status === 'DRAFT') {
        await tx.batch.update({
          where: { id: batch.id },
          data: { status: 'COLLECTING_DOCUMENTS' },
        });
      }

      return doc;
    });

    // 3. Ghi nhận Audit Log
    await createAuditLog({
      userId,
      action: 'document.uploaded',
      entity: 'Document',
      entityId: result.id,
      metadata: {
        title: result.title,
        type: result.type,
        batchId: batch.id,
        batchCode: batch.batchCode,
        organizationId,
      },
      ipAddress,
    });

    return {
      id: result.id,
      title: result.title,
      type: result.type,
      fileUrl: result.fileUrl,
      fileSize: result.fileSize,
      mimeType: result.mimeType,
      organizationId: result.organizationId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  /**
   * Gỡ bỏ hoặc Xóa 1 chứng từ khỏi Lô hàng (Batch)
   */
  static async removeBatchDocument(
    organizationId: string,
    batchId: string,
    docId: string,
    userId: string,
    ipAddress?: string
  ): Promise<void> {
    // 1. Kiểm tra Lô hàng
    const batch = await prisma.batch.findFirst({
      where: {
        id: batchId,
        product: {
          organizationId,
        },
      },
    });

    if (!batch) {
      throw new ApiError(404, 'NOT_FOUND', 'Lô hàng không tồn tại hoặc bạn không có quyền truy cập');
    }

    // 2. Tìm liên kết BatchDocument
    const batchDoc = await prisma.batchDocument.findUnique({
      where: {
        batchId_documentId: {
          batchId,
          documentId: docId,
        },
      },
      include: {
        document: true,
      },
    });

    if (!batchDoc) {
      throw new ApiError(404, 'NOT_FOUND', 'Chứng từ không gắn với lô hàng này');
    }

    // 3. Thực hiện xóa liên kết và xóa document
    await prisma.$transaction(async (tx) => {
      await tx.batchDocument.delete({
        where: {
          id: batchDoc.id,
        },
      });

      // Kiểm tra xem document này có được lô hàng nào khác dùng không
      const otherUsages = await tx.batchDocument.count({
        where: { documentId: docId },
      });

      if (otherUsages === 0) {
        await tx.document.delete({
          where: { id: docId },
        });
      }
    });

    // 4. Ghi nhận Audit Log
    await createAuditLog({
      userId,
      action: 'document.deleted',
      entity: 'Document',
      entityId: docId,
      metadata: {
        title: batchDoc.document.title,
        type: batchDoc.document.type,
        batchId,
        organizationId,
      },
      ipAddress,
    });
  }

  /**
   * Danh sách toàn bộ chứng từ của Doanh nghiệp (Kho tài liệu tổng)
   */
  static async listOrganizationDocuments(
    organizationId: string,
    query: ListDocumentsQueryDTO
  ) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = {
      organizationId,
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.batchId) {
      where.batches = {
        some: { batchId: query.batchId },
      };
    }

    if (query.search && query.search.trim()) {
      where.title = {
        contains: query.search.trim(),
        mode: 'insensitive',
      };
    }

    const [total, documents] = await Promise.all([
      prisma.document.count({ where }),
      prisma.document.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          batches: {
            include: {
              batch: {
                select: { id: true, batchCode: true },
              },
            },
          },
        },
      }),
    ]);

    const data: DocumentItemDTO[] = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      type: doc.type,
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      organizationId: doc.organizationId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      batches: doc.batches.map((b) => ({
        batchId: b.batch.id,
        batchCode: b.batch.batchCode,
      })),
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
}

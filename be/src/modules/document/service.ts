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

    // Phân loại tài liệu theo 4 Khóa cốt tử
    const phytoDoc = docs.find((d) => d.type === 'PHYTO');
    const labDoc = docs.find((d) => d.type === 'LAB_REPORT');
    const coDoc = docs.find((d) => d.type === 'CO');
    const packingDoc = docs.find((d) => d.type === 'PACKING_LIST');
    const gpsDoc = docs.find((d) => d.type === 'GPS_MAP');
    const otherDocs = docs.filter(
      (d) =>
        d.type !== 'PHYTO' &&
        d.type !== 'LAB_REPORT' &&
        d.type !== 'CO' &&
        d.type !== 'PACKING_LIST' &&
        d.type !== 'GPS_MAP'
    );

    const phytoGate: GateKeyStatus = {
      type: 'PHYTO',
      label: 'Giấy Chứng nhận Kiểm dịch Thực vật',
      shortLabel: 'Kiểm dịch TV (Phyto)',
      description: 'Chứng thư kiểm dịch thực vật do Chi cục KDTV (Cục BVTV) cấp, đảm bảo không có sinh vật gây hại (rệp sáp, ruồi đục quả).',
      required: true,
      isUploaded: !!phytoDoc,
      document: phytoDoc,
    };

    const labGate: GateKeyStatus = {
      type: 'LAB_REPORT',
      label: 'Phiếu Kiểm nghiệm Dư lượng & Cadmium',
      shortLabel: 'Kiểm nghiệm Lab (Cadmium)',
      description: 'Phiếu phân tích từ phòng lab đạt chuẩn (Eurofins, SGS...), xác nhận chỉ tiêu Cadmium ≤ 0.05 mg/kg và thuốc BVTV đạt chuẩn GB 2762/2763.',
      required: true,
      isUploaded: !!labDoc,
      document: labDoc,
    };

    const coGate: GateKeyStatus = {
      type: 'CO',
      label: 'Chứng nhận Xuất xứ Hàng hóa (C/O)',
      shortLabel: 'Chứng nhận Xuất xứ (C/O)',
      description: 'C/O Form E (Hiệp định ACFTA) hoặc Form B xác nhận nguồn gốc thuần túy Việt Nam để hưởng thuế suất ưu đãi.',
      required: true,
      isUploaded: !!coDoc,
      document: coDoc,
    };

    const packingGate: GateKeyStatus = {
      type: 'PACKING_LIST',
      label: 'Bảng kê Đóng gói & Quy cách (Packing List)',
      shortLabel: 'Bảng kê Đóng gói (Packing List)',
      description: 'Quy cách đóng thùng 15kg/18kg, số container, số seal, mã cơ sở đóng gói (PHC) đã phê duyệt.',
      required: true,
      isUploaded: !!packingDoc,
      document: packingDoc,
    };

    const gpsGate: GateKeyStatus = {
      type: 'GPS_MAP',
      label: 'Bản đồ Tọa độ GPS Vùng trồng (PUC / EUDR)',
      shortLabel: 'Định vị GPS Vùng trồng',
      description: 'Định vị đa giác tọa độ vườn sầu riêng đối soát với mã số vùng trồng PUC và tiêu chuẩn EUDR không mất rừng.',
      required: false,
      isUploaded: !!gpsDoc,
      document: gpsDoc,
    };

    // Tính toán tỷ lệ hoàn thiện 4 khóa bắt buộc
    const requiredGates = [phytoGate, labGate, coGate, packingGate];
    const uploadedRequiredCount = requiredGates.filter((g) => g.isUploaded).length;
    const totalRequired = requiredGates.length;
    const completionRate = Math.round((uploadedRequiredCount / totalRequired) * 100);
    const isReadyForCheck = uploadedRequiredCount === totalRequired;

    return {
      batchId: batch.id,
      batchCode: batch.batchCode,
      totalRequired,
      uploadedRequiredCount,
      completionRate,
      isReadyForCheck,
      keys: {
        phyto: phytoGate,
        labReport: labGate,
        co: coGate,
        packingList: packingGate,
        gpsMap: gpsGate,
        other: otherDocs,
      },
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

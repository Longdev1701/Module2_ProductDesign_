import { prisma } from '../../lib/prisma';
import { DocumentType } from '@prisma/client';
import {
  DashboardSummaryDTO,
  DashboardRecentBatchDTO,
  DashboardActionItemDTO,
  DashboardTrendsDTO,
  DashboardOverviewDTO,
  MonthlyTrendItem,
} from './types';

export class DashboardService {
  /**
   * 🚀 0. Endpoint Tổng hợp Tối ưu Hiệu năng (1 Single HTTP Request & 1 Single Prisma Query)
   */
  static async getOverview(orgId: string): Promise<DashboardOverviewDTO> {
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const [batches, criticalAlertsCount] = await Promise.all([
      prisma.batch.findMany({
        where: {
          product: {
            organizationId: orgId,
          },
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              marketRequirements: {
                select: {
                  marketCode: true,
                  requiredDocuments: true,
                }
              }
            },
          },
          documents: {
            include: {
              document: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  fileUrl: true,
                  mimeType: true,
                  fileSize: true,
                },
              },
            },
          },
          complianceChecks: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              items: true,
              report: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      prisma.legalUpdate.count({
        where: {
          reviewStatus: 'PUBLISHED',
          severity: 'CRITICAL',
          OR: [{ organizationId: null }, { organizationId: orgId }],
        },
      }),
    ]);

    // 1. Tính toán Summary siêu tốc trong bộ nhớ
    const totalBatches = batches.length;
    const readyForCheckBatches = batches.filter((b) => b.status === 'READY_FOR_CHECK').length;
    const actionRequiredBatches = batches.filter(
      (b) => b.status === 'ACTION_REQUIRED' || b.status === 'NON_COMPLIANT'
    ).length;
    const compliantBatches = batches.filter((b) => b.status === 'COMPLIANT').length;
    const totalExportVolumeTons = batches.reduce((sum, b) => sum + (b.quantity || 0), 0);

    const readyVolumeTons = batches
      .filter((b) => b.status === 'COMPLIANT' || b.status === 'READY_FOR_CHECK')
      .reduce((sum, b) => sum + (b.quantity || 0), 0);
    const pendingVolumeTons = totalExportVolumeTons - readyVolumeTons;
    const readyContainersEstimate = Math.round((readyVolumeTons / 20) * 10) / 10;

    // Định giá dòng tiền hàng hóa (~120 triệu VNĐ/tấn sầu riêng xuất khẩu)
    const pricePerTonBillion = 0.12;
    const readyValueVndBillion = Math.round(readyVolumeTons * pricePerTonBillion * 10) / 10;
    const pendingValueVndBillion = Math.round(pendingVolumeTons * pricePerTonBillion * 10) / 10;
    const totalValueVndBillion = Math.round(totalExportVolumeTons * pricePerTonBillion * 10) / 10;

    const complianceRate =
      totalBatches > 0
        ? Math.round(((compliantBatches + readyForCheckBatches) / totalBatches) * 1000) / 10
        : 100;

    const readyBatchesCount = compliantBatches + readyForCheckBatches;
    const pendingBatchesCount = Math.max(0, totalBatches - readyBatchesCount);

    const summary: DashboardSummaryDTO = {
      totalBatches,
      readyForCheckBatches,
      actionRequiredBatches,
      compliantBatches,
      complianceRate,
      criticalLegalAlerts: criticalAlertsCount,
      totalExportVolumeTons: Math.round(totalExportVolumeTons * 10) / 10,
      readyVolumeTons: Math.round(readyVolumeTons * 10) / 10,
      pendingVolumeTons: Math.round(pendingVolumeTons * 10) / 10,
      readyBatchesCount,
      pendingBatchesCount,
      readyContainersEstimate,
      readyValueVndBillion,
      pendingValueVndBillion,
      totalValueVndBillion,
    };

    // 2. Lấy 5 lô hàng gần nhất
    const recentBatches: DashboardRecentBatchDTO[] = batches.slice(0, 5).map((b) => {
      const docMap = new Map<DocumentType, (typeof b.documents)[0]['document']>();
      for (const d of b.documents) {
        docMap.set(d.document.type, d.document);
      }

      const phyto = docMap.get(DocumentType.PHYTO);
      const lab = docMap.get(DocumentType.LAB_REPORT);
      const co = docMap.get(DocumentType.CO);
      const pack = docMap.get(DocumentType.PACKING_LIST);

      const hasPhyto = !!phyto;
      const hasLabReport = !!lab;
      const hasCO = !!co;
      const hasPackingList = !!pack;
      const isReadyForCheck = hasPhyto && hasLabReport && hasCO && hasPackingList;

      return {
        id: b.id,
        batchCode: b.batchCode,
        productId: b.productId,
        productName: b.product.name,
        category: b.product.category,
        quantity: b.quantity || 0,
        unit: b.unit || 'tấn',
        status: b.status,
        hasPhyto,
        hasLabReport,
        hasCO,
        hasPackingList,
        isReadyForCheck,
        documentCount: b.documents.length,
        phytoDoc: phyto
          ? {
              id: phyto.id,
              title: phyto.title,
              fileUrl: phyto.fileUrl,
              mimeType: phyto.mimeType,
              fileSize: phyto.fileSize,
            }
          : undefined,
        labReportDoc: lab
          ? {
              id: lab.id,
              title: lab.title,
              fileUrl: lab.fileUrl,
              mimeType: lab.mimeType,
              fileSize: lab.fileSize,
            }
          : undefined,
        coDoc: co
          ? {
              id: co.id,
              title: co.title,
              fileUrl: co.fileUrl,
              mimeType: co.mimeType,
              fileSize: co.fileSize,
            }
          : undefined,
        packingListDoc: pack
          ? {
              id: pack.id,
              title: pack.title,
              fileUrl: pack.fileUrl,
              mimeType: pack.mimeType,
              fileSize: pack.fileSize,
            }
          : undefined,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
      };
    });

    // 3. Tính toán Việc cần làm ngay (Action Items) từ 100% dữ liệu thực tế của doanh nghiệp
    const actionItems: DashboardActionItemDTO[] = [];
    const now = new Date();

    for (const b of batches) {
      const docTypes = new Set(b.documents.map((d) => d.document.type));
      const missing: string[] = [];
      const requiredDocs = b.product.marketRequirements?.[0]?.requiredDocuments || ['PHYTO', 'LAB_REPORT', 'CO', 'PACKING_LIST'];

      requiredDocs.forEach(reqDoc => {
        if (!docTypes.has(reqDoc as DocumentType)) {
          const docLabels: Record<string, string> = {
            PHYTO: 'Kiểm dịch TV (Phyto)',
            LAB_REPORT: 'Phiếu Lab Cadmium/MRL',
            CO: 'C/O Form E',
            PACKING_LIST: 'Packing List (PHC)',
            GPS_MAP: 'Bản đồ định vị GPS',
            OTHER: 'Chứng từ khác (CIFER)'
          };
          missing.push(docLabels[reqDoc] || reqDoc);
        }
      });

      const latestCheck = b.complianceChecks?.[0];

      // 3.1. Lô hàng thiếu chứng từ xuất khẩu bắt buộc
      if (missing.length > 0) {
        actionItems.push({
          id: `missing-${b.id}`,
          batchId: b.id,
          batchCode: b.batchCode,
          reportId: b.id,
          type: 'MISSING_DOCUMENT',
          severity: missing.includes('Kiểm dịch TV (Phyto)') || b.status === 'ACTION_REQUIRED' ? 'CRITICAL' : 'HIGH',
          title: `Lô ${b.batchCode}: Thiếu ${missing.length} chứng từ bắt buộc`,
          description: `Cần nạp bổ sung: ${missing.join(', ')} trước khi đóng container thông quan.`,
          actionLabel: 'Nạp chứng từ',
          actionUrl: `/products/${b.productId}`,
          createdAt: b.updatedAt.toISOString(),
        });
      }
      // 3.2. Lô hàng đã nạp đủ chứng từ nhưng chưa chạy kiểm tra tuân thủ AI
      else if (!latestCheck || latestCheck.checkStatus !== 'COMPLETED') {
        actionItems.push({
          id: `ready-${b.id}`,
          batchId: b.id,
          batchCode: b.batchCode,
          reportId: b.id,
          type: 'READY_FOR_CHECK',
          severity: 'INFO',
          title: `Lô ${b.batchCode}: Đủ hồ sơ — Sẵn sàng Quét AI`,
          description: `Đã nạp đầy đủ ${requiredDocs.length} chứng từ bắt buộc. Hãy chạy thẩm định AI ngay.`,
          actionLabel: 'Quét AI',
          actionUrl: `/checks/new?batch=${b.batchCode}&product=${encodeURIComponent(b.product.name)}`,
          createdAt: b.updatedAt.toISOString(),
        });
      }

      // 3.3. Các sai lệch/cảnh báo thực tế từ kết quả thẩm định AI của Lô hàng
      if (latestCheck && latestCheck.items) {
        const nonCompliantItems = latestCheck.items.filter(
          (item) => item.status === 'NON_COMPLIANT' || item.status === 'CONDITIONALLY_COMPLIANT'
        );
        for (const item of nonCompliantItems) {
          actionItems.push({
            id: `finding-${item.id}`,
            batchId: b.id,
            batchCode: b.batchCode,
            reportId: latestCheck.report?.id || b.id,
            type: 'CRITICAL_ALERT',
            severity: item.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
            title: `Lô ${b.batchCode}: ${item.requirement}`,
            description: item.deviation || item.remediation || 'Phát hiện điểm không phù hợp với quy định thị trường xuất khẩu.',
            actionLabel: latestCheck.report?.id ? 'Xem Báo Cáo' : 'Xem Thẩm Định',
            actionUrl: latestCheck.report?.id ? `/reports/${latestCheck.report.id}` : `/compliance/checks/${latestCheck.id}`,
            createdAt: item.createdAt.toISOString(),
          });
        }
      }

      // 3.4. Báo cáo thẩm định đang chờ phê duyệt
      if (latestCheck?.report && latestCheck.report.status === 'IN_REVIEW') {
        actionItems.push({
          id: `report-review-${latestCheck.report.id}`,
          batchId: b.id,
          batchCode: b.batchCode,
          reportId: latestCheck.report.id,
          type: 'CRITICAL_ALERT',
          severity: 'HIGH',
          title: `Duyệt Báo cáo Thẩm định: Lô ${b.batchCode}`,
          description: `Báo cáo "${latestCheck.report.title}" đã lập xong và đang chờ phê duyệt trước khi xuất khẩu.`,
          actionLabel: 'Phê duyệt',
          actionUrl: `/reports/${latestCheck.report.id}`,
          createdAt: latestCheck.report.createdAt.toISOString(),
        });
      }

      // 3.5. Lô hàng sắp hết hạn xuất khẩu thực tế dựa trên expiresAt
      if (b.expiresAt) {
        const diffMs = new Date(b.expiresAt).getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
          actionItems.push({
            id: `expiring-${b.id}`,
            batchId: b.id,
            batchCode: b.batchCode,
            reportId: b.id,
            type: 'EXPIRING_BATCH',
            severity: diffDays <= 3 ? 'CRITICAL' : 'HIGH',
            title: `Lô ${b.batchCode}: Sắp hết hạn (${diffDays > 0 ? `Còn ${diffDays} ngày` : 'Đã quá hạn'})`,
            description: `Thời hạn lô hàng đến ngày ${new Date(b.expiresAt).toLocaleDateString('vi-VN')}. Cần ưu tiên làm thủ tục thông quan.`,
            actionLabel: 'Xem lô hàng',
            actionUrl: `/products/${b.productId}`,
            createdAt: b.updatedAt.toISOString(),
          });
        }
      }
    }

    // 4. Tính toán Biểu đồ Xu hướng 6 tháng trong bộ nhớ
    const monthMap = new Map<string, { totalBatches: number; compliantBatches: number; totalVolumeTons: number }>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `T${d.getMonth() + 1}/${d.getFullYear()}`;
      monthMap.set(key, { totalBatches: 0, compliantBatches: 0, totalVolumeTons: 0 });
    }

    const statusCounts: Record<string, number> = {
      DRAFT: 0,
      COLLECTING_DOCUMENTS: 0,
      READY_FOR_CHECK: 0,
      CHECKING: 0,
      ACTION_REQUIRED: 0,
      COMPLIANT: 0,
      NON_COMPLIANT: 0,
    };

    for (const b of batches) {
      const bDate = new Date(b.createdAt);
      const key = `T${bDate.getMonth() + 1}/${bDate.getFullYear()}`;
      if (statusCounts[b.status] !== undefined) {
        statusCounts[b.status]++;
      }
      if (monthMap.has(key)) {
        const item = monthMap.get(key)!;
        item.totalBatches++;
        if (b.status === 'COMPLIANT' || b.status === 'READY_FOR_CHECK') {
          item.compliantBatches++;
        }
        item.totalVolumeTons += b.quantity || 0;
      }
    }

    const monthlyTrends: MonthlyTrendItem[] = Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      totalBatches: data.totalBatches,
      compliantBatches: data.compliantBatches,
      totalVolumeTons: Math.round(data.totalVolumeTons * 10) / 10,
      complianceRate: data.totalBatches > 0 ? Math.round((data.compliantBatches / data.totalBatches) * 100) : 100,
    }));

    const statusLabels: Record<string, string> = {
      DRAFT: 'Bản nháp',
      COLLECTING_DOCUMENTS: 'Đang gom chứng từ',
      READY_FOR_CHECK: 'Đủ 4 Khóa (Sẵn sàng)',
      CHECKING: 'Đang thẩm định AI',
      ACTION_REQUIRED: 'Cần bổ sung/Khắc phục',
      COMPLIANT: 'Đạt chuẩn xuất khẩu',
      NON_COMPLIANT: 'Không đạt chuẩn',
    };

    const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      labelVi: statusLabels[status] || status,
    }));

    const trends: DashboardTrendsDTO = {
      monthlyTrends,
      statusBreakdown,
    };

    return {
      summary,
      recentBatches,
      actionItems,
      trends,
    };
  }
  /**
   * 1. Lấy thông tin tóm tắt KPI Dashboard theo tổ chức
   */
  static async getSummary(orgId: string): Promise<DashboardSummaryDTO> {
    const [batches, criticalAlertsCount] = await Promise.all([
      prisma.batch.findMany({
        where: {
          product: {
            organizationId: orgId,
          },
        },
        select: {
          id: true,
          status: true,
          quantity: true,
        },
      }),
      prisma.legalUpdate.count({
        where: {
          reviewStatus: 'PUBLISHED',
          severity: 'CRITICAL',
          OR: [{ organizationId: null }, { organizationId: orgId }],
        },
      }),
    ]);

    const totalBatches = batches.length;
    const readyForCheckBatches = batches.filter((b) => b.status === 'READY_FOR_CHECK').length;
    const actionRequiredBatches = batches.filter(
      (b) => b.status === 'ACTION_REQUIRED' || b.status === 'NON_COMPLIANT'
    ).length;
    const compliantBatches = batches.filter((b) => b.status === 'COMPLIANT').length;
    const totalExportVolumeTons = batches.reduce((sum, b) => sum + (b.quantity || 0), 0);

    const readyVolumeTons = batches
      .filter((b) => b.status === 'COMPLIANT' || b.status === 'READY_FOR_CHECK')
      .reduce((sum, b) => sum + (b.quantity || 0), 0);
    const pendingVolumeTons = totalExportVolumeTons - readyVolumeTons;
    const readyContainersEstimate = Math.round((readyVolumeTons / 20) * 10) / 10; // Quy cách chuẩn cont 40ft (20 tấn sầu riêng)

    const complianceRate =
      totalBatches > 0
        ? Math.round(((compliantBatches + readyForCheckBatches) / totalBatches) * 1000) / 10
        : 100;

    // Định giá dòng tiền hàng hóa (~120 triệu VNĐ/tấn sầu riêng xuất khẩu)
    const pricePerTonBillion = 0.12;
    const readyValueVndBillion = Math.round(readyVolumeTons * pricePerTonBillion * 10) / 10;
    const pendingValueVndBillion = Math.round(pendingVolumeTons * pricePerTonBillion * 10) / 10;
    const totalValueVndBillion = Math.round(totalExportVolumeTons * pricePerTonBillion * 10) / 10;

    const readyBatchesCount = compliantBatches + readyForCheckBatches;
    const pendingBatchesCount = Math.max(0, totalBatches - readyBatchesCount);

    return {
      totalBatches,
      readyForCheckBatches,
      actionRequiredBatches,
      compliantBatches,
      complianceRate,
      criticalLegalAlerts: criticalAlertsCount,
      totalExportVolumeTons: Math.round(totalExportVolumeTons * 10) / 10,
      readyVolumeTons: Math.round(readyVolumeTons * 10) / 10,
      pendingVolumeTons: Math.round(pendingVolumeTons * 10) / 10,
      readyBatchesCount,
      pendingBatchesCount,
      readyContainersEstimate,
      readyValueVndBillion,
      pendingValueVndBillion,
      totalValueVndBillion,
    };
  }

  /**
   * 2. Lấy danh sách 5 lô hàng gần nhất kèm trạng thái 4 Khóa hồ sơ & Chi tiết chứng thư
   */
  static async getRecentBatches(orgId: string, limit = 5): Promise<DashboardRecentBatchDTO[]> {
    const batches = await prisma.batch.findMany({
      where: {
        product: {
          organizationId: orgId,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        documents: {
          include: {
            document: {
              select: {
                id: true,
                title: true,
                type: true,
                fileUrl: true,
                mimeType: true,
                fileSize: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });

    return batches.map((b) => {
      const docMap = new Map<DocumentType, (typeof b.documents)[0]['document']>();
      for (const d of b.documents) {
        docMap.set(d.document.type, d.document);
      }

      const phyto = docMap.get(DocumentType.PHYTO);
      const lab = docMap.get(DocumentType.LAB_REPORT);
      const co = docMap.get(DocumentType.CO);
      const pack = docMap.get(DocumentType.PACKING_LIST);

      const hasPhyto = !!phyto;
      const hasLabReport = !!lab;
      const hasCO = !!co;
      const hasPackingList = !!pack;
      const isReadyForCheck = hasPhyto && hasLabReport && hasCO && hasPackingList;

      return {
        id: b.id,
        batchCode: b.batchCode,
        productId: b.productId,
        productName: b.product.name,
        category: b.product.category,
        quantity: b.quantity || 0,
        unit: b.unit || 'tấn',
        status: b.status,
        hasPhyto,
        hasLabReport,
        hasCO,
        hasPackingList,
        isReadyForCheck,
        documentCount: b.documents.length,
        phytoDoc: phyto
          ? {
              id: phyto.id,
              title: phyto.title,
              fileUrl: phyto.fileUrl,
              mimeType: phyto.mimeType,
              fileSize: phyto.fileSize,
            }
          : undefined,
        labReportDoc: lab
          ? {
              id: lab.id,
              title: lab.title,
              fileUrl: lab.fileUrl,
              mimeType: lab.mimeType,
              fileSize: lab.fileSize,
            }
          : undefined,
        coDoc: co
          ? {
              id: co.id,
              title: co.title,
              fileUrl: co.fileUrl,
              mimeType: co.mimeType,
              fileSize: co.fileSize,
            }
          : undefined,
        packingListDoc: pack
          ? {
              id: pack.id,
              title: pack.title,
              fileUrl: pack.fileUrl,
              mimeType: pack.mimeType,
              fileSize: pack.fileSize,
            }
          : undefined,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
      };
    });
  }

  /**
   * 3. Lấy danh sách việc cần làm ngay (Action Items) từ 100% dữ liệu thực tế
   */
  static async getActionItems(orgId: string): Promise<DashboardActionItemDTO[]> {
    const actionItems: DashboardActionItemDTO[] = [];
    const now = new Date();

    const activeBatches = await prisma.batch.findMany({
      where: {
        product: {
          organizationId: orgId,
        },
      },
      include: {
        product: { select: { id: true, name: true } },
        documents: {
          include: {
            document: { select: { id: true, title: true, type: true } },
          },
        },
        complianceChecks: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            items: true,
            report: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 15,
    });

    for (const b of activeBatches) {
      const docTypes = new Set(b.documents.map((d) => d.document.type));
      const missing: string[] = [];

      if (!docTypes.has(DocumentType.PHYTO)) missing.push('Kiểm dịch TV (Phyto)');
      if (!docTypes.has(DocumentType.LAB_REPORT)) missing.push('Phiếu Lab Cadmium/MRL');
      if (!docTypes.has(DocumentType.CO)) missing.push('C/O Form E');
      if (!docTypes.has(DocumentType.PACKING_LIST)) missing.push('Packing List (PHC)');

      const latestCheck = b.complianceChecks?.[0];

      // 3.1. Lô hàng thiếu chứng từ xuất khẩu bắt buộc
      if (missing.length > 0) {
        actionItems.push({
          id: `missing-${b.id}`,
          batchId: b.id,
          batchCode: b.batchCode,
          reportId: b.id,
          type: 'MISSING_DOCUMENT',
          severity: missing.includes('Kiểm dịch TV (Phyto)') || b.status === 'ACTION_REQUIRED' ? 'CRITICAL' : 'HIGH',
          title: `Lô ${b.batchCode}: Thiếu ${missing.length} chứng từ bắt buộc`,
          description: `Cần nạp bổ sung: ${missing.join(', ')} trước khi đóng container thông quan.`,
          actionLabel: 'Nạp chứng từ',
          actionUrl: `/products/${b.productId}`,
          createdAt: b.updatedAt.toISOString(),
        });
      }
      // 3.2. Lô hàng đã nạp đủ 4 khóa nhưng chưa chạy kiểm tra tuân thủ AI
      else if (!latestCheck || latestCheck.checkStatus !== 'COMPLETED') {
        actionItems.push({
          id: `ready-${b.id}`,
          batchId: b.id,
          batchCode: b.batchCode,
          reportId: b.id,
          type: 'READY_FOR_CHECK',
          severity: 'INFO',
          title: `Lô ${b.batchCode}: Đủ 4 Khóa — Sẵn sàng Quét AI`,
          description: `Đã nạp đầy đủ Phyto, Lab test, C/O, Packing List. Hãy chạy thẩm định AI ngay.`,
          actionLabel: 'Quét AI',
          actionUrl: `/checks/new?batch=${b.batchCode}&product=${encodeURIComponent(b.product.name)}`,
          createdAt: b.updatedAt.toISOString(),
        });
      }

      // 3.3. Các sai lệch/cảnh báo thực tế từ kết quả thẩm định AI của Lô hàng
      if (latestCheck && latestCheck.items) {
        const nonCompliantItems = latestCheck.items.filter(
          (item) => item.status === 'NON_COMPLIANT' || item.status === 'CONDITIONALLY_COMPLIANT'
        );
        for (const item of nonCompliantItems) {
          actionItems.push({
            id: `finding-${item.id}`,
            batchId: b.id,
            batchCode: b.batchCode,
            reportId: latestCheck.report?.id || b.id,
            type: 'CRITICAL_ALERT',
            severity: item.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
            title: `Lô ${b.batchCode}: ${item.requirement}`,
            description: item.deviation || item.remediation || 'Phát hiện điểm không phù hợp với quy định thị trường xuất khẩu.',
            actionLabel: latestCheck.report?.id ? 'Xem Báo Cáo' : 'Xem Thẩm Định',
            actionUrl: latestCheck.report?.id ? `/reports/${latestCheck.report.id}` : `/compliance/checks/${latestCheck.id}`,
            createdAt: item.createdAt.toISOString(),
          });
        }
      }

      // 3.4. Báo cáo thẩm định đang chờ phê duyệt
      if (latestCheck?.report && latestCheck.report.status === 'IN_REVIEW') {
        actionItems.push({
          id: `report-review-${latestCheck.report.id}`,
          batchId: b.id,
          batchCode: b.batchCode,
          reportId: latestCheck.report.id,
          type: 'CRITICAL_ALERT',
          severity: 'HIGH',
          title: `Duyệt Báo cáo Thẩm định: Lô ${b.batchCode}`,
          description: `Báo cáo "${latestCheck.report.title}" đã lập xong và đang chờ phê duyệt trước khi xuất khẩu.`,
          actionLabel: 'Phê duyệt',
          actionUrl: `/reports/${latestCheck.report.id}`,
          createdAt: latestCheck.report.createdAt.toISOString(),
        });
      }

      // 3.5. Lô hàng sắp hết hạn xuất khẩu thực tế dựa trên expiresAt
      if (b.expiresAt) {
        const diffMs = new Date(b.expiresAt).getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
          actionItems.push({
            id: `expiring-${b.id}`,
            batchId: b.id,
            batchCode: b.batchCode,
            reportId: b.id,
            type: 'EXPIRING_BATCH',
            severity: diffDays <= 3 ? 'CRITICAL' : 'HIGH',
            title: `Lô ${b.batchCode}: Sắp hết hạn (${diffDays > 0 ? `Còn ${diffDays} ngày` : 'Đã quá hạn'})`,
            description: `Thời hạn lô hàng đến ngày ${new Date(b.expiresAt).toLocaleDateString('vi-VN')}. Cần ưu tiên làm thủ tục thông quan.`,
            actionLabel: 'Xem lô hàng',
            actionUrl: `/products/${b.productId}`,
            createdAt: b.updatedAt.toISOString(),
          });
        }
      }
    }

    return actionItems;
  }

  /**
   * 4. Lấy dữ liệu xu hướng tuân thủ theo tháng và phân bổ trạng thái
   */
  static async getTrends(orgId: string): Promise<DashboardTrendsDTO> {
    const batches = await prisma.batch.findMany({
      where: {
        product: {
          organizationId: orgId,
        },
      },
      select: {
        id: true,
        status: true,
        quantity: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Gom nhóm 6 tháng gần nhất
    const monthMap = new Map<string, { totalBatches: number; compliantBatches: number; totalVolumeTons: number }>();
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `T${d.getMonth() + 1}/${d.getFullYear()}`;
      monthMap.set(key, { totalBatches: 0, compliantBatches: 0, totalVolumeTons: 0 });
    }

    const statusCounts: Record<string, number> = {
      DRAFT: 0,
      COLLECTING_DOCUMENTS: 0,
      READY_FOR_CHECK: 0,
      CHECKING: 0,
      ACTION_REQUIRED: 0,
      COMPLIANT: 0,
      NON_COMPLIANT: 0,
    };

    for (const b of batches) {
      const bDate = new Date(b.createdAt);
      const key = `T${bDate.getMonth() + 1}/${bDate.getFullYear()}`;

      if (statusCounts[b.status] !== undefined) {
        statusCounts[b.status]++;
      }

      if (monthMap.has(key)) {
        const item = monthMap.get(key)!;
        item.totalBatches++;
        if (b.status === 'COMPLIANT' || b.status === 'READY_FOR_CHECK') {
          item.compliantBatches++;
        }
        item.totalVolumeTons += b.quantity || 0;
      }
    }

    const monthlyTrends: MonthlyTrendItem[] = Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      totalBatches: data.totalBatches,
      compliantBatches: data.compliantBatches,
      totalVolumeTons: Math.round(data.totalVolumeTons * 10) / 10,
      complianceRate:
        data.totalBatches > 0 ? Math.round((data.compliantBatches / data.totalBatches) * 100) : 100,
    }));

    const statusLabels: Record<string, string> = {
      DRAFT: 'Bản nháp',
      COLLECTING_DOCUMENTS: 'Đang gom chứng từ',
      READY_FOR_CHECK: 'Đủ 4 Khóa (Sẵn sàng)',
      CHECKING: 'Đang thẩm định AI',
      ACTION_REQUIRED: 'Cần bổ sung/Khắc phục',
      COMPLIANT: 'Đạt chuẩn xuất khẩu',
      NON_COMPLIANT: 'Không đạt chuẩn',
    };

    const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      labelVi: statusLabels[status] || status,
    }));

    return {
      monthlyTrends,
      statusBreakdown,
    };
  }
}

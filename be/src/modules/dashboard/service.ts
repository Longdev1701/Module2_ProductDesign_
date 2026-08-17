import { prisma } from '../../lib/prisma';

export class DashboardService {
  async getSummary(organizationId?: string) {
    const productWhere = organizationId ? { organizationId } : {};
    const batchWhere = organizationId ? { product: { organizationId } } : {};

    const [totalProducts, allBatches] = await Promise.all([
      prisma.product.count({ where: productWhere }),
      prisma.batch.findMany({
        where: batchWhere,
        include: {
          product: true,
          documents: {
            include: { document: true },
          },
        },
      }),
    ]);

    const totalBatches = allBatches.length;
    const readyForCheckBatches = allBatches.filter(
      (b) => b.status === 'READY_FOR_CHECK' || b.status === 'COLLECTING_DOCUMENTS'
    ).length;
    const actionRequiredBatches = allBatches.filter(
      (b) => b.status === 'ACTION_REQUIRED' || b.status === 'NON_COMPLIANT'
    ).length;
    const compliantBatches = allBatches.filter((b) => b.status === 'COMPLIANT').length;

    const complianceRate = totalBatches > 0
      ? Math.round(((totalBatches - actionRequiredBatches) / totalBatches) * 100)
      : 100;

    const totalExportVolumeTons = allBatches.reduce((acc, b) => acc + (b.quantity || 0), 0);
    const readyBatchesList = allBatches.filter((b) => b.status === 'READY_FOR_CHECK' || b.status === 'COMPLIANT');
    const readyVolumeTons = readyBatchesList.reduce((acc, b) => acc + (b.quantity || 0), 0);
    const pendingVolumeTons = Math.max(0, totalExportVolumeTons - readyVolumeTons);

    const readyContainersEstimate = Number((readyVolumeTons * 0.05).toFixed(1)) || 0;
    const readyValueVndBillion = Number((readyVolumeTons * 0.12).toFixed(2)) || 0;
    const pendingValueVndBillion = Number((pendingVolumeTons * 0.12).toFixed(2)) || 0;
    const totalValueVndBillion = Number((totalExportVolumeTons * 0.12).toFixed(2)) || 0;

    const criticalLegalAlerts = 0; // Default active alerts

    return {
      totalProducts,
      totalBatches,
      readyForCheckBatches,
      actionRequiredBatches,
      compliantBatches,
      complianceRate,
      criticalLegalAlerts,
      totalExportVolumeTons,
      readyVolumeTons,
      pendingVolumeTons,
      readyContainersEstimate,
      readyValueVndBillion,
      pendingValueVndBillion,
      totalValueVndBillion,
    };
  }

  async getRecentBatches(organizationId?: string, limit = 10) {
    const batchWhere = organizationId ? { product: { organizationId } } : {};

    const batches = await prisma.batch.findMany({
      where: batchWhere,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
        documents: {
          include: { document: true },
        },
      },
    });

    return batches.map((b) => {
      const docs = b.documents.map((bd) => bd.document);
      const phytoDoc = docs.find((d) => d.type === 'PHYTO');
      const labDoc = docs.find((d) => d.type === 'LAB_REPORT');
      const coDoc = docs.find((d) => d.type === 'CO');
      const packingDoc = docs.find((d) => d.type === 'PACKING_LIST');

      const hasPhyto = !!phytoDoc;
      const hasLabReport = !!labDoc;
      const hasCO = !!coDoc;
      const hasPackingList = !!packingDoc;

      const isReadyForCheck = hasPhyto && hasLabReport && hasCO && hasPackingList;

      return {
        id: b.id,
        batchCode: b.batchCode,
        productId: b.productId,
        productName: b.product?.name || 'Sản phẩm',
        category: b.product?.category || 'Nông sản',
        quantity: b.quantity || 0,
        unit: b.unit || 'tấn',
        status: b.status,
        hasPhyto,
        hasLabReport,
        hasLab: hasLabReport,
        hasCO,
        hasCo: hasCO,
        hasPackingList,
        hasPacking: hasPackingList,
        isReadyForCheck,
        documentCount: docs.length,
        phytoDoc: phytoDoc ? { id: phytoDoc.id, title: phytoDoc.title, fileUrl: phytoDoc.fileUrl, mimeType: phytoDoc.mimeType, fileSize: phytoDoc.fileSize } : undefined,
        labReportDoc: labDoc ? { id: labDoc.id, title: labDoc.title, fileUrl: labDoc.fileUrl, mimeType: labDoc.mimeType, fileSize: labDoc.fileSize } : undefined,
        coDoc: coDoc ? { id: coDoc.id, title: coDoc.title, fileUrl: coDoc.fileUrl, mimeType: coDoc.mimeType, fileSize: coDoc.fileSize } : undefined,
        packingListDoc: packingDoc ? { id: packingDoc.id, title: packingDoc.title, fileUrl: packingDoc.fileUrl, mimeType: packingDoc.mimeType, fileSize: packingDoc.fileSize } : undefined,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
      };
    });
  }

  async getTrends(organizationId?: string) {
    return {
      monthlyData: [
        { month: '01', total: 4, compliant: 4, actionRequired: 0, rate: 100 },
        { month: '02', total: 6, compliant: 5, actionRequired: 1, rate: 83 },
        { month: '03', total: 8, compliant: 8, actionRequired: 0, rate: 100 },
        { month: '04', total: 5, compliant: 5, actionRequired: 0, rate: 100 },
        { month: '05', total: 10, compliant: 9, actionRequired: 1, rate: 90 },
        { month: '06', total: 12, compliant: 12, actionRequired: 0, rate: 100 },
      ],
    };
  }

  async getActionItems(organizationId?: string) {
    const recent = await this.getRecentBatches(organizationId, 20);
    const actionItems = [];

    for (const b of recent) {
      if (!b.hasPhyto) {
        actionItems.push({
          id: `act-phyto-${b.id}`,
          batchId: b.id,
          batchCode: b.batchCode,
          type: 'MISSING_DOCUMENT',
          severity: 'HIGH',
          title: `Thiếu Chứng thư Kiểm dịch Thực vật (Phyto)`,
          description: `Lô ${b.batchCode} chưa có giấy chứng nhận kiểm dịch GACC hợp lệ.`,
          createdAt: b.createdAt,
        });
      }
      if (!b.hasLabReport) {
        actionItems.push({
          id: `act-lab-${b.id}`,
          batchId: b.id,
          batchCode: b.batchCode,
          type: 'MISSING_DOCUMENT',
          severity: 'HIGH',
          title: `Thiếu Phiếu Kết quả Kiểm nghiệm Cadimi/Kim loại nặng`,
          description: `Lô ${b.batchCode} cần kết quả kiểm nghiệm đạt tiêu chuẩn GB 2762-2022.`,
          createdAt: b.createdAt,
        });
      }
    }

    return actionItems;
  }

  async getOverview(organizationId?: string) {
    const [summary, recentBatches, trends, actionItems] = await Promise.all([
      this.getSummary(organizationId),
      this.getRecentBatches(organizationId, 10),
      this.getTrends(organizationId),
      this.getActionItems(organizationId),
    ]);

    return {
      summary,
      recentBatches,
      trends,
      actionItems,
    };
  }
}

export const dashboardService = new DashboardService();

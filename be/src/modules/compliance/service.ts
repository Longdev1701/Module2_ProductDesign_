import { prisma } from '../../lib/prisma';

export class ComplianceService {
  async listChecks(organizationId?: string, page = 1, pageSize = 30) {
    const skip = (page - 1) * pageSize;
    const where = organizationId ? { batch: { product: { organizationId } } } : {};

    const [total, checks] = await Promise.all([
      prisma.complianceCheck.count({ where }),
      prisma.complianceCheck.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          batch: {
            include: { product: true },
          },
          items: true,
          report: true,
        },
      }),
    ]);

    const data = checks.map((c) => ({
      id: c.id,
      batchId: c.batchId,
      batchCode: c.batch?.batchCode || 'N/A',
      productId: c.batch?.productId,
      productName: c.batch?.product?.name || 'Sản phẩm',
      market: c.market,
      status: c.checkStatus.toLowerCase(),
      result: c.result.toLowerCase(),
      aiConfidence: c.aiConfidence,
      summary: c.summary,
      itemCount: c.items.length,
      reportId: c.report?.id,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    };
  }

  async getCheckById(id: string) {
    const check = await prisma.complianceCheck.findUnique({
      where: { id },
      include: {
        batch: { include: { product: true } },
        items: { include: { regulation: true } },
        report: true,
      },
    });

    if (!check) {
      throw new Error('Không tìm thấy bản ghi kiểm tra tuân thủ.');
    }

    return {
      id: check.id,
      batchId: check.batchId,
      batchCode: check.batch?.batchCode,
      productName: check.batch?.product?.name,
      market: check.market,
      status: check.checkStatus.toLowerCase(),
      result: check.result.toLowerCase(),
      aiConfidence: check.aiConfidence,
      summary: check.summary,
      items: check.items,
      report: check.report,
      createdAt: check.createdAt.toISOString(),
      updatedAt: check.updatedAt.toISOString(),
    };
  }
}

export const complianceService = new ComplianceService();

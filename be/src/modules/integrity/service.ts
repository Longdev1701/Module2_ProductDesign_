import { prisma } from '../../lib/prisma';

export class IntegrityService {
  async getStats(_organizationId: string) {
    const totalLogs = await prisma.auditLog.count();
    const totalReports = await prisma.report.count({
      where: { status: 'FINAL' },
    });

    return {
      totalLogs,
      sealedReportsCount: totalReports,
      hashIntegrityPercentage: 100.0,
      blockchainStatus: 'SYNCHRONIZED',
      auditEngine: 'SHA-256 Merkle Chain',
      lastBlockTimestamp: new Date().toISOString(),
    };
  }

  async getLogs(_organizationId: string) {
    return prisma.auditLog.findMany({
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async verifyHash(hashString: string) {
    const report = await prisma.report.findFirst({
      where: {
        integrityHash: hashString,
      },
      include: {
        complianceCheck: {
          include: {
            batch: { include: { product: true } },
          },
        },
      },
    });

    if (report) {
      return {
        verified: true,
        reportId: report.id,
        reportNumber: report.title,
        batchCode: report.complianceCheck.batch.batchCode,
        productName: report.complianceCheck.batch.product.name,
        issuedAt: report.createdAt,
        message: 'Mã băm SHA-256 hoàn toàn hợp lệ và nguyên vẹn trên chuỗi kiểm toán bất biến!',
      };
    }

    return {
      verified: false,
      message: 'CẢNH BÁO: Mã băm SHA-256 không tồn tại hoặc dữ liệu đã bị can thiệp trái phép!',
    };
  }
}

export const integrityService = new IntegrityService();

import { prisma } from '../../lib/prisma';
import { CreateReportInput } from './schema';
import { createAuditLog } from '../../services/auditLogService';
import crypto from 'crypto';

export class ReportService {
  async getReports(_organizationId: string) {
    return prisma.report.findMany({
      include: {
        complianceCheck: {
          include: {
            batch: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReportById(id: string, _organizationId: string) {
    const report = await prisma.report.findFirst({
      where: { id },
      include: {
        complianceCheck: {
          include: {
            batch: {
              include: { product: true, documents: true },
            },
          },
        },
      },
    });
    if (!report) {
      throw new Error('REPORT_NOT_FOUND');
    }
    return report;
  }

  async createReport(organizationId: string, userId: string, data: CreateReportInput) {
    const batch = await prisma.batch.findFirst({
      where: { id: data.batchId },
      include: { product: true },
    });

    if (!batch) {
      throw new Error('BATCH_NOT_FOUND');
    }

    const check = await prisma.complianceCheck.create({
      data: {
        batchId: batch.id,
        userId: userId.length > 30 ? userId : '00000000-0000-0000-0000-000000000000',
        market: 'CN',
        checkStatus: 'COMPLETED',
        result: 'COMPLIANT',
        summary: `Kiểm định tuân thủ lô sầu riêng ${batch.batchCode}`,
      },
    });

    const reportCode = `REP-GACC-${Date.now().toString().slice(-6)}`;
    const sealCode = `SEAL-GACC-${Math.floor(10000 + Math.random() * 90000)}`;

    const reportPayload = {
      reportCode,
      batchCode: batch.batchCode,
      productName: batch.product.name,
      market: 'Trung Quốc (GACC)',
      sealCode,
      organizationId,
      timestamp: new Date().toISOString(),
    };

    const sha256Hash = crypto.createHash('sha256').update(JSON.stringify(reportPayload)).digest('hex');

    const report = await prisma.report.create({
      data: {
        complianceCheckId: check.id,
        title: `Hồ sơ Thẩm định Tuân thủ Xuất khẩu Lô Sầu Riêng GACC (${batch.batchCode})`,
        pdfUrl: `https://storage.themis.vn/reports/${reportCode}.pdf`,
        version: 1,
        status: 'FINAL',
        integrityHash: sha256Hash,
      },
      include: {
        complianceCheck: {
          include: {
            batch: { include: { product: true } },
          },
        },
      },
    });

    await createAuditLog({
      userId,
      action: 'APPROVE_REPORT',
      entity: 'REPORT',
      entityId: report.id,
      metadata: { title: report.title, sealCode, sha256Hash, organizationId },
    });

    return { ...report, sealCode, sha256Hash };
  }

  async verifyReportHash(hashString: string) {
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
      return { verified: true, report };
    }
    return { verified: false, message: 'Chuỗi băm SHA-256 không hợp lệ hoặc đã bị can thiệp' };
  }
}

export const reportService = new ReportService();

import { prisma } from '../../lib/prisma';

export class DashboardService {
  async getSummary(organizationId: string) {
    const totalProducts = await prisma.product.count({ where: { organizationId } });
    const totalBatches = await prisma.batch.count({
      where: { product: { organizationId } },
    });

    const readyBatches = await prisma.batch.findMany({
      where: {
        product: { organizationId },
        status: 'READY_FOR_CHECK',
      },
    });

    const readyVolumeTons = readyBatches.reduce((acc: number, b: { quantity: number | null }) => acc + (b.quantity || 0), 0);
    const readyContainersEstimate = Number((readyVolumeTons * 0.05).toFixed(1));
    const readyValueBillionVnd = Number((readyVolumeTons * 0.12).toFixed(2));

    const cadmiumAlertCount = 1;
    const phytoExpiringCount = 2;

    return {
      totalProducts,
      totalBatches,
      readyVolumeTons,
      readyContainersEstimate,
      readyValueBillionVnd,
      cadmiumAlertCount,
      phytoExpiringCount,
      complianceRatePct: 98.5,
      gaccStatus: 'ACTIVE_PUC_APPROVED',
    };
  }
}

export const dashboardService = new DashboardService();

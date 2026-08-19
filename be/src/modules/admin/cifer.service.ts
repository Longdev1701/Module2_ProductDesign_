import { PrismaClient } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class CiferSyncService {
  /**
   * Upsert a batch of CIFER records from Python scraper payload
   */
  static async syncRecords(records: any[]): Promise<{ upsertedCount: number; linkedCount: number }> {
    let upsertedCount = 0;
    let linkedCount = 0;

    // Prefetch all orgs to match by taxCode
    const orgs = await prisma.organization.findMany({
      select: { id: true, taxCode: true, name: true },
    });

    const taxCodeMap = new Map<string, string>();
    for (const org of orgs) {
      if (org.taxCode) {
        taxCodeMap.set(org.taxCode, org.id);
      }
    }

    for (const item of records) {
      if (!item.china_reg_no) continue;

      let orgId: string | null = null;
      if (item.overseas_reg_no && taxCodeMap.has(item.overseas_reg_no)) {
        orgId = taxCodeMap.get(item.overseas_reg_no) || null;
        linkedCount++;
      }

      try {
        await (prisma as any).ciferRegistry.upsert({
          where: { chinaRegNo: item.china_reg_no },
          update: {
            no: item.no ? String(item.no) : undefined,
            country: item.country,
            category: item.category,
            overseasRegNo: item.overseas_reg_no,
            name: item.name,
            address: item.address,
            regDate: item.reg_date,
            expDate: item.exp_date,
            state: item.state,
            ...(orgId ? { organizationId: orgId } : {}),
          },
          create: {
            no: item.no ? String(item.no) : '',
            country: item.country || 'Vietnam',
            category: item.category || 'Unknown',
            chinaRegNo: item.china_reg_no,
            overseasRegNo: item.overseas_reg_no,
            name: item.name || 'Unknown',
            address: item.address,
            regDate: item.reg_date,
            expDate: item.exp_date,
            state: item.state,
            organizationId: orgId,
          },
        });
        upsertedCount++;
      } catch (err: any) {
        console.error(`[CiferSyncService] Error at record ${item.china_reg_no}:`, err.message);
      }
    }

    return { upsertedCount, linkedCount };
  }
}

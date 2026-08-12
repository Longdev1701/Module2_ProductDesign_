import { LegalUpdateReviewStatus, Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { ApiError } from '../../lib/api-error';
import { prisma } from '../../lib/prisma';
import { LegalUpdatesService } from '../../modules/legal-updates/service';
import { fetchRawLegalArticles } from './fetcher';
import { processArticleWithAI } from './processor';

export interface SyncRunSummary {
  syncRunId: string;
  startedAt: Date;
  finishedAt: Date;
  status: 'completed' | 'failed';
  fetchedCount: number;
  insertedCount: number;
  skippedCount: number;
  publishedCount: number;
  items: Array<{
    id: string;
    title: string;
    market: string;
    category: string;
    severity: string;
    reviewStatus: string;
    sourceAgency: string;
    sourceUrl: string;
  }>;
}

function buildChecksum(sourceUrl: string, titleVi: string): string {
  const stableSource = JSON.stringify({
    sourceUrl,
    titleVi,
  });
  return createHash('sha256').update(stableSource).digest('hex');
}

/**
 * Đảm bảo actorId luôn khớp với một Profile hợp lệ trong DB để không vi phạm ràng buộc audit_logs_userId_fkey
 */
async function resolveActorId(actorId: string): Promise<string> {
  const existing = await prisma.profile.findUnique({
    where: { id: actorId },
    select: { id: true },
  });
  if (existing) {
    return existing.id;
  }

  const anyProfile = await prisma.profile.findFirst({
    select: { id: true },
  });
  if (anyProfile) {
    return anyProfile.id;
  }

  const systemBot = await prisma.profile.upsert({
    where: { id: '00000000-0000-0000-0000-000000000000' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'system-bot@themis-lexiguard.internal',
      fullName: 'System Legal Sync Worker',
      platformRole: 'SUPER_ADMIN',
    },
    select: { id: true },
  });

  return systemBot.id;
}

export class LegalSyncService {
  /**
   * Kích hoạt quy trình đồng bộ tin tức pháp lý tự động (Cào + AI Gemini Parse + Save DB + Audit)
   */
  static async runSync(actorId: string = '00000000-0000-0000-0000-000000000000', ipAddress?: string): Promise<SyncRunSummary> {
    const startedAt = new Date();
    const syncRunId = `sync-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    try {
      const validActorId = await resolveActorId(actorId);
      const rawArticles = await fetchRawLegalArticles();
      const insertedItems: SyncRunSummary['items'] = [];
      let insertedCount = 0;
      let skippedCount = 0;
      let publishedCount = 0;

      for (const rawArticle of rawArticles) {
        const processedInput = await processArticleWithAI(rawArticle);
        const checksum = processedInput.checksum ?? buildChecksum(processedInput.sourceUrl, processedInput.titleVi);

        // Kiểm tra xem bài tin đã tồn tại theo checksum hoặc sourceUrl chưa
        const existing = await prisma.legalUpdate.findFirst({
          where: {
            OR: [
              { checksum },
              { sourceUrl: processedInput.sourceUrl },
            ],
          },
        });

        if (existing) {
          skippedCount++;
          continue;
        }

        // Tạo bài tin mới với trạng thái reviewStatus = PUBLISHED để hiển thị ngay ra Frontend
        const createdDetail = await LegalUpdatesService.create(validActorId, {
          ...processedInput,
          checksum,
        }, ipAddress);

        // Auto-publish bài tin để Frontend có dữ liệu hiển thị tức thì
        const publishedDetail = await LegalUpdatesService.publish(validActorId, createdDetail.id, ipAddress);

        insertedCount++;
        publishedCount++;
        insertedItems.push({
          id: publishedDetail.id,
          title: publishedDetail.titleVi,
          market: publishedDetail.market,
          category: publishedDetail.category,
          severity: publishedDetail.severity,
          reviewStatus: publishedDetail.reviewStatus,
          sourceAgency: publishedDetail.sourceAgency,
          sourceUrl: publishedDetail.sourceUrl,
        });
      }

      const finishedAt = new Date();
      return {
        syncRunId,
        startedAt,
        finishedAt,
        status: 'completed',
        fetchedCount: rawArticles.length,
        insertedCount,
        skippedCount,
        publishedCount,
        items: insertedItems,
      };
    } catch (error: any) {
      throw new ApiError(500, 'INTERNAL_ERROR', `Đồng bộ tin tức pháp lý thất bại: ${error?.message || 'Lỗi không xác định'}`);
    }
  }
}

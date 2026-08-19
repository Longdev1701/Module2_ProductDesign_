import { LegalUpdateReviewStatus, Prisma, RegulationCategory } from '@prisma/client';
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

function mapToRegulationCategory(category?: string): RegulationCategory {
  if (!category) return RegulationCategory.OTHER;
  const c = category.toLowerCase();
  if (c.includes('mrl')) return RegulationCategory.MRL;
  if (c.includes('label')) return RegulationCategory.LABELING;
  if (c.includes('pack')) return RegulationCategory.PACKAGING;
  if (c.includes('trace')) return RegulationCategory.TRACEABILITY;
  if (c.includes('eudr')) return RegulationCategory.EUDR;
  if (c.includes('food_safety') || c.includes('phyto') || c.includes('quarantine') || c.includes('registration')) return RegulationCategory.FOOD_SAFETY;
  return RegulationCategory.OTHER;
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
   * Kích hoạt quy trình đồng bộ văn bản pháp lý & quy định tự động
   * (Cào toàn văn tài liệu + AI Gemini Phân tích & Tóm tắt + Lưu DB + Đồng bộ Thư viện Quy định + Audit Log)
   */
  static async runSync(actorId: string = '00000000-0000-0000-0000-000000000000', ipAddress?: string): Promise<SyncRunSummary> {
    const startedAt = new Date();
    const syncRunId = `sync-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    try {
      const validActorId = await resolveActorId(actorId);
      const rawArticles = await fetchRawLegalArticles();
      const insertedItems: SyncRunSummary['items'] = [];
      const seenUrls = new Set<string>();
      const seenChecksums = new Set<string>();
      let insertedCount = 0;
      let skippedCount = 0;
      let publishedCount = 0;

      for (const rawArticle of rawArticles) {
        if (!rawArticle.sourceUrl || seenUrls.has(rawArticle.sourceUrl)) {
          skippedCount++;
          continue;
        }

        try {
          const processedInput = await processArticleWithAI(rawArticle);
          const checksum = processedInput.checksum ?? buildChecksum(processedInput.sourceUrl, processedInput.titleVi);

          if (seenChecksums.has(checksum)) {
            skippedCount++;
            continue;
          }

          seenUrls.add(processedInput.sourceUrl);
          seenChecksums.add(checksum);

          // Kiểm tra xem văn bản đã tồn tại trong DB chưa
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

          // Tự động tạo hoặc liên kết với Thư viện Quy định (Regulation)
          let regulationId: string | null = null;
          try {
            const regCode = processedInput.sourceReference
              ? processedInput.sourceReference.replace(/[^A-Za-z0-9\-_]/g, '-').slice(0, 40)
              : `${processedInput.market}-${createHash('md5').update(processedInput.sourceUrl).digest('hex').slice(0, 10)}`.toUpperCase();

            const reg = await prisma.regulation.upsert({
              where: { code: regCode },
              update: {
                title: processedInput.titleVi,
                description: processedInput.summaryVi.slice(0, 1000),
                category: mapToRegulationCategory(processedInput.category),
                market: processedInput.market,
                sourceUrl: processedInput.sourceUrl,
                effectiveDate: processedInput.effectiveAt ? new Date(processedInput.effectiveAt) : new Date(),
              },
              create: {
                code: regCode,
                title: processedInput.titleVi,
                description: processedInput.summaryVi.slice(0, 1000),
                category: mapToRegulationCategory(processedInput.category),
                market: processedInput.market,
                sourceUrl: processedInput.sourceUrl,
                effectiveDate: processedInput.effectiveAt ? new Date(processedInput.effectiveAt) : new Date(),
              },
            });
            regulationId = reg.id;
          } catch {
            // Bỏ qua nếu có xung đột mã quy định
          }

          // Tạo văn bản pháp lý mới với trạng thái reviewStatus = PUBLISHED để hiển thị ngay ra Frontend
          const createdDetail = await LegalUpdatesService.create(validActorId, {
            ...processedInput,
            regulationId: regulationId ?? undefined,
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
        } catch (itemError: any) {
          console.warn(`[LegalSync] Bỏ qua văn bản do lỗi xử lý: ${rawArticle.sourceUrl} - ${itemError?.message}`);
          skippedCount++;
        }
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
      throw new ApiError(500, 'INTERNAL_ERROR', `Đồng bộ quy định pháp lý thất bại: ${error?.message || 'Lỗi không xác định'}`);
    }
  }
}

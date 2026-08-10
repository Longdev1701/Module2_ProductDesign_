import {
  LegalUpdate,
  LegalUpdateCategory,
  LegalUpdateConfidence,
  LegalUpdateRelevance,
  LegalUpdateReviewStatus,
  LegalUpdateSeverity,
  LegalUpdateStatus,
  Prisma,
} from '@prisma/client';
import { createHash } from 'crypto';
import { ZodType } from 'zod';
import { ApiError } from '../../lib/api-error';
import { prisma } from '../../lib/prisma';
import {
  affectedProductSchema,
  citationSchema,
  detailedSummarySchema,
  recommendedActionSchema,
  type AdminListQuery,
  type CreateLegalUpdateInput,
  type FeedQuery,
  type UpdateLegalUpdateInput,
} from './schema';
import type {
  AffectedProduct,
  ApiLegalUpdateCategory,
  ApiLegalUpdateConfidence,
  ApiLegalUpdateRelevance,
  ApiLegalUpdateSeverity,
  ApiLegalUpdateStatus,
  DetailedSummary,
  LegalUpdateCitation,
  LegalUpdateDetail,
  LegalUpdateFeedItem,
  PaginatedResult,
  RecommendedAction,
} from './types';

const categoryToPrisma: Record<ApiLegalUpdateCategory, LegalUpdateCategory> = {
  phytosanitary: LegalUpdateCategory.PHYTOSANITARY,
  mrl: LegalUpdateCategory.MRL,
  food_safety: LegalUpdateCategory.FOOD_SAFETY,
  labeling: LegalUpdateCategory.LABELING,
  packaging: LegalUpdateCategory.PACKAGING,
  traceability: LegalUpdateCategory.TRACEABILITY,
  customs: LegalUpdateCategory.CUSTOMS,
  certificate: LegalUpdateCategory.CERTIFICATE,
  organic: LegalUpdateCategory.ORGANIC,
  eudr: LegalUpdateCategory.EUDR,
  esg: LegalUpdateCategory.ESG,
  quota_tariff: LegalUpdateCategory.QUOTA_TARIFF,
  registration: LegalUpdateCategory.REGISTRATION,
  inspection: LegalUpdateCategory.INSPECTION,
  recall: LegalUpdateCategory.RECALL,
  market_access: LegalUpdateCategory.MARKET_ACCESS,
  other: LegalUpdateCategory.OTHER,
};

const severityToPrisma: Record<ApiLegalUpdateSeverity, LegalUpdateSeverity> = {
  critical: LegalUpdateSeverity.CRITICAL,
  high: LegalUpdateSeverity.HIGH,
  medium: LegalUpdateSeverity.MEDIUM,
  low: LegalUpdateSeverity.LOW,
  informational: LegalUpdateSeverity.INFORMATIONAL,
};

const statusToPrisma: Record<ApiLegalUpdateStatus, LegalUpdateStatus> = {
  draft: LegalUpdateStatus.DRAFT,
  published: LegalUpdateStatus.PUBLISHED,
  upcoming: LegalUpdateStatus.UPCOMING,
  effective: LegalUpdateStatus.EFFECTIVE,
  amended: LegalUpdateStatus.AMENDED,
  repealed: LegalUpdateStatus.REPEALED,
  archived: LegalUpdateStatus.ARCHIVED,
};

const relevanceToPrisma: Record<ApiLegalUpdateRelevance, LegalUpdateRelevance> = {
  relevant: LegalUpdateRelevance.RELEVANT,
  not_relevant: LegalUpdateRelevance.NOT_RELEVANT,
  needs_review: LegalUpdateRelevance.NEEDS_REVIEW,
};

const confidenceToPrisma: Record<ApiLegalUpdateConfidence, LegalUpdateConfidence> = {
  high: LegalUpdateConfidence.HIGH,
  medium: LegalUpdateConfidence.MEDIUM,
  low: LegalUpdateConfidence.LOW,
};

const categoryToApi: Record<LegalUpdateCategory, ApiLegalUpdateCategory> = {
  PHYTOSANITARY: 'phytosanitary',
  MRL: 'mrl',
  FOOD_SAFETY: 'food_safety',
  LABELING: 'labeling',
  PACKAGING: 'packaging',
  TRACEABILITY: 'traceability',
  CUSTOMS: 'customs',
  CERTIFICATE: 'certificate',
  ORGANIC: 'organic',
  EUDR: 'eudr',
  ESG: 'esg',
  QUOTA_TARIFF: 'quota_tariff',
  REGISTRATION: 'registration',
  INSPECTION: 'inspection',
  RECALL: 'recall',
  MARKET_ACCESS: 'market_access',
  OTHER: 'other',
};

const severityToApi: Record<LegalUpdateSeverity, ApiLegalUpdateSeverity> = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFORMATIONAL: 'informational',
};

const statusToApi: Record<LegalUpdateStatus, ApiLegalUpdateStatus> = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  UPCOMING: 'upcoming',
  EFFECTIVE: 'effective',
  AMENDED: 'amended',
  REPEALED: 'repealed',
  ARCHIVED: 'archived',
};

const relevanceToApi: Record<LegalUpdateRelevance, ApiLegalUpdateRelevance> = {
  RELEVANT: 'relevant',
  NOT_RELEVANT: 'not_relevant',
  NEEDS_REVIEW: 'needs_review',
};

const confidenceToApi: Record<LegalUpdateConfidence, ApiLegalUpdateConfidence> = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

const feedOrderBy: Record<NonNullable<FeedQuery['sort']>, Prisma.LegalUpdateOrderByWithRelationInput> = {
  'publishedAt:desc': { publishedAt: { sort: 'desc', nulls: 'last' } },
  'publishedAt:asc': { publishedAt: { sort: 'asc', nulls: 'last' } },
  'effectiveAt:desc': { effectiveAt: { sort: 'desc', nulls: 'last' } },
  'effectiveAt:asc': { effectiveAt: { sort: 'asc', nulls: 'last' } },
  'createdAt:desc': { createdAt: 'desc' },
  'createdAt:asc': { createdAt: 'asc' },
  'updatedAt:desc': { updatedAt: 'desc' },
  'updatedAt:asc': { updatedAt: 'asc' },
  // PostgreSQL enum order is CRITICAL -> INFORMATIONAL, so API severity order is reversed.
  'severity:desc': { severity: 'asc' },
  'severity:asc': { severity: 'desc' },
};

function asInputJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function parseJsonArray<T>(value: Prisma.JsonValue | null, schema: ZodType<T>): T[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const parsedItems: T[] = [];
  for (const item of value) {
    const parsed = schema.safeParse(item);
    if (!parsed.success) {
      return [];
    }
    parsedItems.push(parsed.data);
  }
  return parsedItems;
}

function parseDetailedSummary(value: Prisma.JsonValue | null): DetailedSummary | null {
  const parsed = detailedSummarySchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function buildChecksum(input: CreateLegalUpdateInput): string {
  const stableSource = JSON.stringify({
    sourceUrl: input.sourceUrl,
    sourceReference: input.sourceReference ?? null,
    titleOriginal: input.titleOriginal ?? null,
    titleVi: input.titleVi,
    publishedAt: input.publishedAt?.toISOString() ?? null,
  });

  return createHash('sha256').update(stableSource).digest('hex');
}

function isDuplicateError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function isSafeHttpUrl(value: string): boolean {
  try {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function toAuditSnapshot(record: LegalUpdate): Record<string, unknown> {
  return {
    organizationId: record.organizationId,
    regulationId: record.regulationId,
    sourceAgency: record.sourceAgency,
    sourceCountry: record.sourceCountry,
    sourceUrl: record.sourceUrl,
    documentUrl: record.documentUrl,
    sourceReference: record.sourceReference,
    sourceLanguage: record.sourceLanguage,
    rawArticleId: record.rawArticleId,
    checksum: record.checksum,
    titleOriginal: record.titleOriginal,
    titleVi: record.titleVi,
    frontendTitleVi: record.frontendTitleVi,
    frontendSummaryVi: record.frontendSummaryVi,
    summaryVi: record.summaryVi,
    detailedSummaryVi: record.detailedSummaryVi,
    businessImpactVi: record.businessImpactVi,
    recommendedActions: record.recommendedActions,
    citations: record.citations,
    market: record.market,
    category: record.category,
    severity: record.severity,
    status: record.status,
    relevanceStatus: record.relevanceStatus,
    relevanceReasonVi: record.relevanceReasonVi,
    affectedProducts: record.affectedProducts,
    affectedGroups: record.affectedGroups,
    hsCodes: record.hsCodes,
    confidence: record.confidence,
    publishedAt: record.publishedAt?.toISOString() ?? null,
    effectiveAt: record.effectiveAt?.toISOString() ?? null,
    reviewStatus: record.reviewStatus,
    reviewedByUserId: record.reviewedByUserId,
    reviewedAt: record.reviewedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

async function validateReferences(input: {
  organizationId?: string | null;
  regulationId?: string | null;
}) {
  if (input.organizationId) {
    const organization = await prisma.organization.findUnique({
      where: { id: input.organizationId },
      select: { id: true },
    });
    if (!organization) {
      throw new ApiError(422, 'VALIDATION_ERROR', 'organizationId không tồn tại');
    }
  }

  if (input.regulationId) {
    const regulation = await prisma.regulation.findUnique({
      where: { id: input.regulationId },
      select: { id: true },
    });
    if (!regulation) {
      throw new ApiError(422, 'VALIDATION_ERROR', 'regulationId không tồn tại');
    }
  }
}

function buildPublicWhere(organizationId: string, query: FeedQuery): Prisma.LegalUpdateWhereInput {
  const filters: Prisma.LegalUpdateWhereInput[] = [
    { reviewStatus: LegalUpdateReviewStatus.PUBLISHED },
    { OR: [{ organizationId: null }, { organizationId }] },
  ];

  if (query.search) {
    filters.push({
      OR: [
        { titleVi: { contains: query.search, mode: 'insensitive' } },
        { frontendTitleVi: { contains: query.search, mode: 'insensitive' } },
        { summaryVi: { contains: query.search, mode: 'insensitive' } },
        { sourceAgency: { contains: query.search, mode: 'insensitive' } },
      ],
    });
  }

  if (query.market) filters.push({ market: query.market });
  if (query.category) filters.push({ category: categoryToPrisma[query.category] });
  if (query.severity) filters.push({ severity: severityToPrisma[query.severity] });
  if (query.status) filters.push({ status: statusToPrisma[query.status] });

  return { AND: filters };
}

function buildAdminWhere(query: AdminListQuery): Prisma.LegalUpdateWhereInput {
  const filters: Prisma.LegalUpdateWhereInput[] = [];
  if (query.search) {
    filters.push({
      OR: [
        { titleVi: { contains: query.search, mode: 'insensitive' } },
        { sourceAgency: { contains: query.search, mode: 'insensitive' } },
        { sourceUrl: { contains: query.search, mode: 'insensitive' } },
      ],
    });
  }
  if (query.market) filters.push({ market: query.market });
  if (query.category) filters.push({ category: categoryToPrisma[query.category] });
  if (query.severity) filters.push({ severity: severityToPrisma[query.severity] });
  if (query.status) filters.push({ status: statusToPrisma[query.status] });
  if (query.reviewStatus) {
    const reviewStatus: Record<NonNullable<AdminListQuery['reviewStatus']>, LegalUpdateReviewStatus> = {
      pending_review: LegalUpdateReviewStatus.PENDING_REVIEW,
      published: LegalUpdateReviewStatus.PUBLISHED,
      rejected: LegalUpdateReviewStatus.REJECTED,
    };
    filters.push({ reviewStatus: reviewStatus[query.reviewStatus] });
  }
  return filters.length === 0 ? {} : { AND: filters };
}

function toCompactItem(record: LegalUpdate): LegalUpdateFeedItem {
  return {
    id: record.id,
    title: record.frontendTitleVi ?? record.titleVi,
    description: record.frontendSummaryVi ?? record.summaryVi,
    market: record.market,
    category: categoryToApi[record.category],
    severity: severityToApi[record.severity],
    status: statusToApi[record.status],
    sourceAgency: record.sourceAgency,
    sourceUrl: record.sourceUrl,
    publishedAt: record.publishedAt,
    effectiveAt: record.effectiveAt,
    createdAt: record.createdAt,
  };
}

function toDetail(record: LegalUpdate): LegalUpdateDetail {
  return {
    id: record.id,
    sourceAgency: record.sourceAgency,
    sourceCountry: record.sourceCountry,
    sourceUrl: record.sourceUrl,
    documentUrl: record.documentUrl,
    sourceReference: record.sourceReference,
    sourceLanguage: record.sourceLanguage,
    titleOriginal: record.titleOriginal,
    titleVi: record.titleVi,
    summaryVi: record.summaryVi,
    detailedSummaryVi: parseDetailedSummary(record.detailedSummaryVi),
    businessImpactVi: record.businessImpactVi,
    recommendedActions: parseJsonArray<RecommendedAction>(record.recommendedActions, recommendedActionSchema),
    citations: parseJsonArray<LegalUpdateCitation>(record.citations, citationSchema),
    affectedProducts: parseJsonArray<AffectedProduct>(record.affectedProducts, affectedProductSchema),
    affectedGroups: record.affectedGroups,
    hsCodes: record.hsCodes,
    market: record.market,
    category: categoryToApi[record.category],
    severity: severityToApi[record.severity],
    status: statusToApi[record.status],
    relevance: {
      status: relevanceToApi[record.relevanceStatus],
      reasonVi: record.relevanceReasonVi,
    },
    confidence: confidenceToApi[record.confidence],
    publishedAt: record.publishedAt,
    effectiveAt: record.effectiveAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function createData(input: CreateLegalUpdateInput): Prisma.LegalUpdateUncheckedCreateInput {
  return {
    organizationId: input.organizationId ?? null,
    regulationId: input.regulationId ?? null,
    sourceAgency: input.sourceAgency,
    sourceCountry: input.sourceCountry ?? null,
    sourceUrl: input.sourceUrl,
    documentUrl: input.documentUrl ?? null,
    sourceReference: input.sourceReference ?? null,
    sourceLanguage: input.sourceLanguage ?? null,
    rawArticleId: input.rawArticleId ?? null,
    checksum: input.checksum ?? buildChecksum(input),
    titleOriginal: input.titleOriginal ?? null,
    titleVi: input.titleVi,
    frontendTitleVi: input.frontendTitleVi ?? null,
    frontendSummaryVi: input.frontendSummaryVi ?? null,
    summaryVi: input.summaryVi,
    detailedSummaryVi: input.detailedSummaryVi ? asInputJson(input.detailedSummaryVi) : Prisma.JsonNull,
    businessImpactVi: input.businessImpactVi ?? null,
    recommendedActions: asInputJson(input.recommendedActions ?? []),
    citations: asInputJson(input.citations ?? []),
    market: input.market,
    category: input.category ? categoryToPrisma[input.category] : LegalUpdateCategory.OTHER,
    severity: input.severity ? severityToPrisma[input.severity] : LegalUpdateSeverity.INFORMATIONAL,
    status: input.status ? statusToPrisma[input.status] : LegalUpdateStatus.PUBLISHED,
    relevanceStatus: input.relevanceStatus ? relevanceToPrisma[input.relevanceStatus] : LegalUpdateRelevance.NEEDS_REVIEW,
    relevanceReasonVi: input.relevanceReasonVi ?? null,
    affectedProducts: asInputJson(input.affectedProducts ?? []),
    affectedGroups: input.affectedGroups ?? [],
    hsCodes: input.hsCodes ?? [],
    confidence: input.confidence ? confidenceToPrisma[input.confidence] : LegalUpdateConfidence.MEDIUM,
    publishedAt: input.publishedAt ?? null,
    effectiveAt: input.effectiveAt ?? null,
    reviewStatus: LegalUpdateReviewStatus.PENDING_REVIEW,
  };
}

function updateData(input: UpdateLegalUpdateInput): Prisma.LegalUpdateUncheckedUpdateInput {
  return {
    ...(input.organizationId !== undefined ? { organizationId: input.organizationId } : {}),
    ...(input.regulationId !== undefined ? { regulationId: input.regulationId } : {}),
    ...(input.sourceAgency !== undefined ? { sourceAgency: input.sourceAgency } : {}),
    ...(input.sourceCountry !== undefined ? { sourceCountry: input.sourceCountry } : {}),
    ...(input.documentUrl !== undefined ? { documentUrl: input.documentUrl } : {}),
    ...(input.sourceLanguage !== undefined ? { sourceLanguage: input.sourceLanguage } : {}),
    ...(input.titleOriginal !== undefined ? { titleOriginal: input.titleOriginal } : {}),
    ...(input.titleVi !== undefined ? { titleVi: input.titleVi } : {}),
    ...(input.frontendTitleVi !== undefined ? { frontendTitleVi: input.frontendTitleVi } : {}),
    ...(input.frontendSummaryVi !== undefined ? { frontendSummaryVi: input.frontendSummaryVi } : {}),
    ...(input.summaryVi !== undefined ? { summaryVi: input.summaryVi } : {}),
    ...(input.detailedSummaryVi !== undefined ? {
      detailedSummaryVi: input.detailedSummaryVi ? asInputJson(input.detailedSummaryVi) : Prisma.JsonNull,
    } : {}),
    ...(input.businessImpactVi !== undefined ? { businessImpactVi: input.businessImpactVi } : {}),
    ...(input.recommendedActions !== undefined ? { recommendedActions: asInputJson(input.recommendedActions) } : {}),
    ...(input.citations !== undefined ? { citations: asInputJson(input.citations) } : {}),
    ...(input.market !== undefined ? { market: input.market } : {}),
    ...(input.category !== undefined ? { category: categoryToPrisma[input.category] } : {}),
    ...(input.severity !== undefined ? { severity: severityToPrisma[input.severity] } : {}),
    ...(input.status !== undefined ? { status: statusToPrisma[input.status] } : {}),
    ...(input.relevanceStatus !== undefined ? { relevanceStatus: relevanceToPrisma[input.relevanceStatus] } : {}),
    ...(input.relevanceReasonVi !== undefined ? { relevanceReasonVi: input.relevanceReasonVi } : {}),
    ...(input.affectedProducts !== undefined ? { affectedProducts: asInputJson(input.affectedProducts) } : {}),
    ...(input.affectedGroups !== undefined ? { affectedGroups: input.affectedGroups } : {}),
    ...(input.hsCodes !== undefined ? { hsCodes: input.hsCodes } : {}),
    ...(input.confidence !== undefined ? { confidence: confidenceToPrisma[input.confidence] } : {}),
    ...(input.publishedAt !== undefined ? { publishedAt: input.publishedAt } : {}),
    ...(input.effectiveAt !== undefined ? { effectiveAt: input.effectiveAt } : {}),
  };
}

export class LegalUpdatesService {
  static async getFeed(organizationId: string, query: FeedQuery): Promise<PaginatedResult<LegalUpdateFeedItem>> {
    const where = buildPublicWhere(organizationId, query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 3;
    const sort = query.sort ?? 'publishedAt:desc';
    const [total, records] = await prisma.$transaction([
      prisma.legalUpdate.count({ where }),
      prisma.legalUpdate.findMany({
        where,
        orderBy: feedOrderBy[sort],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data: records.map(toCompactItem),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  static async getPublishedDetail(organizationId: string, id: string): Promise<LegalUpdateDetail> {
    const record = await prisma.legalUpdate.findFirst({
      where: {
        id,
        reviewStatus: LegalUpdateReviewStatus.PUBLISHED,
        OR: [{ organizationId: null }, { organizationId }],
      },
    });

    if (!record) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy bản tin pháp lý');
    }

    return toDetail(record);
  }

  static async listForAdmin(query: AdminListQuery): Promise<PaginatedResult<LegalUpdateFeedItem & { reviewStatus: string }>> {
    const where = buildAdminWhere(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const sort = query.sort ?? 'publishedAt:desc';
    const [total, records] = await prisma.$transaction([
      prisma.legalUpdate.count({ where }),
      prisma.legalUpdate.findMany({
        where,
        orderBy: feedOrderBy[sort],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data: records.map((record) => ({
        ...toCompactItem(record),
        reviewStatus: record.reviewStatus.toLowerCase(),
      })),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  static async getAdminDetail(id: string): Promise<LegalUpdateDetail & { reviewStatus: string }> {
    const record = await prisma.legalUpdate.findUnique({ where: { id } });
    if (!record) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy bản tin pháp lý');
    }
    return { ...toDetail(record), reviewStatus: record.reviewStatus.toLowerCase() };
  }

  static async create(actorId: string, input: CreateLegalUpdateInput, ipAddress?: string): Promise<LegalUpdateDetail & { reviewStatus: string }> {
    await validateReferences(input);

    try {
      const record = await prisma.$transaction(async (tx) => {
        const created = await tx.legalUpdate.create({ data: createData(input) });
        await tx.auditLog.create({
          data: {
            userId: actorId,
            action: 'legal_update.created',
            entity: 'LegalUpdate',
            entityId: created.id,
            metadata: asInputJson({ after: toAuditSnapshot(created) }),
            ipAddress,
          },
        });
        return created;
      });
      return { ...toDetail(record), reviewStatus: record.reviewStatus.toLowerCase() };
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new ApiError(409, 'CONFLICT', 'Bản tin có nguồn và checksum trùng lặp');
      }
      throw error;
    }
  }

  static async update(actorId: string, id: string, input: UpdateLegalUpdateInput, ipAddress?: string): Promise<LegalUpdateDetail & { reviewStatus: string }> {
    await validateReferences(input);
    try {
      const record = await prisma.$transaction(async (tx) => {
        const before = await tx.legalUpdate.findUnique({ where: { id } });
        if (!before) {
          throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy bản tin pháp lý');
        }

        if (before.reviewStatus === LegalUpdateReviewStatus.REJECTED) {
          throw new ApiError(409, 'CONFLICT', 'Không thể sửa bản tin đã bị từ chối');
        }

        if (before.reviewStatus === LegalUpdateReviewStatus.PUBLISHED) {
          const publishedFields = new Set(['status', 'effectiveAt']);
          const immutableFields = Object.keys(input).filter((field) => !publishedFields.has(field));
          if (immutableFields.length > 0) {
            throw new ApiError(409, 'CONFLICT', 'Bản tin đã publish chỉ được cập nhật trạng thái hoặc ngày hiệu lực', {
              fields: immutableFields,
            });
          }
        }

        const changed = await tx.legalUpdate.updateMany({
          where: {
            id,
            reviewStatus: before.reviewStatus,
            updatedAt: before.updatedAt,
          },
          data: {
            ...updateData(input),
            updatedAt: new Date(),
          },
        });
        if (changed.count !== 1) {
          throw new ApiError(409, 'CONFLICT', 'Bản tin đã thay đổi, vui lòng tải lại và thử lại');
        }

        const updated = await tx.legalUpdate.findUniqueOrThrow({ where: { id } });
        await tx.auditLog.create({
          data: {
            userId: actorId,
            action: 'legal_update.updated',
            entity: 'LegalUpdate',
            entityId: id,
            metadata: asInputJson({ before: toAuditSnapshot(before), after: toAuditSnapshot(updated) }),
            ipAddress,
          },
        });
        return updated;
      });
      return { ...toDetail(record), reviewStatus: record.reviewStatus.toLowerCase() };
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new ApiError(409, 'CONFLICT', 'Bản tin có nguồn và checksum trùng lặp');
      }
      throw error;
    }
  }

  static async publish(actorId: string, id: string, ipAddress?: string): Promise<LegalUpdateDetail & { reviewStatus: string }> {
    const record = await prisma.$transaction(async (tx) => {
      const before = await tx.legalUpdate.findUnique({ where: { id } });
      if (!before) {
        throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy bản tin pháp lý');
      }
      if (before.reviewStatus !== LegalUpdateReviewStatus.PENDING_REVIEW) {
        throw new ApiError(409, 'CONFLICT', 'Chỉ bản tin đang chờ duyệt mới có thể publish');
      }

      if (!isSafeHttpUrl(before.sourceUrl)) {
        throw new ApiError(409, 'CONFLICT', 'sourceUrl của bản tin không hợp lệ để publish');
      }
      if (!before.titleVi.trim() || !before.summaryVi.trim()) {
        throw new ApiError(409, 'CONFLICT', 'Bản tin thiếu tiêu đề hoặc tóm tắt tiếng Việt');
      }
      if (!before.publishedAt) {
        throw new ApiError(409, 'CONFLICT', 'Bản tin cần có ngày công bố trước khi publish');
      }

      const reviewedAt = new Date();
      const changed = await tx.legalUpdate.updateMany({
        where: {
          id,
          reviewStatus: LegalUpdateReviewStatus.PENDING_REVIEW,
          updatedAt: before.updatedAt,
        },
        data: {
          reviewStatus: LegalUpdateReviewStatus.PUBLISHED,
          reviewedByUserId: actorId,
          reviewedAt,
          updatedAt: reviewedAt,
        },
      });
      if (changed.count !== 1) {
        throw new ApiError(409, 'CONFLICT', 'Bản tin đã thay đổi trạng thái, vui lòng tải lại và thử lại');
      }

      const updated = await tx.legalUpdate.findUniqueOrThrow({ where: { id } });
      await tx.auditLog.create({
        data: {
          userId: actorId,
          action: 'legal_update.published',
          entity: 'LegalUpdate',
          entityId: id,
          metadata: asInputJson({ before: toAuditSnapshot(before), after: toAuditSnapshot(updated) }),
          ipAddress,
        },
      });
      return updated;
    });
    return { ...toDetail(record), reviewStatus: record.reviewStatus.toLowerCase() };
  }

  static async reject(actorId: string, id: string, reason: string, ipAddress?: string): Promise<LegalUpdateDetail & { reviewStatus: string }> {
    const record = await prisma.$transaction(async (tx) => {
      const before = await tx.legalUpdate.findUnique({ where: { id } });
      if (!before) {
        throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy bản tin pháp lý');
      }
      if (before.reviewStatus !== LegalUpdateReviewStatus.PENDING_REVIEW) {
        throw new ApiError(409, 'CONFLICT', 'Chỉ bản tin đang chờ duyệt mới có thể reject');
      }

      const rejectedAt = new Date();
      const changed = await tx.legalUpdate.updateMany({
        where: {
          id,
          reviewStatus: LegalUpdateReviewStatus.PENDING_REVIEW,
          updatedAt: before.updatedAt,
        },
        data: {
          reviewStatus: LegalUpdateReviewStatus.REJECTED,
          updatedAt: rejectedAt,
        },
      });
      if (changed.count !== 1) {
        throw new ApiError(409, 'CONFLICT', 'Bản tin đã thay đổi trạng thái, vui lòng tải lại và thử lại');
      }

      const updated = await tx.legalUpdate.findUniqueOrThrow({ where: { id } });
      await tx.auditLog.create({
        data: {
          userId: actorId,
          action: 'legal_update.rejected',
          entity: 'LegalUpdate',
          entityId: id,
          metadata: asInputJson({ before: toAuditSnapshot(before), after: toAuditSnapshot(updated), reason }),
          ipAddress,
        },
      });
      return updated;
    });
    return { ...toDetail(record), reviewStatus: record.reviewStatus.toLowerCase() };
  }
}

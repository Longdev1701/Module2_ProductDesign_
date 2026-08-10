import { z } from 'zod';

const uuidSchema = z.string().uuid();
const nullableTrimmedString = z.string().trim().min(1).nullable().optional();
const optionalDateSchema = z.coerce.date().nullable().optional();
function isSafeHttpUrl(value: string): boolean {
  try {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

const httpUrlSchema = z.string().trim().url().max(2_000)
  .refine(isSafeHttpUrl, 'URL phải dùng giao thức http hoặc https');
const nullableHttpUrlSchema = httpUrlSchema.nullable().optional();

export const legalUpdateCategorySchema = z.enum([
  'phytosanitary', 'mrl', 'food_safety', 'labeling', 'packaging', 'traceability',
  'customs', 'certificate', 'organic', 'eudr', 'esg', 'quota_tariff',
  'registration', 'inspection', 'recall', 'market_access', 'other',
]);
export const legalUpdateSeveritySchema = z.enum(['critical', 'high', 'medium', 'low', 'informational']);
export const legalUpdateStatusSchema = z.enum(['draft', 'published', 'upcoming', 'effective', 'amended', 'repealed', 'archived']);
export const legalUpdateReviewStatusSchema = z.enum(['pending_review', 'published', 'rejected']);
export const legalUpdateRelevanceSchema = z.enum(['relevant', 'not_relevant', 'needs_review']);
export const legalUpdateConfidenceSchema = z.enum(['high', 'medium', 'low']);

export const recommendedActionSchema = z.object({
  actionVi: z.string().trim().min(1).max(1_000),
  basis: z.string().trim().min(1).max(2_000),
  priority: z.enum(['high', 'medium', 'low']),
}).strict();

export const citationSchema = z.object({
  sourceReference: z.string().trim().min(1).max(500).nullable(),
  section: z.string().trim().min(1).max(500).nullable(),
  quoteVi: z.string().trim().min(1).max(4_000),
}).strict();

export const affectedProductSchema = z.object({
  nameVi: z.string().trim().min(1).max(300),
  nameOriginal: z.string().trim().min(1).max(300).nullable(),
  hsCode: z.string().trim().min(1).max(50).nullable(),
  scope: z.enum(['specific', 'commodity_group', 'all_agricultural_products', 'unclear']),
}).strict();

export const detailedSummarySchema = z.object({
  purpose: z.string().trim().min(1).max(4_000).optional(),
  scope: z.string().trim().min(1).max(4_000).optional(),
  keyRequirements: z.array(z.string().trim().min(1).max(2_000)).max(50).optional(),
  inspectionAndCertification: z.array(z.string().trim().min(1).max(2_000)).max(50).optional(),
  penaltiesOrConsequences: z.array(z.string().trim().min(1).max(2_000)).max(50).optional(),
  unknowns: z.array(z.string().trim().min(1).max(2_000)).max(50).optional(),
}).strict();

const legalUpdateWriteFieldsSchema = z.object({
  organizationId: uuidSchema.nullable().optional(),
  regulationId: uuidSchema.nullable().optional(),
  sourceAgency: z.string().trim().min(1).max(300),
  sourceCountry: nullableTrimmedString,
  sourceUrl: httpUrlSchema,
  documentUrl: nullableHttpUrlSchema,
  sourceReference: nullableTrimmedString,
  sourceLanguage: z.string().trim().min(2).max(20).nullable().optional(),
  rawArticleId: uuidSchema.nullable().optional(),
  checksum: z.string().regex(/^[a-fA-F0-9]{64}$/, 'checksum phải là SHA-256 hex').optional(),
  titleOriginal: nullableTrimmedString,
  titleVi: z.string().trim().min(1).max(1_000),
  frontendTitleVi: nullableTrimmedString,
  frontendSummaryVi: nullableTrimmedString,
  summaryVi: z.string().trim().min(1).max(10_000),
  detailedSummaryVi: detailedSummarySchema.nullable().optional(),
  businessImpactVi: z.string().trim().min(1).max(10_000).nullable().optional(),
  recommendedActions: z.array(recommendedActionSchema).max(50).optional(),
  citations: z.array(citationSchema).max(100).optional(),
  market: z.string().trim().min(1).max(100),
  category: legalUpdateCategorySchema.optional(),
  severity: legalUpdateSeveritySchema.optional(),
  status: legalUpdateStatusSchema.optional(),
  relevanceStatus: legalUpdateRelevanceSchema.optional(),
  relevanceReasonVi: z.string().trim().min(1).max(2_000).nullable().optional(),
  affectedProducts: z.array(affectedProductSchema).max(100).optional(),
  affectedGroups: z.array(z.string().trim().min(1).max(300)).max(100).optional(),
  hsCodes: z.array(z.string().trim().min(1).max(50)).max(100).optional(),
  confidence: legalUpdateConfidenceSchema.optional(),
  publishedAt: optionalDateSchema,
  effectiveAt: optionalDateSchema,
}).strict();

export const createLegalUpdateSchema = legalUpdateWriteFieldsSchema;
export const updateLegalUpdateSchema = legalUpdateWriteFieldsSchema
  .omit({
    checksum: true,
    sourceUrl: true,
    sourceReference: true,
    rawArticleId: true,
  })
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, 'Cần có ít nhất một trường để cập nhật');

const legalUpdateSortSchema = z.enum([
  'publishedAt:desc', 'publishedAt:asc', 'effectiveAt:desc', 'effectiveAt:asc',
  'createdAt:desc', 'createdAt:asc', 'updatedAt:desc', 'updatedAt:asc',
  'severity:desc', 'severity:asc',
]);

export const feedQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(3),
  search: z.string().trim().min(1).max(200).optional(),
  market: z.string().trim().min(1).max(100).optional(),
  category: legalUpdateCategorySchema.optional(),
  severity: legalUpdateSeveritySchema.optional(),
  status: legalUpdateStatusSchema.optional(),
  sort: legalUpdateSortSchema.default('publishedAt:desc'),
}).strict();

export const adminListQuerySchema = feedQuerySchema.extend({
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  reviewStatus: legalUpdateReviewStatusSchema.optional(),
}).strict();

export const legalUpdateParamsSchema = z.object({
  id: uuidSchema,
}).strict();

export const rejectLegalUpdateSchema = z.object({
  reason: z.string().trim().min(1).max(2_000),
}).strict();

export const publishLegalUpdateSchema = z.object({}).strict().default({});

export type CreateLegalUpdateInput = z.infer<typeof createLegalUpdateSchema>;
export type UpdateLegalUpdateInput = z.infer<typeof updateLegalUpdateSchema>;
export type FeedQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  market?: string;
  category?: z.infer<typeof legalUpdateCategorySchema>;
  severity?: z.infer<typeof legalUpdateSeveritySchema>;
  status?: z.infer<typeof legalUpdateStatusSchema>;
  sort?: z.infer<typeof legalUpdateSortSchema>;
};
export type AdminListQuery = FeedQuery & {
  reviewStatus?: z.infer<typeof legalUpdateReviewStatusSchema>;
};

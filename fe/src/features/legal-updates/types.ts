import { z } from "zod";

import { isSafeHttpUrl } from "@/lib/safe-url";

const apiDateTimeSchema = z.string().datetime({ offset: true });
const nullableApiDateTimeSchema = apiDateTimeSchema.nullable();
const httpUrlSchema = z.string().url().refine(isSafeHttpUrl, "URL must use http or https");

export const legalUpdateSeveritySchema = z.enum([
  "critical",
  "high",
  "medium",
  "low",
  "informational",
]);

export const legalUpdateStatusSchema = z.enum([
  "draft",
  "published",
  "upcoming",
  "effective",
  "amended",
  "repealed",
  "archived",
]);

export const legalUpdateCategorySchema = z.enum([
  "phytosanitary",
  "mrl",
  "food_safety",
  "labeling",
  "packaging",
  "traceability",
  "customs",
  "certificate",
  "organic",
  "eudr",
  "esg",
  "quota_tariff",
  "registration",
  "inspection",
  "recall",
  "market_access",
  "other",
]);

export const legalUpdateRelevanceSchema = z.enum([
  "relevant",
  "not_relevant",
  "needs_review",
]);

export const legalUpdateConfidenceSchema = z.enum(["high", "medium", "low"]);

export const legalUpdateFeedItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().nullable(),
  market: z.string().min(1),
  category: legalUpdateCategorySchema,
  severity: legalUpdateSeveritySchema,
  status: legalUpdateStatusSchema,
  sourceAgency: z.string().nullable(),
  sourceUrl: httpUrlSchema.nullable(),
  hsCodes: z.array(z.string()).optional(),
  affectedProductCount: z.number().int().nonnegative().optional(),
  publishedAt: nullableApiDateTimeSchema,
  effectiveAt: nullableApiDateTimeSchema,
  createdAt: apiDateTimeSchema,
});


const recommendedActionSchema = z.object({
  actionVi: z.string().min(1),
  basis: z.string().min(1),
  priority: z.enum(["high", "medium", "low"]),
});

const citationSchema = z.object({
  sourceReference: z.string().nullable(),
  section: z.string().nullable(),
  quoteVi: z.string().min(1),
});

const affectedProductSchema = z.object({
  nameVi: z.string().min(1),
  nameOriginal: z.string().nullable(),
  hsCode: z.string().nullable(),
  scope: z.enum(["specific", "commodity_group", "all_agricultural_products", "unclear"]),
});

const detailedSummarySchema = z.object({
  purpose: z.string().optional(),
  scope: z.string().optional(),
  keyRequirements: z.array(z.string()).optional(),
  inspectionAndCertification: z.array(z.string()).optional(),
  penaltiesOrConsequences: z.array(z.string()).optional(),
  unknowns: z.array(z.string()).optional(),
}).nullable();

export const legalUpdateDetailSchema = z.object({
  id: z.string().uuid(),
  sourceAgency: z.string().nullable(),
  sourceCountry: z.string().nullable(),
  sourceUrl: httpUrlSchema.nullable(),
  documentUrl: httpUrlSchema.nullable(),
  sourceReference: z.string().nullable(),
  sourceLanguage: z.string().nullable(),
  titleOriginal: z.string().nullable(),
  titleVi: z.string().min(1),
  summaryVi: z.string().min(1),
  detailedSummaryVi: detailedSummarySchema,
  businessImpactVi: z.string().nullable(),
  recommendedActions: z.array(recommendedActionSchema),
  citations: z.array(citationSchema),
  affectedProducts: z.array(affectedProductSchema),
  affectedGroups: z.array(z.string()),
  hsCodes: z.array(z.string()),
  market: z.string().min(1),
  category: legalUpdateCategorySchema,
  severity: legalUpdateSeveritySchema,
  status: legalUpdateStatusSchema,
  relevance: z.object({
    status: legalUpdateRelevanceSchema,
    reasonVi: z.string().nullable(),
  }),
  confidence: legalUpdateConfidenceSchema,
  publishedAt: nullableApiDateTimeSchema,
  effectiveAt: nullableApiDateTimeSchema,
  createdAt: apiDateTimeSchema,
  updatedAt: apiDateTimeSchema,
});

const feedMetaSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  requestId: z.string().min(1),
});

export const legalUpdateFeedResponseSchema = z.object({
  data: z.array(legalUpdateFeedItemSchema),
  meta: feedMetaSchema,
});

export const legalUpdateDetailResponseSchema = z.object({
  data: legalUpdateDetailSchema,
  meta: z.object({ requestId: z.string().min(1) }),
});

export type LegalUpdateFeedItem = z.infer<typeof legalUpdateFeedItemSchema>;
export type LegalUpdateDetail = z.infer<typeof legalUpdateDetailSchema>;

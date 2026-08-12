import type { LegalUpdate } from '@prisma/client';

export type ApiLegalUpdateCategory =
  | 'phytosanitary'
  | 'mrl'
  | 'food_safety'
  | 'labeling'
  | 'packaging'
  | 'traceability'
  | 'customs'
  | 'certificate'
  | 'organic'
  | 'eudr'
  | 'esg'
  | 'quota_tariff'
  | 'registration'
  | 'inspection'
  | 'recall'
  | 'market_access'
  | 'other';

export type ApiLegalUpdateSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';
export type ApiLegalUpdateStatus = 'draft' | 'published' | 'upcoming' | 'effective' | 'amended' | 'repealed' | 'archived';
export type ApiLegalUpdateReviewStatus = 'pending_review' | 'published' | 'rejected';
export type ApiLegalUpdateRelevance = 'relevant' | 'not_relevant' | 'needs_review';
export type ApiLegalUpdateConfidence = 'high' | 'medium' | 'low';

export interface RecommendedAction {
  actionVi: string;
  basis: string;
  priority: 'high' | 'medium' | 'low';
}

export interface LegalUpdateCitation {
  sourceReference: string | null;
  section: string | null;
  quoteVi: string;
}

export interface AffectedProduct {
  nameVi: string;
  nameOriginal: string | null;
  hsCode: string | null;
  scope: 'specific' | 'commodity_group' | 'all_agricultural_products' | 'unclear';
}

export interface DetailedSummary {
  purpose?: string;
  scope?: string;
  keyRequirements?: string[];
  inspectionAndCertification?: string[];
  penaltiesOrConsequences?: string[];
  unknowns?: string[];
}

export interface LegalUpdateFeedItem {
  id: string;
  title: string;
  description: string;
  market: string;
  category: ApiLegalUpdateCategory;
  severity: ApiLegalUpdateSeverity;
  status: ApiLegalUpdateStatus;
  sourceAgency: string;
  sourceUrl: string;
  hsCodes?: string[];
  affectedProductCount?: number;
  publishedAt: Date | null;
  effectiveAt: Date | null;
  createdAt: Date;
}


export interface LegalUpdateDetail {
  id: string;
  sourceAgency: string;
  sourceCountry: string | null;
  sourceUrl: string;
  documentUrl: string | null;
  sourceReference: string | null;
  sourceLanguage: string | null;
  titleOriginal: string | null;
  titleVi: string;
  summaryVi: string;
  detailedSummaryVi: DetailedSummary | null;
  businessImpactVi: string | null;
  recommendedActions: RecommendedAction[];
  citations: LegalUpdateCitation[];
  affectedProducts: AffectedProduct[];
  affectedGroups: string[];
  hsCodes: string[];
  market: string;
  category: ApiLegalUpdateCategory;
  severity: ApiLegalUpdateSeverity;
  status: ApiLegalUpdateStatus;
  relevance: {
    status: ApiLegalUpdateRelevance;
    reasonVi: string | null;
  };
  confidence: ApiLegalUpdateConfidence;
  publishedAt: Date | null;
  effectiveAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export type LegalUpdateRecord = LegalUpdate;

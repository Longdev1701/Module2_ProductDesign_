-- Legal Updates Phase 1
--
-- Apply this migration after the baseline migration in 20260809235500.
-- Do not make this migration idempotent: any pre-existing object indicates
-- schema drift and must stop deployment for investigation.

CREATE TYPE "LegalUpdateCategory" AS ENUM (
  'PHYTOSANITARY', 'MRL', 'FOOD_SAFETY', 'LABELING', 'PACKAGING',
  'TRACEABILITY', 'CUSTOMS', 'CERTIFICATE', 'ORGANIC', 'EUDR', 'ESG',
  'QUOTA_TARIFF', 'REGISTRATION', 'INSPECTION', 'RECALL',
  'MARKET_ACCESS', 'OTHER'
);

CREATE TYPE "LegalUpdateSeverity" AS ENUM (
  'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL'
);

CREATE TYPE "LegalUpdateStatus" AS ENUM (
  'DRAFT', 'PUBLISHED', 'UPCOMING', 'EFFECTIVE', 'AMENDED', 'REPEALED',
  'ARCHIVED'
);

CREATE TYPE "LegalUpdateReviewStatus" AS ENUM (
  'PENDING_REVIEW', 'PUBLISHED', 'REJECTED'
);

CREATE TYPE "LegalUpdateRelevance" AS ENUM (
  'RELEVANT', 'NOT_RELEVANT', 'NEEDS_REVIEW'
);

CREATE TYPE "LegalUpdateConfidence" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

CREATE TABLE public.legal_updates (
  id TEXT PRIMARY KEY,
  "organizationId" TEXT REFERENCES public.organizations(id) ON DELETE CASCADE,
  "regulationId" TEXT REFERENCES public.regulations(id) ON DELETE SET NULL,
  "sourceAgency" TEXT NOT NULL,
  "sourceCountry" TEXT,
  "sourceUrl" TEXT NOT NULL,
  "documentUrl" TEXT,
  "sourceReference" TEXT,
  "sourceLanguage" TEXT,
  "rawArticleId" TEXT,
  checksum TEXT NOT NULL,
  "titleOriginal" TEXT,
  "titleVi" TEXT NOT NULL,
  "frontendTitleVi" TEXT,
  "frontendSummaryVi" TEXT,
  "summaryVi" TEXT NOT NULL,
  "detailedSummaryVi" JSONB,
  "businessImpactVi" TEXT,
  "recommendedActions" JSONB,
  citations JSONB,
  market TEXT NOT NULL,
  category "LegalUpdateCategory" NOT NULL DEFAULT 'OTHER',
  severity "LegalUpdateSeverity" NOT NULL DEFAULT 'INFORMATIONAL',
  status "LegalUpdateStatus" NOT NULL DEFAULT 'PUBLISHED',
  "relevanceStatus" "LegalUpdateRelevance" NOT NULL DEFAULT 'NEEDS_REVIEW',
  "relevanceReasonVi" TEXT,
  "affectedProducts" JSONB,
  "affectedGroups" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "hsCodes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  confidence "LegalUpdateConfidence" NOT NULL DEFAULT 'MEDIUM',
  "publishedAt" TIMESTAMP(3),
  "effectiveAt" TIMESTAMP(3),
  "reviewStatus" "LegalUpdateReviewStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
  "reviewedByUserId" TEXT REFERENCES public.profiles(id) ON DELETE RESTRICT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "legal_updates_published_requires_review"
    CHECK (
      "reviewStatus" <> 'PUBLISHED'
      OR ("reviewedByUserId" IS NOT NULL AND "reviewedAt" IS NOT NULL)
    )
);

CREATE INDEX "legal_updates_organization_review_published_idx"
  ON public.legal_updates ("organizationId", "reviewStatus", "publishedAt");
CREATE INDEX "legal_updates_market_review_published_idx"
  ON public.legal_updates (market, "reviewStatus", "publishedAt");
CREATE INDEX "legal_updates_status_effective_idx"
  ON public.legal_updates (status, "effectiveAt");
CREATE INDEX "legal_updates_regulation_idx"
  ON public.legal_updates ("regulationId");
CREATE INDEX "legal_updates_hs_codes_gin_idx"
  ON public.legal_updates USING GIN ("hsCodes");

CREATE UNIQUE INDEX "legal_updates_source_url_checksum_key"
  ON public.legal_updates ("sourceUrl", checksum);
CREATE UNIQUE INDEX "legal_updates_source_reference_checksum_key"
  ON public.legal_updates ("sourceReference", checksum)
  WHERE "sourceReference" IS NOT NULL;

ALTER TABLE public.legal_updates ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.legal_updates TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.legal_updates FROM anon, authenticated;

CREATE POLICY "legal_updates_read_published_scoped"
  ON public.legal_updates
  FOR SELECT
  TO authenticated
  USING (
    "reviewStatus" = 'PUBLISHED'
    AND (
      "organizationId" IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.organization_members AS member
        WHERE member."organizationId" = legal_updates."organizationId"
          AND member."userId" = auth.uid()::TEXT
          AND member.status = 'ACTIVE'
      )
    )
  );

ALTER PUBLICATION supabase_realtime ADD TABLE public.legal_updates;

-- Baseline of the schema that existed before LegalUpdate.
-- For an existing Supabase database previously managed with `prisma db push`,
-- inspect schema parity first, then mark this migration as applied with
-- `prisma migrate resolve --applied 20260809235500_baseline_existing_schema`.

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TYPE "PlatformRole" AS ENUM ('USER', 'SUPPORT', 'PLATFORM_ADMIN', 'SUPER_ADMIN');
CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'MANAGER', 'COMPLIANCE', 'VIEWER');
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'INVITED');
CREATE TYPE "BatchStatus" AS ENUM ('DRAFT', 'COLLECTING_DOCUMENTS', 'READY_FOR_CHECK', 'CHECKING', 'ACTION_REQUIRED', 'COMPLIANT', 'NON_COMPLIANT', 'EXPIRED');
CREATE TYPE "DocumentType" AS ENUM ('CO', 'CQ', 'PHYTO', 'LAB_REPORT', 'CONTRACT', 'INVOICE', 'PACKING_LIST', 'GPS_MAP', 'OTHER');
CREATE TYPE "RegulationCategory" AS ENUM ('MRL', 'LABELING', 'PACKAGING', 'TRACEABILITY', 'EUDR', 'ESG', 'FOOD_SAFETY', 'OTHER');
CREATE TYPE "CheckStatus" AS ENUM ('QUEUED', 'PROCESSING', 'NEEDS_INPUT', 'COMPLETED', 'FAILED', 'CANCELLED', 'SUPERSEDED');
CREATE TYPE "ComplianceResult" AS ENUM ('COMPLIANT', 'CONDITIONALLY_COMPLIANT', 'NON_COMPLIANT', 'INSUFFICIENT_INFORMATION', 'NOT_APPLICABLE', 'MANUAL_REVIEW_REQUIRED');
CREATE TYPE "FindingSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL');
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'FINAL');
CREATE TYPE "NotificationType" AS ENUM ('REGULATION_UPDATE', 'CHECK_COMPLETED', 'RISK_ALERT', 'SYSTEM');

CREATE TABLE "profiles" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "avatarUrl" TEXT,
  "jobTitle" TEXT,
  "platformRole" "PlatformRole" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "organizations" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "taxCode" TEXT,
  "address" TEXT,
  "legalRepresentative" TEXT,
  "contactEmail" TEXT,
  "contactPhone" TEXT,
  "primaryProduct" TEXT,
  "exportMarkets" JSONB,
  "exportForm" TEXT,
  "exportScale" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "organization_members" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "OrganizationRole" NOT NULL DEFAULT 'COMPLIANCE',
  "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "invitations" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" "OrganizationRole" NOT NULL DEFAULT 'COMPLIANCE',
  "token" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "products" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "hsCode" TEXT,
  "description" TEXT,
  "origin" TEXT,
  "organizationId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "batches" (
  "id" TEXT NOT NULL,
  "batchCode" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION,
  "unit" TEXT,
  "status" "BatchStatus" NOT NULL DEFAULT 'DRAFT',
  "producedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "product_market_requirements" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "marketCode" TEXT NOT NULL,
  "marketName" TEXT NOT NULL,
  CONSTRAINT "product_market_requirements_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "documents" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "type" "DocumentType" NOT NULL,
  "fileUrl" TEXT,
  "fileSize" INTEGER,
  "mimeType" TEXT,
  "organizationId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "batch_documents" (
  "id" TEXT NOT NULL,
  "batchId" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "batch_documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "regulations" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" "RegulationCategory" NOT NULL,
  "market" TEXT NOT NULL,
  "effectiveDate" TIMESTAMP(3),
  "sourceUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "regulations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "mrl_limits" (
  "id" TEXT NOT NULL,
  "regulationId" TEXT NOT NULL,
  "substance" TEXT NOT NULL,
  "maxLimit" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL DEFAULT 'mg/kg',
  "productGroup" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "mrl_limits_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "compliance_checks" (
  "id" TEXT NOT NULL,
  "batchId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "checkStatus" "CheckStatus" NOT NULL DEFAULT 'QUEUED',
  "result" "ComplianceResult" NOT NULL DEFAULT 'MANUAL_REVIEW_REQUIRED',
  "aiConfidence" DOUBLE PRECISION,
  "summary" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "compliance_checks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "compliance_items" (
  "id" TEXT NOT NULL,
  "complianceCheckId" TEXT NOT NULL,
  "regulationId" TEXT,
  "requirement" TEXT NOT NULL,
  "status" "ComplianceResult" NOT NULL,
  "deviation" TEXT,
  "remediation" TEXT,
  "severity" "FindingSeverity" NOT NULL DEFAULT 'INFORMATIONAL',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "compliance_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reports" (
  "id" TEXT NOT NULL,
  "complianceCheckId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "pdfUrl" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
  "integrityHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entityId" TEXT,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "link" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
CREATE UNIQUE INDEX "organization_members_organizationId_userId_key" ON "organization_members"("organizationId", "userId");
CREATE UNIQUE INDEX "invitations_token_key" ON "invitations"("token");
CREATE UNIQUE INDEX "batches_batchCode_key" ON "batches"("batchCode");
CREATE UNIQUE INDEX "product_market_requirements_productId_marketCode_key" ON "product_market_requirements"("productId", "marketCode");
CREATE UNIQUE INDEX "batch_documents_batchId_documentId_key" ON "batch_documents"("batchId", "documentId");
CREATE UNIQUE INDEX "regulations_code_key" ON "regulations"("code");
CREATE UNIQUE INDEX "reports_complianceCheckId_key" ON "reports"("complianceCheckId");
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "batches" ADD CONSTRAINT "batches_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_market_requirements" ADD CONSTRAINT "product_market_requirements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "documents" ADD CONSTRAINT "documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "batch_documents" ADD CONSTRAINT "batch_documents_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "batch_documents" ADD CONSTRAINT "batch_documents_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mrl_limits" ADD CONSTRAINT "mrl_limits_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "compliance_checks" ADD CONSTRAINT "compliance_checks_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "compliance_checks" ADD CONSTRAINT "compliance_checks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "compliance_items" ADD CONSTRAINT "compliance_items_complianceCheckId_fkey" FOREIGN KEY ("complianceCheckId") REFERENCES "compliance_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "compliance_items" ADD CONSTRAINT "compliance_items_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "reports" ADD CONSTRAINT "reports_complianceCheckId_fkey" FOREIGN KEY ("complianceCheckId") REFERENCES "compliance_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

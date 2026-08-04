---
name: database
description: Modify Prisma schema, write migrations, design RLS policies, and manage Supabase DB for Themis LexiGuard. Use when editing be/prisma/schema.prisma or writing SQL migrations.
---

# SKILL: Database

## ENGINE
db: Supabase PostgreSQL
orm: Prisma
extensions: pgvector (for regulation embeddings)

## KEY TABLES & OWNERSHIP

### User/Org group
Profile(id, full_name, avatar_url, timezone)
Organization(id, name, tax_code, country, settings)
OrganizationMember(org_id, user_id, role, status)  — unique(org_id+user_id)

### Product group
Product(id, organization_id, code, name, category, hs_code, origin_country, status)
  unique: (organization_id, code)  — NOT global unique
ProductMarket(product_id, market, status)
Supplier(id, organization_id, name, country)

### Batch group
Batch(id, organization_id, product_id, batch_code, status, target_markets[])
  unique: (organization_id, batch_code)

### Document group
Document(id, org_id, batch_id, document_type, storage_path, checksum, expires_at)
DocumentVersion(id, document_id, version, storage_path, checksum)
DocumentExtraction(id, document_version_id, structured_data, confidence, status)

### Compliance group
ComplianceCheck(id, org_id, batch_id, check_type, target_market, status, result, risk_score)
ComplianceCheckDocument(check_id, document_version_id)  — snapshot: which version was used
Finding(id, check_id, code, severity, status, requirement, observed_value, confidence)
FindingCitation(id, finding_id, regulation_version_id, article, quote, source_url)
RemediationTask(id, org_id, finding_id, assignee_id, status, priority, due_date)

### Regulation group
Regulation(id, source, external_id, canonical_title, market, category, current_version_id)
RegulationVersion(id, regulation_id, version_label, full_text, effective_at, checksum)
  — NEVER update existing version, always insert new row
RegulationChunk(id, version_id, text, embedding vector(1536), article, market, effective_at)
RegulationApplicability(version_id, product_category, hs_code, market, substance)
RegulationImpact(version_id, org_id, product_id, impact_level, status)

### System group
AuditLog(id, org_id, actor_id, action, entity_type, entity_id, before_data, after_data, ip_hash)
  — immutable, no UPDATE/DELETE policies
Notification(id, org_id, user_id, type, entity_id, is_read)
SyncRun(id, source, status, fetched/created/updated/failed counts, error_data)
AIUsageEvent(id, org_id, check_id, model, input_tokens, output_tokens, estimated_cost)

## CRITICAL CONSTRAINTS
- Document version used in ComplianceCheck → NO update allowed
- Approved Report → NO direct update → create new check + new report
- Regulation → NO delete → add RegulationVersion only
- AuditLog → NO update/delete policy in RLS
- Batch must share organization_id with its Product
- Finding without citationIds → reject at application layer before save

## RLS PATTERN (every business table)
SELECT: user is active member of row.organization_id
INSERT: role has create permission
UPDATE: role has edit permission
DELETE: owner/manager only, with conditions

```sql
-- Example RLS for products
CREATE POLICY "select_products" ON products
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );
```

## KEY INDEXES
products: (organization_id, status), (organization_id, code)
batches: (organization_id, product_id), (status, created_at)
documents: (batch_id, document_type), (expires_at), (checksum)
compliance_checks: (batch_id, created_at), (organization_id, result), (status)
findings: (check_id, severity), (status, severity)
regulations: (source, external_id)
regulation_versions: (regulation_id, published_at), (effective_at)
notifications: (user_id, is_read, created_at)
audit_logs: (organization_id, created_at)
regulation_chunks: ivfflat index on embedding (vector cosine)

## IDEMPOTENCY FOR REGULATION SYNC
key: source + external_id + content_checksum
same key → update existing, do NOT create duplicate version

## MIGRATION PROCESS
1. prisma migrate dev --name <descriptive-name>
2. review generated SQL
3. run on staging first
4. backup production
5. deploy migration before backend deploy

## FORBIDDEN
- No global unique on Product.code (must be org-scoped)
- No soft-delete-only on AuditLog (must be append-only)
- No UPDATE on regulation_versions after creation
- No storing Gemini API key in DB
- No service role key in any DB column

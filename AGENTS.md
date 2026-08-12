# THEMIS LEXIGUARD — MASTER AGENT RULES

product: Themis LexiGuard | AI Compliance Navigator for Agricultural Export
mvp: durian × CHINA | stack: Next.js15 + Express + Supabase + Prisma + Gemini
dirs: fe/ | be/ | docs/ | .agents/

---

## TEAM RULES

### Git & Branch
branch: feat/sprint-N-name | fix/description | chore/name
commit: imperative tense, max 72 chars, reference task ID
PR: must link issue, must describe what + why, not how
merge: only when CI green (typecheck + lint + test + build)
main: protected — no direct push
review: min 1 approval, author resolves all comments before merge
changelog: MANDATORY — every PR / system change MUST update CHANGELOG.md

### PR Checklist (author self-review)
[ ] no mock data in production path
[ ] no hardcoded hex colors — CSS vars only
[ ] no secrets in code or logs
[ ] loading + empty + error states implemented
[ ] zod validation on both FE and BE
[ ] BE auth + RBAC check on every mutating endpoint
[ ] audit log written for data-mutating actions
[ ] CHANGELOG.md updated with all changes made
[ ] build passes locally before pushing

### Code Standards
language: TypeScript strict — no `any`, no `// @ts-ignore`
imports: absolute paths via @ alias, no ../../../ chains
env vars: only via process.env — never inline
error handling: always return error info to user (no silent swallow)
comments: explain WHY, not WHAT — delete stale comments
naming: PascalCase(components/types) camelCase(vars/fns) SCREAMING_SNAKE(constants/enums)
files: kebab-case for all filenames
tests: unit for business logic, integration for API+DB, E2E for critical flows

### ABSOLUTE PROHIBITIONS (applies to every layer)
✗ name "Coffee EU-Check AI" anywhere
✗ mock/setTimeout in production code paths
✗ hardcode hex colors — use var(--color-*)
✗ call Gemini from frontend
✗ expose SUPABASE_SERVICE_ROLE_KEY or GEMINI_API_KEY to frontend/client
✗ conclude `compliant` when finding has no citationIds
✗ overwrite approved report — create new version
✗ delete Regulation — add RegulationVersion only
✗ merge to main when CI fails
✗ trust userId from request body — always from validated JWT
✗ complete task without updating CHANGELOG.md when system/code state changes

---

## RESPONSE FORMAT (when AI completes a task)

done:
  DONE: [1-line summary of change]
  FILES: [file1, file2, ...]
  TEST: [how to verify]

blocked:
  BLOCKED: [reason]
  NEED: [what is missing]

code always includes: loading state | empty state | error state | zod schema | BE auth check | CHANGELOG.md update

---

## STATUS ENUMS (use exact strings)

batch.status:    draft | collecting_documents | ready_for_check | checking | action_required | compliant | non_compliant | expired
check.status:    queued | processing | needs_input | completed | failed | cancelled | superseded
check.result:    compliant | conditionally_compliant | non_compliant | insufficient_information | not_applicable | manual_review_required
finding.severity: critical | high | medium | low | informational
doc.status:      uploaded | queued | processing | extracted | needs_review | failed
regulation.status: draft | published | upcoming | effective | amended | repealed

FORBIDDEN result values: pass | fail | warning

---

## FRONTEND RULES (fe/)

stack: Next.js 15 App Router | Tailwind CSS v4 | React Hook Form + Zod | lucide-react | motion
state: server state via API client | Context only for auth/org/theme | URL params for filter+pagination

### Structure
fe/src/app/(auth)/        — login, register, onboarding
fe/src/app/(dashboard)/   — all protected pages
fe/src/components/        — shared UI primitives
fe/src/features/<name>/   — feature-scoped: components + hooks + types
fe/src/lib/api.ts         — single API client (no raw fetch in components)
fe/src/types/             — shared TypeScript interfaces

### Routing
- middleware.ts: redirect unauthenticated → /login?next=<path>
- auth pages + active session → redirect /dashboard
- URL stores: ?page=&pageSize=&search=&market=&status=&sort=

### API calls
- all business calls → fe/src/lib/api.ts (never Supabase DB direct)
- Supabase direct: auth session | realtime | signed URL only
- always handle: 401 (refresh/redirect) | 403 (show forbidden) | 422 (show field errors) | 5xx (show retry)

### Component contract
every feature component MUST have:
  loading:  skeleton (content) or spinner (actions)
  empty:    descriptive message + primary CTA
  error:    real API error message, retry button
  success:  toast or inline confirmation

forms:
  library: React Hook Form
  schema: Zod (shared with BE via fe/src/types/)
  submit: disabled while loading
  errors: field-level + form-level

tables:
  pagination: server-side only (never load all)
  sort: server-side
  filter: synced to URL params
  mobile: horizontal scroll wrapper

### Forbidden (FE)
✗ setTimeout to simulate loading
✗ hardcoded demo arrays in components
✗ inline style with color values
✗ direct Supabase DB queries for business data
✗ business logic in JSX — extract to hooks

---

## BACKEND RULES (be/)

stack: Node.js + Express | Prisma | Zod | Supabase JWT
structure: modules/<name>/{router, controller, service, schema, types}

### Request pipeline
request → authMiddleware → orgMiddleware → rbacMiddleware → controller → service → prisma → response

### Auth middleware (every protected route)
1. read: Authorization: Bearer <token>
2. verify: Supabase JWT (issuer, audience, expiration)
3. extract: userId = token.sub — NEVER from req.body
4. fail: 401 Unauthorized
5. attach: req.user = { id, email }

### RBAC middleware
check in order:
  1. user is active member of target organization
  2. user role has permission for action
  3. requested entity belongs to same organization
fail any → 403 Forbidden

### RBAC matrix
action                    | owner | manager | analyst | viewer
create product/batch      |   ✓   |    ✓    |    ✓    |   ✗
delete product            |   ✓   |    ✓    |    ✗    |   ✗
upload document           |   ✓   |    ✓    |    ✓    |   ✗
run compliance check      |   ✓   |    ✓    |    ✓    |   ✗
approve report            |   ✓   |    ✓    |    ✗    |   ✗
manage org members        |   ✓   |    ✗    |    ✗    |   ✗
view reports/dashboard    |   ✓   |    ✓    |    ✓    |   ✓

### Controller rules
- input validation: Zod schema (fail fast, return 422 with details)
- no business logic in controller — delegate to service
- no raw Prisma in controller
- always return requestId in response

### Service rules
- single responsibility per service method
- transactions: use prisma.$transaction for multi-table writes
- never throw raw DB errors — catch and re-throw as domain errors

### Background jobs (REQUIRED for these operations)
document text extraction | AI compliance analysis | PDF report gen
legal regulation sync | email/notification dispatch | impact analysis
job schema: { id, status, progress, retry_count, error_message, idempotency_key, started_at, finished_at }

### Rate limits (separate per action)
login: 5/min/IP | check: 10/hr/org | upload: 20/hr/user | export: 10/hr/user | sync: 1/hr/admin

### Forbidden (BE)
✗ business logic in router file
✗ skip RBAC "because UI already prevents it"
✗ long-running sync inside HTTP handler → use job queue
✗ return raw Prisma/DB error messages to client
✗ accept userId from request body

---

## SERVER / WORKER RULES (be/src/jobs/)

### Worker types
legal-sync/      — fetch + normalize + version regulation data
doc-processing/  — extract text + structured fields from uploaded files
compliance/      — run AI analysis pipeline
notifications/   — send in-app + email notifications

### Job contract
every job MUST:
  - generate unique idempotency key before starting
  - acquire distributed lock (prevent duplicate runs)
  - update job status: queued → processing → completed|failed
  - emit progress events (picked up by Supabase Realtime)
  - retry on transient failure (max 3, exponential backoff)
  - log: job_id, org_id, started_at, finished_at, error_data
  - clean up lock on exit (success or failure)

### Legal sync idempotency
key: source + external_id + content_checksum
same key → update existing record, do NOT create duplicate version

### AI compliance pipeline
documents → extraction → user_verify → applicable_regs
→ deterministic_rules (code) + RAG (pgvector) → Gemini
→ Zod validate output → save findings + citations → report

deterministic rules handle (never send to AI):
  MRL threshold breach | doc expiry | missing required doc
  batch code mismatch | date logic errors | duplicate certificate numbers

### Forbidden (jobs)
✗ run heavy jobs synchronously in HTTP request
✗ skip idempotency key
✗ swallow job errors silently
✗ store raw Gemini output — only Zod-validated structured data

---

## DATABASE RULES

### Core principles
- every business table has organization_id (direct or via FK)
- RLS on every table: user reads only their org's data
- AuditLog: append-only, no UPDATE/DELETE RLS policy
- Regulation: never delete, add version only
- DocumentVersion used in ComplianceCheck: no update allowed
- Product.code unique: (organization_id, code) — NOT global

### RLS pattern
SELECT: org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid() AND status='active')
INSERT: role-based (check via function)
UPDATE: role-based
DELETE: owner/manager only, with conditions
AuditLog: INSERT only — no UPDATE/DELETE

### Key indexes
products(org_id, status) | products(org_id, code)
batches(org_id, product_id) | batches(status, created_at)
documents(batch_id, type) | documents(expires_at) | documents(checksum)
compliance_checks(batch_id, created_at) | compliance_checks(status)
findings(check_id, severity) | findings(status, severity)
regulations(source, external_id) | regulation_versions(effective_at)
notifications(user_id, is_read, created_at)
regulation_chunks: ivfflat on embedding (cosine)

### Invariants (enforce at service layer + DB constraints)
- Batch.org_id must equal its Product.org_id
- Approved Report → immutable (new check + new report only)
- Finding without citationIds → rejected before save
- ComplianceCheck not approve-able while status=processing

### Migration process
prisma migrate dev --name <descriptive> → review SQL → staging → backup prod → deploy

### Forbidden (DB)
✗ global unique on Product.code
✗ UPDATE on regulation_versions after creation
✗ UPDATE/DELETE on audit_logs
✗ public bucket for compliance documents
✗ storing secrets in any DB column

---

## API RULES

### Response envelope (always)
success: { "data": T, "meta": { "requestId": string } }
error:   { "error": { "code": string, "message": string, "details"?: object, "requestId": string } }

### Pagination (all list endpoints)
query:    ?page=1&pageSize=20&search=&sort=createdAt:desc&market=EU&status=active
response: { data: T[], meta: { page, pageSize, total, totalPages, requestId } }
rule: server-side always — never return all records

### HTTP status codes
200 GET success | 201 POST created | 204 DELETE no content
400 bad request | 401 unauthenticated | 403 forbidden | 404 not found
422 validation error (Zod) | 409 conflict | 429 rate limit | 500 server error

### Endpoint naming
GET    /api/<resource>              — list
POST   /api/<resource>              — create
GET    /api/<resource>/:id          — get one
PATCH  /api/<resource>/:id          — partial update
DELETE /api/<resource>/:id          — delete
POST   /api/<resource>/:id/<action> — state transition (approve, cancel, retry)

### Key endpoints
# Auth & Org
GET|POST /api/organizations | GET|PATCH /api/organizations/:id
GET|POST /api/organizations/:id/members | POST /api/organizations/:id/invitations

# Products & Batches
GET|POST|PATCH|DELETE /api/products | POST /api/products/import
GET|POST /api/products/:id/batches | GET|PATCH|DELETE /api/batches/:id | POST /api/batches/:id/archive

# Documents
POST /api/documents/upload-url | POST /api/documents
GET|DELETE /api/documents/:id | POST /api/documents/:id/reprocess

# Compliance
POST|GET /api/compliance/checks | GET /api/compliance/checks/:id
POST /api/compliance/checks/:id/cancel|retry|recheck
GET /api/checks/:checkId/findings | PATCH /api/findings/:id
POST /api/findings/:id/tasks | PATCH|GET /api/tasks/:id
POST /api/tasks/:id/evidence|complete|review

# Reports
GET /api/reports/:id | GET /api/reports/:id/versions
POST /api/reports/:id/approve|request-revision|export

# Regulations
GET /api/regulations | GET /api/regulations/:id | GET /api/regulations/:id/versions
POST /api/regulations/:id/analyze-impact
POST /api/admin/regulations/sync | GET /api/admin/regulations/sync-runs

# Dashboard
GET /api/dashboard/summary|trends|recent-checks|action-items|legal-updates

# Health
GET /health | /health/database|storage|ai|legal-sources

### Forbidden (API)
✗ return all records without pagination
✗ expose internal DB errors in response
✗ allow userId override from request body
✗ skip requestId in response
✗ accept orphaned entity IDs (validate org ownership)

---

## DEFINITION OF DONE

feature is DONE only when ALL are true:
[ ] UI: no placeholder, no mock, no setTimeout
[ ] API: real endpoint, real DB write
[ ] Validation: Zod on FE form + BE input
[ ] Auth: JWT verified, RBAC checked server-side
[ ] States: loading + empty + error implemented
[ ] Audit: log written for mutations
[ ] Changelog: CHANGELOG.md updated
[ ] Secrets: none in code or bundle
[ ] Build: `tsc --noEmit` + build succeeds
[ ] Console: no errors in production build
[ ] Isolation: cannot access another org's data

---

## LESSONS LEARNED & PERFORMANCE RULES (CRITICAL FOR ALL AGENTS)

### 1. Dashboard & Route Navigation (0ms Instant Page Transitions)
- **Synchronous State Hydration**: Khởi tạo state React (`user`, `org`, `loading`) đồng bộ trong `useState(() => ...)` bằng cách đọc cache `localStorage` ngay tại Frame 0. Tuyệt đối không để `loading` khởi tạo là `true` khi đã có cache vì sẽ gây nhấp nháy Skeleton khi chuyển route quay lại.
- **No Unconditional Global Events**: Không dispatch các sự kiện toàn cục (như `themis:organization-changed`) khi mount trang trừ khi dữ liệu (như `organizationId`) thực sự thay đổi, để tránh re-trigger không cần thiết làm reload các Widget con.

### 2. UI Layout & Responsive Tabs
- **Flex Wrap Over Overflow Clipping**: Sử dụng `flex flex-wrap` cho các bộ nút/tab chọn nhiều tùy chọn (như danh sách thị trường, loại tiêu chuẩn) thay vì cuộn ngang `overflow-x-auto` bị giấu viền. Đảm bảo 100% tùy chọn hiển thị đầy đủ trên mọi màn hình.
- **Pagination Standard for List Widgets**: Các widget hiển thị danh sách (bài tin, tài liệu PDF) phải có bộ nút phân trang thu nhỏ (`<` `>`) ngay trên card và nút "Xem tất cả" mở Modal Dialog với phân trang + tìm kiếm server-side.

### 3. Backend Query & API Performance
- **Parallel Query Execution**: Sử dụng `Promise.all` để chạy song song các câu lệnh Prisma thay vì `await` nối tiếp làm tăng thời gian chờ.
- **Selective Field Fetching**: Luôn dùng Prisma `select` để lọc loại bỏ các trường JSON/văn bản lớn (`detailedSummaryVi`, `citations`) ở các endpoint dạng danh sách/feed.

### 4. Skeleton Loading Standard
- Thiết kế Skeleton UI mô phỏng chính xác hình dáng, tỉ lệ và số dòng của card/thành phần thực tế thay vì dùng spinner quay tròn gây chậm mắt.

### 5. Next.js SSR Hydration Safety (Zero Hydration Mismatch)
- Khi đọc cache `localStorage` để tối ưu tải trang, luôn sử dụng mốc `mounted` (`const [mounted, setMounted] = useState(false)` + `useEffect(() => setMounted(true), [])`).
- Trong pass render đầu tiên, Server và Client đều render `<DashboardSkeleton />`, sau đó Client hydrate dữ liệu từ cache ngay tại Frame 1. Tuyệt đối không đọc `localStorage` trực tiếp trong khởi tạo `useState(() => ...)` vì sẽ làm khác biệt HTML giữa Server SSR và Client.


---

## SKILLS (load when relevant)
frontend       → fe/ components, pages, Next.js routing, Tailwind
backend        → be/ API endpoints, middleware, Express modules
ai-compliance  → compliance engine, Gemini, rule engine, RAG
database       → Prisma schema, RLS policies, migrations
security       → auth flows, RBAC, audit log, secrets, file security

skill files: .agents/skills/<name>/SKILL.md
ref docs:    .agents/ref/01-product.md … 10-done.md


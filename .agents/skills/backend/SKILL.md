---
name: backend
description: Build Express.js API endpoints, middleware, modules for Themis LexiGuard. Use when creating/editing BE files in be/src/.
---

# SKILL: Backend

## STACK
runtime: Node.js + Express.js
orm: Prisma (be/prisma/schema.prisma)
db: Supabase PostgreSQL
auth: Supabase JWT validation (verify at middleware, NOT trust FE body)
validation: Zod
bg-jobs: separate jobs/ workers (never long-running in HTTP handler)

## DIR STRUCTURE
be/src/modules/<name>/
  ├── <name>.router.ts      — Express router
  ├── <name>.controller.ts  — HTTP in/out
  ├── <name>.service.ts     — business logic
  ├── <name>.schema.ts      — Zod schemas
  └── <name>.types.ts       — TypeScript types
be/src/middleware/
  ├── auth.ts               — JWT validation + attach user
  ├── organization.ts       — resolve org + check membership
  └── rbac.ts               — role permission check
be/src/jobs/
  ├── legal-sync/
  ├── document-processing/
  └── notifications/

## MODULE LIST
auth | organizations | products | batches | documents
compliance | ai | reports | regulations | notifications | dashboard

## REQUEST PIPELINE
request → auth middleware → org middleware → rbac middleware → controller → service → prisma → response

## AUTH MIDDLEWARE (every protected route)
1. Extract Bearer token from Authorization header
2. Verify JWT with Supabase (issuer, audience, expiration)
3. Extract userId from token payload — NEVER from req.body
4. Attach to req.user

## RBAC MIDDLEWARE
check order:
1. user is member of organization (active status)
2. role has permission for action
3. entity belongs to same organization
reject with 403 if any check fails

## RESPONSE FORMAT
success: { data: T, meta: { requestId: string } }
error:   { error: { code: string, message: string, details?: object, requestId: string } }
always set requestId from middleware

## PAGINATION (all list endpoints)
query params: page, pageSize, search, sort (field:asc|desc), filters
response: { data: items[], meta: { page, pageSize, total, totalPages, requestId } }
always server-side — never return all records

## AUDIT LOG (write after every mutation that matters)
fields: actor_id, action, entity_type, entity_id, before_data, after_data, ip_hash, created_at
trigger on: product/batch CRUD, document upload/replace, check run, report approve, role change

## BACKGROUND JOBS
jobs that must NOT run in HTTP handler:
- document text extraction
- AI compliance analysis
- PDF report generation
- legal regulation sync
- email/notification dispatch
- impact analysis after regulation update
job record needs: id, status, progress, retry_count, error_message, idempotency_key

## FORBIDDEN
- No business logic in router/controller (→ service layer)
- No direct Supabase Admin calls from request handlers without org check
- No skipping RBAC for convenience
- No returning raw Prisma errors to client
- No long-running sync operations inside HTTP request lifecycle

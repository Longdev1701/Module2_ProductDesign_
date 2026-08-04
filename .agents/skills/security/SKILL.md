---
name: security
description: Enforce authentication, authorization, secrets management, file security, and audit logging for Themis LexiGuard. Use when touching auth flows, RBAC, file upload/download, or any code involving secrets.
---

# SKILL: Security

## SECRETS — LOCATION RULES
| Secret | Allowed location |
|---|---|
| SUPABASE_SERVICE_ROLE_KEY | be/ only, never fe/ |
| GEMINI_API_KEY | be/ only |
| DATABASE_URL | be/ only |
| DIRECT_URL | be/ only |
| SUPABASE_ANON_KEY | fe/ allowed (anon key only) |
| SUPABASE_URL | fe/ allowed |

never appear in: git commits, console.log, API responses, frontend bundle

## JWT VALIDATION (every protected BE endpoint)
middleware must:
1. read Authorization: Bearer <token>
2. verify with Supabase JWT (check issuer, audience, exp)
3. extract userId from token.sub — NEVER from req.body.userId
4. on failure → 401 Unauthorized
5. attach req.user = { id, email }

## AUTHORIZATION CHECK ORDER (every endpoint)
1. is user member of target organization? (active status)
2. does user's role allow this action?
3. does the requested entity belong to that organization?
→ fail any → 403 Forbidden + log attempt

## ROLE PERMISSION MAP
action               | owner | manager | analyst | viewer
create product/batch |  ✓   |    ✓    |    ✓    |   ✗
delete product       |  ✓   |    ✓    |    ✗    |   ✗
run check            |  ✓   |    ✓    |    ✓    |   ✗
approve report       |  ✓   |    ✓    |    ✗    |   ✗
manage members       |  ✓   |    ✗    |    ✗    |   ✗
view reports         |  ✓   |    ✓    |    ✓    |   ✓

## FILE SECURITY
- Storage bucket: PRIVATE (no public URLs for documents)
- access: signed URL with short TTL (≤60min)
- log every download: user_id, document_id, timestamp, ip_hash
- validate on upload: MIME type, extension, size limit, checksum, not empty, not encrypted PDF
- sanitize filename before storing
- never return storage_path in API response

## RATE LIMITS (separate per action)
login attempts: 5/min per IP
compliance check: 10/hour per org
AI chat: 30/hour per user
file upload: 20/hour per user
export: 10/hour per user
manual sync: 1/hour per admin

## AUDIT LOG — REQUIRED TRIGGERS
action                    | entity_type
create/update/delete product | product
upload/replace document   | document
run compliance check      | compliance_check
approve report            | report
request report revision   | report
change member role        | organization_member
login failure (≥3)        | auth
manual regulation sync    | sync_run
admin access              | system

audit_log fields: actor_id, action, entity_type, entity_id, before_data(json), after_data(json), request_id, ip_hash, created_at
RLS: AuditLog is append-only — no UPDATE or DELETE policy

## DO NOT LOG
- passwords or password hashes
- full JWT tokens
- service role keys
- full document contents
- full Gemini prompts containing business data

## ONBOARDING (session lifecycle)
register → email verify → create Profile + Organization + Membership(owner) → redirect dashboard
login → validate → set Supabase session → redirect dashboard
logout → invalidate session → clear client cache → redirect login
session expired → 401 → auto redirect login (preserve attempted URL)
protected route → no session → redirect /login?next=<path>
auth route + active session → redirect /dashboard

## FORBIDDEN
- NEVER trust userId from request body
- NEVER skip RBAC because "the UI already prevents it"
- NEVER use public bucket for compliance documents
- NEVER expose service key in any API response
- NEVER log sensitive content
- NEVER allow cross-org data access regardless of role

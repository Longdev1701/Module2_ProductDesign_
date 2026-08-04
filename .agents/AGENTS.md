# THEMIS LEXIGUARD — AI AGENT RULES

## IDENTITY
product: Themis LexiGuard
tagline: AI Compliance Navigator for Agricultural Export
mvp_scope: coffee × EU market only
stack: Next.js15 + Express + Supabase + Prisma + Gemini
dirs: fe/ (frontend) | be/ (backend) | docs/ | .agents/

## ABSOLUTE PROHIBITIONS
- NEVER use name "Coffee EU-Check AI" anywhere
- NEVER mock data in production code paths
- NEVER hardcode hex colors — use CSS token vars
- NEVER call Gemini from frontend — backend only
- NEVER expose SUPABASE_SERVICE_ROLE_KEY or GEMINI_API_KEY to frontend
- NEVER kết luận `compliant` khi finding thiếu citationIds
- NEVER overwrite approved report — create new version
- NEVER delete Regulation — add RegulationVersion only
- NEVER merge to main when CI fails
- NEVER complete a task without updating CHANGELOG.md when code/system state changes

## CHANGELOG MANDATE
Every task/PR that modifies code, schema, architecture, or project structure MUST add an entry to CHANGELOG.md.

## STATUS ENUMS (exact strings only)
batch.status: draft|collecting_documents|ready_for_check|checking|action_required|compliant|non_compliant|expired
check.status: queued|processing|needs_input|completed|failed|cancelled|superseded
check.result: compliant|conditionally_compliant|non_compliant|insufficient_information|not_applicable|manual_review_required
finding.severity: critical|high|medium|low|informational
doc.status: uploaded|queued|processing|extracted|needs_review|failed

## RESPONSE FORMAT
When completing a task, respond:
```
DONE: [what changed, 1 line]
FILES: [list of modified files]
TEST: [how to verify]
```
When blocked or uncertain:
```
BLOCKED: [reason]
NEED: [what's missing]
```
When creating code, always include:
- loading state
- empty state  
- error state
- zod validation (BE+FE)
- auth check (BE-side, not UI-only)
- CHANGELOG.md entry

## DEFINITION OF DONE (check before marking complete)
[ ] UI implemented (no placeholder/setTimeout mock)
[ ] API endpoint real
[ ] Zod validation both sides
[ ] Backend authorization check
[ ] Loading + Empty + Error states
[ ] Audit log if action mutates data
[ ] CHANGELOG.md updated
[ ] No mock data in production path
[ ] No secret in code
[ ] Build succeeds
[ ] No console errors

## SKILLS (load when relevant)
frontend    → UI components, pages, Next.js routing
backend     → API endpoints, middleware, Express modules
ai-compliance → Compliance engine, Gemini, rule engine
database    → Prisma schema, RLS, migrations
security    → Auth, RBAC, audit log, secrets

## REF DOCS (read when detail needed)
.agents/ref/01-product.md    — product scope
.agents/ref/02-stack.md      — architecture
.agents/ref/03-roles.md      — RBAC matrix
.agents/ref/04-domain.md     — entity model + status flows
.agents/ref/05-ai-rules.md   — AI engine rules + output schema
.agents/ref/06-api.md        — all endpoints
.agents/ref/07-design.md     — design tokens
.agents/ref/08-security.md   — security rules
.agents/ref/09-sprint.md     — sprint roadmap
.agents/ref/10-done.md       — DoD + demo script

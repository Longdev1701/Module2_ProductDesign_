---
name: frontend
description: Build Next.js 15 App Router pages, React components, Tailwind UI for Themis LexiGuard. Use when creating/editing FE files in fe/src/.
---

# SKILL: Frontend

## STACK
framework: Next.js 15 App Router
styling: Tailwind CSS v4 (tokens only, no arbitrary values)
state: React Hook Form + Zod (forms) | Context (auth/org/theme only)
icons: lucide-react
animation: motion
router: file-based App Router

## DIR STRUCTURE
fe/src/app/(auth)/          — login, register, onboarding
fe/src/app/(dashboard)/     — all protected pages
fe/src/components/          — shared UI primitives
fe/src/features/<name>/     — feature-scoped components + hooks
fe/src/hooks/               — shared custom hooks
fe/src/lib/                 — api client, utils
fe/src/types/               — shared TypeScript types

## ROUTING RULES
- Protected routes → middleware redirect to /login if no session
- Auth routes → redirect to /dashboard if session exists
- Filter/pagination → store in URL params (not state)
- Dynamic segments: [productId], [batchId], [checkId], [reportId]

## API CALLS
- Always use fe/src/lib/api.ts client (never fetch Supabase DB directly for business logic)
- Supabase direct: auth session, realtime subscription, signed URL only
- Error response shape: { error: { code, message, requestId } }
- Success shape: { data: {}, meta: { requestId } }

## COMPONENT RULES
- Every interactive component needs: loading | empty | error state
- Status/severity → always show icon + text (never color alone)
- Tables → server-side pagination, not client-side filter
- Forms → React Hook Form + Zod schema, disable submit on loading
- Modals → trap focus, Escape closes
- No hardcoded colors — use var(--color-*)

## REQUIRED STATES PER FEATURE
loading: skeleton preferred over spinner for content areas
empty: descriptive message + CTA action button
error: real error message from API, not "Something went wrong"
optimistic: show immediately, revert on failure for mutations

## COLOR TOKENS (use exactly)
primary: var(--color-primary-700)
success: var(--color-success-700)
warning: var(--color-warning-700)
danger: var(--color-danger-700)
text: var(--color-neutral-950)
bg: var(--color-neutral-50)

## FORBIDDEN
- No setTimeout to simulate async
- No hardcoded demo data in components
- No inline style colors
- No direct DB calls from components
- No business logic in components (→ move to hooks or server)

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
fe/src/app/(auth)/                  — login, register, onboarding, reset-password
fe/src/app/(dashboard)/             — root dashboard group
fe/src/app/(dashboard)/(shell)/     — pages with Sidebar + Topbar (dashboard, checks, history, integrity, products, regulations, reports, settings)
fe/src/app/(dashboard)/admin        — standalone full-page Admin Portal
fe/src/app/(dashboard)/pending-access — standalone waiting screen for unassigned users
fe/src/components/                  — shared UI primitives & layout (Sidebar, Topbar, UserDropdown, LegalTrackingWidget)
fe/src/features/<name>/             — feature-scoped components + hooks
fe/src/hooks/                       — shared custom hooks
fe/src/lib/                         — api client, utils
fe/src/types/                       — shared TypeScript types

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
- **Single Responsibility Principle (SRP) Modularization:**
  - Monolithic files (>200 lines) are FORBIDDEN. Split feature pages into focused sub-components under `fe/src/features/<name>/` (e.g. `features/settings/{ProfileSettingsTab.tsx, MemberSettingsTab.tsx, SecuritySettingsTab.tsx, NotificationSettingsTab.tsx, index.tsx}` and `features/auth/{AuthBrandingPanel.tsx, LoginView.tsx, RegisterView.tsx, index.tsx}`).
  - Separate layout components into single-responsibility files: `components/layout/{Sidebar.tsx, Topbar.tsx, UserDropdown.tsx}`.
- **Dynamic Session & RBAC Integration:**
  - Topbar Header MUST fetch active session via `api.get('/auth/me')` and display real user name, initial avatar, active Organization name, and `OrganizationRole` badge (`OWNER` | `MANAGER` | `COMPLIANCE` | `VIEWER`).
  - Settings page MUST display real profile, real enterprise export info, real team members list, and disable edit controls for non-OWNER/MANAGER roles with clear permission badges.
- Every interactive component needs: loading | empty | error state
- Status/severity → always show icon + text (never color alone)
- Tables → server-side pagination, not client-side filter
- Forms → React Hook Form + Zod schema, disable submit on loading
- Modals → trap focus, Escape closes
- No hardcoded colors — use CSS token variables

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

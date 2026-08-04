# 09. Roadmap & Phân công Sprint

## Tổng thời gian ước tính

| Điều kiện | Thời gian |
|---|---|
| 1 người, part-time | 8–12 tuần |
| 1 người, full-time | 6–8 tuần |
| Nhóm 2–3 người | 4–6 tuần cho MVP |
| Prototype demo đơn giản | 2–3 tuần |

## Sprint 0 — Chuẩn hóa dự án (2–3 ngày)

**Mục tiêu:** Repo build ổn định, CI xanh, 10 trang render đúng.

- Chốt tên sản phẩm → **Themis LexiGuard**.
- Chốt MVP cà phê–EU.
- Chuẩn hóa README.
- Migrate FE sang Next.js 15 App Router (Sprint 0 đã xong).
- Thiết lập formatter, lint, CI.
- Chuyển màu hardcode thành CSS token.

## Sprint 1 — Auth & Organization (4–6 ngày)

- Supabase Auth, Profile, Organization, Membership, Role.
- Protected routes, Onboarding.
- RLS, Organization switcher.

**Deliverable:** Đăng ký/đăng nhập, tạo org, mời thành viên, không đọc chéo dữ liệu.

## Sprint 2 — Products & Batches (5–7 ngày)

- Product CRUD, Batch CRUD.
- Filter, Pagination (server-side), Product detail, Batch detail.
- Validation, Audit log, Import CSV cơ bản.

**Deliverable:** Không còn mock data trong ProductsPage. Dữ liệu phân tách theo org.

## Sprint 3 — Document Management (5–8 ngày)

- Private bucket, Signed upload, Document metadata + versioning.
- Preview, Processing status (realtime).
- Text extraction, Structured extraction, Review extracted data.

**Deliverable:** Upload PDF → trích xuất → người dùng xác nhận → lưu version + checksum.

## Sprint 4 — Regulations Library (6–10 ngày)

- Regulation schema + versioning, Manual import.
- Một connector pháp lý đầu tiên, SyncRun.
- Search, Filter, Detail page, Effective date.
- pgvector, Chunking, Embedding.

**Deliverable:** RegulationsPage dùng dữ liệu thật, search/filter hoạt động, có 1 nguồn sync.

## Sprint 5 — Compliance Engine (8–12 ngày)

- ComplianceCheck, Rule engine (MRL, dates, missing docs).
- Applicability, RAG retrieval, Gemini orchestration.
- Structured output, Finding, Citation, Confidence.
- Retry, Progress tracking realtime.

**Deliverable:** Chạy được 1 compliance check cà phê–EU, báo cáo có citation, không pass khi thiếu data.

## Sprint 6 — Report & Remediation (5–7 ngày)

- Report UI, Report versioning, Approval workflow.
- PDF export, Remediation task, Evidence.
- Re-check, Compare versions.

**Deliverable:** Xem/approve báo cáo, finding có task, re-check không ghi đè lịch sử.

## Sprint 7 — Dashboard, History & Integrity (5–7 ngày)

- Dashboard aggregates (dùng API, không tính ở FE).
- Recent checks, Priority queue.
- History filters, Compare checks.
- Integrity rules, Audit timeline.
- Notifications, Realtime.

**Deliverable:** Toàn bộ dashboard dùng data thật, cảnh báo có action, có lịch sử và audit.

## Sprint 8 — Stabilization (5–7 ngày)

- E2E tests, Security tests, AI evaluation.
- Responsive, Accessibility, Performance.
- Error handling, Monitoring (health endpoints).
- Staging, Production deployment.
- Documentation.

**Deliverable:** Demo end-to-end, CI xanh, không lỗi P0, có checklist vận hành.

## Backlog Priority

### P0 — Bắt buộc
Auth, Organization, RLS, Product CRUD, Batch CRUD, Document upload, Compliance check, Rule engine, AI structured output, Regulation citation, Report, Audit log, Error handling, Deployment.

### P1 — Quan trọng
Realtime, Regulations sync, Document extraction, Remediation task, Notification center, Report version, CSV import, Dashboard analytics, Compare checks.

### P2 — Sau MVP
MFA, Google login, Email digest, Web push, Multi-language, Advanced OCR, Multiple AI providers, Custom rule builder, Enterprise SSO, Public report share.

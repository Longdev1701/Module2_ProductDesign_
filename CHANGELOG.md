# CHANGELOG

Tất cả các thay đổi quan trọng của dự án **Themis LexiGuard** sẽ được ghi chép lại trong file này theo định dạng chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

> **QUY TẮC BẮT BUỘC:** Mọi thao tác nâng cấp, cải thiện, thêm tính năng hoặc sửa lỗi liên quan tới hệ thống ĐỀU PHẢI được ghi lại tại đây trước khi kết thúc task.

---

## [Unreleased]

- Bổ sung hỗ trợ biến môi trường Supabase key naming mới (`SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL`) đồng thời giữ tương thích với `SUPABASE_ANON_KEY` và `SUPABASE_SERVICE_ROLE_KEY`.
- Sửa lỗi terminal Frontend do ESLint/TypeScript strict: thay `any` bằng type dùng chung, sửa `Input` dùng `useId`, sửa hook effect trong Admin/Settings, và xác nhận `next build` chạy thành công; Backend `tsc --noEmit` chạy thành công.
- Tái cấu trúc lại Hệ thống Điều hướng Shell Layout `src/app/(dashboard)/(shell)/` chứa toàn bộ các trang tính năng (`/dashboard`, `/checks/new`, `/history`, `/integrity`, `/products`, `/regulations`, `/reports`, `/settings`) tích hợp sẵn **Sidebar** bên trái và **Topbar** ở trên.
- Loại bỏ thư mục mã nguồn cũ `_legacy` để làm sạch dự án, ngăn ngừa lỗi trùng lặp module hoặc type check mâu thuẫn trong IDE/TypeScript compiler.
- Bổ sung Google Fonts link (`Inter` + `Material Symbols Outlined`) tại `<head>` của `RootLayout` (`fe/src/app/layout.tsx`), giúp khôi phục hiển thị biểu tượng icon sắc nét trên toàn hệ thống (không còn bị hiển thị dạng chữ thuần).
- Khôi phục giao diện Dashboard tổng quan gốc phong phú (`fe/src/app/(dashboard)/(shell)/dashboard/page.tsx`) kết hợp với dữ liệu doanh nghiệp từ API:
  - Bộ 4 thẻ thống kê trực quan (Tổng kiểm tra, Đạt yêu cầu, Cảnh báo, Nghiêm trọng).
  - Sơ đồ cột Phân tích rủi ro thị trường (US / CN GACC).
  - Bảng Lịch sử Thẩm định tuân thủ sầu riêng gần đây.
  - Widget `LegalTrackingWidget` được cập nhật chuẩn ngữ cảnh Nghị định thư GACC Sầu riêng sang Trung Quốc (Mã HS: 0810.60.00).
- Khắc phục sự cố Prisma Client DLL bị khóa EPERM bằng cách tái khởi chạy môi trường build và `prisma generate` sạch sẽ, đưa dự án về trạng thái **0 lỗi TypeScript (0 errors)** ở cả Frontend và Backend.
- Bổ sung thanh Topbar Quản trị và nút **Đăng xuất (Logout)** nổi bật ở tất cả các trang (`/admin`, `/dashboard`, `/pending-access`, `/settings`).
- Bổ sung nút **🏠 Quay về Dashboard** (`/dashboard`) xuất hiện trực tiếp trên Topbar và UserDropdown menu dành cho tất cả các vai trò (`OWNER`, `MANAGER`, `COMPLIANCE`, `VIEWER`, `PLATFORM_ADMIN`) giúp quay lại Dashboard mà vẫn giữ phiên đăng nhập.
- Bổ sung nút **⚙️ Admin Portal** điều hướng nhanh dành cho tài khoản Admin khi ở trang User Dashboard.
- Bổ sung nút **⚙️ Cài đặt & Phân quyền** (`/settings`) kết nối trực tiếp trên thanh điều hướng Dashboard.
- Khôi phục giao diện Trang Đăng Nhập / Đăng Ký gốc với panel thương hiệu bên trái (Logo Themis LexiGuard, slogan *"Precision in Law"*, các huy hiệu GACC & EUDR, AI Gemini) kết nối API Backend thực tế.
- Khôi phục và tạo mới đầy đủ toàn bộ 16 đường dẫn trang trong `src/app/(dashboard)` gồm: `/settings`, `/dashboard`, `/admin`, `/products`, `/products/[id]`, `/checks/new`, `/regulations`, `/reports/[id]`, `/history`, `/integrity` với bọc `Suspense` chuẩn Next.js App Router.
- Hiển thị đầy đủ Badge phân quyền (`PLATFORM_ADMIN`, `OWNER`, `MANAGER`, `COMPLIANCE`), Họ tên và Email tài khoản đang đăng nhập ở Topbar.

### Added
- Add frontend legal-update widget states, Zod API validation, and Supabase Realtime refresh support.
- Khởi tạo thư mục quy tắc và kiến trúc `.agents/` chuẩn hóa theo Antigravity format.
- Tạo bộ skill phân tách rõ ràng: `frontend`, `backend`, `ai-compliance`, `database`, `security`.
- Tạo các tài liệu tham chiếu chi tiết trong `.agents/ref/` (từ `01-product.md` đến `10-done.md`).
- Tạo file `AGENTS.md` tại root tổng hợp toàn bộ quy tắc hệ thống (Team, FE, BE, Server/Worker, DB, API).
- Thêm quy tắc bắt buộc cập nhật `CHANGELOG.md` cho mọi thay đổi dự án.
- Phân rã toàn bộ Use Case chi tiết của hệ thống tại thư mục `docs/usecases/` (UC-00 đến UC-10).
- Tạo tài liệu tổng hợp kiến trúc hệ thống, ma trận RBAC, ma trận CRUD và sơ đồ UML đầy đủ tại `docs/usecases/00-system-overview.md`.
- Xuất toàn bộ sơ đồ UML tiêu chuẩn dưới dạng file `.uml` PlantUML tại thư mục `docs/uml/` (`use-case-diagram.uml`, `business-sequence.uml`, `class-diagram.uml`, `system-architecture.uml`).
- Khởi tạo ảnh minh họa trực quan Use Case Diagram Flow tại `docs/assets/usecase_diagram_flow.png`.
- Bổ sung bộ 3 sơ đồ trực quan hoàn chỉnh tại `docs/assets/`:
  1. `overview_usecase_diagram.png` (Sơ đồ Use Case Tổng quát hệ thống)
  2. `breakdown_usecase_tree_diagram.png` (Sơ đồ Phân rã Cây chức năng 3 cấp Level 0 -> Level 3)
  3. `detailed_compliance_flow_diagram.png` (Sơ đồ Luồng xử lý Chi tiết từng bước AI Compliance Check Engine)
- Khởi tạo sơ đồ trực quan User Story Map dạng bảng dán thẻ Sticky Notes gọn gàng tại `docs/assets/user_story_map_board.png` hỗ trợ phân rã lộ trình phát triển Release 1 (MVP), Release 2 và Release 3.
- Cập nhật `be/prisma/schema.prisma` hoàn chỉnh theo chuẩn LCMS: Tách `Profile` & `OrganizationMember`, bổ sung đầy đủ thông tin Doanh nghiệp Xuất khẩu Nông sản, chuẩn hóa `ComplianceResult` enum (loại bỏ PASS/FAIL/WARNING) và bổ sung `ReportStatus` versioning.
- Xây dựng Backend Auth & Organization Modules (`be/src/modules/auth/`, `be/src/modules/organization/`) gồm Zod Schema, Service, Controller, Router với Supabase Auth & Audit Log.
- Thay thế 1:1 toàn bộ giao diện Đăng nhập / Đăng ký từ thiết kế của `fe/fe` (`Input.tsx`, `Button.tsx`, `AuthPage.tsx` với Tailwind v4 `--color-primary: #00236f` theme), kết nối với Backend API và lược bỏ các nút bấm Social Login chưa có trong phạm vi MVP (tuân thủ quy tắc No Mock Data).
- Tách biệt hoàn toàn Kiến trúc Phân quyền 2 Tầng (Two-Tier Authorization): Tầng Nền tảng (`PlatformRole`: `USER`, `SUPPORT`, `PLATFORM_ADMIN`, `SUPER_ADMIN`) và Tầng Doanh nghiệp (`OrganizationRole`: `OWNER`, `MANAGER`, `COMPLIANCE`, `VIEWER`). Triển khai `platformRbacMiddleware` và `rbacMiddleware` bảo vệ dữ liệu doanh nghiệp an toàn tuyệt đối.
- Cập nhật biến môi trường Supabase production thực tế, đồng bộ database schema qua Prisma `db push` và thực thi thành công 100% (6/6) bộ kịch bản kiểm thử API thực tế (Đăng ký, Đăng nhập sai pass, Đăng nhập đúng cấp JWT, Onboarding Doanh nghiệp XNK, Xác nhận Role OWNER & Kiểm thử bảo mật 401 Unauthorized).
- Cập nhật tài liệu hướng dẫn `README.md` và `docs/usecases/UC-00-auth-rbac.md` với thông tin tài liệu kiểm thử mẫu đã được khởi tạo sẵn trên Supabase Database.
- Tích hợp 100% dữ liệu thực từ Backend API vào Topbar Header & Trang Cài Đặt (Settings Page): Hiển thị tên thật, avatar ký tự đầu, Tên Doanh nghiệp đang hoạt động, Badge Vai trò Phân quyền (`OWNER` / `MANAGER` / `COMPLIANCE` / `VIEWER`), Danh sách Nhân sự thực tế & Form Mời thành viên mới theo ma trận phân quyền.
- Cập nhật bộ quy tắc Skill `.agents/skills/frontend/SKILL.md` (bắt buộc nguyên tắc Đơn nhiệm SRP cho Frontend & tích hợp session RBAC thực tế), đồng thời cập nhật toàn bộ tài liệu usecase `docs/usecases/UC-00-auth-rbac.md` và `README.md` khớp 100% với kiến trúc đã nâng cấp.
- Hoàn thiện 100% tính năng Đăng xuất (`POST /api/auth/logout`) và Khôi phục/Đặt lại mật khẩu (`POST /api/auth/forgot-password`, `POST /api/auth/reset-password`) ở cả Backend API & Giao diện Frontend (`ForgotPasswordView.tsx`, `/reset-password/page.tsx`), tích hợp Audit Log ghi vết bảo mật.
- Cập nhật toàn bộ tài liệu kiến trúc & usecase `docs/usecases/UC-00-auth-rbac.md` và `README.md` sang mô hình **Admin-Provisioned Enterprise SaaS**: Cấm User thường tự tạo Doanh nghiệp; chuyển trách nhiệm tạo Doanh nghiệp và cấp quyền cho Platform Admin (`SUPER_ADMIN` / `PLATFORM_ADMIN`). User mới được phân luồng tự động về màn hình Chờ Cấp Quyền (`/pending-access`).
- Tách nhỏ toàn bộ mã nguồn Admin Portal Feature theo nguyên tắc Đơn nhiệm (SRP) vào `fe/src/features/admin/`: `AdminHeader.tsx` (Header & Search), `AdminOrgTab.tsx` (Tạo & Quản lý Doanh nghiệp), `AdminUserTab.tsx` (Cấp quyền & Quản lý Nhân sự), `index.tsx` (Main Orchestrator), đảm bảo mã nguồn gọn gàng, dễ bảo trì và mở rộng.
  6. Tách biệt hoàn toàn `PlatformRole` (`SUPER_ADMIN`, `PLATFORM_ADMIN`, `SUPPORT`) với `OrganizationRole` (`OWNER`, `MANAGER`, `COMPLIANCE`, `VIEWER`) để ngăn ngừa rò rỉ dữ liệu chéo (Cross-tenant Data Leakage).

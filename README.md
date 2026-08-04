# Module2 Product Design – Themis LexiGuard Compliance Navigator

Đồ án Module 2 xây dựng giao diện nền tảng AI hỗ trợ doanh nghiệp theo dõi tuân thủ pháp lý, quản lý lô hàng và đánh giá rủi ro xuất khẩu nông sản theo nhiều thị trường (EU, USA, Nhật Bản, Trung Quốc).

## Mục tiêu đồ án

- Chuẩn hóa quy trình kiểm tra tuân thủ cho sản phẩm/lô hàng.
- Hỗ trợ tư vấn pháp lý bằng AI theo ngữ cảnh từng hồ sơ.
- Cảnh báo sớm thay đổi quy định và rủi ro trong chuỗi cung ứng.
- Trực quan hóa kết quả bằng dashboard, báo cáo và lịch sử thẩm định.

## Chức năng chính hiện có

- **Đăng nhập / đăng ký / quên mật khẩu / OTP**.
- **Dashboard tổng quan pháp lý**: KPI, biểu đồ rủi ro, cảnh báo.
- **Tư vấn AI (chat)**: mô phỏng hội thoại, phân tích và trả báo cáo.
- **Giám sát liêm chính**: theo dõi trạng thái audit và cảnh báo pháp lý.
- **Thư viện quy định quốc tế**: tra cứu văn bản và dòng cập nhật luật.
- **Quản lý sản phẩm & lô hàng**: danh mục, lọc, truy cập chi tiết.
- **Chi tiết sản phẩm**: yêu cầu MRL, tiêu chuẩn thị trường mục tiêu.
- **Lịch sử thẩm định**: tra cứu các lần kiểm tra theo lô hàng.
- **Báo cáo phân tích**: mức độ tuân thủ, sai lệch, khuyến nghị xử lý.
- **Trang cài đặt hệ thống**: tài khoản, thông báo, API & tích hợp.

## Công nghệ sử dụng

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Backend**: Node.js + Express.js
- **Database & ORM**: PostgreSQL (Supabase) + Prisma
- **Authentication**: Supabase Auth
- **UI**: Tailwind CSS 4, Lucide Icons, Framer Motion
- **AI Core**: Google Gemini 1.5

## Cấu trúc thư mục chính

```text
Themis-LexiGuard/
├── fe/                # Frontend (Next.js 15 App Router)
│   ├── app/           # Pages & Layouts (App Router)
│   ├── components/    # UI Components & Widgets
│   ├── features/      # Feature modules
│   └── lib/           # Utilities & API Client
├── be/                # Backend (Express.js)
│   ├── src/           # Controllers, Services, Middlewares
│   ├── prisma/        # Database Schema & Migrations
│   └── jobs/          # Background tasks (Sync, AI processing)
└── docs/              # Tài liệu hệ thống & HDSD Agents
```

## Hướng dẫn chạy dự án

### 1) Chạy Backend (API Server)
```bash
cd be
npm install
npm run db:generate    # Khởi tạo Prisma Client
npm run dev            # Chạy ở http://localhost:3001
```

### 2) Chạy Frontend (Web UI)
```bash
cd fe
npm install
npm run dev            # Chạy ở http://localhost:3000
```

```bash
npm run build
```
## Scripts (Ví dụ)

**Frontend (`fe/`)**:
- `npm run dev`: Chạy Next.js dev server.
- `npm run build`: Build production.
- `npm run start`: Chạy server production.

**Backend (`be/`)**:
- `npm run dev`: Chạy Express server.
- `npm run db:generate`: Khởi tạo Prisma Client.
- `npm run db:migrate`: Chạy migration database.

## Phân công vai trò (Team 7 người)

| STT | Họ và Tên | Vai trò dự kiến | Nhiệm vụ chính |
|:---:|---|---|---|
| 1 | **Phạm Thành Long** | Tech Lead & AI Engineer | Setup kiến trúc (FE/BE), kết nối Supabase, Prisma, tích hợp Gemini AI và duyệt PR. |
| 2 | **Đàm Công Tú** | Product Owner / QA | Viết User Stories, kịch bản test, chuẩn bị dữ liệu pháp lý (Luật EU) & test UX/UI. |
| 3 | **Chăm Rốch Thi** | Frontend (Core & Auth) | Dựng layout (Sidebar, Topbar), Next.js Routing, tích hợp trang Đăng nhập / Đăng ký. |
| 4 | **Huỳnh Hoàng Quân** | Frontend (Data UI) | Code giao diện Dashboard (Biểu đồ, KPI), Thư viện pháp lý và Giám sát liêm chính. |
| 5 | **Nguyễn Tiến Thành** | Frontend (Forms & Ops) | Code giao diện Quản lý Sản phẩm, Lô hàng, upload file chứng từ và Báo cáo. |
| 6 | **Hà Anh Tuấn** | Backend (API & DB) | Xây dựng RESTful API (Express), viết các logic CRUD cho Products, Batches bằng Prisma. |
| 7 | **Tạ Lê Anh Bảo** | Backend (Services & Jobs) | Viết Middleware (Auth, RBAC), logic bóc tách dữ liệu (OCR) và cron jobs (đồng bộ luật). |

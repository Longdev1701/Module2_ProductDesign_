# 02. Stack công nghệ & Kiến trúc thư mục

> Stack này đã được xác nhận. KHÔNG tự ý thay đổi mà không có sự đồng thuận của cả nhóm.

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Frontend | Next.js 15 (App Router) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| ORM | Prisma |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| AI | Google Gemini (qua backend — KHÔNG gọi trực tiếp từ FE) |
| Vector search | pgvector |
| Deploy FE | Vercel |
| Deploy BE | Render |
| Form | React Hook Form + Zod |

## Kiến trúc thư mục chuẩn

```
Module2/
├── fe/                    # Next.js 15 App Router
│   └── src/
│       ├── app/           # Route groups: (auth)/, (dashboard)/
│       ├── components/    # Shared UI components
│       ├── features/      # auth/, products/, batches/, compliance/, reports/, ...
│       ├── hooks/
│       ├── lib/
│       └── types/
│
├── be/                    # Express.js Backend
│   ├── src/
│   │   ├── middleware/
│   │   ├── modules/       # auth/, products/, batches/, compliance/, ai/, reports/, ...
│   │   ├── jobs/          # background workers: legal-sync, doc-processing, ...
│   │   └── index.ts
│   └── prisma/
│       └── schema.prisma
│
└── docs/
    ├── plan.md            # Master plan — source of truth
    ├── AGENTS.md          # Index file
    └── guidelines/        # Các file này
```

## Nguyên tắc truy cập dữ liệu

Frontend **chỉ được** gọi Supabase trực tiếp cho:
- Authentication & Session.
- Realtime subscription.
- Upload qua Signed URL.

Tất cả nghiệp vụ khác **phải đi qua Express API**:
- Tạo / sửa / xóa sản phẩm, lô hàng.
- Chạy compliance check.
- Phê duyệt báo cáo.
- Quản lý thành viên.
- Xóa dữ liệu.

## Route chính (Next.js App Router)

```
(auth)/
  login/
  register/
  onboarding/

(dashboard)/
  dashboard/
  products/
  products/[productId]/
  batches/[batchId]/
  checks/new/
  checks/[checkId]/
  reports/[reportId]/
  history/
  regulations/
  integrity/
  settings/profile/
  settings/organization/
  settings/members/
```

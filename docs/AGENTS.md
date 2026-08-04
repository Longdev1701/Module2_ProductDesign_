# AGENTS.md — Themis LexiGuard Compliance Navigator

> Đây là file index bắt buộc đọc đầu tiên.
> Mọi AI agent và thành viên nhóm phải nắm rõ các tài liệu dưới đây trước khi làm việc.

---

## Tổng quan nhanh

| Thông tin | Giá trị |
|---|---|
| **Tên sản phẩm** | Themis LexiGuard |
| **Mô tả** | AI Compliance Navigator for Agricultural Export |
| **MVP** | Cà phê — EU |
| **Stack** | Next.js 15 · Express.js · Supabase · Prisma · Google Gemini |

---

## Tài liệu hướng dẫn

Đọc theo thứ tự khi bắt đầu sprint mới hoặc onboarding thành viên:

| File | Nội dung |
|---|---|
| [01-product.md](../.agents/01-product.md) | Định danh, mục đích, phạm vi MVP |
| [02-stack.md](../.agents/02-stack.md) | Stack công nghệ, kiến trúc thư mục, nguyên tắc truy cập data |
| [03-roles.md](../.agents/03-roles.md) | RBAC, ma trận quyền, RLS |
| [04-domain.md](../.agents/04-domain.md) | Trạng thái nghiệp vụ, domain model, entity relationship |
| [05-ai-rules.md](../.agents/05-ai-rules.md) | Quy tắc AI, structured output schema, confidence threshold |
| [06-api.md](../.agents/06-api.md) | Chuẩn response, danh sách endpoint |
| [07-design.md](../.agents/07-design.md) | Color token, typography, component bắt buộc |
| [08-security.md](../.agents/08-security.md) | Secrets, JWT, audit log, rate limit |
| [09-sprint.md](../.agents/09-sprint.md) | Roadmap Sprint 0–8, backlog priority |
| [10-done.md](../.agents/10-done.md) | Definition of Done, quy tắc nhóm, kịch bản demo |

---

## 3 quy tắc quan trọng nhất

1. **Không có mock data trong production path.**
2. **Không có citation = không lưu finding.**
3. **Không có secrets trong frontend bundle.**

---

> Nguồn sự thật tối thượng: [plan.md](./plan.md) (3249 dòng — master design document).

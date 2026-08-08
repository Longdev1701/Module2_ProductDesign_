# CHANGELOG

Tất cả các thay đổi quan trọng của dự án **Themis LexiGuard** sẽ được ghi chép lại trong file này theo định dạng chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

> **QUY TẮC BẮT BUỘC:** Mọi thao tác nâng cấp, cải thiện, thêm tính năng hoặc sửa lỗi liên quan tới hệ thống ĐỀU PHẢI được ghi lại tại đây trước khi kết thúc task.

---

## [Unreleased]

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

### Changed
- Cấu trúc lại toàn bộ tài liệu `README.md` dựa theo câu chuyện sản phẩm, bối cảnh xuất khẩu cà phê sang EU, 7 điểm nghẽn/vấn đề cần giải quyết, 5 giá trị cốt lõi, sơ đồ kiến trúc tổng quan & luồng nghiệp vụ Mermaid, bảng ma trận phân quyền RBAC, hướng dẫn biến môi trường chi tiết, quy tắc kỹ thuật và bảng phân công vai trò nhiệm vụ chi tiết của 7 thành viên nhóm.
- Dọn dẹp triệt để các ký tự xung đột git merge (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) tồn đọng trong `README.md`, chuẩn hóa định dạng Markdown đẹp và sạch nhất.


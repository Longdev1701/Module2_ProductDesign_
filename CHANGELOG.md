# CHANGELOG

Tất cả các thay đổi quan trọng của dự án **Themis LexiGuard** sẽ được ghi chép lại trong file này theo định dạng chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

> **QUY TẮC BẮT BUỘC:** Mọi thao tác nâng cấp, cải thiện, thêm tính năng hoặc sửa lỗi liên quan tới hệ thống ĐỀU PHẢI được ghi lại tại đây trước khi kết thúc task.

---

## [Unreleased]

### Added
- Khởi tạo thư mục quy tắc và kiến trúc `.agents/` chuẩn hóa theo Antigravity format.
- Tạo bộ skill phân tách rõ ràng: `frontend`, `backend`, `ai-compliance`, `database`, `security`.
- Tạo các tài liệu tham chiếu chi tiết trong `.agents/ref/` (từ `01-product.md` đến `10-done.md`).
- Tạo file `AGENTS.md` tại root tổng hợp toàn bộ quy tắc hệ thống (Team, FE, BE, Server/Worker, DB, API).
- Thêm quy tắc bắt buộc cập nhật `CHANGELOG.md` cho mọi thay đổi dự án.

### Changed
- Cấu trúc lại toàn bộ tài liệu `README.md` dựa theo câu chuyện sản phẩm, bối cảnh xuất khẩu cà phê sang EU, 7 điểm nghẽn/vấn đề cần giải quyết, 5 giá trị cốt lõi, sơ đồ kiến trúc tổng quan & luồng nghiệp vụ Mermaid, bảng ma trận phân quyền RBAC, hướng dẫn biến môi trường chi tiết, quy tắc kỹ thuật và bảng phân công vai trò nhiệm vụ chi tiết của 7 thành viên nhóm.
- Dọn dẹp triệt để các ký tự xung đột git merge (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) tồn đọng trong `README.md`, chuẩn hóa định dạng Markdown đẹp và sạch nhất.







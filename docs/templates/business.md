# 📋 TEMPLATE: BUSINESS SPECIFICATION (business.md)

> **Hướng dẫn**: Dùng mẫu này để mô tả luồng nghiệp vụ cốt lõi, quy tắc kiểm tra tuân thủ và tích hợp REST API cho ứng dụng di động / web.

---

## 🎯 1. QUY TRÌNH NGHIỆP VỤ (BUSINESS WORKFLOW)
- **Tên bài toán / Nghiệp vụ**: [Thẩm định Tuân thủ Xuất khẩu Sầu riêng GACC - HS 0810.60.00]
- **Các bước thực hiện**:
  1. Bước 1: [Xem Ra-da Quy định & Cảnh báo Cadmium GB 2762-2022]
  2. Bước 2: [Quét / Nạp 4 Khóa chứng thư KCS thực địa (Phyto, Lab, C/O, Packing list)]
  3. Bước 3: [Tra cứu sản lượng Lô hàng, Định giá tiền cont & Mã băm SHA-256 niêm phong]

---

## 🔌 2. DANH SÁCH REST API BACKEND
- `POST /api/auth/login`: Xác thực tài khoản doanh nghiệp.
- `GET /api/dashboard/summary`: Lấy thông số KPI dòng tiền và cảnh báo điểm mù.
- `GET /api/batches`: Danh sách lô hàng xuất khẩu.
- `POST /api/batches/:id/documents`: Nạp chứng từ 4 khóa tuân thủ.

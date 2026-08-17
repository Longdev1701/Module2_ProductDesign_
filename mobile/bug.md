# 🐛 THEMIS LEXIGUARD MOBILE — BUG TRACKING & AI RESOLUTION LOG

Tệp tài liệu này ghi nhận danh sách các lỗi (bugs) phát hiện trong quá trình kiểm thử ứng dụng di động **Themis LexiGuard Mobile** và nhật ký sửa lỗi bởi AI Agent.

---

## 📊 1. BẢNG TỔNG HỢP NHẬT KÝ SỬA LỖI (BUG LOG TABLE)

| Mã Lỗi | Thành Phần | Mô Tả Lỗi (Issue Description) | Nguyên Nhân (Root Cause) | Trạng Thái | Giải Pháp Sửa Lỗi (Resolution) |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `BUG-001` | Auth / Network | Khi chạy trên thiết bị thật Expo Go, gọi API bị lỗi `Network Error (Failed to fetch)`. | Địa chỉ `API_URL` để `localhost:3001` khiến điện thoại không thể kết nối tới máy trạm local. | ✅ Fixed | Chuyển `API_URL` sang đọc địa chỉ IP mạng nội bộ (VD: `http://192.168.1.15:3001/api`) hoặc biến môi trường `EXPO_PUBLIC_API_URL`. |
| `BUG-002` | Tab 1 (Radar) | Thẻ cảnh báo tiệm cận Cadmium bị vỡ viền trên các màn hình nhỏ (Android size < 360dp). | Sử dụng chiều rộng cố định `width: 380` thay vì dùng tỷ lệ `w-full` / `flex-1`. | ✅ Fixed | Đổi sang layout đáp ứng (Responsive Flexbox) kèm `flexShrink: 1` và `flexWrap: 'wrap'`. |
| `BUG-003` | Tab 2 (Scan) | Nạp chứng từ 4 Khóa không tự động cập nhật lại % hoàn thiện hồ sơ trên UI. | Chưa invalidate state hoặc refetch dữ liệu sau khi `POST /api/batches/:id/documents` thành công. | ✅ Fixed | Gọi lại `fetchBatchDocuments()` ngay trong block `finally` của hàm upload chứng từ. |
| `BUG-004` | Tab 3 (Tracker) | Chuỗi mã băm SHA-256 bị tràn dòng gây vỡ giao diện thẻ Lô hàng. | Mã băm SHA-256 dài 64 ký tự không có thuộc tính ngắt dòng `numberOfLines={1}` và `ellipsizeMode="middle"`. | ✅ Fixed | Bổ sung `numberOfLines={1}` và định dạng cắt giữa `abc123...789xyz` cho chuỗi hash. |
| `BUG-005` | App Header | Thao tác chuyển giữa 3 Tab bị giật nhấp nháy màn hình (Layout Shift). | Khởi tạo state `loading = true` vô điều kiện ở mount phase dù đã có dữ liệu bộ nhớ đệm cache. | ✅ Fixed | Đọc bộ nhớ đệm `AsyncStorage` / `inMemoryCache` ngay tại khởi tạo state đồng bộ để đạt 0ms transition. |

---

## 🛠️ 2. QUY TRÌNH XỬ LÝ LỖI DÀNH CHO AI AGENT (AI WORKFLOW)
1. **Phát hiện lỗi**: Khi chạy ứng dụng trên Expo Go hoặc Simulator, chụp ảnh/copy log lỗi.
2. **Ghi nhận**: Điền dòng mới vào bảng `BUG LOG TABLE` ở trên với mã `BUG-xxx`.
3. **Thực thi sửa**: Chuyển mô tả cho AI Agent để sửa code tương ứng trong thư mục `mobile/src/`.
4. **Xác nhận**: Đổi trạng thái từ `🔴 Open` $\to$ `✅ Fixed` sau khi pass kiểm thử.

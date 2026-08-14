# THEMIS LEXIGUARD MOBILE — PROMPT: TAB 5 (AI LEGAL ASSISTANT) & NOTIFICATIONS

## 1. Màn hình Trợ lý Pháp lý AI (Tab 5: `chat.tsx`)

**Mục tiêu:** Cung cấp giao diện chat AI để người dùng hỏi nhanh các quy định pháp luật (ví dụ: "MRL sầu riêng đi Trung Quốc là bao nhiêu?").

### UI/UX & Layout
- **Header:** Tiêu đề "AI Legal Assistant" với logo Themis Shield. Thiết kế header dạng kính mờ (Glassmorphism).
- **Khu vực Chat (Chat List):** 
  - Các bong bóng chat (Chat Bubbles) nổi (Elevated) với bóng đổ cực mềm (`shadow-sm` hoặc `shadow-md`).
  - Lời của AI: Căn trái, Avatar AI hình tròn xanh đậm, nền bong bóng màu xám nhạt/trắng.
  - Lời của User: Căn phải, nền bong bóng dải màu gradient (Themis Blue to Dark Blue).
- **Thanh nhập liệu (Input Bar):** 
  - Đặt dưới cùng, ngay trên Bottom Navigation. 
  - Có các nút: Đính kèm tài liệu (Ghim), Voice/Micro, và nút Send to đùng phát sáng (Glow effect).
  - Background của khu vực nhập liệu có hiệu ứng Blur.

---

## 2. Modal Trung tâm Thông báo (`notifications.tsx`)

**Mục tiêu:** Hiển thị các cảnh báo thay đổi luật pháp (Regulation update) hoặc trạng thái lô hàng.

### UI/UX & Layout
- **Header:** Nút Back mũi tên bên trái, Tiêu đề "Notification Center" ở giữa, Nút "Đánh dấu đã đọc" (Double Check) bên phải.
- **Danh sách Thông báo (List):**
  - Nhóm theo thời gian: "Hôm nay", "Hôm qua".
  - Mỗi thông báo là một Thẻ (Card) bo góc tròn (`rounded-3xl` / 24px) màu trắng nổi trên nền xám nhạt `#f7f9fb`.
  - Icon Badge bên trái: 
    - 🔴 Đỏ (Critical): Cho Cảnh báo Rủi ro cao / Bị đình chỉ lô hàng.
    - 🟠 Cam (Warning): Cho cảnh báo thay đổi chuẩn MRL sắp tới.
    - 🔵 Xanh dương (Info): Tin nhắn cập nhật / App update.

---

## 3. Modal Tải lên Minh chứng Khắc phục (`evidence-upload.tsx`)

**Mục tiêu:** Dành cho nhân viên hiện trường (kho/cảng) chụp ảnh báo cáo hoàn thành Nhiệm vụ khắc phục (Remediation Task).

### UI/UX & Layout
- **Thẻ Nhiệm vụ (Task Card):** Nằm trên cùng, bo góc, nền xám nhạt, hiển thị chi tiết việc cần làm (VD: "Cập nhật nhãn dán cho Lô Sầu riêng #RD4567"). Có Status Badge "In Progress" (Cam).
- **Khu vực Upload:**
  - Một khối (Block) hình vuông/chữ nhật lớn ở giữa màn hình.
  - Viền nét đứt (Dashed border).
  - Background: Glassmorphism (Kính mờ) hoặc gradient rất nhạt tạo cảm giác có thể bấm vào.
  - Icon Đám mây/Camera lớn ở giữa với dòng text "Tap to take photo or upload evidence".
- **Nút Hành động:** Nút "SUBMIT EVIDENCE" bự ở dưới cùng, trải dài toàn chiều ngang, màu Gradient Xanh Themis, bo góc cực tròn.

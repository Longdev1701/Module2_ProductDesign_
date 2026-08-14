# PROMPT 1:1 — TAB 4: QUẢN LÝ TÀI KHOẢN CÁ NHÂN (ACCOUNT MANAGEMENT)

---

## 📌 Prompt Template (Sao chép đoạn dưới đây gửi cho AI):

```markdown
Hãy xây dựng màn hình Tab 4 (Account Management) cho ứng dụng React Native / Expo (`app/(tabs)/account.tsx`) dựa trên phong cách Premium Design, với hiệu ứng nổi (Elevated) và Glassmorphism.

### 1. Yêu cầu Cấu trúc & Layout Premium Design

#### A. Header Cá Nhân (Profile Header Card)
- Nền màn hình tổng thể: Xám nhạt hiện đại `#f7f9fb`.
- Header không dùng thanh Navigation Bar mặc định mà sử dụng một Card nổi bật ở trên cùng.
- Profile Card:
  - Background: Dải màu Gradient từ Xanh Themis (`#00236f`) sang `#003299`, bo góc tròn lớn `rounded-b-3xl`, đổ bóng lan tỏa `shadow-blue-900/20`.
  - Padding: p-6, pt-12 (để chừa chỗ cho StatusBar).
  - Nội dung Flex Row:
    - Bên trái: Avatar hình tròn lớn (kích thước 64x64), viền trắng dày 2px. Nếu không có ảnh dùng Avatar chữ cái đầu tiên (Text trắng, nền `#0047ab`).
    - Bên phải (Thông tin):
      - Tên hiển thị: `Nguyễn Văn A` (Text trắng, font-bold text-xl).
      - Vai trò: `QA/QC Manager` (Badge nền `bg-white/20`, text trắng, px-2 py-1 rounded-md text-xs mt-1).
      - Công ty: `Công ty CP Nông Sản Việt` (Text mờ `text-blue-100`, text-sm mt-1).

#### B. Danh sách Tùy chọn & Cài đặt (Settings Menu List)
- Nằm phía dưới Profile Card, hiển thị dưới dạng các Khối (Blocks) bo góc `rounded-3xl` màu trắng `#ffffff`, đổ bóng siêu mềm `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`, margin 16px.
- Áp dụng hiệu ứng nhấn (Pressable) với phản hồi rung (Haptic feedback) và scale down.

**Block 1: Công việc & Lịch sử**
- Mục 1: `Lịch sử quét tài liệu` (Icon Document/History bên trái màu Xám đậm nền xám nhạt, mũi tên ChevronRight bên phải).
- Mục 2: `Nhiệm vụ cần xử lý` (Icon CheckSquare màu Hổ phách Amber, kèm Badge đỏ hiển thị số `3` task đang chờ).

**Block 2: Cài đặt Hệ thống**
- Mục 1: `Nhận cảnh báo pháp lý (Push Notifications)` (Icon Bell màu Themis Blue, bên phải là Toggle Switch - Switch màu Xanh dương bật on).
  - *Lưu ý UX:* Nút Toggle này rất quan trọng để nhận cảnh báo Legal Radar.
- Mục 2: `Đổi mật khẩu` (Icon Lock, ChevronRight).
- Mục 3: `Ngôn ngữ (Tiếng Việt)` (Icon Globe).

**Block 3: Đăng xuất**
- Nút Đăng xuất: Không dùng nền đỏ toàn bộ mà dùng nền trắng trong suốt hoặc xám nhạt, Text màu Đỏ `#EF4444`, font-bold, căn giữa. Khi bấm có Alert confirm.

#### C. Navigation Bar Bottom (Thanh điều hướng dưới 4 Tabs)
Sử dụng Bottom Tab Navigation bar bo góc mượt, đổ bóng nổi phía trên:
- Tab 1 (`Radar`): Icon Shield màu Xám `#757682`.
- Tab 2 (`Scan`): Icon Camera màu Xám `#757682`.
- Tab 3 (`Lô Hàng`): Icon Package/Boxes màu Xám `#757682`.
- Tab 4 (`Cá nhân`): Icon User màu Blue `#00236f`, Text `#00236f` (Active).

---

### 2. Xử lý Logic
- Hiển thị thông tin user từ `AuthContext` hoặc API `/auth/me`.
- Nút Đăng xuất sẽ gọi hàm `logout()` xóa token và chuyển hướng về màn hình Login.
```

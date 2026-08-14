# PROMPT 1:1 — TAB 3: QUẢN LÝ & TRA CỨU LÔ HÀNG XUẤT KHẨU (EXPORT BATCH TRACKER)

> **Image Reference**: `docs/mobile-prompts/tab3_batch_tracker.jpg`

---

## 📌 Prompt Template (Sao chép đoạn dưới đây gửi cho AI):

```markdown
Hãy xây dựng màn hình Tab 3 (Export Batch Tracker) cho ứng dụng React Native / Expo (`app/(tabs)/batches.tsx`) dựa trên phong cách Premium Design, tập trung vào UX mượt mà và bóng đổ mềm (Soft Shadows).

### 1. Yêu cầu Cấu trúc & Layout Premium Design

#### A. Header Màn hình Quản lý Lô hàng
- Nền màn hình: Xám nhạt hiện đại `#f7f9fb`.
- Tiêu đề chính: `Quản Lý Lô Hàng Xuất Khẩu` (Font Inter/Outfit bold `#131b2e`, text-lg).
- Tiêu đề phụ: `Tra cứu mã số vùng trồng PUC, mã đóng gói PHC` (Text xám `#444651`, text-xs).

#### B. Thanh Tìm kiếm & Bộ lọc Trạng thái (Premium Search & Filter Bar)
- Thanh tìm kiếm Input:
  - Hiệu ứng Inner Shadow hoặc nền trắng mờ, không dùng border thô cứng. `bg-white`, bo góc cực tròn `rounded-full`, đổ bóng cực nhẹ `shadow-sm`, px-4 py-3.
  - Left Icon: Search icon `Search` màu Themis Blue `#00236f`.
  - Placeholder: `"Nhập mã lô, mã PUC (VN-DLK)..."`.
- Thanh cuộn ngang Bộ lọc Trạng thái:
  - Chip 1 (Active): `Tất cả` (Background Gradient Themis Blue, Text trắng, font-medium, rounded-full, shadow-md).
  - Chip 2: `🟢 Đủ ĐK Xuất Khẩu` (Background `#ffffff`, Text xanh `#00236f`, shadow-sm).
  - Chip 3: `🟡 Cần Bổ Sung` (Background `#ffffff`, Text vàng `#FBBF24`, shadow-sm).
  - Chip 4: `🔴 Dừng Thông Quan` (Background `#ffffff`, Text đỏ `#F87171`, shadow-sm).

#### C. Danh sách Thẻ Lô hàng Xuất khẩu Đầy đủ Chi tiết (Export Batch Cards List)
Danh sách cuộn `FlatList` chứa các thẻ Lô hàng, ứng dụng **Soft Shadows** và góc bo lớn `rounded-3xl` để mang lại cảm giác cao cấp:

- **Thẻ Lô hàng 1 (Trạng thái Đủ ĐK Thông quan)**:
  - Background: `#ffffff`, không dùng border, bo góc `rounded-3xl`, đổ bóng lan tỏa `shadow-[0_8px_30px_rgb(0,0,0,0.06)]`, p-5, margin-bottom 16px.
  - Header Thẻ: Flex row justify-between items-center.
    - Mã Lô hàng: `SR-CN088-2026` (Nền xám nhạt `bg-gray-100`, text-blue-800 font-bold text-xs px-2 py-1 rounded-md).
    - Ngày khởi tạo: `12/08/2026` (Text-gray-400 text-xs).
  - Tên Sản phẩm: `Sầu Riêng Ri6 Khai Thác Vùng Đắk Lắk` (Font-bold text-dark `#131b2e` text-base my-2).
  - Khung Lưới Chi tiết 2 Cột (Grid 2 cols, text-xs text-gray-500 gap-y-2 my-2 bg-slate-50 p-3 rounded-2xl):
    - Cột 1: `PUC: VN-DLK-088`
    - Cột 2: `PHC: VN-PHC-102`
    - Cột 3: `Đích: 🇨🇳 TQ GACC`
    - Cột 4: `Cửa khẩu: Hữu Nghị`
  - Badge Trạng thái Thông quan Nổi bật (Animated/Gradient Badge):
    - Dải Gradient xanh lá cây (Emerald), chữ trắng font-bold text-xs py-2.5 px-3 rounded-xl text-center w-full my-3. Hiển thị: `🟢 ĐỦ ĐIỀU KIỆN THÔNG QUAN GACC`.
  - Thanh Nút Thao tác (Action Buttons Row):
    - Button 1 (Chia sẻ Zalo): Button Primary nổi bật `Gửi Báo cáo (Zalo)` (Gradient bg-[#00236f] to bg-[#003299], text-white font-bold text-xs py-3 px-4 rounded-2xl flex-1 mr-2, icon Share, đổ bóng shadow-blue-500/30).
    - Button 2: Button Outline `Chi tiết` (bg-transparent text-slate-700 border border-slate-200 font-medium text-xs py-3 px-4 rounded-2xl).

- **Thẻ Lô hàng 2 (Trạng thái Cần Bổ Sung Hồ Sơ)**:
  - Áp dụng layout tương tự Thẻ 1 nhưng dùng dải Gradient Vàng (Amber) cho Badge Trạng thái: `🟡 CẦN BỔ SUNG PHIẾU TEST CADMIUM`.
  - Button chính: `Bổ sung hồ sơ ngay` (Gradient Amber).

#### D. Navigation Bar Bottom (Thanh điều hướng dưới 4 Tabs)
Sử dụng Bottom Tab Navigation bar bo góc mượt, đổ bóng nổi phía trên:
- Tab 1 (`Radar`): Icon Shield màu Xám `#757682`.
- Tab 2 (`Scan`): Icon Camera màu Xám `#757682`.
- Tab 3 (`Lô Hàng`): Icon Package/Boxes màu Blue `#00236f`, Text `#00236f` (Active).
- Tab 4 (`Cá nhân`): Icon User màu Xám `#757682`.

---

### 2. Tích hợp Chia sẻ PDF & API
- Gọi `expo-sharing` chia sẻ file PDF Báo cáo thẩm định GACC (`fe/public/Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf`) trực tiếp sang Zalo/Email. Chú ý thêm haptic feedback khi ấn nút Share.
- Lấy danh sách lô hàng từ API Express `GET /api/products`.
```

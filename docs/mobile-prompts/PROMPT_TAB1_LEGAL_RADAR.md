# PROMPT 1:1 — TAB 1: RADAR CẢNH BÁO RỦI RO QUY ĐỊNH XUẤT KHẨU (LEGAL RISK RADAR)

> **Image Reference**: `docs/mobile-prompts/tab1_legal_radar.jpg`

---

## 📌 Prompt Template (Sao chép đoạn dưới đây gửi cho AI):

```markdown
Hãy xây dựng màn hình Tab 1 (Legal Risk Radar) cho ứng dụng React Native / Expo (`app/(tabs)/index.tsx`) dựa trên phong cách Premium Design, hiệu ứng Glassmorphism.

### 1. Yêu cầu Cấu trúc & Layout Premium Design

#### A. Header Doanh nghiệp & Hệ thống (Top Bar - Glassmorphism)
- Yêu cầu sử dụng `BlurView` (`expo-blur`) hoặc nền trắng mờ (translucent `bg-white/80 backdrop-blur-xl`) để tạo cảm giác kính mờ trượt lên nội dung phía dưới.
- Phía trên cùng bên trái: Tên Doanh nghiệp `CÔNG TY CP NÔNG SẢN VIỆT` (Font Inter/Outfit bold `#131b2e`, text-sm).
- Ngay bên phải hoặc dòng dưới: Pill badge `🇨🇳 China GACC & 🇪🇺 EU` (Background `#f2f3ff`, text Themis Blue `#00236f`, rounded-full, text-xs).
- Bên phải Header: Icon khiên bảo mật Themis Radar (`ShieldAlert` hoặc `Radar` icon màu xanh `#00236f` có đổ bóng nhẹ).

#### B. Bộ lọc Thị trường & Mặt hàng (Filter Chips Bar)
- Thanh cuộn ngang `ScrollView horizontal showsHorizontalScrollIndicator={false}` chứa các chip bấm:
- Mặc định các chip có nền trơn, nhưng khi Active sẽ có dải màu `LinearGradient` từ Xanh Themis (`#00236f`) sang xanh nhạt hơn, tạo sự nổi bật. Thêm viền nhẹ (soft border) và bóng đổ (shadow-sm).
  - Chip 1 (Active): `Tất cả` (Gradient Themis Blue, Text trắng, font-medium, rounded-full).
  - Chip 2: `🇨🇳 Trung Quốc GACC` (Background `#ffffff`, Text xám `#444651`, rounded-full, shadow-sm).
  - Chip 3: `🇪🇺 EU` (Background `#ffffff`, Text xám `#444651`, shadow-sm).

#### C. Widget Thống kê Rủi ro Xuất khẩu (KPI Risk Summary Widget)
- Khung lưới 2 cột chứa 2 Thẻ chỉ số tổng quan với hiệu ứng Elevated:
  - Thẻ 1 (Cảnh báo MRL):
    - Background `#ffffff`, bo góc tròn trịa (rounded-2xl), đổ bóng mềm `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`.
    - Viền góc trái hoặc dải màu đỏ mờ (Gradient).
    - Số liệu: `02` (Font-bold 2xl text-red-600).
    - Tiêu đề: `Cảnh báo MRL Cadmium` (text-xs text-gray-500).
    - Badge phụ: `TÁC ĐỘNG CAO` (bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px]).
  - Thẻ 2 (Thay đổi Quy định):
    - Tương tự nhưng sử dụng dải màu/shadow vàng cho `Cập nhật Lệnh 248/249`, text amber-600, badge vàng.

#### D. Danh sách Thẻ Bài tin Cảnh báo (Legal Risk Alert Cards)
Danh sách cuộn đứng (`FlatList`) áp dụng hiệu ứng chuyển động vi mô (Micro-animations - ví dụ Scale down nhẹ khi nhấn vào bằng `Pressable` + Reanimated):

- **Thẻ 1 (Ví dụ MRL Cadmium Sầu riêng)**:
  - Background: `#ffffff`, bo góc lớn `rounded-3xl`, viền siêu mỏng `border border-gray-100`, shadow mềm mại.
  - Header bài tin: Cờ `🇨🇳 GACC Trung Quốc` (text-blue-800 text-xs font-semibold) • Ngày `13/08/2026`.
  - Tiêu đề: `"Siết chặt mức giới hạn MRL Cadmium đối với Sầu riêng tươi Việt Nam xuất khẩu"` (Text dark `#131b2e` font-bold text-base leading-snug my-2).
  - Tag mức độ nghiêm trọng: Cảnh báo `TÁC ĐỘNG CAO` (bg-red-50 text-red-600 viền đỏ nhạt, text-xs font-bold px-2 py-1 rounded).
  - Nút hành động chính: Có dải màu gradient `#00236f` sang `#003299`, bo góc `rounded-2xl`, chữ trắng `Rà soát mẫu test phòng lab`, có hiệu ứng Glow (phát sáng nhạt xung quanh).

#### E. Navigation Bar Bottom (Thanh điều hướng dưới 4 Tabs)
Sử dụng Bottom Tab Navigation bar bo góc mượt, có đổ bóng nổi phía trên:
- Tab 1 (`Radar`): Icon Shield màu Blue `#00236f`, Text `#00236f` (Active).
- Tab 2 (`Scan`): Icon Camera màu Xám `#757682`, Text `#757682`.
- Tab 3 (`Lô Hàng`): Icon Package/Boxes màu Xám `#757682`, Text `#757682`.
- Tab 4 (`Cá nhân`): Icon User màu Xám `#757682`, Text `#757682`.

---

### 2. Tích hợp API Backend Express
- Gọi API `GET http://<BACKEND_URL>/api/legal-updates`
- Lọc theo `market` (CHINA, EU) và `status` (PUBLISHED).
- Thêm loading state (Skeleton loader mượt mà).
```

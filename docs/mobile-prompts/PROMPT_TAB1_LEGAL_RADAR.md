# PROMPT 1:1 — TAB 1: RADAR CẢNH BÁO RỦI RO QUY ĐỊNH XUẤT KHẨU (LEGAL RISK RADAR)

> **Image Reference**: `docs/mobile-prompts/tab1_legal_radar.jpg`

---

## 📌 Prompt Template (Sao chép đoạn dưới đây gửi cho AI):

```markdown
Hãy xây dựng màn hình Tab 1 (Legal Risk Radar) cho ứng dụng React Native / Expo (`app/(tabs)/index.tsx`) dựa trên thiết kế 1:1 tại hình ảnh `docs/mobile-prompts/tab1_legal_radar.jpg`.

### 1. Yêu cầu Cấu trúc & Layout 1:1

#### A. Header Doanh nghiệp & Hệ thống (Top Bar)
- Phía trên cùng bên trái: Hiển thị tên Doanh nghiệp `CÔNG TY CP NÔNG SẢN VIỆT` (Text bold `#F9FAFB`, text-sm).
- Ngay bên phải hoặc dòng dưới: Pill badge `🇨🇳 China GACC & 🇪🇺 EU` (Background `#1E293B`, text Emerald `#34D399`, rounded-full, text-xs).
- Bên phải Header: Icon khiên bảo mật Themis Radar (`ShieldAlert` hoặc `Radar` icon màu xanh `#10B981`).

#### B. Bộ lọc Thị trường & Mặt hàng (Filter Chips Bar)
- Thanh cuộn ngang `ScrollView horizontal showsHorizontalScrollIndicator={false}` chứa các chip bấm:
  - Chip 1 (Active): `Tất cả` (Background Emerald `#10B981`, Text trắng, font-medium, rounded-full).
  - Chip 2: `🇨🇳 Trung Quốc GACC` (Background `#1F2937`, Text xám `#9CA3AF`, rounded-full).
  - Chip 3: `🇪🇺 EU` (Background `#1F2937`, Text xám `#9CA3AF`).
  - Chip 4: `📦 Sầu riêng` (Background `#1F2937`, Text xám `#9CA3AF`).
  - Chip 5: `☕ Cà phê` (Background `#1F2937`, Text xám `#9CA3AF`).
- Thao tác: Bấm chuyển chip chủ động lọc danh sách bài tin theo thị trường/sản phẩm.

#### C. Widget Thống kê Rủi ro Xuất khẩu (KPI Risk Summary Widget)
- Khung lưới 2 cột chứa 2 Thẻ chỉ số tổng quan:
  - Thẻ 1 (Cảnh báo MRL):
    - Border trái viền đỏ `#EF4444` (border-l-4), background `#111827`.
    - Số liệu: `02` (Font-bold 2xl text-red-400).
    - Tiêu đề: `Cảnh báo MRL Cadmium` (text-xs text-gray-400).
    - Badge phụ: `TÁC ĐỘNG CAO` (bg-red-950 text-red-400 px-2 py-0.5 rounded text-[10px]).
  - Thẻ 2 (Thay đổi Quy định):
    - Border trái viền vàng `#F59E0B` (border-l-4), background `#111827`.
    - Số liệu: `01` (Font-bold 2xl text-amber-400).
    - Tiêu đề: `Cập nhật Lệnh 248/249` (text-xs text-gray-400).
    - Badge phụ: `CẦN RÀ SOÁT` (bg-amber-950 text-amber-400 px-2 py-0.5 rounded text-[10px]).

#### D. Danh sách Thẻ Bài tin Cảnh báo (Legal Risk Alert Cards)
Danh sách cuộn đứng (`FlatList`) hiển thị các thẻ bài tin với cấu trúc chính xác:

- **Thẻ 1 (Ví dụ MRL Cadmium Sầu riêng)**:
  - Background: `#111827`, border `#1F2937`, rounded-2xl, p-4, margin-bottom 12px.
  - Header bài tin: Flex row justify-between. Phía trái: Flag `🇨🇳 GACC Trung Quốc` (text-emerald-400 text-xs font-semibold). Phía phải: Ngày `13/08/2026` (text-gray-500 text-xs).
  - Tiêu đề: `"Siết chặt mức giới hạn MRL Cadmium đối với Sầu riêng tươi Việt Nam xuất khẩu"` (Text white font-bold text-base leading-snug my-2).
  - Thông tin trích dẫn: Badge `Lệnh 248 GACC / QĐ 1802` (bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded).
  - Tag mức độ nghiêm trọng: Badge Đỏ `TÁC ĐỘNG CAO` (bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded).
  - Nút hành động chính: Button Emerald `Rà soát mẫu test phòng lab` (bg-emerald-600 active:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl flex-row items-center justify-center).

- **Thẻ 2 (Ví dụ Kiểm dịch thực vật EU)**:
  - Background: `#111827`, border `#1F2937`, rounded-2xl, p-4, margin-bottom 12px.
  - Header bài tin: Flag `🇪🇺 Liên minh Châu Âu` • Ngày `10/08/2026`.
  - Tiêu đề: `"Bổ sung tần suất kiểm tra chứng thư Phytosanitary tại cảng nhập khẩu EU"`.
  - Thông tin trích dẫn: `EU Reg 2026/912`.
  - Tag mức độ nghiêm trọng: Badge Vàng `TRUNG BÌNH` (bg-amber-500/20 text-amber-400 text-xs font-bold).
  - Nút hành động chính: Button Slate `Xem hướng dẫn kiểm dịch` (bg-slate-800 text-slate-200 text-xs font-medium py-2 px-3 rounded-xl).

#### E. Navigation Bar Bottom (Thanh điều hướng dưới)
- Tab 1 (`Radar`): Icon Radar/Shield màu Xanh `#10B981`, Text `#10B981` Font-bold (Active).
- Tab 2 (`Quét Hồ Sơ`): Icon Camera màu Xám `#6B7280`, Text `#6B7280`.
- Tab 3 (`Lô Hàng`): Icon Package/Boxes màu Xám `#6B7280`, Text `#6B7280`.

---

### 2. Tích hợp API Backend Express
- Gọi API `GET http://<BACKEND_URL>/api/legal-updates`
- Lọc theo `market` (CHINA, EU) và `status` (PUBLISHED).
- Mapping dữ liệu response `{ data: [ { id, title, summary, market, severity, citation, createdAt } ] }`.
```

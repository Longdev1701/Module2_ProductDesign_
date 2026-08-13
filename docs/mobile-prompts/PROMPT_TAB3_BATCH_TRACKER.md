# PROMPT 1:1 — TAB 3: QUẢN LÝ & TRA CỨU LÔ HÀNG XUẤT KHẨU (EXPORT BATCH TRACKER)

> **Image Reference**: `docs/mobile-prompts/tab3_batch_tracker.jpg`

---

## 📌 Prompt Template (Sao chép đoạn dưới đây gửi cho AI):

```markdown
Hãy xây dựng màn hình Tab 3 (Export Batch Tracker) cho ứng dụng React Native / Expo (`app/(tabs)/batches.tsx`) dựa trên thiết kế 1:1 tại hình ảnh `docs/mobile-prompts/tab3_batch_tracker.jpg`.

### 1. Yêu cầu Cấu trúc & Layout 1:1

#### A. Header Màn hình Quản lý Lô hàng
- Tiêu đề chính: `Quản Lý Lô Hàng Xuất Khẩu` (Text bold white `#F9FAFB`, text-lg).
- Tiêu đề phụ: `Tra cứu mã số vùng trồng PUC, mã đóng gói PHC & điều kiện thông quan` (Text xám `#9CA3AF`, text-xs).

#### B. Thanh Tìm kiếm & Bộ lọc Trạng thái Thông quan (Search & Filter Bar)
- Thanh tìm kiếm Input:
  - Input field background `#1F2937`, border `#374151`, rounded-xl, px-3 py-2, text white.
  - Left Icon: Search icon `Search` màu xám.
  - Placeholder: `"Nhập mã lô (SR-CN088), mã PUC (VN-DLK)..."`.
- Thanh cuộn ngang Bộ lọc Trạng thái:
  - Chip 1 (Active): `Tất cả` (Background Emerald `#10B981`, Text trắng, font-medium, rounded-full).
  - Chip 2: `🟢 Đủ ĐK Xuất Khẩu` (Background `#1F2937`, Text xám-xanh `#34D399`).
  - Chip 3: `🟡 Cần Bổ Sung Hồ Sơ` (Background `#1F2937`, Text vàng `#FBBF24`).
  - Chip 4: `🔴 Dừng Thông Quan` (Background `#1F2937`, Text đỏ `#F87171`).

#### C. Danh sách Thẻ Lô hàng Xuất khẩu Đầy đủ Chi tiết (Export Batch Cards List)
Danh sách cuộn `FlatList` chứa các thẻ Lô hàng với thông tin chi tiết dành riêng cho logistics nông sản:

- **Thẻ Lô hàng 1 (Trạng thái Đủ ĐK Thông quan)**:
  - Background: `#111827`, border `#1F2937`, rounded-2xl, p-4, margin-bottom 12px.
  - Header Thẻ: Flex row justify-between items-center.
    - Mã Lô hàng: `SR-CN088-2026` (Font-mono bold text-emerald-400 text-sm).
    - Ngày khởi tạo: `12/08/2026` (Text-gray-500 text-xs).
  - Tên Sản phẩm: `Sầu Riêng Ri6 Khai Thác Vùng Đắk Lắk` (Font-bold text-white text-base my-1).
  - Khung Lưới Chi tiết 2 Cột (Grid 2 cols, text-xs text-gray-400 gap-y-1 my-2):
    - Cột 1: `Mã vùng trồng (PUC): VN-DLK-088`
    - Cột 2: `Mã cơ sở đóng gói (PHC): VN-PHC-102`
    - Cột 3: `Thị trường xuất: 🇨🇳 Trung Quốc GACC`
    - Cột 4: `Cửa khẩu xuất: Hữu Nghị / Tân Thanh`
  - Badge Trạng thái Thông quan Nổi bật (Large Banner Badge):
    - Text: `🟢 ĐỦ ĐIỀU KIỆN THÔNG QUAN GACC` (bg-emerald-500/20 text-emerald-400 font-bold text-xs py-2 px-3 rounded-xl text-center w-full my-2 border border-emerald-500/30).
  - Thanh Nút Thao tác (Action Buttons Row):
    - Button 1 (Chia sẻ Zalo): Button Emerald `Chia sẻ Báo cáo PDF (Zalo)` (bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex-row items-center justify-center flex-1 mr-2, icon Share/Send).
    - Button 2: Button Slate `Chi tiết hồ sơ` (bg-slate-800 text-slate-300 font-medium text-xs py-2.5 px-3 rounded-xl).

- **Thẻ Lô hàng 2 (Trạng thái Cần Bổ Sung Hồ Sơ)**:
  - Background: `#111827`, border `#1F2937`, rounded-2xl, p-4, margin-bottom 12px.
  - Header Thẻ: `SR-EU042-2026` • `09/08/2026`.
  - Tên Sản phẩm: `Sầu Riêng Dấp Mật Xuất Khẩu EU`.
  - Grid thông tin: `PUC: VN-BTE-042` | `PHC: VN-PHC-088` | `Thị trường: 🇪🇺 EU` | `Cửa khẩu: Cảng Cát Lái`.
  - Badge Trạng thái Nổi bật:
    - Text: `🟡 CẦN BỔ SUNG PHIẾU TEST CADMIUM` (bg-amber-500/20 text-amber-400 font-bold text-xs py-2 px-3 rounded-xl text-center w-full my-2 border border-amber-500/30).
  - Thanh Nút Thao tác:
    - Button 1 (Bổ sung ngay): Button Amber `Bổ sung hồ sơ ngay` (bg-amber-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex-1 mr-2).
    - Button 2: Button Slate `Chi tiết`.

#### D. Navigation Bar Bottom (Thanh điều hướng dưới)
- Tab 1 (`Radar`): Icon Radar/Shield màu Xám `#6B7280`, Text `#6B7280`.
- Tab 2 (`Quét Hồ Sơ`): Icon Camera màu Xám `#6B7280`, Text `#6B7280`.
- Tab 3 (`Lô Hàng`): Icon Package/Boxes màu Xanh `#10B981`, Text `#10B981` Font-bold (Active).

---

### 2. Tích hợp Chia sẻ PDF & API
- Gọi `expo-sharing` chia sẻ file PDF Báo cáo thẩm định GACC (`fe/public/Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf`) trực tiếp sang Zalo/Email.
- Lấy danh sách lô hàng từ API Express `GET /api/products` hoặc mock data lô hàng chuẩn nông sản Việt.
```

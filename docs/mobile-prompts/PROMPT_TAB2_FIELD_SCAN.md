# PROMPT 1:1 — TAB 2: QUÉT & THẨM ĐỊNH CHỨNG THƯ THỰC ĐỊA (FIELD COMPLIANCE SCANNER)

> **Image Reference**: `docs/mobile-prompts/tab2_field_scan.jpg`

---

## 📌 Prompt Template (Sao chép đoạn dưới đây gửi cho AI):

```markdown
Hãy xây dựng màn hình Tab 2 (Field Compliance Scanner) cho ứng dụng React Native / Expo (`app/(tabs)/scan.tsx`) dựa trên thiết kế 1:1 tại hình ảnh `docs/mobile-prompts/tab2_field_scan.jpg`.

### 1. Yêu cầu Cấu trúc & Layout 1:1

#### A. Header Màn hình Quét
- Tiêu đề chính: `Quét & Thẩm Định Chứng Thư` (Text bold white `#F9FAFB`, text-lg).
- Tiêu đề phụ: `Cán bộ QA/QC chụp phiếu test phòng lab hoặc giấy kiểm dịch` (Text xám `#9CA3AF`, text-xs).

#### B. Thanh chọn Loại Chứng thư / Hồ sơ (Document Type Selector)
- Thanh cuộn ngang chip chọn:
  - Chip 1 (Active): `Phiếu Test Cadmium` (Background Emerald `#10B981`, Text trắng, font-medium, rounded-full).
  - Chip 2: `Giấy Kiểm Dịch (Phytosanitary)` (Background `#1F2937`, Text xám `#9CA3AF`).
  - Chip 3: `Tem Nhãn GACC` (Background `#1F2937`, Text xám `#9CA3AF`).

#### C. Khung Quét Camera Thông minh (Camera Viewport & Target Frame)
- Sử dụng `expo-camera` (CameraView) hoặc `expo-image-picker`.
- Vùng hiển thị camera chiếm 55% chiều cao màn hình.
- Phủ lên trên (Overlay View): Khung chữ nhật căn chỉnh tài liệu khổ A4:
  - Viền khung: Viền góc Xanh Neon Emerald (`#34D399`, độ dày 3px, chiều dài góc 24px).
  - Dòng chữ hướng dẫn trung tâm: `"ĐẶT PHIẾU TEST VÀO NGUYÊN KHUNG CHỤP"` (Text trắng mờ, text-xs font-semibold uppercase bg-black/60 px-3 py-1 rounded-full).

#### D. Card Xem trước Trích xuất AI Tức thì (Instant AI Result Popup Card)
- Xuất hiện đè phía trên thanh điều khiển chụp ảnh (Floating Card):
  - Background: `#111827` với viền dải xanh `#059669` (border-t-2).
  - Header Card: Icon Sparkles / AI + Badge `AI TRÍCH XUẤT TỨC THÌ` (text-emerald-400 font-bold text-xs).
  - Chi tiết trích xuất:
    - Dòng 1: `Chỉ số Cadmium phát hiện: 0.03 mg/kg` (Font-medium text-white text-sm).
    - Dòng 2: Badge Xanh `ĐẠT CHUẨN GACC (Giới hạn cho phép ≤ 0.05 mg/kg)` (bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded mt-1 align-self-start).

#### E. Thanh Nút Thao tác Chụp ảnh (Camera Action Controls Bar)
- Bố cục 3 nút nằm ngang cân đối:
  - Nút bên trái: Icon Thư viện ảnh `Chọn từ thư viện` (Background `#1F2937`, p-3 rounded-full, text-gray-300).
  - Nút trung tâm: **Large Camera Shutter Button** (Vòng tròn ngoài Emerald `#10B981` đường kính 72px, nút bấm tròn trắng bên trong đường kính 60px).
  - Nút bên phải: Icon Lịch sử `Lịch sử quét` (Background `#1F2937`, p-3 rounded-full, text-gray-300).

#### F. Navigation Bar Bottom (Thanh điều hướng dưới)
- Tab 1 (`Radar`): Icon Radar/Shield màu Xám `#6B7280`, Text `#6B7280`.
- Tab 2 (`Quét Hồ Sơ`): Icon Camera màu Xanh `#10B981`, Text `#10B981` Font-bold (Active).
- Tab 3 (`Lô Hàng`): Icon Package/Boxes màu Xám `#6B7280`, Text `#6B7280`.

---

### 2. Xử lý Logic & Upload File
- Khi người dùng ấn Nút Chụp hoặc Chọn ảnh từ thư viện:
  1. Sử dụng `expo-image-picker` / `takePictureAsync` lấy file ảnh local URI.
  2. Hiển thị trạng thái Spin / Loading: `"Đang trích xuất OCR & Thẩm định AI..."`.
  3. Gửi FormData Multipart tới API Backend `/api/documents`.
  4. Cập nhật Card Popup hiển thị kết quả Cadmium và trạng thái tuân thủ.
```

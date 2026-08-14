# PROMPT 1:1 — TAB 2: QUÉT & THẨM ĐỊNH CHỨNG THƯ THỰC ĐỊA (FIELD COMPLIANCE SCANNER)

> **Image Reference**: `docs/mobile-prompts/tab2_field_scan.jpg`

---

## 📌 Prompt Template (Sao chép đoạn dưới đây gửi cho AI):

```markdown
Hãy xây dựng màn hình Tab 2 (Field Compliance Scanner) cho ứng dụng React Native / Expo (`app/(tabs)/scan.tsx`) dựa trên phong cách Premium Design, tập trung vào trải nghiệm thực tế ảo (AR-like) và Glassmorphism.

### 1. Yêu cầu Cấu trúc & Layout Premium Design

#### A. Header Màn hình Quét (Overlay mờ)
- Header không dùng nền đặc (solid) mà lơ lửng trên nền viewport của Camera.
- Tiêu đề chính: `Quét & Thẩm Định` (Text bold trắng hoặc sáng màu nổi bật trên nền đen mờ).
- Tiêu đề phụ: `Hướng camera vào phiếu test lab hoặc giấy kiểm dịch` (Text xám nhạt, text-xs).

#### B. Thanh chọn Loại Chứng thư / Hồ sơ (Floating Document Type Selector)
- Thanh cuộn ngang dạng Floating (lơ lửng), sử dụng `BlurView` nền kính mờ (`bg-white/20` hoặc `bg-black/40`).
  - Chip 1 (Active): `Phiếu Test Cadmium` (Nền Gradient Themis Blue sáng, Text trắng, bo tròn cực mượt `rounded-full`, có glow).
  - Chip 2: `Kiểm Dịch (Phytosanitary)` (Nền trong suốt viền mỏng trắng, Text trắng nhạt).
  - Chip 3: `Tem Nhãn GACC` (Nền trong suốt viền mỏng trắng, Text trắng nhạt).

#### C. Khung Quét Camera Thông minh (Camera Viewport & Dark Blur Overlay)
- Sử dụng `expo-camera` (CameraView).
- Vùng hiển thị camera chiếm toàn bộ chiều cao (full screen) hoặc 70% bên trên.
- **Dark Blur Overlay**: Phủ lên toàn bộ màn hình một lớp mờ tối (`bg-black/60`), TRỪ phần khung hình chữ nhật ở giữa (Viewfinder) để ánh sáng camera lọt qua rõ nét.
- Viền khung Viewfinder: Viền góc Xanh Neon Emerald (`#34D399`), có hiệu ứng nhấp nháy hoặc quét vạch sáng (Scanner line animation) dọc theo khung.
- Dòng chữ hướng dẫn trung tâm: `"ĐẶT PHIẾU TEST VÀO NGUYÊN KHUNG CHỤP"` (Text trắng, text-xs font-semibold uppercase bg-black/60 px-3 py-1 rounded-full).

#### D. Card Xem trước Trích xuất AI Tức thì (Instant AI Result Glass Card)
- Xuất hiện đè phía trên thanh điều khiển chụp ảnh, dùng **Slide-up Animation** mượt mà khi chụp xong.
- Nền: `BlurView` sáng (Light Glassmorphism), viền dải xanh `#00236f` (border-t-4).
- Header Card: Icon Sparkles / AI phát sáng + Badge `AI TRÍCH XUẤT TỨC THÌ` (text-blue-800 font-bold text-xs).
- Chi tiết trích xuất:
  - Dòng 1: `Chỉ số Cadmium phát hiện: 0.03 mg/kg` (Font-medium text-dark `#131b2e` text-sm).
  - Dòng 2: Badge Xanh `ĐẠT CHUẨN GACC (Giới hạn cho phép ≤ 0.05 mg/kg)` (bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mt-2).

#### E. Thanh Nút Thao tác Chụp ảnh (Camera Action Controls Bar)
- Bố cục 3 nút lơ lửng (Floating) ở dưới cùng:
  - Nút bên trái: Thư viện ảnh (Nền kính mờ `bg-white/30`, p-4 rounded-full, icon trắng).
  - Nút trung tâm: **Large Glowing Camera Shutter** (Nút chụp cực lớn, vòng tròn ngoài có hiệu ứng gradient lan tỏa / Ripple effect, nút bấm tròn trong suốt hoặc màu Xanh Themis).
  - Nút bên phải: Lịch sử quét (Nền kính mờ, icon trắng).

#### F. Navigation Bar Bottom (Thanh điều hướng dưới 4 Tabs)
Sử dụng Bottom Tab Navigation bar bo góc mượt, đổ bóng:
- Tab 1 (`Radar`): Icon Shield màu Xám `#757682`.
- Tab 2 (`Scan`): Icon Camera màu Blue `#00236f`, Text `#00236f` (Active).
- Tab 3 (`Lô Hàng`): Icon Package/Boxes màu Xám `#757682`.
- Tab 4 (`Cá nhân`): Icon User màu Xám `#757682`.

---

### 2. Xử lý Logic & Upload File
- Khi người dùng ấn Nút Chụp hoặc Chọn ảnh từ thư viện:
  1. Lấy file ảnh local URI, haptic feedback (rung nhẹ điện thoại).
  2. Hiển thị trạng thái Spin (Loading) với hiệu ứng mờ nhòe: `"Đang trích xuất OCR & Thẩm định AI..."`.
  3. Gửi FormData Multipart tới API Backend `/api/documents`.
  4. Bật Slide-up Card hiển thị kết quả.
```

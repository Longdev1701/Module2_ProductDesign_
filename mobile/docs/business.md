# Business — Active features

> **Cách dùng**: File này chứa tất cả các tính năng nghiệp vụ của ứng dụng **Themis LexiGuard Mobile**.

---

## FEATURE #1: Legal Risk Radar & Cadmium GB 2762-2022 Alert

**Status**: `[x] Verified`  
**Ngày tạo**: `2026-08-17`  
**Ngày xong**: `2026-08-17`

### Tôi muốn

Tôi muốn Giám đốc XNK và Quản lý nông trường xem được Ra-da cảnh báo điểm mù pháp lý GACC thời gian thực, tự động phát hiện các lô sầu riêng tiệm cận ngưỡng Cadmium $\le 0.05\text{ mg/kg}$ và đếm ngược hạn Kiểm dịch TV Phyto (14 ngày).

### Request backend ở

- `GET /api/dashboard/summary` — Lấy chỉ số sản lượng an toàn (tấn & tỷ VNĐ), đếm số lô tiệm cận mức Cadmium nguy hiểm ($0.040 - 0.049\text{ mg/kg}$) và số lô sắp hết hạn Phyto ($\le 3\text{ ngày}$).
- `GET /api/regulations` — Lấy danh sách văn bản quy định mới nhất của Hải quan GACC Trung Quốc.

### Out of scope

- Không gửi SMS trực tiếp tới nông dân (giai đoạn sau).
- Không quét mã QR thẻ bảo hiểm nông nghiệp.

### Verify steps

1. Mở ứng dụng di động Themis LexiGuard Mobile.
2. Tại Tab 1 ("Ra-da Quy Định"), kiểm tra 2 thẻ KPI "Sản lượng an toàn" và "Cảnh báo điểm mù".
3. Thẻ cảnh báo hiển thị rõ ràng chỉ tiêu Cadmium GB 2762-2022 và thông báo đếm ngược Phyto $\le 3\text{ ngày}$.
4. Cuộn xuống xem Bảng tin văn bản Lệnh 248/249 GACC CIFER.

---

## FEATURE #2: Field Compliance 4-Key Document Scan

**Status**: `[x] Verified`  
**Ngày tạo**: `2026-08-17`  
**Ngày xong**: `2026-08-17`

### Tôi muốn

Tôi muốn Cán bộ QA/QC tại cơ sở đóng gói (PHC) nạp và kiểm tra đủ 4 loại chứng từ sống còn (Phyto, Phiếu Lab Cadmium, C/O Form E, Packing List) cho từng lô hàng và theo dõi tỷ lệ hoàn thiện hồ sơ thông quan.

### Request backend ở

- `GET /api/batches` — Danh sách lô hàng sầu riêng.
- `POST /api/batches/:id/documents` — Nạp file scan 4 khóa chứng từ.

### Out of scope

- Không OCR trực tiếp trên thiết bị yếu (đẩy về Backend xử lý).

### Verify steps

1. Mở Tab 2 ("Quét Thực Địa").
2. Kiểm tra thanh tiến độ "Độ hoàn thiện hồ sơ thông quan (%)".
3. Nhấp nạp từng chứng từ (Phyto, Lab Cadmium, C/O Form E, Packing List).
4. Nhấp nút "Quét & Gửi Thẩm Định Tuân Thủ" $\to$ Hiển thị thông báo xác nhận gửi thành công.

---

## FEATURE #3: Export Batch Tracker & SHA-256 Seal Verification

**Status**: `[x] Verified`  
**Ngày tạo**: `2026-08-17`  
**Ngày xong**: `2026-08-17`

### Tôi muốn

Tôi muốn người dùng xem danh sách container sầu riêng tươi xuất khẩu kèm định giá tiền hàng (`💰 ~X.X Tỷ VNĐ / 🚛 ~X.X Cont`), mã số vùng trồng PUC, cơ sở đóng gói PHC và chuỗi băm SHA-256 niêm phong container.

### Request backend ở

- `GET /api/batches` — Danh sách chi tiết lô hàng.
- `GET /api/integrity/stats` — Thông tin mã kẹp chì Seal và chuỗi băm SHA-256 bất biến.

### Out of scope

- Không tích hợp bản đồ GPS vệ tinh thời gian thực trên app (dùng tọa độ PUC cố định).

### Verify steps

1. Mở Tab 3 ("Lô Hàng Xuất").
2. Kiểm tra danh sách thẻ lô hàng (DURIAN-2024-889, DURIAN-2024-912).
3. Mỗi thẻ hiển thị đầy đủ: Khối lượng (tấn), Giá trị ước tính (Tỷ VNĐ), Mã CIFER, PUC, PHC, Mã Seal Kẹp chì và Mã băm SHA-256.

---

## 📋 Template (copy block này khi thêm feature mới)

```markdown
## FEATURE #<N>: <tên feature>

**Status**: `[ ] Open`
**Ngày tạo**: `<YYYY-MM-DD>`

### Tôi muốn


### Request backend ở


### Out of scope


### Verify steps (AI fill khi implement xong)


### Notes (optional)

```

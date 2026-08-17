# Done — Archived features

> Feature user verify OK (`[x] Verified`) → AI auto-move từ `business.md` sang đây.

---

## FEATURE #1: Legal Risk Radar & Cadmium GB 2762-2022 Alert

**Status**: `[x] Verified`  
**Ngày tạo**: `2026-08-17`  
**Ngày xong**: `2026-08-17`

### Tôi muốn
Giám đốc XNK và Quản lý nông trường xem được Ra-da cảnh báo điểm mù pháp lý GACC thời gian thực, tiệm cận mức Cadmium $\le 0.05\text{ mg/kg}$ và đếm ngược hạn Phyto 14 ngày.

### Request backend ở
- `GET /api/dashboard/summary`
- `GET /api/regulations`

---

## FEATURE #2: Field Compliance 4-Key Document Scan

**Status**: `[x] Verified`  
**Ngày tạo**: `2026-08-17`  
**Ngày xong**: `2026-08-17`

### Tôi muốn
Cán bộ QA/QC nạp và kiểm tra đủ 4 loại chứng từ sống còn (Phyto, Lab Cadmium, C/O Form E, Packing List) cho từng lô hàng và theo dõi tỷ lệ hoàn thiện hồ sơ.

### Request backend ở
- `GET /api/batches`
- `POST /api/batches/:id/documents`

---

## FEATURE #3: Export Batch Tracker & SHA-256 Seal Verification

**Status**: `[x] Verified`  
**Ngày tạo**: `2026-08-17`  
**Ngày xong**: `2026-08-17`

### Tôi muốn
Người dùng xem danh sách container sầu riêng tươi xuất khẩu kèm định giá tiền hàng (`💰 ~X.X Tỷ VNĐ / 🚛 ~X.X Cont`), mã PUC, PHC và chuỗi băm SHA-256 niêm phong container.

### Request backend ở
- `GET /api/batches`
- `GET /api/integrity/stats`

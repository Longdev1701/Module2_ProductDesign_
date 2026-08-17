# Project Brief — Themis LexiGuard Mobile

Trợ lý Giám sát & Thẩm định Tuân thủ Xuất khẩu Sầu riêng tươi sang Trung Quốc (Hải quan GACC — HS Code: `0810.60.00`) trên nền tảng di động.

---

## Tên app

**Themis LexiGuard Mobile**

## Mục đích

Giúp Doanh nghiệp Xuất khẩu Nông sản (Giám đốc XNK, Cán bộ KCS/QA/QC tại xưởng) theo dõi quy định Hải quan GACC, kiểm định 4 Khóa hồ sơ thực địa và quản lý sản lượng, tiền hàng container lạnh mọi lúc mọi nơi trên điện thoại.

## Brief

> App mobile di động kết nối 100% với Express Backend API hiện có (`http://<server-ip>:3001/api`), hỗ trợ 3 tính năng cốt lõi:
> 1. **Ra-da Cảnh báo Quy định (Legal Risk Radar)**: Cảnh báo tiệm cận chỉ tiêu Cadmium GB 2762-2022 ($\le 0.05\text{ mg/kg}$) và đếm ngược hạn Kiểm dịch TV Phyto 14 ngày.
> 2. **Kiểm định Thực địa (Field Compliance Scan)**: Nạp & kiểm tra 4 Khóa chứng thư (Phyto, Lab Cadmium, C/O Form E, Packing List).
> 3. **Quản lý Lô hàng Xuất khẩu (Export Batch Tracker)**: Tra cứu sản lượng, quy đổi tiền hàng cont lạnh (~2.4 Tỷ VNĐ/cont) và mã băm SHA-256 niêm phong.

## Platform target

- [x] Android
- [x] iOS
- [x] Cả 2 (Expo Go)

## Tech stack

- **Framework**: Expo SDK 51.0 + React Native 0.74.5
- **Routing**: Tab Navigation / Expo Router
- **Local storage**: AsyncStorage
- **Backend**: Express.js REST API (`http://localhost:3001/api`)
- **DB**: Supabase PostgreSQL + Prisma ORM
- **Auth**: Supabase JWT Token Bearer

## Links

- **Repo**: `https://github.com/Longdev1701/Module2_ProductDesign_`
- **Backend URL**: `http://localhost:3001/api`
- **Web App**: `http://localhost:3000`

## Team

- **Nhóm trưởng**: Phạm Thành Long
- **Thành viên**: Đàm Công Tú, Chăm Rốch Thi, Huỳnh Hoàng Quân, Nguyễn Tiến Thành, Hà Anh Tuấn.

## Timeline

- **Started**: 2026-08-17
- **Target MVP**: 2026-08-18 (Thứ 3 Deadline)
- **Current phase**: MVP Dev & Verified

---

## Diagrams Checklist

- [x] **Architecture** (`docs/diagrams/architecture.mmd`) — Client Expo ↔ Express API ↔ Supabase DB
- [x] **Sequence** (`docs/diagrams/sequence.mmd`) — Flow nạp 4 khóa chứng thư & quét tuân thủ AI
- [x] **Data flow** (`docs/diagrams/data-flow.mmd`) — State lifecycle local AsyncStorage ↔ Backend API
- [x] **ER** (`docs/diagrams/er.mmd`) — Entity Product, Batch, Document, AuditLog
- [x] **Navigation flow** (`docs/diagrams/navigation.mmd`) — Radar ↔ Field Scan ↔ Batch Tracker

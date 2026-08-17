# Bug done — Verified & archived

> Bug user verify OK (`[x] Verified`) → AI auto-move từ `bug.md` sang đây.

---

## BUG #1: Localhost API URL Network Error on Physical Device

**Status**: `[x] Verified`  
**Ngày report**: `2026-08-17`  
**Ngày fix**: `2026-08-17`  
**Ngày verify**: `2026-08-17`  
**Severity**: `P1 major`

### Triệu chứng
Khi chạy ứng dụng trên thiết bị thật qua Expo Go, ứng dụng báo lỗi `Network Error` do địa chỉ `localhost:3001` không thể phân giải trên mạng di động.

### Expected
Ứng dụng di động có thể kết nối mượt mà tới Backend API REST qua địa chỉ IP mạng LAN hoặc biến môi trường `EXPO_PUBLIC_API_URL`.

### Root cause
Khai báo cứng URL `localhost:3001` chỉ hoạt động trên máy lập trình local, thiết bị di động thật trên mạng WiFi cần truy cập qua IP mạng LAN.

### Fix
- `mobile/src/api/client.ts` — Thêm fallback tự động đọc `process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api'`.

### Verify steps
1. Mở ứng dụng di động Themis LexiGuard Mobile.
2. Dữ liệu KPI và danh sách Lô hàng hiển thị thành công mà không báo lỗi Network Error.

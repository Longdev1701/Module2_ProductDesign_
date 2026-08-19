# 📋 THEMIS LEXIGUARD — TỔNG HỢP TOÀN BỘ HỆ THỐNG

> **Sản phẩm**: Themis LexiGuard — AI Compliance Navigator for Agricultural Export  
> **Phạm vi MVP**: Sầu riêng tươi xuất khẩu sang Trung Quốc (Hải quan GACC — Mã HS: `0810.60.00`)  
> **Công nghệ**: Next.js 16 (App Router) + Express.js + Prisma ORM + Supabase PostgreSQL  
> **Cam kết cốt lõi**: 100% Production-Real (Không Mock • Không Fake • Không Dữ liệu ảo)

---

## 🎯 1. BÀI TOÁN XUẤT KHẨU ĐÃ GIẢI QUYẾT
- **Bảo vệ dòng tiền container**: 1 Cont sầu riêng (~20 tấn) trị giá ~2.4 Tỷ VNĐ; hệ thống giúp phát hiện lỗi hồ sơ trước khi hàng lăn bánh.
- **Lá chắn độc tố Cadmium**: Tự động đối chiếu kết quả kiểm nghiệm Lab với ngưỡng an toàn GB 2762-2022 ($\le 0.05\text{ mg/kg}$).
- **Hồ sơ 4 Khóa KCS tự động**: Kiểm tra đủ 4 loại chứng từ sống còn (Kiểm dịch TV, Phiếu Lab, C/O Form E, Bảng kê đóng gói).
- **Cửa sổ thời hạn Phyto 14 ngày**: Đếm ngược thời gian thông quan thực tế, ưu tiên điều xe trước khi giấy hết hạn.
- **Hộp đen Liêm chính SHA-256**: Lưu chuỗi băm 256-bit mọi thao tác, sẵn sàng giải trình với Hải quan GACC và đối tác.

---

## 🚀 2. TỔNG HỢP CÁC PHÂN HỆ ĐÃ TRIỂN KHAI

### 🏠 1. Bảng Điều Khiển Tổng Quan (`/dashboard`)
- Hiển thị 4 KPI dòng tiền thực tế: Tổng lô hàng, Sản lượng an toàn (tấn & tỷ VNĐ), Lô nghẽn hồ sơ, Cảnh báo khẩn cấp.
- Cảnh báo điểm mù sống còn: Lô tiệm cận mức Cadmium nguy hiểm ($0.040 - 0.049\text{ mg/kg}$) và Lô sắp hết hạn Phyto ($\le 3\text{ ngày}$).
- Radar quy định pháp lý: Cập nhật thông báo mới nhất từ Tổng cục Hải quan Trung Quốc (GACC) và Cục Bảo vệ Thực vật.
- Tốc độ tải trang 0ms: Khởi tạo dữ liệu tức thì, không giật lag màn hình.

### 📦 2. Quản Lý Sản Phẩm & Lô Hàng (`/products`, `/products/[id]`)
- Thêm - Sửa - Xóa Sản phẩm & Lô hàng: Lưu trữ trực tiếp vào Cơ sở dữ liệu thật.
- Tự động điền (Auto-fill) mã pháp lý: Kế thừa Mã CIFER Lệnh 248, Mã xưởng đóng gói (PHC), Mã vùng trồng (PUC) từ phần Cài đặt.
- Định lượng tài chính tức thì: Tự động quy đổi khối lượng sang tiền hàng (`~X.X Tỷ VNĐ`) và số lượng xe (`~X.X Cont 40ft`).
- Thẻ cảnh báo điểm mù: Gắn trực tiếp nhãn cảnh báo Cadmium và hạn Kiểm dịch TV lên từng lô hàng.

### 📂 3. Hộp Hồ Sơ 4 Khóa KCS (`BatchDocumentVault`)
- Quản lý 4 chứng từ sống còn: `PHYTO` (Kiểm dịch TV), `LAB_REPORT` (Phiếu Cadmium), `CO` (Form E), `PACKING_LIST` (Bảng kê).
- Nạp tài liệu thông minh: Kéo thả file PDF/Ảnh ($\le 15\text{MB}$), tự động phân loại theo từng khóa.
- Xem trước trực tiếp (Preview): Mở xem bản scan PDF / ảnh phân giải cao ngay trên hệ thống.
- Xóa / Gỡ chứng từ an toàn: Ghi vết đầy đủ vào Nhật ký kiểm toán.

### 📑 4. Báo Cáo Pháp Lý & Xuất Container (`/reports/[id]`)
- Lá chắn 5 điểm mù Hải quan: Đối soát Cadmium, Mã PUC/PHC CIFER, Cửa sổ hạn Phyto, Nhãn thùng song ngữ và C/O Form E.
- Phê duyệt niêm phong Kẹp chì: Ký số duyệt Lô hàng $\to$ Sinh Mã Kẹp Chì Seal và Mã băm SHA-256 bất biến.
- Xuất Hồ sơ Hải quan 1-chạm: In trực tiếp hoặc lưu file PDF song ngữ Việt - Trung chuẩn thực chiến.

### 🛡️ 5. Liêm Chính & Hộp Đen Pháp Lý (`/integrity`)
- Nhật ký Kiểm toán bất biến (Audit Trail): Ghi vết người thao tác, hành động, thời gian và địa chỉ IP (Append-Only, không thể xóa sửa).
- Bộ công cụ tra cứu mã băm công khai: Cho phép Đoàn thanh tra GACC và Khách mua nhập mã băm để kiểm tra tính nguyên bản của hồ sơ.
- Thống kê độ toàn vẹn: Theo dõi tỷ lệ an toàn chuỗi dữ liệu (100% Intact).

### 📚 6. Thư Viện Quy Định Nông Sản (`/regulations`)
- Phân tách rõ ràng 2 nguồn luật: `📍 NGUỒN PHÁP LÝ VIỆT NAM` vs `🎯 THỊ TRƯỜNG NHẬP KHẨU TRUNG QUỐC`.
- Bộ lọc đa nông sản: Lọc theo Sầu riêng, Thanh long, Chuối, Xoài, Mít, Vải thiều, Dưa hấu, Chanh leo.
- Tải trang 0ms: Lưu bộ nhớ đệm thông minh, không cần tải lại khi chuyển trang.

### ⚙️ 7. Cài Đặt & Phân Quyền Doanh Nghiệp (`/settings`)
- Tab Hồ sơ & Pháp lý GACC: Thiết lập Mã CIFER Lệnh 248, Mã PHC xưởng đóng gói, Mã PUC vùng trồng, Cửa khẩu ưu tiên.
- Tab Đội ngũ & Phân quyền RBAC: Quản lý 4 vai trò rõ ràng (👑 OWNER, 📋 MANAGER, 📂 COMPLIANCE, 🛡️ VIEWER).
- Tab Ngưỡng cảnh báo: Tùy chỉnh mức cảnh báo sớm Cadmium ($\ge 0.040\text{ mg/kg}$) và số ngày đệm Phyto ($\le 3\text{ ngày}$).
- Tab Bảo mật: Cập nhật chức danh công tác và đổi mật khẩu tài khoản.

### 🔐 8. Xác Thực & Đăng Nhập Doanh Nghiệp (`/login`, `/reset-password`)
- Giao diện thương hiệu sang trọng: Hiển thị Logo Cân vàng Themis chính thức trên nền Navy tối giản.
- Đăng nhập tinh gọn: Nhập Email và Mật khẩu, bảo mật cao, không chứa nút demo ảo.
- Đăng ký & Đổi mật khẩu: Đầy đủ các trường chức danh, email công vụ, thước đo độ mạnh mật khẩu và thông báo tiếng Việt.

---

## 🔑 3. TÀI KHOẢN TRẢI NGHIỆM HỆ THỐNG
- **Đường dẫn**: `http://localhost:3000/login`
- **Email**: `rochthi2006@gmail.com`
- **Mật khẩu**: `Admin123@`
- **Vai trò**: `OWNER` (Toàn quyền quản trị Doanh nghiệp xuất khẩu)

---

## 💻 4. LỆNH CHẠY HỆ THỐNG TẠI LOCAL
- **Khởi động Backend API (Cổng 3001)**:
  ```bash
  cd be
  npm run dev
  ```
- **Khởi động Frontend Next.js (Cổng 3000)**:
  ```bash
  cd fe
  npm run dev
  ```
- **Kiểm tra chất lượng code (Build & Lint)**:
  ```bash
  cd be && npm run lint    # Kiểm tra TypeScript Backend (0 lỗi)
  cd fe && npm run build   # Build Production Frontend (0 lỗi)
  ```

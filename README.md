# Module2 Product Design – Themis LexiGuard Compliance Navigator

Đồ án Module 2 xây dựng giao diện nền tảng AI hỗ trợ doanh nghiệp theo dõi tuân thủ pháp lý, quản lý lô hàng và đánh giá rủi ro xuất khẩu nông sản theo nhiều thị trường (EU, USA, Nhật Bản, Trung Quốc).

## Mục tiêu đồ án

- Chuẩn hóa quy trình kiểm tra tuân thủ cho sản phẩm/lô hàng.
- Hỗ trợ tư vấn pháp lý bằng AI theo ngữ cảnh từng hồ sơ.
- Cảnh báo sớm thay đổi quy định và rủi ro trong chuỗi cung ứng.
- Trực quan hóa kết quả bằng dashboard, báo cáo và lịch sử thẩm định.

## Chức năng chính hiện có

- **Đăng nhập / đăng ký / quên mật khẩu / OTP**.
- **Dashboard tổng quan pháp lý**: KPI, biểu đồ rủi ro, cảnh báo.
- **Tư vấn AI (chat)**: mô phỏng hội thoại, phân tích và trả báo cáo.
- **Giám sát liêm chính**: theo dõi trạng thái audit và cảnh báo pháp lý.
- **Thư viện quy định quốc tế**: tra cứu văn bản và dòng cập nhật luật.
- **Quản lý sản phẩm & lô hàng**: danh mục, lọc, truy cập chi tiết.
- **Chi tiết sản phẩm**: yêu cầu MRL, tiêu chuẩn thị trường mục tiêu.
- **Lịch sử thẩm định**: tra cứu các lần kiểm tra theo lô hàng.
- **Báo cáo phân tích**: mức độ tuân thủ, sai lệch, khuyến nghị xử lý.
- **Trang cài đặt hệ thống**: tài khoản, thông báo, API & tích hợp.

## Công nghệ sử dụng

- **Frontend**: React 19 + TypeScript
- **Build tool**: Vite 6
- **Routing**: React Router DOM 7
- **UI**: Tailwind CSS 4, Lucide Icons, Material Symbols

## Cấu trúc thư mục chính

```text
src/
  components/        # Layout, widget dùng lại, UI primitives
  pages/             # Các màn hình chính của hệ thống
  lib/               # Utility dùng chung
  App.tsx            # Khai báo routes
  main.tsx           # Entry point
public/              # Tài nguyên tĩnh (logo, ảnh, ...)
```

## Hướng dẫn chạy dự án

### 1) Cài đặt dependencies

```bash
npm install
```

### 2) Chạy môi trường development

```bash
npm run dev
```

Mặc định truy cập tại: `http://localhost:3000`

### 3) Build production

```bash
npm run build
```

### 4) Preview bản build

```bash
npm run preview
```

## Scripts

- `npm run dev`: chạy local server bằng Vite (port 3000)
- `npm run build`: build production
- `npm run preview`: chạy preview từ bản build
- `npm run lint`: kiểm tra TypeScript (`tsc --noEmit`)

## Các route chính

- `/login`: xác thực người dùng
- `/`: dashboard tổng quan
- `/new`: tư vấn AI
- `/integrity`: giám sát liêm chính
- `/regulations`: thư viện pháp lý
- `/products`: danh mục sản phẩm & lô hàng
- `/products/:id`: chi tiết sản phẩm
- `/history`: lịch sử thẩm định
- `/report/:id`: báo cáo phân tích
- `/settings`: cài đặt hệ thống

## Thành viên nhóm (7 người)

1. Đàm Công Tú
2. Chăm Rốch Thi
3. Huỳnh Hoàng Quân
4. Nguyễn Tiến Thành
5. Hà Anh Tuấn
6. Tạ Lê Anh Bảo
7. Phạm Thành Long

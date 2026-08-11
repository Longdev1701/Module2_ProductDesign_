# THEMIS LEXIGUARD — AI COMPLIANCE NAVIGATOR FOR AGRICULTURAL EXPORT
## TÀI LIỆU DỰ ÁN VÀ QUY CHUẨN HỆ THỐNG DOANH NGHIỆP
### PHẠM VI CHÍNH (MVP RELEASE 1): SẦU RIÊNG XUẤT KHẨU SANG TRUNG QUỐC (GACC PROTOCOL - MÃ HS: 0810.60.00 / 0811.90.00)

---

## 1. Ý TƯỞNG VÀ BỐI CẢNH DỰ ÁN

### 1.1. Bối cảnh thị trường xuất khẩu sầu riêng Việt Nam
Sầu riêng Việt Nam (bao gồm Sầu riêng tươi Ri6, Dona Monthong và Sầu riêng cấp đông) đã chính thức được xuất khẩu chính ngạch sang thị trường Trung Quốc theo Nghị định thư về Yêu cầu Kiểm dịch Thực vật được ký kết giữa Bộ Nông nghiệp & Phát triển Nông thôn Việt Nam (MARD) và Tổng cục Hải quan Trung Quốc (GACC).

Tuy nhiên, thị trường Trung Quốc ngày càng siết chặt hàng rào kỹ thuật và tiêu chuẩn an toàn thực phẩm. Hải quan Trung Quốc thường xuyên áp dụng tần suất kiểm tra cao tại các cửa khẩu đối với:
- Dư lượng Kim loại nặng Cadmium (Cd ≤ 0.05 mg/kg theo Tiêu chuẩn Quốc gia GB 2762-2022).
- Dư lượng thuốc bảo vệ thực vật MRL (Dithiocarbamates ≤ 2.0 mg/kg, Chlorpyrifos ≤ 0.01 mg/kg theo GB 2763-2021).
- Trạng thái cấp phép và tính hiệu lực của Mã số Vùng trồng (PUC) và Mã số Cơ sở Đóng gói (PHC).
- Tem nhãn phụ Tiếng Trung trên 100% thùng hàng theo Lệnh số 248 và Lệnh số 249/GACC.

### 1.2. Ý tưởng cốt lõi (Core Idea)
Themis LexiGuard được xây dựng như một **Trợ lý Thẩm định Tuân thủ Pháp lý & Kỹ thuật Nông sản** (AI Compliance Navigator), đóng vai trò như một màng lọc kiểm soát chất lượng độc lập trước khi mở tờ khai hải quan.

Hệ thống kết hợp giữa **Động cơ Quy tắc Cứng (Deterministic Rule Engine)** và **Động cơ Trí tuệ Nhân tạo (Gemini AI Compliance Orchestration)** để tự động hóa quy trình rà soát chứng từ, đối soát MRL, xác thực mã PUC/PHC và đưa ra báo cáo thẩm định có trích dẫn nguồn luật chính xác.

### 1.3. Thành viên thực hiện dự án (Project Team Members)

| STT | Họ và Tên | Vai trò dự kiến | Nhiệm vụ chính |
|:---:|---|---|---|
| 1 | **Phạm Thành Long** | Tech Lead & AI Engineer | Setup kiến trúc (FE/BE), kết nối Supabase, Prisma, tích hợp Gemini AI và duyệt PR. |
| 2 | **Đàm Công Tú** | Product Owner / QA | Viết User Stories, kịch bản test, chuẩn bị dữ liệu pháp lý (Luật GACC & EU) & test UX/UI. |
| 3 | **Chăm Rốch Thi** | Frontend (Core & Auth) | Dựng layout (Sidebar, Topbar), Next.js Routing, tích hợp trang Đăng nhập / Đăng ký. |
| 4 | **Huỳnh Hoàng Quân** | Frontend (Data UI) | Code giao diện Dashboard (Biểu đồ, KPI), Thư viện pháp lý và Giám sát liêm chính. |
| 5 | **Nguyễn Tiến Thành** | Frontend (Forms & Ops) | Code giao diện Quản lý Sản phẩm, Lô hàng, upload file chứng từ và Báo cáo. |
| 6 | **Hà Anh Tuấn** | Backend (API & DB) | Xây dựng RESTful API (Express), viết các logic CRUD cho Products, Batches bằng Prisma. |

---

## 2. NGHỊCH LÝ VÀ ĐIỂM ĐAU CỦA DOANH NGHIỆP XUẤT KHẨU

Hệ thống Themis LexiGuard tập trung giải quyết 4 điểm đau chí mạng của các Doanh nghiệp xuất khẩu Nông sản:

1. **Rủi ro tịch thu, tái xuất hoặc tiêu hủy lô hàng tại cửa khẩu**:
   Khi lô hàng sầu riêng cập cảng hoặc qua cửa khẩu đường bộ (Hữu Nghị, Tân Thanh, Móng Cái), nếu chỉ số Cadmium vượt ngưỡng 0.05 mg/kg hoặc phát hiện rệp sáp (*Bactrocera dorsalis*, *Pseudococcus jackbeardsleyi*), toàn bộ lô hàng sẽ bị tịch thu hoặc hủy bỏ. Chi phí thiệt hại cho một container sầu riêng (18.5 tấn) dao động từ 1.5 đến 2.5 tỷ đồng.

2. **Thiếu cơ sở luận cứ pháp lý khi làm việc với Hải quan và đối tác**:
   Các phiếu kết quả thử nghiệm nội bộ thường bị phân tán ở nhiều định dạng (PDF, ảnh scan). Khi phát sinh bất đồng hoặc bị Hải quan nước nhập khẩu truy xuất nguồn gốc, doanh nghiệp thiếu một báo cáo thẩm định tập trung có đầy đủ mã trích dẫn (citations) dẫn chiếu các điều khoản luật định chính thức.

3. **Rủi ro bỏ sót lỗi do rà soát hồ sơ chứng từ thủ công**:
   Cán bộ phụ trách tuân thủ phải rà soát bằng mắt thường hàng chục chứng từ phức tạp: Giấy chứng nhận Phytosanitary (PSC), Phiếu kết quả Lab Eurofins/Quatest, Hồ sơ Mã số PUC/PHC, Hợp đồng thương mại và Tờ khai hải quan. Quy trình thủ công tốn thời gian và dễ xảy ra sai sót.

4. **Biến động liên tục của các tiêu chuẩn kỹ thuật GACC**:
   Hải quan Trung Quốc thường xuyên cập nhật danh mục các mã số PUC/PHC được phép xuất khẩu, thay đổi phương pháp lấy mẫu hoặc cập nhật các ngưỡng MRL mới. Doanh nghiệp thiếu hệ thống cảnh báo tác động thời gian thực tới các lô hàng đang trong quá trình vận chuyển.

---

## 3. GIẢI PHÁP VÀ GIÁ TRỊ CỐT LÕI CỦA THEMIS LEXIGUARD

### 3.1. Động cơ Thẩm định 2 Tầng (Two-Tier Compliance Engine)
- **Tầng 1 — Deterministic Rule Engine (Quy tắc Cứng)**:
  Thực thi thuật toán mã nguồn đối soát tức thì dữ liệu kiểm nghiệm thực tế với Tiêu chuẩn GB 2762-2022 (Cadmium ≤ 0.05 mg/kg), GB 2763-2021 (Dithiocarbamates ≤ 2.0 mg/kg, Chlorpyrifos ≤ 0.01 mg/kg) và tính còn hiệu lực của Giấy chứng nhận Kiểm dịch Phytosanitary PSC (thời hạn 14 ngày).
- **Tầng 2 — Gemini AI Compliance Orchestration (AI Chuyên sâu)**:
  Tự động hóa đọc hiểu tài liệu OCR, phân tích tính bất đồng nhất giữa các chứng từ, cảnh báo rủi ro khoảng thời gian giữa ngày lấy mẫu Lab và ngày cấp Phytosanitary, đồng thời đề xuất hành động khắc phục cụ thể (ví dụ: Dán bổ sung tem nhãn phụ tiếng Trung chứa mã PUC/PHC lên thùng hàng).

### 3.2. Quy tắc Bắt buộc về Trích dẫn Nguồn luật (Citation Mandate)
Tất cả các phát hiện (Findings/ComplianceItems) do AI khởi tạo đều bắt buộc phải đính kèm mã `citationId` dẫn chiếu trực tiếp đến các văn bản pháp luật chính thức:
- Điều 4 & 8, Nghị định thư Hải quan GACC Sầu riêng Tươi 2022.
- Tiêu chuẩn An toàn Thực phẩm Quốc gia Trung Quốc GB 2762-2022 & GB 2763-2021.
- Lệnh số 248/2021/GACC về Quản lý Đăng ký Doanh nghiệp Thực phẩm Nhập khẩu.
- Lệnh số 249/2021/GACC về Biện pháp Quản lý An toàn Thực phẩm Xuất Nhập khẩu.

### 3.3. Tính Bất biến và Quản lý Phiên bản Báo cáo (Immutable Report Versioning)
Báo cáo sau khi được cấp thẩm quyền duyệt (`APPROVED`) sẽ trở thành tài liệu bất biến (Immutable), không thể sửa đổi hoặc ghi đè. Khi lô hàng có sự thay đổi chứng từ hoặc khắc phục bổ sung, hệ thống khởi tạo phiên bản báo cáo mới (`version: 2`), lưu trữ nguyên vẹn lịch sử phiên bản cũ phục vụ công tác kiểm toán độc lập.

---

## 4. KIẾN TRÚC HỆ THỐNG VÀ CÔNG NGHỆ (TECHNOLOGY STACK)

### 4.1. Công nghệ sử dụng
- **Frontend (`fe/`)**: Next.js 15 App Router, React 19, Tailwind CSS v4 CSS variables, React Hook Form, Zod Schema Validation, Lucide Icons.
- **Backend (`be/`)**: Node.js, Express.js (TypeScript Strict Mode), Prisma ORM v6, Supabase PostgreSQL Database, JWT Verification Middleware, Express Rate Limit.
- **AI Engine**: Google Gemini 1.5 Pro / 2.0 Flash tích hợp Zod Structured Output Parser.
- **Báo cáo PDF**: ReportLab Python Engine tích hợp phông chữ Arial TrueType Unicode (`arial.ttf` & `arialbd.ttf`), xuất file PDF Tiếng Việt chuẩn doanh nghiệp.

### 4.2. Mô hình Phân quyền 2 Tầng (Two-Tier Authorization)
Hệ thống áp dụng mô hình phân quyền chặt chẽ server-side nhằm đảm bảo cô lập dữ liệu tuyệt đối giữa các Doanh nghiệp (Multi-tenant Data Isolation):
- **Platform Role (Quyền Nền tảng)**: `SUPER_ADMIN`, `PLATFORM_ADMIN`, `SUPPORT`, `USER`.
- **Organization Role (Quyền Doanh nghiệp)**: `OWNER`, `MANAGER`, `COMPLIANCE`, `VIEWER`.

---

## 5. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
Module2/
├── fe/                                 # Ứng dụng Frontend (Next.js 15 App Router)
│   ├── src/
│   │   ├── app/                        # Next.js App Router Pages & Routes
│   │   │   ├── (auth)/                 # Login, Register, Pending Access Pages
│   │   │   └── (dashboard)/            # Main Shell, Dashboard, Products, History, Reports
│   │   ├── components/                 # Component giao diện dùng chung (Widgets, Cards, Buttons)
│   │   ├── features/                   # Logic nghiệp vụ chi tiết từng màn hình (ReportPage, DashboardPage, NewCheckPage...)
│   │   ├── lib/                        # API Client (ApiClient), Auth Context, Utilities
│   │   └── types/                      # Interfaces & Zod Schemas dùng chung
│   └── public/                         # Tệp tĩnh (Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf)
│
├── be/                                 # Ứng dụng Backend API (Node.js Express + Prisma)
│   ├── prisma/
│   │   └── schema.prisma               # Prisma Schema (Database Entities & RLS Policies)
│   └── src/
│       ├── middleware/                 # Auth JWT Middleware, RBAC Middleware, Error Handler
│       ├── modules/                    # Sub-modules (Auth, Organization, Product, Batch, Compliance, Report)
│       └── jobs/                       # Background Workers & AI Analysis Jobs
│
├── docs/                               # Tài liệu Quy chuẩn Kỹ thuật & Báo cáo Doanh nghiệp
│   ├── THEMIS_LEXIGUARD_MASTER_SPECIFICATION.md
│   ├── Themis_LexiGuard_Tai_Lieu_Quy_Chuan_Doanh_Nghiep.docx
│   ├── Themis_LexiGuard_Bao_Cao_GACC_Sau_Rieng_Tieng_Viet.pdf
│   ├── china_gacc_durian_compliance_guide.md
│   └── mvp_core_usecases_deepdive.md
│
├── scripts/                            # Scripts hỗ trợ biên dịch Báo cáo PDF & Word
│   ├── generate_pdf_report_vi.py       # Script biên dịch Báo cáo PDF Sầu riêng GACC Tiếng Việt
│   └── generate_master_docx.py         # Script biên dịch File Word Quy chuẩn Kỹ thuật Doanh nghiệp
│
└── CHANGELOG.md                        # Nhật ký ghi nhận các thay đổi mã nguồn & tài liệu
```

---

## 6. HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH (GETTING STARTED)

### 6.1. Yêu cầu môi trường
- Node.js: >= v18.0.0
- NPM: >= v9.0.0
- Python: >= 3.10 (phục vụ script ReportLab biên dịch PDF/DOCX)
- Supabase PostgreSQL Database

### 6.2. Cấu hình Backend (`be/`)

1. Di chuyển vào thư mục backend và cài đặt thư viện:
```bash
cd be
npm install
```

2. Cấu hình tệp biến môi trường `be/.env`:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:6543/postgres?pgboiler=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR_SUPABASE_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SUPABASE_SERVICE_ROLE_KEY]"
GEMINI_API_KEY="[YOUR_GEMINI_API_KEY]"
PORT=5000
```

3. Nạp Schema Prisma và khởi chạy Backend:
```bash
npm run db:generate
npm run db:migrate
npm run dev
```
Backend API sẽ khởi chạy tại: `http://localhost:5000`

### 6.3. Cấu hình Frontend (`fe/`)

1. Di chuyển vào thư mục frontend và cài đặt thư viện:
```bash
cd fe
npm install
```

2. Cấu hình tệp biến môi trường `fe/.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_SUPABASE_ANON_KEY]"
```

3. Khởi chạy Frontend ở chế độ Development:
```bash
npm run dev
```
Frontend Web App sẽ khởi chạy tại: `http://localhost:3000`

---

## 7. CHUẨN GIAO TIẾP API (RESPONSE ENVELOPE)

Tất cả các API Endpoints trong hệ thống đều trả về dữ liệu theo cấu trúc chuẩn hóa:

- **Phản hồi Thành công (200 / 201)**:
```json
{
  "data": {
    "checkId": "chk_2026_gacc_0888",
    "batchCode": "DURIAN-2026-CN088",
    "status": "CONDITIONALLY_COMPLIANT",
    "confidenceScore": 0.968
  },
  "meta": {
    "requestId": "req_992a10b4c8e7"
  }
}
```

- **Phản hồi Lỗi Validation (422 Unprocessable Entity)**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Chỉ số kiểm nghiệm Cadmium không hợp lệ",
    "details": [
      {
        "field": "cadmium_level",
        "issue": "Giá trị 0.08 mg/kg vượt ngưỡng tối đa GB 2762-2022 (0.05 mg/kg)"
      }
    ],
    "requestId": "req_992a10b4c8e7"
  }
}
```

---

## 8. TIÊU CHUẨN HOÀN THÀNH VÀ KÊNH NGHIỆM THU (DEFINITION OF DONE)

Một tính năng trong Themis LexiGuard chỉ được đánh giá là Hoàn thành (DONE) khi đáp ứng toàn bộ 10 tiêu chí:
1. Giao diện Frontend đầy đủ, 0% dữ liệu mock trong luồng sản xuất.
2. API backend thực tế kết nối CSDL PostgreSQL qua Prisma ORM.
3. Xác thực dữ liệu bằng Zod Schema trên cả Frontend và Backend.
4. Kiểm tra phân quyền RBAC server-side cho mọi thao tác mutating (POST/PATCH/DELETE).
5. Xử lý đầy đủ các trạng thái giao diện: Loading, Empty, Error và Success confirmation.
6. Ghi vết Audit Log đối với các hành động làm biến đổi trạng thái hệ thống.
7. Không lưu trữ hoặc làm rò rỉ API Keys / Secrets trong mã nguồn.
8. Biên dịch TypeScript thành công 100% không lỗi (`tsc --noEmit`).
9. Cập nhật nhật ký thay đổi trong tệp `CHANGELOG.md`.
10. Đảm bảo tính cô lập dữ liệu Multi-tenant tuyệt đối giữa các Doanh nghiệp.

---

*Tài liệu này là quy chuẩn dự án chính thức của hệ thống Themis LexiGuard.*

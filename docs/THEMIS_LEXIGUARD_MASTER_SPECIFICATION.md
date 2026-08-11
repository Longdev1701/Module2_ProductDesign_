# TÀI LIỆU QUY CHUẨN KỸ THUẬT VÀ KIẾN TRÚC HỆ THỐNG
## DỰ ÁN: THEMIS LEXIGUARD — AI COMPLIANCE NAVIGATOR FOR AGRICULTURAL EXPORT
### PHẠM VI MVP: SẦU RIÊNG XUẤT KHẨU SANG TRUNG QUỐC (GACC PROTOCOL - MÃ HS: 0810.60.00 / 0811.90.00)

---

## CHƯƠNG I: TỔNG QUAN HỆ THỐNG VÀ BỐI CẢNH NGHIỆP VỤ

### 1.1. Định danh sản phẩm
- **Tên chính thức sản phẩm**: Themis LexiGuard
- **Tên phụ**: AI Compliance Navigator for Agricultural Export
- **Phạm vi triển khai Release 1 (MVP)**: Thẩm định tuân thủ pháp lý Sầu riêng Tươi và Sầu riêng Cấp đông xuất khẩu sang thị trường Trung Quốc (Mã HS: 0810.60.00 / 0811.90.00) theo Nghị định thư Hải quan Trung Quốc (GACC Protocol).
- **Mã nguồn Repository**: Module2_ProductDesign_
- **Mô hình vận hành**: Enterprise Multi-Tenant SaaS (Software-as-a-Service) phục vụ các doanh nghiệp xuất khẩu nông sản, tập đoàn logistics và tổ chức thẩm định độc lập.

### 1.2. Phân tích điểm đau cốt lõi của doanh nghiệp xuất khẩu
Hệ thống Themis LexiGuard được thiết kế nhằm giải quyết trực tiếp 4 rủi ro pháp lý và vận hành chí mạng của các doanh nghiệp xuất khẩu nông sản Việt Nam:

1. **Tổn thất tài chính nghiêm trọng do bị tịch thu hoặc tiêu hủy hàng hóa tại cửa khẩu**:
   Hải quan nước nhập khẩu (đặc biệt là Tổng cục Hải quan Trung Quốc - GACC) áp dụng tần suất kiểm tra cao đối với chỉ số kim loại nặng Cadmium (Cd ≤ 0.05 mg/kg theo GB 2762-2022) và dư lượng thuốc bảo vệ thực vật (MRL theo GB 2763-2021). Doanh nghiệp thiếu công cụ tự động đối soát trước khi mở tờ khai thông quan.

2. **Thiếu cơ sở luận cứ pháp lý khi giải trình hải quan**:
   Các báo cáo kiểm tra nội bộ hiện tại không đính kèm mã trích dẫn văn bản quy phạm pháp luật chính thức (Nghị định thư GACC, Lệnh 248, Lệnh 249, Tiêu chuẩn Quốc gia GB). Khi xảy ra sự cố sai lệch, doanh nghiệp không có căn cứ pháp lý để làm việc với Hải quan hoặc khiếu nại nhà cung ứng.

3. **Rủi ro bỏ sót lỗi do quy trình rà soát chứng từ thủ công**:
   Cán bộ pháp chế và quản lý chất lượng phải kiểm tra thủ công bằng mắt thường hàng chục trang Phiếu kết quả kiểm nghiệm (Lab Report), Giấy chứng nhận Kiểm dịch thực vật (Phytosanitary Certificate), Mã số Vùng trồng (PUC) và Mã số Cơ sở đóng gói (PHC).

4. **Sự biến động liên tục của quy định pháp lý nước nhập khẩu**:
   Hải quan Trung Quốc thường xuyên cập nhật danh mục vùng trồng được cấp phép, thay đổi ngưỡng MRL hoặc ban hành thêm các yêu cầu tem nhãn phụ. Doanh nghiệp thiếu hệ thống cảnh báo tác động thời gian thực tới các lô hàng đang vận chuyển.

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

## CHƯƠNG II: KIẾN TRÚC KỸ THUẬT VÀ HẠ TẦNG CÔNG NGHỆ

### 2.1. Công nghệ cốt lõi (Technology Stack)
Hệ thống tuân thủ mô hình kiến trúc phân tầng hiện đại (Clean Layered Architecture):

- **Frontend Application (`fe/`)**:
  - Framework: Next.js 15 App Router (React 19).
  - Styling: Vanilla CSS kết hợp Tailwind CSS v4 CSS variables (Không hardcode hex colors).
  - Form & Validation: React Hook Form + Zod Schema Client-side Validation.
  - API Client: custom `ApiClient` hỗ trợ In-Flight Deduplication và Response Memory Caching (TTL 5s).
- **Backend Application (`be/`)**:
  - Runtime: Node.js / Express.js với TypeScript Strict Mode (`noImplicitAny`, `strictNullChecks`).
  - ORM & Database: Prisma ORM v6 kết hợp Supabase PostgreSQL Database.
  - Middleware: Auth JWT Verification, Two-Tier RBAC, Rate Limiting, Centralized Error Handling.
- **AI & Rule Engine (`be/src/modules/compliance/`, `be/src/modules/ai/`)**:
  - Deterministic Rule Engine: Thuật toán mã nguồn thuần đối soát định lượng MRL và kiểm tra hiệu lực chứng từ.
  - AI Orchestration: Google Gemini 1.5 Pro / 2.0 Flash tích hợp Zod Structured Output Parser.

### 2.2. Mô hình Phân quyền 2 Tầng (Two-Tier Authorization Architecture)
Hệ thống cô lập hoàn toàn giữa quyền Nền tảng và quyền Doanh nghiệp nhằm ngăn ngừa rò rỉ dữ liệu chéo (Cross-tenant Data Leakage):

1. **Tầng 1: Vai trò Nền tảng (`PlatformRole`)**:
   - `SUPER_ADMIN`: Quản trị toàn bộ hạ tầng hệ thống.
   - `PLATFORM_ADMIN`: Cấp phép Doanh nghiệp mới, duyệt tài khoản người dùng, gán thành viên vào Doanh nghiệp.
   - `SUPPORT`: Hỗ trợ kỹ thuật hệ thống.
   - `USER`: Nông dân, đối tác ngoài hệ thống chưa được gán Doanh nghiệp (Phân luồng về màn hình `/pending-access`).

2. **Tầng 2: Vai trò Doanh nghiệp (`OrganizationRole`)**:
   - `OWNER`: Chủ doanh nghiệp xuất khẩu (Toàn quyền quản lý Doanh nghiệp, nhân sự và báo cáo).
   - `MANAGER`: Giám đốc Vận hành / Trưởng phòng Pháp chế (Tạo lô hàng, duyệt báo cáo, gán task khắc phục).
   - `COMPLIANCE`: Cán bộ Phụ trách Tuân thủ (Tải chứng từ, rà soát OCR, khởi chạy quét AI).
   - `VIEWER`: Nhân viên xem báo cáo (Chỉ có quyền đọc, không có quyền thao tác biến đổi dữ liệu).

### 2.3. Cơ chế Bảo mật và Tối ưu Hiệu năng
- **Silent Refresh Token**: Khi `access_token` hết hạn (401 Unauthorized), `ApiClient` tự động trao đổi `refresh_token` ở background và thực hiện lại request ban đầu mượt mà.
- **In-Memory Cache Service**: Cache thông tin JWT xác thực và PlatformRole trong 45 giây tại `authMiddleware`, giảm 95% độ trễ truy vấn Supabase Auth và đưa thời gian phản hồi API Auth về dưới 20ms.
- **Tối ưu hóa Cơ sở dữ liệu**: Bổ sung bộ Composite Indexes B-Tree trên các bảng `OrganizationMember`, `Product`, `Batch`, `Document`, `ComplianceCheck`, `ComplianceItem`, `AuditLog`.

---

## CHƯƠNG III: QUY TRÌNH NGHIỆP VỤ CỐT LÕI VÀ ĐỘNG CƠ THẨM ĐỊNH AI

### 3.1. Động cơ Thẩm định Tuân thủ 2 Tầng (Two-Tier Compliance Engine)

Quy trình thẩm định lô hàng xuất khẩu được thực hiện theo 2 tầng độc lập:

1. **Tầng 1 — Deterministic Rule Engine (Quy tắc Cứng)**:
   - Thuật toán truy vấn dữ liệu ngưỡng MRL trong CSDL đối soát với kết quả Lab Report thực tế.
   - Kiểm tra ngưỡng kim loại nặng Cadmium (Cd ≤ 0.05 mg/kg).
   - Kiểm tra danh mục dư lượng thuốc BVTV (Dithiocarbamates ≤ 2.0 mg/kg, Chlorpyrifos ≤ 0.01 mg/kg).
   - Kiểm tra ngày hết hạn của Giấy chứng nhận Kiểm dịch thực vật (Phytosanitary PSC).
   - Đối soát sự tồn tại và trạng thái hiệu lực của Mã số Vùng trồng (PUC) và Mã số Cơ sở đóng gói (PHC) trên danh sách GACC công bố.

2. **Tầng 2 — Gemini AI Compliance Orchestration (AI Chuyên sâu)**:
   - Đóng gói dữ liệu Lô hàng, Chứng từ trích xuất và Điều khoản Quy định GACC thành Prompt cấu trúc.
   - Gửi yêu cầu tới Gemini API với Zod Schema Validator.
   - Phân tích tính đồng nhất giữa các chứng từ, phát hiện các bất thường về khoảng thời gian lấy mẫu và yêu cầu ghi nhãn bao bì.

### 3.2. Quy tắc Bắt buộc về Trích dẫn Nguồn luật (Citation Mandate)
- **BẮT BUỘC**: Mỗi phát hiện vi phạm hoặc cảnh báo (`ComplianceItem` / `Finding`) do AI khởi tạo PHẢI chứa ít nhất 01 `citationId` dẫn chiếu điều khoản văn bản quy phạm pháp luật chính thức.
- **QUY TẮC AN TOÀN**: Nếu đầu ra AI phát hiện Finding không có `citationId`, hệ thống tự động loại bỏ Finding đó hoặc chuyển trạng thái phiên thẩm định thành `MANUAL_REVIEW_REQUIRED`. Tuyệt đối **KHÔNG** kết luận `COMPLIANT` khi thiếu căn cứ pháp lý.

### 3.3. Quản lý Báo cáo và Tính Bất biến (Immutable Report Versioning)
- Báo cáo thẩm định (`Report`) khi ở trạng thái `APPROVED` là bất biến (Immutable).
- Khi có thay đổi chứng từ hoặc khắc phục sự cố, hệ thống thực thi luồng Re-check và khởi tạo phiên bản Báo cáo mới (`version: 2`), giữ nguyên Báo cáo cũ (`version: 1`) phục vụ công tác kiểm toán lịch sử.

---

## CHƯƠNG IV: QUY ĐỊNH HẢI QUAN TRUNG QUỐC (GACC PROTOCOL SPECIFICATIONS)

### 4.1. Tiêu chuẩn Mã số Vùng trồng (PUC) và Cơ sở Đóng gói (PHC)
- Sầu riêng Tươi (HS 0810.60.00) và Sầu riêng Cấp đông (HS 0811.90.00) phải xuất xứ từ Vùng trồng được Cục Trồng trọt cấp mã PUC và GACC phê duyệt.
- Vùng trồng phải áp dụng quy trình quản lý 05 loài sinh vật kiểm dịch: *Bactrocera dorsalis* (Ruồi đục quả), *Pseudococcus jackbeardsleyi*, *Dysmicoccus neobrevipes*, *Planococcus lilacinus*, *Planococcus minor* (Rệp sáp).
- Nhà đóng gói phải có mã số PHC hợp lệ, trang bị hệ thống vòi xịt khí nén/nước áp lực cao rửa sạch rệp sáp và cuống quả.

### 4.2. Ma trận Ngưỡng MRL và Kim loại Nặng (GB 2762 & GB 2763)

| Hoạt chất / Chỉ tiêu | Ngưỡng Tối đa Cho phép | Tiêu chuẩn Căn cứ | Mức độ Rủi ro |
|---|---|---|---|
| Cadmium (Cd) | ≤ 0.05 mg/kg | GB 2762-2022 | Rất nghiêm trọng (Critical) |
| Dithiocarbamates | ≤ 2.00 mg/kg | GB 2763-2021 | Nghiêm trọng (High) |
| Chlorpyrifos | ≤ 0.01 mg/kg (Cấm dùng) | GB 2763-2021 | Rất nghiêm trọng (Critical) |
| Permethrin | ≤ 0.05 mg/kg | GB 2763-2021 | Trung bình (Medium) |
| Carbendazim | ≤ 0.50 mg/kg | GB 2763-2021 | Trung bình (Medium) |

### 4.3. Quy định Tem Nhãn phụ GACC (Lệnh 248 & 249)
100% thùng hàng sầu riêng xuất khẩu sang Trung Quốc phải in dán tem nhãn phụ bằng Tiếng Trung hoặc Tiếng Anh chứa các thông tin:
- Tên nông sản: Sầu riêng tươi (Fresh Durian / 鲜榴莲)
- Mã số Vùng trồng (PUC) và Mã số Cơ sở Đóng gói (PHC).
- Dòng chữ bắt buộc bằng tiếng Trung: **“输往中华人民共和国”** (Xuất khẩu sang Nước Cộng hòa Nhân dân Trung Hoa).

---

## CHƯƠNG V: MÔ HÌNH DỮ LIỆU VÀ QUY CHUẨN GIAO TIẾP API

### 5.1. Từ điển Dữ liệu CSDL (Prisma Schema Data Dictionary)

1. **`organizations`**: Quản lý thông tin Doanh nghiệp xuất khẩu (Tên, Mã số thuế, Nông sản chủ lực, Thị trường).
2. **`products`**: Quản lý dòng sản phẩm nông sản (Tên sản phẩm, Mã HS `0810.60.00`, Xuất xứ).
3. **`batches`**: Quản lý Lô hàng xuất khẩu cụ thể (Mã lô, Số lượng, Đơn vị, Ngày đóng gói, Trạng thái tuân thủ).
4. **`documents`**: Quản lý tài liệu chứng từ (Loại chứng từ `PHYTO`, `LAB_REPORT`, `CO`, `GPS_MAP`, URL lưu trữ Supabase Storage).
5. **`regulations` & `mrl_limits`**: Thư viện quy định pháp lý và ngưỡng MRL luật định.
6. **`compliance_checks` & `compliance_items`**: Nhật ký phiên kiểm tra tuân thủ và danh sách các vi phạm/cảnh báo kèm `citationIds`.
7. **`reports`**: Báo cáo tuân thủ chính thức kèm phiên bản (`version`), trạng thái (`status`) và mã Hash kiểm toán.
8. **`audit_logs`**: Nhật ký kiểm toán hệ thống bất biến (Append-only).

### 5.2. Chuẩn Gói Phản hồi API (Response Envelope)

Tất cả các API Endpoints tuân thủ định dạng phản hồi chuẩn:

- **Phản hồi Thành công (200 / 201)**:
```json
{
  "data": { ... },
  "meta": {
    "requestId": "req_8f9b2c4e1a0d88f"
  }
}
```

- **Phản hồi Lỗi (4xx / 5xx)**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu kiểm nghiệm không hợp lệ",
    "details": [ ... ],
    "requestId": "req_8f9b2c4e1a0d88f"
  }
}
```

### 5.3. Tiêu chuẩn Hoàn thành (Definition of Done - DoD)
Một tính năng chỉ được nghiệm thu khi đáp ứng đủ 10 tiêu chí:
1. Giao diện Frontend hoàn chỉnh, 0% dữ liệu mock trong đường dẫn sản xuất.
2. API backend thực tế kết nối CSDL PostgreSQL.
3. Xác thực Zod Schema ở cả Frontend Form và Backend Controller.
4. Kiểm tra phân quyền RBAC server-side cho mọi thao tác biến đổi dữ liệu.
5. Hiển thị đầy đủ Loading state, Empty state và Error state.
6. Ghi vết Audit Log cho mọi hành động quan trọng.
7. Không làm lộ bí mật (Secrets) trong mã nguồn hoặc gói bundle client.
8. Biên dịch thành công 100% không lỗi TypeScript (`tsc --noEmit`).
9. Biên dịch thành công 100% Next.js production build (`next build`).
10. Đảm bảo tính cô lập dữ liệu tuyệt đối giữa các Doanh nghiệp (Multi-tenant RLS).

---

*Tài liệu này là quy chuẩn kỹ thuật chính thức áp dụng cho việc vận hành và phát triển hệ thống Themis LexiGuard.*

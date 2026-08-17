# 🏛️ Themis LexiGuard — AI Compliance Navigator for Agricultural Export

![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)
![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Prisma](https://img.shields.io/badge/Prisma-6.9-2D3748?logo=prisma)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.4-4285F4?logo=google-gemini)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwind-css)

> **"Biến rào cản pháp lý thành lợi thế cạnh tranh xuất khẩu"**  
> **Themis LexiGuard** là nền tảng AI hỗ trợ doanh nghiệp xuất khẩu nông sản (MVP: **Sầu riêng tươi xuất khẩu sang thị trường Trung Quốc theo Nghị định thư Hải quan GACC — Mã HS: 0810.60.00**) tự động hóa quá trình kiểm tra tuân thủ pháp lý, thẩm định chứng từ, phát hiện rủi ro sớm và trích dẫn điều khoản luật có căn cứ.

---

## 👥 Đội Ngũ Thực Hiện Dự Án (Team Members)

| STT | Họ và Tên | Vai trò |
| :---: | :--- | :--- |
| 1 | **Phạm Thành Long** | 👑 **Nhóm trưởng** |
| 2 | Đàm Công Tú | Thành viên |
| 3 | Chăm Rốch Thi | Thành viên |
| 4 | Huỳnh Hoàng Quân | Thành viên |
| 5 | Nguyễn Tiến Thành | Thành viên |
| 6 | Hà Anh Tuấn | Thành viên |

---

## 📖 Câu Chuyện & Bối Cảnh Dự Án (Our Story)

Việt Nam tự hào là một trong những quốc gia xuất khẩu nông sản hàng đầu thế giới, trong đó **Sầu riêng tươi** là mặt hàng trái cây "tỷ đô" tăng trưởng bùng nổ, đóng góp lớn cho kim ngạch xuất khẩu quốc gia sang thị trường **Trung Quốc (Tổng cục Hải quan GACC)**. Tuy nhiên, để xuất khẩu chính ngạch và thông quan thuận lợi, các doanh nghiệp xuất khẩu Việt Nam phải đối mặt với một loạt quy định pháp lý và tiêu chuẩn an toàn thực phẩm khắt khe:

- 🧪 **Giới hạn Kim loại nặng Cadmium (GB 2762-2022) & Dư lượng BVTV (GB 2763-2021):** Kiểm soát nghiêm ngặt hàm lượng Cadmium trong quả sầu riêng không vượt quá ngưỡng tối đa cho phép **0.05 mg/kg**.
- 🏷️ **Mã số Vùng trồng (PUC) & Cơ sở Đóng gói (PHC):** 100% lô hàng bắt buộc phải xuất phát từ các vùng trồng và xưởng đóng gói được Hải quan Trung Quốc (GACC) phê duyệt mã định danh và còn hiệu lực.
- 📄 **Giấy chứng nhận Kiểm dịch thực vật (Phytosanitary Certificate):** Cấp bởi Cục Bảo vệ Thực vật Việt Nam, xác nhận lô hàng không nhiễm các đối tượng sinh vật gây hại (ruồi đục quả, rệp sáp, sâu đục cuống) thuộc diện kiểm dịch của phía Trung Quốc.
- 📦 **Quy chuẩn ghi nhãn & Bao bì thùng carton (15kg):** In đầy đủ thông tin song ngữ (hoặc tiếng Trung), tên loại sầu riêng, mã PUC, mã PHC theo đúng Điều 7 Nghị định thư.

Một sai sót nhỏ trong hồ sơ chứng từ hoặc một chỉ tiêu Cadmium vượt ngưỡng có thể dẫn đến hậu quả nghiêm trọng: **Toàn bộ container sầu riêng bị tạm giữ tại cửa khẩu, bị trả về, tiêu hủy hoặc bị thu hồi mã vùng trồng, gây thiệt hại tài chính hàng trăm triệu đến hàng tỷ đồng mỗi lô hàng.**

---

## ❓ Vấn Đề Cần Giải Quyết (The Problem Statement)

Qua khảo sát thực tế, quy trình kiểm tra và quản lý tuân thủ thủ công tại các doanh nghiệp xuất khẩu nông sản hiện nay đang gặp phải **7 điểm nghẽn nghiêm trọng**:

1. 🔍 **Quy định phân tán & Phức tạp:** Văn bản luật EU nằm rải rác ở hàng chục cổng thông tin quốc tế, ngôn ngữ chuyên ngành bằng tiếng Anh/Pháp khó tra cứu và dễ hiểu sai.
2. 🎯 **Mơ hồ trong áp dụng:** Khó xác định chính xác quy định nào áp dụng cho từng mã HS Code, dòng sản phẩm (cà phê nhân xanh, cà phê rang xay) hay thị trường ngách.
3. 📁 **Chứng từ & Dữ liệu rời rạc:** Dữ liệu lô hàng, kết quả kiểm nghiệm MRL, mã định vị GPS và chứng thư bị quản lý phân tán bằng Excel, Zalo, giấy tờ thủ công.
4. ⏰ **Phát hiện rủi ro quá muộn:** Doanh nghiệp thường chỉ phát hiện sai sót khi hàng đã đóng container lên tàu hoặc bị đối tác/hải quan EU kiểm tra tại cảng đích.
5. ⚖️ **Kiểm tra thiếu căn cứ pháp lý:** Đánh giá cảm tính, thiếu liên kết trực tiếp tới điều khoản văn bản luật và phiên bản đang có hiệu lực.
6. 📋 **Bị động trong xử lý sự cố:** Khi phát hiện cảnh báo vi phạm, doanh nghiệp không có quy trình chuẩn hay danh sách hành động khắc phục cụ thể để xử lý kịp thời.
7. 🔄 **Không theo kịp thay đổi luật:** Khi EU ban hành luật mới hoặc cập nhật mức MRL, doanh nghiệp hoàn toàn bị động và không biết sản phẩm/lô hàng nào của mình chịu ảnh hưởng.

---

## 💡 Giải Pháp Themis LexiGuard & 5 Giá Trị Cốt Lõi

**Themis LexiGuard** ra đời như một **"Trợ lý Điều hướng Tuân thủ AI"** toàn diện, giải quyết triệt để 7 điểm nghẽn trên thông qua **5 giá trị cốt lõi**:

| # | Giá Trị Cốt Lõi | Mô Tả Giải Pháp |
|---|---|---|
| 📂 | **Tập trung hóa dữ liệu (Centralization)** | Quản lý tập trung Sản phẩm, Lô hàng, Mã vùng trồng, Kiểm nghiệm MRL, Chứng thư và Báo cáo trên một nền tảng duy nhất. |
| 🛡️ | **Kiểm tra sớm (Proactive Risk Assessment)** | Thẩm định rủi ro pháp lý ngay từ khâu chuẩn bị lô hàng, trước khi thu mua, đóng gói hoặc xuất cảng. |
| 📜 | **Phân tích có căn cứ (Verifiable AI)** | Mọi kết luận AI trả về đều đi kèm trích dẫn điều khoản luật cụ thể (Regulation No., Article ID, Annex) và ngày hiệu lực. |
| 🔔 | **Theo dõi thay đổi (Legal Impact Tracking)** | Khi EU cập nhật luật mới, hệ thống tự động quét và phát hiện các sản phẩm/lô hàng trong danh mục có thể bị ảnh hưởng. |
| 🛠️ | **Đề xuất lộ trình (Actionable Guidance)** | Cung cấp Action Tasks từng bước giúp doanh nghiệp bổ sung chứng từ, điều chỉnh chỉ tiêu hoặc kiểm nghiệm lại kịp thời. |

---

## 🏗️ Kiến Trúc Hệ Thống & Luồng Dữ Liệu (System Architecture)

### 1. Sơ Đồ Tổng Quan Kiến Trúc (Architecture Diagram)

```mermaid
graph TD
    subgraph ClientLayer ["Client Layer (Frontend & Mobile)"]
        UI["Next.js 15 App Router (fe/)"]
        MOB["Expo React Native (mobile/)"]
        Form["React Hook Form + Zod"]
        State["Server State API Client"]
    end

    subgraph ServiceLayer ["Service Layer (Backend API & Middleware)"]
        API["Express.js Server (be/)"]
        AuthM["Supabase JWT Auth Middleware"]
        RBACM["Organization RBAC Middleware"]
        ValM["Zod Request Validation"]
        Ctrl["Domain Controllers"]
    end

    subgraph IntelligenceEngine ["Intelligence Engine"]
        RE["Deterministic Rule Engine\n(MRL limits, Doc expiry, Code match)"]
        RAG["RAG Engine (pgvector)"]
        AI["Google Gemini 2.4 API"]
    end

    subgraph DataStorage ["Data & Storage Layer"]
        DB[(Supabase PostgreSQL)]
        Prisma["Prisma ORM"]
        Audit["Append-Only Audit Log"]
    end

    subgraph WorkerLayer ["Background Workers (be/src/jobs/)"]
        J1["Legal Sync Worker"]
        J2["Doc Extraction Worker"]
        J3["AI Compliance Worker"]
        J4["Notification Worker"]
    end

    UI -->|HTTPS / REST API| API
    MOB -->|HTTPS / REST API| API
    API --> AuthM --> RBACM --> ValM --> Ctrl
    Ctrl --> RE
    Ctrl --> RAG
    RAG --> AI
    Ctrl --> Prisma --> DB
    Ctrl --> Audit
    J1 & J2 & J3 & J4 --> DB
```

---

### 2. Sơ Đồ Luồng Nghiệp Vụ Cốt Lõi (Core Business Workflow)

```mermaid
flowchart TD
    A[Doanh Nghiệp Onboarding / Chọn Workspace] --> B[Tạo Hồ Sơ Sản Phẩm & Mã Vùng Trồng GPS]
    B --> C[Tạo Lô Hàng Export Batch]
    C --> D[Tải Lên Chứng Từ: MRL, Phyto, CO, EUDR Statement]
    D --> E[Khởi Tạo Compliance Check Package]
    
    E --> F{Hệ Thống Phân Tích}
    F -->|1. Rule Engine| F1[Kiểm tra định lượng MRL & Hạn dùng]
    F -->|2. Gemini AI + RAG| F2[Đánh giá điều khoản định tính & Trích dẫn Luật EU]
    
    F1 & F2 --> G{Kết Quả Thẩm Định}
    G -->|Compliant| H[Sinh Báo Cáo Tuân Thủ EU Compliant Report]
    G -->|Non-Compliant / Action Required| I[Tạo Cảnh Báo Findings & Giao Remediation Tasks]
    
    I --> J[Chuyên Viên Xử Lý Minh Chứng & Chạy Re-check]
    J --> H
    
    K[Scheduler Sync Luật EU Mới] --> L[Legal Impact Engine Scans System] --> I
```

---

## 🔑 Ma Trận Phân Quyền (RBAC Matrix)

Hệ thống phân quyền nghiêm ngặt theo mô hình Organization:

| Chức năng / Hành động | Owner | Manager | Analyst | Viewer |
|---|:---:|:---:|:---:|:---:|
| Quản lý Organization & Thành viên | ✅ | ❌ | ❌ | ❌ |
| Tạo / Cập nhật Sản phẩm & Lô hàng | ✅ | ✅ | ✅ | ❌ |
| Xóa Sản phẩm / Lô hàng | ✅ | ✅ | ❌ | ❌ |
| Tải lên Chứng từ & Hồ sơ | ✅ | ✅ | ✅ | ❌ |
| Chạy AI Compliance Check | ✅ | ✅ | ✅ | ❌ |
| Phê duyệt Báo cáo Compliance | ✅ | ✅ | ❌ | ❌ |
| Giao nhiệm vụ khắc phục (Remediation Task) | ✅ | ✅ | ❌ | ❌ |
| Xem Dashboard, Sản phẩm & Báo cáo | ✅ | ✅ | ✅ | ✅ |

---

## 🛠️ Chi Tiết Công Nghệ Sử Dụng (Tech Stack)

### Frontend (`fe/`)
- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 + Motion (framer-motion)
- **UI Components & Icons:** Custom Design Tokens, Lucide React Icons
- **Form & Validation:** React Hook Form + Zod Validation Schema
- **API Communication:** Centralized API Client (`fe/src/lib/api.ts`)

### Backend (`be/`)
- **Core Engine:** Node.js + Express.js + TypeScript
- **Database & ORM:** Supabase PostgreSQL (với RLS & pgvector) + Prisma ORM
- **AI & RAG:** Google Gemini 2.4 API (`@google/genai`) + Custom Deterministic Rule Engine
- **Authentication & Authorization:** Supabase Auth JWT + Multi-tenant RBAC Middleware
- **Security & Logging:** Helmet, Express Rate Limit, Zod Schema Middleware, Audit Logging
- **Background Workers (`be/src/jobs/`):** Workers xử lý trích xuất văn bản, kiểm tra tuân thủ AI, đồng bộ luật và gửi thông báo.

---

## 📁 Cấu Trúc Thư Mục Dự Án (Monorepo)

```text
Module2_ProductDesign_/
├── fe/                         # Frontend Application (Next.js 15 App Router - Modular SRP Structure)
│   ├── src/
│   │   ├── app/                # Next.js App Router (Next 15)
│   │   │   ├── (auth)/         # Auth routes (/login, /reset-password)
│   │   │   └── (dashboard)/    # Protected routes (/dashboard, /admin, /pending-access)
│   │   ├── components/         # Shared UI Primitives (Button, Input, Layout)
│   │   ├── features/           # Modular Feature Orchestrators (auth, admin, settings, etc.)
│   │   │   ├── auth/           # Auth Feature (AuthBrandingPanel, LoginView, RegisterView, PendingAccessView)
│   │   │   ├── settings/       # Settings Feature (ProfileSettingsTab, MemberSettingsTab, SecuritySettingsTab)
│   │   │   └── products/       # Products & Batches feature modules
│   │   ├── lib/api.ts          # Central API Client with JWT Auth headers
│   │   └── types/              # Shared TypeScript definitions & Zod schemas
│   ├── public/                 # Static assets
│   └── package.json
│
├── be/                         # Backend Server & Worker Engine (Express + Prisma)
│   ├── prisma/                 # Prisma Schema & Migration files
│   │   └── schema.prisma       # Database schema definition
│   ├── src/
│   │   ├── modules/            # API Modules (auth, products, batches, compliance, reports, etc.)
│   │   ├── jobs/               # Background Workers (doc-processing, compliance, legal-sync)
│   │   ├── middleware/         # Auth, RBAC, Rate limit, Zod validation
│   │   └── index.ts            # Server Entry point
│   └── package.json
│
├── docs/                       # Tài liệu thiết kế hệ thống
│   ├── usecases/               # Phân rã chi tiết Use Cases (UC-00 tới UC-10)
│   └── uml/                    # Sơ đồ PlantUML hệ thống (.uml)
├── .agents/                    # Master Agent Rules & Reference Docs
│   └── ref/                    # Reference Documents (01-product.md -> 10-done.md)
├── AGENTS.md                   # Bộ Quy tắc Quản trị Hệ thống (Master System Rules)
├── CHANGELOG.md                # Lịch sử ghi vết thay đổi hệ thống
└── README.md                   # Tài liệu hướng dẫn & Giới thiệu dự án (File này)
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Môi Trường Local

### Yêu cầu hệ thống:
- **Node.js**: `v20.x` trở lên
- **Package Manager**: `npm`
- **Database**: Supabase PostgreSQL + Prisma

---

### 1️⃣ Thiết lập Backend API (`be/`)

```bash
# Di chuyển vào thư mục backend
cd be

# Cài đặt các thư viện phụ thuộc
npm install

# Tạo file biến môi trường
cp .env.example .env
```

**Bảng Cấu Hình Biến Môi Trường (`be/.env`):**

| Biến môi trường | Mô tả |
|---|---|
| `DATABASE_URL` | Pooled Postgres connection URL từ Supabase |
| `DIRECT_URL` | Direct Postgres connection URL dùng cho Prisma Migrate |
| `SUPABASE_URL` | URL dự án Supabase của bạn |
| `SUPABASE_ANON_KEY` | Public Anon Key của Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key (chỉ dùng ở BE, không leak ra client) |
| `GEMINI_API_KEY` | API Key cho Google Gemini AI Engine |
| `PORT` | Port chạy Express Server (Mặc định: `5000`) |

```bash
# Khởi tạo Prisma Client & Migrate Database Schema
npm run db:generate
npm run db:migrate

# (Tùy chọn) Nạp dữ liệu mẫu
npm run db:seed

# Khởi chạy Backend Server ở chế độ Development
npm run dev
```
👉 Backend API sẽ hoạt động tại: `http://localhost:5000`

---

### 1️⃣ Chạy Backend API Server (`be/`)
```bash
cd be
npm install
npm run db:generate    # Khởi tạo Prisma Client
npm run dev            # Server chạy ở http://localhost:3001
```

### 2️⃣ Chạy Frontend Web UI (`fe/`)
```bash
cd fe
npm install
npm run dev            # Web app chạy ở http://localhost:3000
```

### 3️⃣ Chạy Ứng Dụng Di Động Mobile Expo (`mobile/`)
```bash
cd mobile
npm install
npm start              # Khởi chạy ứng dụng di động trên Expo Go
```

---

## 📱 Ứng Dụng Di Động Mobile Expo (Themis LexiGuard Mobile)

Ứng dụng di động **Themis LexiGuard Mobile** được thiết kế tinh gọn trên nền tảng **Expo React Native**, kết nối 100% với Express Backend API sẵn có:

- 📡 **Tab 1: Ra-da Quy Định GACC & Cadmium (`Legal Risk Radar`)**: Cảnh báo rủi ro tiệm cận ngưỡng Cadmium $\le 0.05\text{ mg/kg}$ và đếm ngược hạn Phyto 14 ngày.
- 📷 **Tab 2: Kiểm Định Thực Địa 4 Khóa (`Field Compliance Scan`)**: Hỗ trợ cán bộ QA/QC nạp chứng thư và đánh giá % hoàn thiện hồ sơ.
- 🚛 **Tab 3: Quản Lý Lô Hàng Sầu Riêng (`Export Batch Tracker`)**: Tra cứu sản lượng, định giá cont lạnh và mã băm SHA-256 niêm phong.

### 🖼️ Hình Ảnh Giao Diện Thực Tế Ứng Dụng Mobile:
| Tab 1: Ra-da Quy Định GACC | Tab 2: Quét Hồ Sơ 4 Khóa | Tab 3: Tra Cứu Lô Hàng |
| :---: | :---: | :---: |
| ![Tab 1 Legal Radar](docs/mobile-prompts/tab1_legal_radar.jpg) | ![Tab 2 Field Scan](docs/mobile-prompts/tab2_field_scan.jpg) | ![Tab 3 Batch Tracker](docs/mobile-prompts/tab3_batch_tracker.jpg) |

---

## 🔑 Tài Khoản Thử Nghiệm Mẫu (Sample Account)

> **Tài khoản doanh nghiệp xuất khẩu đã được khởi tạo và kích hoạt sẵn trên Supabase Database:**

* **Email:** `themis_exporter_1786179990121@yopmail.com`
* **Mật khẩu:** `ThemisLexiGuard2026!`
* **Doanh nghiệp:** *Công ty CP Xuất Nhập Khẩu Nông Sản Tây Nguyên*
* **Chức vụ / Phân quyền:** `OWNER` (Chủ doanh nghiệp)

---

## 📜 Các Scripts Khởi Chạy (NPM Scripts)

### Frontend (`fe/`)
- `npm run dev`: Chạy Next.js Development Server (port 3000)
- `npm run build`: Build bản Production ứng dụng Next.js
- `npm run start`: Chạy server production từ bản build
- `npm run lint`: Kiểm tra syntax & quy tắc ESLint

### Backend (`be/`)
- `npm run dev`: Chạy Express Server bằng `tsx watch` (port 5000)
- `npm run build`: Compile TypeScript thành JavaScript trong `dist/`
- `npm run start`: Chạy Production server từ `dist/index.js`
- `npm run db:generate`: Sinh Prisma Client mới nhất từ `schema.prisma`
- `npm run db:migrate`: Chạy migrations tới database Supabase
- `npm run db:studio`: Mở giao diện Prisma Studio tra cứu dữ liệu
- `npm run db:seed`: Khởi tạo dữ liệu mẫu cho database

---

## 📊 Hệ Thống Trạng Thái Chuẩn Hóa (Status Enums)

Mọi đối tượng trong hệ thống đều tuân theo các trạng thái định danh chuẩn xác:

* **Batch Status (`batch.status`):** `draft` | `collecting_documents` | `ready_for_check` | `checking` | `action_required` | `compliant` | `non_compliant` | `expired`
* **Check Status (`check.status`):** `queued` | `processing` | `needs_input` | `completed` | `failed` | `cancelled` | `superseded`
* **Check Result (`check.result`):** `compliant` | `conditionally_compliant` | `non_compliant` | `insufficient_information` | `not_applicable` | `manual_review_required`
* **Finding Severity (`finding.severity`):** `critical` | `high` | `medium` | `low` | `informational`
* **Document Status (`doc.status`):** `uploaded` | `queued` | `processing` | `extracted` | `needs_review` | `failed`

---

## 🛡️ Quy Tắc Kỹ Thuật Bắt Buộc (Absolute Prohibitions)

1. ❌ **Không dùng tên cũ "Coffee EU-Check AI"** dưới mọi hình thức.
2. ❌ **Không mock/setTimeout** trong production code path.
3. ❌ **Không hardcode màu hex** — luôn sử dụng CSS Variable tokens.
4. ❌ **Không gọi Gemini API từ Frontend** — bắt buộc gọi qua Backend pipeline.
5. ❌ **Không bao giờ lộ `SUPABASE_SERVICE_ROLE_KEY` hay `GEMINI_API_KEY`** ra phía client.
6. ❌ **Không kết luận `compliant`** khi kết quả AI thiếu `citationIds` (trích dẫn điều khoản luật).
7. ❌ **Không ghi đè báo cáo đã duyệt** — bắt buộc tạo version mới.
8. ❌ **Bắt buộc cập nhật [CHANGELOG.md](file:///d:/AI/module_2/Module2_ProductDesign_/CHANGELOG.md)** sau mỗi công việc/thay đổi hệ thống.

---

## 👥 Phân Công Vai Trò & Thành Viên Thực Hiện (Team 7 Người)

=======
```bash
npm run build
```
## Scripts (Ví dụ)

**Frontend (`fe/`)**:
- `npm run dev`: Chạy Next.js dev server.
- `npm run build`: Build production.
- `npm run start`: Chạy server production.

**Backend (`be/`)**:
- `npm run dev`: Chạy Express server.
- `npm run db:generate`: Khởi tạo Prisma Client.
- `npm run db:migrate`: Chạy migration database.

## Phân công vai trò (Team 7 người)

>>>>>>> c04d463 (docs: add detailed usecase breakdown, uml diagrams, and visual flows)
| STT | Họ và Tên | Vai trò dự kiến | Nhiệm vụ chính |
|:---:|---|---|---|
| 1 | **Phạm Thành Long** | Tech Lead & AI Engineer | Setup kiến trúc (FE/BE), kết nối Supabase, Prisma, tích hợp Gemini AI và duyệt PR. |
| 2 | **Đàm Công Tú** | Product Owner / QA | Viết User Stories, kịch bản test, chuẩn bị dữ liệu pháp lý (Luật EU) & test UX/UI. |
| 3 | **Chăm Rốch Thi** | Frontend (Core & Auth) | Dựng layout (Sidebar, Topbar), Next.js Routing, tích hợp trang Đăng nhập / Đăng ký. |
| 4 | **Huỳnh Hoàng Quân** | Frontend (Data UI) | Code giao diện Dashboard (Biểu đồ, KPI), Thư viện pháp lý và Giám sát liêm chính. |
| 5 | **Nguyễn Tiến Thành** | Frontend (Forms & Ops) | Code giao diện Quản lý Sản phẩm, Lô hàng, upload file chứng từ và Báo cáo. |
| 6 | **Hà Anh Tuấn** | Backend (API & DB) | Xây dựng RESTful API (Express), viết các logic CRUD cho Products, Batches bằng Prisma. |
| 7 | **Tạ Lê Anh Bảo** | Backend (Services & Jobs) | Viết Middleware (Auth, RBAC), logic bóc tách dữ liệu (OCR) và cron jobs (đồng bộ luật). |
<<<<<<< HEAD

---

## 📜 Quy Định & Giấy Phép

Dự án tuân thủ nghiêm ngặt **Master System Rules** tại [AGENTS.md](file:///d:/AI/module_2/Module2_ProductDesign_/AGENTS.md) và **System Implementation Plan** tại [docs/plan.md](file:///d:/AI/module_2/Module2_ProductDesign_/docs/plan.md).  
Mọi thay đổi nâng cấp hệ thống được ghi chép minh bạch tại [CHANGELOG.md](file:///d:/AI/module_2/Module2_ProductDesign_/CHANGELOG.md).
=======
>>>>>>> c04d463 (docs: add detailed usecase breakdown, uml diagrams, and visual flows)

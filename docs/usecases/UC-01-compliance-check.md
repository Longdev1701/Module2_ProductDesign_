# UC-01 — AI Compliance Check

> **Mức độ:** Level 1 (Use Case chính — Core Feature)  
> **Actor chính:** Compliance Analyst, Compliance Manager, Owner/CEO  
> **Priority:** P0 — Tính năng cốt lõi của hệ thống

---

## Cây phân rã

```
UC-01: AI Compliance Check
├── UC-01.1: Khởi tạo Compliance Check
│   ├── UC-01.1.1: Chọn lô hàng cần kiểm tra
│   ├── UC-01.1.2: Xác nhận danh sách tài liệu đầu vào
│   └── UC-01.1.3: Chọn thị trường & loại kiểm tra
│
├── UC-01.2: Xác định quy định áp dụng (Applicability)
│   ├── UC-01.2.1: Mapping sản phẩm → thị trường → nhóm quy định
│   ├── UC-01.2.2: Kiểm tra ngày hiệu lực quy định
│   └── UC-01.2.3: Loại trừ quy định không áp dụng
│
├── UC-01.3: Deterministic Rule Engine
│   ├── UC-01.3.1: Kiểm tra MRL (dư lượng thuốc bảo vệ thực vật)
│   ├── UC-01.3.2: Kiểm tra ngày hết hạn tài liệu
│   ├── UC-01.3.3: Kiểm tra tài liệu bắt buộc còn thiếu
│   ├── UC-01.3.4: Kiểm tra batch code khớp giữa các chứng từ
│   ├── UC-01.3.5: Kiểm tra số certificate bị trùng
│   └── UC-01.3.6: Kiểm tra đơn vị đo lường hợp lệ
│
├── UC-01.4: AI Analysis (RAG + Gemini)
│   ├── UC-01.4.1: RAG retrieval — tìm chunks quy định liên quan
│   ├── UC-01.4.2: Build prompt (system + domain + user context)
│   ├── UC-01.4.3: Gọi Gemini API
│   ├── UC-01.4.4: Validate structured output (Zod)
│   └── UC-01.4.5: Reject output nếu thiếu citation
│
├── UC-01.5: Tổng hợp kết quả
│   ├── UC-01.5.1: Merge findings (deterministic + AI)
│   ├── UC-01.5.2: Tính Risk Score tổng hợp
│   ├── UC-01.5.3: Xác định kết quả cuối (result enum)
│   └── UC-01.5.4: Sinh báo cáo (Report)
│
├── UC-01.6: Review & Approve báo cáo
│   ├── UC-01.6.1: Xem chi tiết từng Finding + Citation
│   ├── UC-01.6.2: Approve báo cáo
│   ├── UC-01.6.3: Request revision (trả lại để chỉnh)
│   └── UC-01.6.4: Export báo cáo PDF
│
├── UC-01.7: Xử lý Finding & Remediation
│   ├── UC-01.7.1: Tạo Remediation Task từ Finding
│   ├── UC-01.7.2: Hoàn thành task + đính kèm bằng chứng
│   └── UC-01.7.3: Re-check sau khi xử lý
│
└── UC-01.8: Quản lý trạng thái Check
    ├── UC-01.8.1: Hủy check đang chạy (Cancel)
    ├── UC-01.8.2: Retry check thất bại
    └── UC-01.8.3: Supersede check cũ bằng check mới
```

---

## Luồng hoạt động chi tiết (End-to-End Flow)

```
User (Compliance Analyst)
  ↓ Đăng nhập, chọn org
  ↓
[UC-01.1] Khởi tạo Check
  ↓ Chọn batch + xác nhận documents
  ↓ POST /api/compliance/checks
  ↓
Backend: Tạo ComplianceCheck { status: "queued" }
  ↓ Ghi AuditLog: check.created
  ↓ Dispatch background job: compliance-analysis-job
  ↓
[Job] compliance-analysis-worker
  ↓
  [UC-01.2] Xác định quy định áp dụng
    ↓ Query: Regulation WHERE market = EU AND product_type = COFFEE
    ↓ Filter: effective_at <= ngày check, status IN (effective, upcoming)
    ↓
  [UC-01.3] Deterministic Rule Engine
    ↓ Đọc extracted data từ DocumentExtraction
    ↓ Chạy code rules: MRL, expiry, missing docs, batch code...
    ↓ Tạo Finding records (severity: critical/high/medium/low)
    ↓ Mỗi Finding PHẢI có citationIds
    ↓
  [UC-01.4] AI Analysis
    ↓ RAG: hybrid search pgvector + keyword
    ↓   → Lấy top K regulation chunks liên quan
    ↓ Build prompt: system_prompt + domain_prompt + user_context
    ↓   user_context = { batch metadata, extracted fields, applicable_regs }
    ↓ Gọi Gemini API (backend chỉ, không qua FE)
    ↓ Nhận JSON response
    ↓ Validate Zod schema
    ↓   - Nếu thiếu citationIds → reject finding, log WARNING
    ↓   - Nếu confidence < 0.6 → manualReviewRequired = true
    ↓
  [UC-01.5] Merge & Score
    ↓ Merge: deterministic findings + AI findings
    ↓ Dedup findings (same code + same citation)
    ↓ Tính riskScore: weighted severity count
    ↓ Xác định result:
    ↓   - critical finding tồn tại → non_compliant
    ↓   - high finding → conditionally_compliant
    ↓   - manualReview = true → manual_review_required
    ↓   - thiếu data → insufficient_information
    ↓   - tất cả OK → compliant
    ↓
  Update ComplianceCheck { status: "completed", result, riskScore }
  ↓ Tạo Report record
  ↓ Ghi AIUsageEvent (token count, model, cost estimate)
  ↓ Ghi AuditLog: check.completed
  ↓
  [Supabase Realtime] Broadcast event "check:completed" → FE
  ↓
FE cập nhật UI (real-time)
  ↓
  [UC-01.6] Review
    ↓ Hiển thị: summary card, findings list, citations
    ↓ Manager/Owner: Approve hoặc Request Revision
    ↓ POST /api/reports/:id/approve
    ↓ Backend: Report.status = "approved", immutable
    ↓
  [UC-01.4.4] Export PDF
    ↓ POST /api/reports/:id/export
    ↓ Background job: generate PDF
    ↓ Lưu vào Supabase Storage
    ↓ Return signed URL (15 phút)
    ↓
  Notification → Email + In-App: "Báo cáo đã được tạo"
```

---

## UC-01.1 — Khởi tạo Compliance Check

### UC-01.1.1 — Chọn lô hàng cần kiểm tra

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.1.1 |
| **Tên** | Chọn lô hàng cần kiểm tra |
| **Mục tiêu** | User chọn batch cụ thể để tiến hành compliance check |
| **Actor** | Compliance Analyst, Manager, Owner |
| **Tiền điều kiện** | Batch tồn tại, status là `ready_for_check` |
| **Hậu điều kiện** | Batch được chọn làm đầu vào cho check |
| **Input** | `batchId` |
| **Output** | Danh sách tài liệu đính kèm batch, extracted data summary |

**Main Flow:**
1. User vào `/checks/new` hoặc từ Batch Detail page
2. FE hiển thị dropdown chọn Product → Batch
3. FE query: `GET /api/products/:id/batches?status=ready_for_check`
4. User chọn batch
5. FE load danh sách documents thuộc batch + trạng thái extraction

**Validation:**
- Batch phải thuộc org hiện tại
- Batch phải có status `ready_for_check` (không thể check batch còn `draft`)
- Batch phải có ít nhất 1 document đã `extracted`

**Exception Flow:**
- Batch chưa có document → "Lô hàng chưa có tài liệu. Vui lòng tải lên tài liệu trước"
- Batch có document chưa xử lý xong → "Đang xử lý tài liệu. Vui lòng chờ"

---

### UC-01.1.2 — Xác nhận danh sách tài liệu

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.1.2 |
| **Tên** | Xác nhận danh sách tài liệu đầu vào |
| **Mục tiêu** | User review và xác nhận tài liệu nào sẽ được đưa vào check |
| **Input** | `documentIds[]` (danh sách doc được chọn) |
| **Output** | Danh sách doc confirmed, locked version snapshot |

**Main Flow:**
1. FE hiển thị checkbox list: tên doc, loại, ngày upload, status extraction
2. User chọn/bỏ chọn tài liệu (tối thiểu 1)
3. Hiển thị warning nếu thiếu loại doc quan trọng (kết quả kiểm nghiệm, CO...)
4. User nhấn "Bắt đầu kiểm tra"

**Business Rule:**
- Phải có ít nhất 1 document đã extracted
- Nên có: `lab_result`, `certificate_of_origin`
- Hệ thống cảnh báo (không chặn) nếu thiếu doc quan trọng

---

### UC-01.1.3 — Chọn thị trường & loại kiểm tra

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.1.3 |
| **Input** | `market` (EU/USA/...), `checkType` (full/mrl_only/eudr_only) |

**Main Flow:**
1. FE hiển thị: thị trường (mặc định từ product.primaryMarket)
2. Loại kiểm tra: Full / MRL only / EUDR only / Label only
3. User confirm → Submit

---

## UC-01.2 — Xác định quy định áp dụng

### UC-01.2.1 — Mapping sản phẩm → quy định

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.2.1 |
| **Actor** | System (Background Job) |

**Logic:**
```typescript
// Lấy tất cả regulation version đang có hiệu lực cho market + product_type
const applicableRegs = await prisma.regulationVersion.findMany({
  where: {
    regulation: {
      markets: { has: market },      // EU
      productTypes: { has: "COFFEE" }
    },
    status: { in: ["effective", "upcoming"] },
    effective_at: { lte: checkDate }
  }
})
```

**Output:** Danh sách `RegulationVersion` áp dụng cho check này

---

## UC-01.3 — Deterministic Rule Engine

### UC-01.3.1 — Kiểm tra MRL

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.3.1 |
| **Tên** | Kiểm tra giới hạn dư lượng thuốc BVTV (MRL) |
| **Input** | `extractedLabResult`, `mrlTable` từ RegulationChunk |
| **Business Rule** | MRL vượt giới hạn → Finding severity: critical |

**Logic:**
```typescript
for (const pesticide of labResult.residues) {
  const allowedMrl = getMrlLimit(pesticide.name, "EU", "COFFEE")
  if (pesticide.value > allowedMrl) {
    createFinding({
      code: "MRL_LIMIT_EXCEEDED",
      severity: "critical",
      title: `${pesticide.name} vượt ngưỡng MRL EU`,
      observedData: `${pesticide.value} mg/kg`,
      requirement: `EU Reg 396/2005 giới hạn ${allowedMrl} mg/kg`,
      citationIds: [relevantChunkId]
    })
  }
}
```

---

### UC-01.3.2 — Kiểm tra ngày hết hạn tài liệu

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.3.2 |
| **Business Rule** | Tài liệu hết hạn trước ngày check → Finding severity: high |

```typescript
for (const doc of documents) {
  if (doc.expiryDate && doc.expiryDate < checkDate) {
    createFinding({
      code: "DOCUMENT_EXPIRED",
      severity: "high",
      title: `${doc.type} đã hết hạn (${doc.expiryDate})`,
      citationIds: [...]
    })
  }
}
```

---

### UC-01.3.3 — Kiểm tra tài liệu bắt buộc còn thiếu

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.3.3 |
| **Business Rule** | Thiếu tài liệu bắt buộc (lab_result, CO, EUDR declaration) → severity: critical |

```typescript
const required = getRequiredDocs(market, checkType)
for (const docType of required) {
  if (!batchDocs.find(d => d.type === docType && d.status === "extracted")) {
    createFinding({
      code: "MISSING_REQUIRED_DOCUMENT",
      severity: "critical",
      title: `Thiếu tài liệu bắt buộc: ${docType}`
    })
  }
}
```

---

### UC-01.3.4 — Kiểm tra batch code khớp

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.3.4 |
| **Business Rule** | Batch code trên các chứng từ phải khớp nhau |

---

### UC-01.3.5 — Kiểm tra certificate bị trùng

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.3.5 |
| **Business Rule** | Số certificate đã được dùng trong check khác → severity: high |

---

## UC-01.4 — AI Analysis

### UC-01.4.1 — RAG Retrieval

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.4.1 |
| **Tên** | Truy xuất chunks quy định liên quan |
| **Actor** | System |
| **Input** | Batch context, extracted data, applicable_regulation_ids |
| **Output** | Top K regulation chunks (text + embedding metadata) |

**Logic:**
```typescript
// Hybrid search: dense (pgvector) + sparse (keyword)
const query = buildSearchQuery(batchContext, marketContext)
const chunks = await hybridSearch({
  embedding: await embed(query),
  keywords:  extractKeywords(query),
  filter:    { regulationVersionIds: applicableRegIds },
  topK:      20
})
```

---

### UC-01.4.2 — Build Prompt

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.4.2 |
| **Output** | Prompt object: { systemPrompt, domainPrompt, userContext } |

**System Prompt** (cố định):
```
Bạn là AI phân tích tuân thủ pháp lý nông sản.
- Chỉ dùng context được cung cấp, không tự tạo quy định.
- Không kết luận compliant khi thiếu citation.
- Không kết luận khi confidence < 0.6.
- Phân biệt ngày công bố và ngày hiệu lực.
- Trả JSON đúng schema.
```

---

### UC-01.4.3 — Gọi Gemini API

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.4.3 |
| **Actor** | Backend service (KHÔNG gọi từ FE) |
| **Input** | Prompt object |
| **Output** | Raw JSON từ Gemini |

**Rate limit:** 10 checks/hour/org

---

### UC-01.4.4 — Validate Structured Output

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.4.4 |
| **Business Rule** | Zod validate bắt buộc trước khi lưu DB |

```typescript
const ComplianceOutputSchema = z.object({
  summary: z.object({
    result: z.enum(["compliant","conditionally_compliant","non_compliant",
                    "insufficient_information","not_applicable","manual_review_required"]),
    riskScore: z.number().min(0).max(100),
    confidence: z.number().min(0).max(1)
  }),
  findings: z.array(z.object({
    code: z.string(),
    title: z.string(),
    severity: z.enum(["critical","high","medium","low","informational"]),
    status: z.literal("open"),
    requirement: z.string(),
    observedData: z.string(),
    recommendation: z.string(),
    citationIds: z.array(z.string()).min(1), // BẮT BUỘC có citation
    confidence: z.number(),
    manualReviewRequired: z.boolean()
  })),
  missingInformation: z.array(z.object({
    field: z.string(),
    reason: z.string()
  }))
})
```

---

### UC-01.4.5 — Reject finding thiếu citation

```typescript
const validFindings = output.findings.filter(f => {
  if (!f.citationIds || f.citationIds.length === 0) {
    logger.warn("Finding rejected: no citationIds", { code: f.code })
    return false
  }
  return true
})
```

---

## UC-01.5 — Tổng hợp kết quả

### UC-01.5.2 — Tính Risk Score

| Severity | Điểm | Ghi chú |
|----------|------|---------|
| critical | 40 | Cộng cho mỗi finding |
| high | 20 | |
| medium | 10 | |
| low | 3 | |
| informational | 0 | |

```
riskScore = min(100, sum(findings.map(f => severityScore[f.severity])))
```

### UC-01.5.3 — Xác định result enum

```typescript
function determineResult(findings, hasManualReview, hasInsufficientInfo): ComplianceResult {
  if (hasInsufficientInfo)                          return "insufficient_information"
  if (hasManualReview)                              return "manual_review_required"
  if (findings.some(f => f.severity === "critical")) return "non_compliant"
  if (findings.some(f => f.severity === "high"))     return "conditionally_compliant"
  if (findings.length === 0)                         return "compliant"
  return "conditionally_compliant"
}
```

---

## UC-01.6 — Review, Approval & Versioning Báo cáo Tuân thủ

> **Vòng đời Báo cáo (Report Lifecycle):**
> `DRAFT` (Dự thảo) ──► `IN_REVIEW` (Đang thẩm định) ──► `CHANGES_REQUESTED` (Yêu cầu chỉnh sửa) ──► `APPROVED` (Đã duyệt) ──► `FINAL` (Chính thức - Bất biến)

### UC-01.6.2 — Phê duyệt Báo cáo (Approve Report)

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.6.2 |
| **Actor** | Compliance Manager, Owner |
| **Tiền điều kiện** | Báo cáo ở trạng thái `DRAFT` hoặc `IN_REVIEW`, các lỗi `CRITICAL` đã được giải trình/khắc phục |
| **Hậu điều kiện** | Report chuyển sang trạng thái `FINAL` (Chính thức - Immutable), không thể sửa trực tiếp |
| **API** | `POST /api/reports/:id/approve` |

**Quy tắc nghiệp vụ:**
- Báo cáo đã chuyển sang `FINAL` là **BẤT BIẾN (Immutable)** để phục vụ Kiểm toán (Audit Trail).
- Nếu cần điều chỉnh báo cáo đã `FINAL`, hệ thống **không ghi đè**, mà tạo **Phiên bản hiệu chỉnh mới (Revision)**: `Report v1 FINAL` ──► `Tạo Revision` ──► `Report v2 DRAFT`.
- Mọi báo cáo `FINAL` đều đi kèm Snapshot dữ liệu tài liệu + Snapshot trích dẫn luật tại thời điểm duyệt + Integrity Hash.

**Audit Log:** `{ action: "report.approved", reportId, version: 1, approverId, integrityHash, timestamp }`

---

### UC-01.6.4 — Export PDF

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.6.4 |
| **Actor** | Tất cả role có quyền xem |
| **Output** | Signed URL PDF (15 phút) |

**Flow:**
1. `POST /api/reports/:id/export`
2. Background job: render HTML template → PDF (Puppeteer)
3. Upload PDF → Supabase Storage (private bucket)
4. Tạo signed URL 15 phút
5. Return URL

**Rate limit:** 10 exports/hour/user

---

## UC-01.7 — Remediation

### UC-01.7.1 — Tạo Remediation Task

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.7.1 |
| **Actor** | Manager, Owner |
| **Input** | `findingId`, `title`, `description`, `assigneeId`, `dueDate` |
| **API** | `POST /api/findings/:id/tasks` |

**Validation:**
```
title:      required | max 200 ký tự
assigneeId: required | phải là member trong cùng org
dueDate:    required | phải sau ngày hôm nay
```

**Notification:** In-App + Email gửi cho assignee

---

### UC-01.7.3 — Re-check

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-01.7.3 |
| **Mục tiêu** | Chạy lại check mới sau khi đã xử lý remediation |
| **Business Rule** | Check cũ bị mark `superseded`, không bị xóa |
| **API** | `POST /api/compliance/checks/:id/recheck` |

---

## UC-01.8 — Quản lý trạng thái Check

### UC-01.8.1 — Hủy check (Cancel)

| Trường | Nội dung |
|--------|----------|
| **API** | `POST /api/compliance/checks/:id/cancel` |
| **Điều kiện** | Check đang ở trạng thái `queued` hoặc `processing` |
| **Actor** | Manager, Owner (người tạo check) |

---

## Screens liên quan

| Screen | Route | Mô tả |
|--------|-------|-------|
| Tạo Check | `/checks/new` | Wizard: chọn batch → confirm docs → chọn market |
| Check Detail | `/checks/:id` | Xem tiến trình real-time, kết quả, findings |
| Report Detail | `/reports/:id` | Xem báo cáo, approve, export |
| Batch Detail | `/batches/:id` | Xem danh sách checks của batch |

---

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/compliance/checks` | Tạo check mới |
| GET | `/api/compliance/checks` | Danh sách checks (paged) |
| GET | `/api/compliance/checks/:id` | Chi tiết check + status |
| POST | `/api/compliance/checks/:id/cancel` | Hủy check |
| POST | `/api/compliance/checks/:id/retry` | Retry khi failed |
| POST | `/api/compliance/checks/:id/recheck` | Tạo check mới (supersede cũ) |
| GET | `/api/checks/:id/findings` | Danh sách findings |
| PATCH | `/api/findings/:id` | Cập nhật finding (note, status) |
| POST | `/api/findings/:id/tasks` | Tạo remediation task |
| GET | `/api/reports/:id` | Xem report |
| POST | `/api/reports/:id/approve` | Approve report |
| POST | `/api/reports/:id/export` | Export PDF |
| GET | `/api/reports/:id/versions` | Lịch sử version |

---

## Database Tables

| Bảng | Thao tác |
|------|---------|
| `compliance_checks` | INSERT, UPDATE status/result |
| `compliance_check_documents` | INSERT (snapshot version) |
| `findings` | INSERT (bulk), UPDATE (status/note) |
| `finding_citations` | INSERT |
| `remediation_tasks` | INSERT, UPDATE |
| `remediation_evidence` | INSERT |
| `reports` | INSERT, UPDATE (approve) |
| `ai_usage_events` | INSERT (token tracking) |
| `audit_logs` | INSERT |

---

## Background Jobs

| Job | Trigger | Mô tả |
|-----|---------|-------|
| `compliance-analysis` | POST /api/compliance/checks | Chạy toàn bộ pipeline |
| `pdf-report-export` | POST /api/reports/:id/export | Tạo file PDF |
| `send-check-notification` | Check completed | Gửi email/in-app |

---

## Notifications

| Sự kiện | Kênh | Người nhận |
|---------|------|-----------|
| Check hoàn thành | Email + In-App | Người tạo check + Manager |
| Finding critical | Email + In-App | Manager + Owner |
| Report approved | In-App | Team members |
| Remediation task assigned | Email + In-App | Assignee |

---

## Audit Log Events

| Event | Khi nào |
|-------|---------|
| `check.created` | POST /api/compliance/checks |
| `check.started` | Job bắt đầu chạy |
| `check.completed` | Job hoàn thành |
| `check.failed` | Job lỗi |
| `check.cancelled` | User cancel |
| `check.retried` | User retry |
| `report.approved` | Manager/Owner approve |
| `report.revision_requested` | Request revision |
| `report.exported` | Export PDF |
| `task.created` | Tạo remediation task |
| `task.completed` | Hoàn thành task |

---

## Điều kiện hoàn thành (DoD)

- [ ] User tạo được check, hệ thống queue job thật
- [ ] Job chạy rule engine deterministic và sinh findings với citation
- [ ] Job gọi Gemini thật (không mock), nhận structured output
- [ ] Zod validate output, reject finding thiếu citation
- [ ] Batch.status tự động cập nhật: `ready_for_check` → `checking` → `compliant`/`non_compliant`/...
- [ ] Realtime update: FE thấy tiến trình check không cần reload
- [ ] Manager approve được report
- [ ] Report đã approve = immutable
- [ ] Export PDF thực tế, không phải file rỗng
- [ ] Audit log đầy đủ mọi sự kiện

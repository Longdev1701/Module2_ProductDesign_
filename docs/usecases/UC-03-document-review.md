# UC-03 — AI Document Review

> **Mức độ:** Level 1 (Use Case chính)  
> **Actor chính:** Nhân viên Compliance, Quản lý HTX  
> **Priority:** P0 — Tiền đề của UC-01

---

## Cây phân rã

```
UC-03: AI Document Review
├── UC-03.1: Upload tài liệu
│   ├── UC-03.1.1: Chọn và upload file (PDF/DOCX/XLSX/JPG/PNG)
│   ├── UC-03.1.2: Khai báo metadata tài liệu
│   └── UC-03.1.3: Upload lên Supabase Storage (Signed URL)
│
├── UC-03.2: AI OCR & Trích xuất văn bản
│   ├── UC-03.2.1: OCR file ảnh / PDF scanned
│   ├── UC-03.2.2: Trích xuất văn bản từ PDF native
│   └── UC-03.2.3: Trích xuất text từ DOCX/XLSX
│
├── UC-03.3: AI Structured Data Extraction
│   ├── UC-03.3.1: Nhận dạng loại tài liệu (classification)
│   ├── UC-03.3.2: Trích xuất các trường có cấu trúc
│   ├── UC-03.3.3: Phát hiện lỗi và bất nhất trong tài liệu
│   └── UC-03.3.4: Tính checksum & phát hiện trùng lặp
│
├── UC-03.4: Người dùng xác nhận dữ liệu trích xuất
│   ├── UC-03.4.1: Hiển thị dữ liệu trích xuất để review
│   ├── UC-03.4.2: Chỉnh sửa trường sai
│   └── UC-03.4.3: Xác nhận / từ chối tài liệu
│
├── UC-03.5: Versioning tài liệu
│   ├── UC-03.5.1: Tạo DocumentVersion mới khi cập nhật
│   └── UC-03.5.2: Lock version đã dùng trong check
│
└── UC-03.6: Xử lý lại (Reprocess)
    └── UC-03.6.1: Kích hoạt lại OCR/extraction cho tài liệu lỗi
```

---

## Luồng hoạt động chi tiết (End-to-End Flow)

```
User (Compliance Analyst)
  ↓
[UC-03.1] Upload file
  ↓ GET /api/documents/upload-url
  ↓ → BE sinh Signed URL (Supabase Storage, private bucket)
  ↓ FE upload trực tiếp lên Storage (bypass BE để tránh body size limit)
  ↓ FE gọi POST /api/documents { storageKey, type, batchId, metadata }
  ↓ BE tạo Document record { status: "uploaded" }
  ↓ BE ghi AuditLog: document.uploaded
  ↓ BE dispatch job: doc-processing-job
  ↓
[Background Job: doc-processing]
  ↓
  [UC-03.2] Text Extraction
    ↓ Download file từ Storage
    ↓ Phát hiện loại file (MIME type)
    ↓ PDF native? → pdf-parse → raw text
    ↓ PDF scanned / image? → Gemini Vision / Tesseract OCR
    ↓ DOCX? → mammoth → raw text
    ↓ XLSX? → xlsx-js → structured rows
    ↓ Update Document.status = "processing"
    ↓
  [UC-03.3] Structured Extraction
    ↓ Gemini: phân loại tài liệu (lab_result / CO / EUDR_declaration / ...)
    ↓ Gemini: trích xuất trường theo template của loại tài liệu
    ↓ Ví dụ Lab Result → extract: {
    ↓   batchCode, labName, testDate, expiryDate,
    ↓   residues: [{ name, value, unit, method }],
    ↓   productName, sampleWeight
    ↓ }
    ↓ Kiểm tra checksum: sha256(fileBuffer) → phát hiện file trùng
    ↓ Phát hiện bất nhất: batchCode không khớp với batch đang upload
    ↓ Tạo DocumentExtraction record
    ↓ Update Document.status = "extracted" hoặc "needs_review"
    ↓
  [Realtime] Broadcast: document:processed → FE
  ↓
[UC-03.4] User Review
  ↓ FE hiển thị: file preview (bên trái) + extracted data (bên phải)
  ↓ User kiểm tra từng trường
  ↓ User sửa nếu AI trích xuất sai
  ↓ User nhấn "Xác nhận" hoặc "Từ chối"
  ↓ POST /api/documents/:id/confirm { correctedData, confirmed: true }
  ↓ BE lưu confirmed extraction, tạo DocumentVersion
  ↓
Batch.status: collecting_documents → ready_for_check (khi đủ tài liệu required)
```

---

## UC-03.1 — Upload tài liệu

### UC-03.1.1 — Chọn và upload file

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.1.1 |
| **Tên** | Upload file tài liệu |
| **Mục tiêu** | User tải lên tài liệu pháp lý / kiểm nghiệm cho lô hàng |
| **Actor** | Compliance Analyst, Manager, Owner, Quản lý HTX |
| **Tiền điều kiện** | User có quyền `document.upload`, batch tồn tại và thuộc org |
| **Hậu điều kiện** | File lưu trên Storage, Document record tạo, job xử lý được dispatch |
| **Trigger** | User click "Tải lên tài liệu" trong Batch Detail |
| **Input** | File (PDF/DOCX/XLSX/JPG/PNG), `batchId`, `documentType` |
| **Output** | Document record (status: uploaded), processing job started |

**Validation:**
```
file.size:   max 50MB
file.type:   application/pdf | application/vnd.openxmlformats-officedocument.* 
             | image/jpeg | image/png | image/tiff
documentType: enum: lab_result | certificate_of_origin | eudr_declaration 
              | phytosanitary | organic_cert | other
```

**Security:**
- Supabase Storage: private bucket (không public)
- Tên file được sanitize: remove special chars, UUID prefix
- Virus scan: ClamAV scan trước khi process (nếu có)
- RLS: chỉ member của org mới download được

**API Flow:**
```
Step 1: GET /api/documents/upload-url?contentType=application/pdf&filename=lab_result.pdf
  → BE tạo Supabase signed upload URL (5 phút, max 50MB)
  → Return: { uploadUrl, storageKey }

Step 2: FE PUT file lên uploadUrl trực tiếp (multipart)

Step 3: POST /api/documents
  Body: { storageKey, batchId, type, originalFilename, fileSize, mimeType }
  → BE tạo Document record
  → BE verify file tồn tại trên Storage
  → Return: { documentId, status: "uploaded" }
```

**Exception Flow:**
- File quá lớn → "File vượt quá giới hạn 50MB"
- Loại file không hỗ trợ → "Định dạng file không được hỗ trợ"
- Upload thất bại → Signed URL hết hạn → "Upload thất bại. Vui lòng thử lại"

---

### UC-03.1.2 — Khai báo metadata tài liệu

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.1.2 |
| **Input** | `documentType`, `issueDate`, `expiryDate?`, `issuingAuthority?`, `description?` |

**Validation:**
```
documentType:     required
issueDate:        required | không quá ngày hôm nay
expiryDate:       optional | sau issueDate
issuingAuthority: optional | max 200 ký tự
```

---

## UC-03.2 — AI OCR & Trích xuất văn bản

### UC-03.2.1 — OCR file ảnh / PDF scanned

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.2.1 |
| **Actor** | System (Background Job) |
| **Input** | File binary (image hoặc PDF scanned) |
| **Output** | Raw text string |

**Implementation:**
```typescript
// Detect if PDF is native or scanned
const pdfInfo = await detectPdfType(fileBuffer)
if (pdfInfo.isScanned || fileType.startsWith("image/")) {
  // Use Gemini Vision for OCR (highest accuracy for Vietnamese docs)
  const rawText = await geminiVision.extractText(fileBuffer, {
    language: ["vi", "en"],
    outputFormat: "text"
  })
} else {
  // Native PDF → pdf-parse
  const pdfData = await pdfParse(fileBuffer)
  rawText = pdfData.text
}
```

**AI xử lý:** Gemini Vision API cho file ảnh và PDF scan  
**Ngôn ngữ hỗ trợ:** Tiếng Việt + Tiếng Anh

---

### UC-03.2.2 — Trích xuất text từ PDF native

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.2.2 |
| **Library** | `pdf-parse` Node.js |
| **Output** | Raw text, page count, metadata |

---

## UC-03.3 — AI Structured Data Extraction

### UC-03.3.1 — Nhận dạng loại tài liệu

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.3.1 |
| **Tên** | AI phân loại loại tài liệu |
| **Input** | Raw text + metadata người dùng khai báo |
| **Output** | `documentType`, `confidence` |

**Logic:**
```typescript
// Nếu người dùng đã khai báo type → trust và skip classification
if (userDeclaredType) {
  docType = userDeclaredType
} else {
  // AI classify
  const classification = await gemini.classify(rawText, DOC_TYPES)
  docType = classification.type
  if (classification.confidence < 0.7) {
    doc.status = "needs_review" // User phải xác nhận
  }
}
```

---

### UC-03.3.2 — Trích xuất trường có cấu trúc

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.3.2 |
| **Actor** | System (Gemini) |
| **Input** | Raw text + docType |
| **Output** | JSON structured data theo schema của từng docType |

**Schema theo loại tài liệu:**

```typescript
// Lab Result Schema
LabResultExtraction = {
  batchCode:    string,
  productName:  string,
  labName:      string,
  testDate:     date,
  expiryDate:   date?,
  sampleWeight: number?,
  residues: [{
    pesticide:   string,
    value:       number,
    unit:        string,  // "mg/kg"
    testMethod:  string?,
    resultType:  string,  // "ND" | "detected"
  }],
  certNumber:   string?
}

// Certificate of Origin Schema
COExtraction = {
  exporterName:   string,
  importerName:   string,
  productCode:    string?,
  hsCode:         string?,
  batchCode:      string?,
  origin:         string,
  certNumber:     string,
  issueDate:      date,
  expiryDate:     date?,
  issuingBody:    string,
  netWeight:      number?,
  grossWeight:    number?,
}

// EUDR Declaration Schema
EUDRExtraction = {
  operatorName:      string,
  geolocations: [{
    latitude:    number,
    longitude:   number,
    polygonRef:  string?,
  }],
  productDescription: string,
  hsCode:            string,
  countryOfProduction: string,
  harvestPeriod:     string?,
  ddsReferenceNumber: string?,
}
```

**Prompt:**
```
Trích xuất các trường sau từ tài liệu. 
Trả JSON theo schema được cung cấp.
Nếu trường không tìm thấy → null.
Không suy diễn hay tạo ra thông tin không có trong văn bản.
```

---

### UC-03.3.3 — Phát hiện lỗi và bất nhất

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.3.3 |
| **Tên** | Phát hiện lỗi trong tài liệu |
| **Output** | Danh sách `issues[]` trong DocumentExtraction |

**Kiểm tra tự động (Deterministic):**
```typescript
const issues = []

// 1. Batch code không khớp
if (extracted.batchCode !== batch.code) {
  issues.push({ type: "batch_code_mismatch", severity: "high",
    message: `Mã lô hàng trên tài liệu "${extracted.batchCode}" 
              không khớp với lô hàng "${batch.code}"` })
}

// 2. Tài liệu đã hết hạn
if (extracted.expiryDate && extracted.expiryDate < today) {
  issues.push({ type: "document_expired", severity: "high",
    message: `Tài liệu hết hạn ngày ${extracted.expiryDate}` })
}

// 3. Số certificate trùng
const existing = await findCertByNumber(extracted.certNumber, orgId)
if (existing) {
  issues.push({ type: "duplicate_certificate", severity: "medium",
    message: `Số chứng nhận ${extracted.certNumber} đã tồn tại` })
}
```

---

### UC-03.3.4 — Tính checksum & phát hiện trùng lặp

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.3.4 |
| **Mục tiêu** | Ngăn upload cùng file nhiều lần |

```typescript
const checksum = crypto.createHash("sha256").update(fileBuffer).digest("hex")
const duplicate = await prisma.document.findFirst({
  where: { checksum, batchId }
})
if (duplicate) {
  throw new ConflictError("FILE_ALREADY_UPLOADED", 
    "File này đã được tải lên cho lô hàng này")
}
```

---

## UC-03.4 — Người dùng xác nhận dữ liệu trích xuất

### UC-03.4.1 — Hiển thị dữ liệu để review

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.4.1 |
| **Tên** | Review dữ liệu trích xuất |
| **Mục tiêu** | User xác minh AI trích xuất đúng |
| **UI** | Split view: File preview (trái) + Form dữ liệu trích xuất (phải) |

**Main Flow:**
1. Document.status = "extracted" → hiển thị notification / badge
2. User click "Review tài liệu"
3. FE load: `GET /api/documents/:id/extraction`
4. Hiển thị PDF preview (iframe/react-pdf) bên trái
5. Hiển thị form với dữ liệu AI trích xuất bên phải
6. Highlight các trường có `confidence < 0.8` bằng màu vàng
7. Hiển thị issues[] nếu có

---

### UC-03.4.2 — Chỉnh sửa trường sai

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.4.2 |
| **Tên** | Chỉnh sửa dữ liệu trích xuất |
| **Input** | `correctedData: Record<string, any>` |

**Main Flow:**
1. User click vào field có highlight
2. Inline edit trực tiếp trong form
3. Validate format real-time (ngày tháng, số, ...)
4. Ghi nhận `correctionCount` (để theo dõi chất lượng AI)

---

### UC-03.4.3 — Xác nhận / Từ chối tài liệu

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.4.3 |
| **Input** | `confirmed: boolean`, `correctedData?: JSON`, `rejectionReason?: string` |
| **API** | `POST /api/documents/:id/confirm` |

**Nếu confirm:**
- Lưu DocumentExtraction với `confirmed: true`, `confirmedAt`, `confirmedBy`
- Tạo DocumentVersion (snapshot immutable)
- Kiểm tra batch: nếu đủ required docs → batch.status = `ready_for_check`

**Nếu reject:**
- Document.status = "failed"
- User cần upload lại

**Audit Log:** `{ action: "document.confirmed" | "document.rejected", documentId, userId, correctionCount }`

---

## UC-03.5 — Versioning tài liệu

### UC-03.5.1 — Tạo DocumentVersion mới

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.5.1 |
| **Trigger** | Khi document confirmed hoặc khi upload bản mới |

```typescript
// DocumentVersion là snapshot tại thời điểm confirm
const version = await prisma.documentVersion.create({
  data: {
    documentId,
    versionNumber: latestVersion + 1,
    storageKey,         // immutable pointer to file
    extractedData,      // confirmed extraction snapshot
    checksum,
    createdAt: now()
  }
})
```

### UC-03.5.2 — Lock version đã dùng trong check

**Business Rule:** Nếu DocumentVersion đã được dùng trong ComplianceCheck → không được update/delete

```typescript
// Check trước khi update extraction
const usedInCheck = await prisma.complianceCheckDocument.findFirst({
  where: { documentVersionId: version.id }
})
if (usedInCheck) {
  throw new ForbiddenError("VERSION_LOCKED", 
    "Version tài liệu đã được dùng trong compliance check và không thể chỉnh sửa")
}
```

---

## UC-03.6 — Xử lý lại (Reprocess)

### UC-03.6.1 — Kích hoạt lại extraction

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-03.6.1 |
| **Trigger** | User click "Xử lý lại" khi document.status = "failed" |
| **API** | `POST /api/documents/:id/reprocess` |

**Main Flow:**
1. BE kiểm tra: document.status phải là `failed` hoặc `needs_review`
2. BE reset: status = "queued"
3. BE dispatch lại doc-processing-job
4. Supabase Realtime broadcast

---

## Screens liên quan

| Screen | Route | Mô tả |
|--------|-------|-------|
| Batch Detail | `/batches/:id` | Upload documents, xem danh sách |
| Document Review | `/batches/:id/documents/:docId/review` | Split view review |
| Document List | trong Batch Detail | Table với trạng thái từng doc |

---

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/documents/upload-url` | Lấy signed upload URL |
| POST | `/api/documents` | Tạo Document record sau khi upload |
| GET | `/api/documents/:id` | Chi tiết document + status |
| GET | `/api/documents/:id/extraction` | Xem extracted data |
| POST | `/api/documents/:id/confirm` | Xác nhận / từ chối |
| DELETE | `/api/documents/:id` | Xóa (chỉ khi chưa dùng trong check) |
| POST | `/api/documents/:id/reprocess` | Xử lý lại |

---

## Database Tables

| Bảng | Thao tác |
|------|---------|
| `documents` | INSERT, UPDATE status |
| `document_versions` | INSERT (immutable sau khi tạo) |
| `document_extractions` | INSERT, UPDATE (trước khi confirm) |
| `audit_logs` | INSERT |

---

## Background Jobs

| Job | Trigger | Mô tả |
|-----|---------|-------|
| `doc-processing` | POST /api/documents | OCR + extraction |
| `send-doc-notification` | doc.status changed | Thông báo cho user |

---

## Notifications

| Sự kiện | Kênh | Người nhận |
|---------|------|-----------|
| Document extracted xong | In-App + Realtime | Người upload |
| Document needs_review | In-App | Người upload |
| Document failed | In-App | Người upload + Manager |
| Batch ready_for_check | In-App | Analyst + Manager |

---

## Audit Log Events

| Event | Khi nào |
|-------|---------|
| `document.uploaded` | POST /api/documents |
| `document.processing_started` | Job bắt đầu |
| `document.extracted` | Extraction thành công |
| `document.needs_review` | Low confidence extraction |
| `document.failed` | OCR/extraction thất bại |
| `document.confirmed` | User confirm |
| `document.rejected` | User reject |
| `document.reprocessed` | Kích hoạt lại |
| `document.deleted` | Xóa document |

---

## AI xử lý gì

| Bước | AI làm gì |
|------|-----------|
| OCR | Gemini Vision → chuyển ảnh/PDF scan thành text |
| Classification | Gemini → phân loại loại tài liệu |
| Extraction | Gemini → trích xuất fields có cấu trúc theo schema |
| Issues detection | Deterministic code (không dùng AI) cho batch mismatch, expiry |

---

## Điều kiện hoàn thành (DoD)

- [ ] Upload file thật lên Supabase private bucket
- [ ] OCR hoạt động với PDF scan và ảnh (Gemini Vision)
- [ ] Extraction sinh JSON đúng schema theo loại tài liệu
- [ ] User review và chỉnh sửa được extraction data
- [ ] DocumentVersion tạo khi confirm, immutable sau đó
- [ ] Checksum phát hiện file trùng
- [ ] Batch.status tự động cập nhật khi đủ tài liệu
- [ ] Realtime update hiển thị trạng thái processing
- [ ] Audit log đầy đủ

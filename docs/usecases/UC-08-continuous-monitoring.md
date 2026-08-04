# UC-08 — Continuous Compliance Monitoring (Service)

> **Mức độ:** Level 1 (Background Service — Không có UI trực tiếp)  
> **Actor chính:** Dịch vụ nền (System Service)  
> **Priority:** P1 — Quan trọng  
> **Ghi chú:** Đây là service tự động, không có actor người dùng trực tiếp

---

## Cây phân rã

```
UC-08: Continuous Compliance Monitoring
├── UC-08.1: Quét & Đồng bộ nguồn dữ liệu pháp lý
│   ├── UC-08.1.1: Crawler — Thu thập từ EUR-Lex (EU)
│   ├── UC-08.1.2: Crawler — Thu thập từ RASFF (EU Food Safety)
│   ├── UC-08.1.3: Crawler — Thu thập từ USDA (USA)
│   ├── UC-08.1.4: Parser — Chuẩn hóa dữ liệu raw
│   └── UC-08.1.5: Quản lý SyncRun (lịch sử đồng bộ)
│
├── UC-08.2: Phát hiện thay đổi & phân loại
│   ├── UC-08.2.1: Phát hiện thay đổi MRL
│   ├── UC-08.2.2: Phát hiện quy định mới
│   ├── UC-08.2.3: Phát hiện thay đổi ngày hiệu lực
│   └── UC-08.2.4: Đánh giá mức độ thay đổi (major/minor)
│
├── UC-08.3: Embedding & Vector Database
│   ├── UC-08.3.1: Chunking văn bản quy định
│   ├── UC-08.3.2: Embedding với text-embedding model
│   └── UC-08.3.3: Upsert vào pgvector
│
├── UC-08.4: Phân tích tác động (Impact Analysis)
│   ├── UC-08.4.1: Xác định org / product bị ảnh hưởng
│   ├── UC-08.4.2: AI sinh impact summary
│   └── UC-08.4.3: Đánh giá mức độ tác động (critical/high/medium/low)
│
└── UC-08.5: Kích hoạt cảnh báo
    ├── UC-08.5.1: Tạo Notification records
    ├── UC-08.5.2: Gửi Email cảnh báo
    └── UC-08.5.3: Update batch status bị ảnh hưởng
```

---

## Luồng hoạt động chi tiết (System Flow)

```
[Cron Job] Mỗi 6 giờ / daily tùy nguồn
  ↓
[UC-08.1] Legal Sync Workers
  ↓
  Crawler → EUR-Lex API / RASFF RSS / USDA API
    ↓ fetch latest regulations, amendments, notifications
    ↓
  Parser
    ↓ Normalize: title, number, effective_date, market, product_types
    ↓ Xác định changeType: new | amended | repealed | mrl_updated
    ↓
  Idempotency check:
    ↓ key = source + external_id + content_checksum
    ↓ Same key → skip (idempotent)
    ↓ New key → process
    ↓
  [UC-08.2] Change Detection
    ↓ So sánh với version cũ nhất trong DB
    ↓ Nếu khác → tạo RegulationVersion mới (KHÔNG update cũ)
    ↓ Classify severity: major (MRL changed) / minor (format fix)
    ↓
  [UC-08.3] Embedding Pipeline
    ↓ Chunk text: sliding window 512 tokens, 50% overlap
    ↓ Embed: Gemini text-embedding-004 (1536 dims)
    ↓ Upsert RegulationChunks với embedding vào pgvector
    ↓
  Update SyncRun: { status: "completed", newVersions: N, processedAt }
  ↓
[UC-08.4] Impact Analysis (async, per org)
  ↓ For each affected org:
    ↓ Query: products in org that match market + productType
    ↓ AI: generate impact summary (compare old vs new regulation text)
    ↓ Save RegulationImpact { orgId, regulationVersionId, impactLevel, summary }
    ↓
[UC-08.5] Trigger Alerts
  ↓ Create Notification records for:
    → Managers/Owners của affected orgs
  ↓ Dispatch email notification jobs
  ↓ Update Dashboard "legal-updates" cache
  ↓ If critical change: update batch.status = "action_required" for compliant batches
```

---

## UC-08.1 — Quét & Đồng bộ nguồn dữ liệu pháp lý

### UC-08.1.1 — Crawler EUR-Lex (EU)

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-08.1.1 |
| **Tên** | Crawler dữ liệu từ EUR-Lex |
| **Actor** | System Cron Job |
| **Trigger** | Cron daily 02:00 UTC |
| **Input** | EUR-Lex API endpoint: `https://eur-lex.europa.eu/SPARQL` |
| **Output** | Raw regulation text + metadata |

**SPARQL Query (EUR-Lex):**
```sparql
SELECT ?work ?title ?date ?cellarId
WHERE {
  ?work cdm:resource_legal_is_about_subject_matter <subject_matter_uri> ;
        cdm:work_date_document ?date ;
        cdm:work_title ?title .
  FILTER(?date > "2020-01-01"^^xsd:date)
}
```

**Rate limit:** Max 10 requests/minute đến EUR-Lex

**Fallback:** RSS feed của EUR-Lex nếu SPARQL unavailable

---

### UC-08.1.2 — Crawler RASFF (EU Food Safety)

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-08.1.2 |
| **Mô tả** | RASFF = Rapid Alert System for Food and Feed |
| **Trigger** | Cron daily 03:00 UTC |
| **Nguồn** | `https://webgate.ec.europa.eu/rasff-window/api/` |
| **Output** | Alert về sản phẩm vi phạm MRL, recall notices |

**Ứng dụng:**
- Phát hiện: loại thuốc BVTV mới bị EU cấm / giảm MRL
- Cảnh báo sớm cho doanh nghiệp

---

### UC-08.1.3 — Crawler USDA (USA)

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-08.1.3 |
| **Trigger** | Cron 2 lần/tuần |
| **Nguồn** | USDA Foreign Agriculture Service API |
| **Ghi chú** | P2 — Sau MVP (MVP chỉ EU) |

---

### UC-08.1.4 — Parser & Normalize

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-08.1.4 |
| **Input** | Raw API response (JSON/XML/HTML) từ các nguồn |
| **Output** | Normalized RegulationData object |

**Normalization Schema:**
```typescript
type NormalizedRegulation = {
  source:          "EUR_LEX" | "RASFF" | "USDA" | "MANUAL"
  externalId:      string        // ID từ nguồn gốc
  title:           string
  number:          string?       // Số hiệu văn bản
  type:            "regulation" | "directive" | "decision" | "alert"
  markets:         Market[]
  productTypes:    ProductType[]
  effectiveDate:   Date
  publicationDate: Date
  status:          RegulationStatus
  content:         string        // Full text
  sourceUrl:       string
  contentChecksum: string        // sha256(content)
}
```

---

### UC-08.1.5 — Quản lý SyncRun

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-08.1.5 |
| **Mục tiêu** | Theo dõi lịch sử và trạng thái mỗi lần sync |

**SyncRun schema:**
```typescript
{
  id:              uuid
  source:          string
  status:          "running" | "completed" | "failed" | "partial"
  startedAt:       timestamp
  finishedAt:      timestamp?
  newVersions:     number
  errors:          JSON[]
  triggeredBy:     "cron" | "manual" | "webhook"
}
```

**API (Admin only):**
```
POST /api/admin/regulations/sync       -- Trigger manual sync
GET  /api/admin/regulations/sync-runs  -- Lịch sử sync runs
```

**Idempotency:**
```typescript
const key = `${source}:${externalId}:${contentChecksum}`
const existing = await findByIdempotencyKey(key)
if (existing) {
  // Đã xử lý rồi → skip
  syncRun.skipped++
  return
}
// Chưa xử lý → tạo mới
await processNewVersion(normalized)
await saveIdempotencyKey(key)
```

---

## UC-08.2 — Phát hiện thay đổi

### UC-08.2.1 — Phát hiện thay đổi MRL

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-08.2.1 |
| **Tên** | Phát hiện thay đổi giới hạn MRL |
| **Input** | New regulation text + Previous regulation version text |
| **Output** | `{ pesticide, oldLimit, newLimit, changeType: "tightened"|"relaxed"|"new_added" }` |

**AI xử lý:**
```typescript
// So sánh hai version bằng AI (structured diff)
const diff = await gemini.compare({
  systemPrompt: "So sánh hai văn bản quy định. Trả JSON danh sách thay đổi MRL.",
  oldText: prevVersion.content,
  newText: newContent,
  schema: MRLChangesSchema
})
```

**Deterministic check (trước AI):**
```typescript
// Extract MRL table từ cả 2 versions và compare programmatically
const oldMrlTable = parseMrlTable(prevVersion.content)
const newMrlTable = parseMrlTable(newVersion.content)
const changes = diffMrlTables(oldMrlTable, newMrlTable)
// Chỉ dùng AI cho changes mà deterministic không parse được
```

---

### UC-08.2.4 — Đánh giá mức độ thay đổi

| Mức | Điều kiện | Action |
|-----|-----------|--------|
| `critical` | MRL bị giảm xuống | Cảnh báo ngay, check lại batch đang compliant |
| `high` | Yêu cầu tài liệu mới | Cảnh báo manager |
| `medium` | Thay đổi deadline | Cập nhật notification |
| `low` | Thay đổi format, annotation | Log only |

---

## UC-08.3 — Embedding & Vector Database

### UC-08.3.1 — Chunking văn bản

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-08.3.1 |
| **Strategy** | Sliding window: 512 tokens, 50% overlap |
| **Boundary** | Ưu tiên tách theo paragraph, không tách giữa câu |

```typescript
function chunkRegulation(text: string): Chunk[] {
  const paragraphs = splitByParagraph(text)
  const chunks = slidingWindowChunk(paragraphs, {
    maxTokens:   512,
    overlapRatio: 0.5,
    boundary:    "paragraph"
  })
  return chunks.map((c, i) => ({
    content:      c.text,
    chunkIndex:   i,
    startToken:   c.startToken,
    metadata: {
      section:    c.sectionTitle,
      article:    c.articleNumber,
    }
  }))
}
```

---

### UC-08.3.2 — Embedding

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-08.3.2 |
| **Model** | `text-embedding-004` (Gemini) hoặc `text-embedding-3-small` (OpenAI) |
| **Dimension** | 1536 |
| **Batch size** | 100 chunks/request |

---

### UC-08.3.3 — Upsert vào pgvector

```typescript
// Upsert: tạo mới hoặc update nếu chunk đã tồn tại
await prisma.regulationChunk.upsert({
  where: { regulationVersionId_chunkIndex: { regulationVersionId, chunkIndex: i } },
  create: { regulationVersionId, chunkIndex: i, content, embedding, metadata },
  update: { content, embedding, metadata }  // nếu content thay đổi
})
```

**Index:** `CREATE INDEX ON regulation_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)`

---

## UC-08.4 — Phân tích tác động

### UC-08.4.1 — Xác định org bị ảnh hưởng

```typescript
async function findAffectedOrgs(newRegVersion: RegulationVersion) {
  // Tìm tất cả org có product match market + productType
  const affectedProducts = await prisma.product.findMany({
    where: {
      productMarkets: {
        some: { market: { in: newRegVersion.markets } }
      },
      type: { in: newRegVersion.productTypes }
    },
    include: { organization: true }
  })
  
  return [...new Set(affectedProducts.map(p => p.organization))]
}
```

---

### UC-08.4.2 — AI sinh impact summary

```typescript
const impactSummary = await gemini.analyze({
  prompt: `
    Quy định mới: ${newVersion.title}
    Thay đổi so với version cũ: ${changesList}
    Sản phẩm bị ảnh hưởng: ${affectedProducts.map(p => p.name).join(", ")}
    
    Hãy phân tích tác động và đề xuất hành động cần thiết.
    Trả JSON theo ImpactSummarySchema.
  `
})
```

---

## UC-08.5 — Kích hoạt cảnh báo

### UC-08.5.1 — Tạo Notification records

```typescript
for (const org of affectedOrgs) {
  const managers = await getOrgManagers(org.id) // role: owner | manager
  
  for (const manager of managers) {
    await prisma.notification.create({
      data: {
        userId:    manager.userId,
        orgId:     org.id,
        type:      "REGULATION_CHANGED",
        title:     `Quy định mới: ${newVersion.title}`,
        body:      impactSummary.shortDescription,
        actionUrl: `/regulations/${regulation.id}`,
        isRead:    false
      }
    })
  }
}
```

---

## Admin API

| Method | Path | Mô tả | Actor |
|--------|------|-------|-------|
| POST | `/api/admin/regulations/sync` | Trigger sync thủ công | System Admin |
| GET | `/api/admin/regulations/sync-runs` | Lịch sử sync | System Admin |
| GET | `/health/legal-sources` | Health check các nguồn | System Admin |

---

## Database Tables

| Bảng | Thao tác |
|------|---------|
| `regulations` | INSERT (chỉ tạo mới) |
| `regulation_versions` | INSERT (không update sau khi tạo) |
| `regulation_chunks` | UPSERT |
| `regulation_impacts` | INSERT / UPDATE |
| `sync_runs` | INSERT, UPDATE status |
| `notifications` | INSERT |
| `audit_logs` | INSERT |

---

## Background Jobs (Workers)

| Worker | Trigger | Schedule |
|--------|---------|----------|
| `eurlex-crawler` | Cron | Daily 02:00 UTC |
| `rasff-crawler` | Cron | Daily 03:00 UTC |
| `regulation-parser` | Queue (after crawl) | Async |
| `regulation-embedder` | Queue (after parse) | Async |
| `impact-analyzer` | Queue (after embed) | Async per org |
| `alert-dispatcher` | Queue (after impact) | Async |

---

## Health Checks

```
GET /health/legal-sources
Response:
{
  "eurLex":  { "status": "ok", "lastSync": "2026-08-04T02:00:00Z" },
  "rasff":   { "status": "ok", "lastSync": "2026-08-04T03:00:00Z" },
  "usda":    { "status": "degraded", "lastSync": "2026-08-01T00:00:00Z" }
}
```

---

## Idempotency & Reliability

**Distributed lock:**
```typescript
// Ngăn 2 worker chạy song song cùng nguồn
const lock = await acquireLock(`sync:${source}`, ttl: 3600)
if (!lock.acquired) {
  logger.info("Sync already running for source:", source)
  return
}
try {
  await runSync(source)
} finally {
  await lock.release()
}
```

**Retry policy:**
- Max 3 lần retry
- Exponential backoff: 1s, 2s, 4s
- Dead letter queue sau 3 lần thất bại

---

## Điều kiện hoàn thành (DoD)

- [ ] Crawler chạy được với EUR-Lex (dù chỉ fetch 1 nguồn)
- [ ] Parser normalize dữ liệu đúng schema
- [ ] Idempotency key ngăn duplicate processing
- [ ] Chunking + Embedding chạy và lưu vào pgvector
- [ ] Impact analysis sinh được summary bằng AI
- [ ] Notification gửi đến đúng người trong org bị ảnh hưởng
- [ ] Batch.status cập nhật khi regulation critical thay đổi
- [ ] SyncRun lưu lịch sử đầy đủ
- [ ] Health check endpoint hoạt động
- [ ] Distributed lock ngăn concurrent sync

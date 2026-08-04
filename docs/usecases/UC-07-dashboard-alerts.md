# UC-07 — Dashboard & Cảnh báo Quy định

> **Mức độ:** Level 1 (Use Case chính)  
> **Actor chính:** CEO, Compliance Manager/Analyst, Hiệp hội  
> **Priority:** P0 — Luôn hiển thị là landing page sau đăng nhập

---

## Cây phân rã

```
UC-07: Dashboard & Cảnh báo Quy định
├── UC-07.1: Dashboard tổng quan
│   ├── UC-07.1.1: Hiển thị tóm tắt trạng thái compliance
│   ├── UC-07.1.2: Hiển thị số liệu sản phẩm / lô hàng
│   ├── UC-07.1.3: Hiển thị biểu đồ xu hướng rủi ro
│   └── UC-07.1.4: Hiển thị action items cần xử lý
│
├── UC-07.2: Danh sách kiểm tra gần đây
│   ├── UC-07.2.1: Recent compliance checks
│   ├── UC-07.2.2: Findings cần xử lý
│   └── UC-07.2.3: Remediation tasks sắp đến hạn
│
├── UC-07.3: Thư viện quy định pháp lý
│   ├── UC-07.3.1: Tìm kiếm văn bản quy định
│   ├── UC-07.3.2: Xem chi tiết regulation
│   └── UC-07.3.3: Xem lịch sử version quy định
│
├── UC-07.4: Cảnh báo thay đổi quy định
│   ├── UC-07.4.1: Danh sách cập nhật quy định mới
│   ├── UC-07.4.2: Phân tích tác động với sản phẩm của org
│   └── UC-07.4.3: Đồng hồ đếm ngược EUDR effective date
│
└── UC-07.5: Gửi cảnh báo
    ├── UC-07.5.1: Cảnh báo qua Email
    ├── UC-07.5.2: Cảnh báo In-App (Notification center)
    └── UC-07.5.3: Cảnh báo SMS (P2 - sau MVP)
```

---

## Luồng hoạt động chi tiết

```
User đăng nhập thành công
  ↓ redirect /dashboard
  ↓
FE: GET /api/dashboard/summary
  ↓ BE tổng hợp: compliant_count, non_compliant_count, action_required_count
  ↓
FE: GET /api/dashboard/recent-checks
  ↓ Last 5-10 compliance checks
  ↓
FE: GET /api/dashboard/action-items
  ↓ Open findings (critical + high), due remediation tasks, expiring docs
  ↓
FE: GET /api/dashboard/legal-updates
  ↓ New regulation versions in last 30 days, impact analysis results
  ↓
Render dashboard với:
  ↓ KPI cards (top)
  ↓ Action items list (priority)
  ↓ Recent checks table
  ↓ Legal updates feed
  ↓ EUDR countdown (nếu có)
  ↓
Realtime subscription:
  ↓ Supabase Realtime: listen to notification_channel(userId)
  ↓ Khi có notification mới → badge update + toast
```

---

## UC-07.1 — Dashboard tổng quan

### UC-07.1.1 — Tóm tắt trạng thái compliance

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.1.1 |
| **Tên** | KPI Cards compliance summary |
| **Actor** | CEO, Manager, Analyst, Viewer |
| **Tiền điều kiện** | User đã login, thuộc org |
| **Hậu điều kiện** | Dashboard hiển thị đúng số liệu của org |
| **API** | `GET /api/dashboard/summary` |
| **Output** | JSON aggregates (không tính ở FE) |

**Data trả về:**
```typescript
{
  compliance: {
    totalBatches:         number,
    compliantBatches:     number,
    nonCompliantBatches:  number,
    actionRequired:       number,
    pendingCheck:         number,
  },
  findings: {
    openCritical:  number,
    openHigh:      number,
    openMedium:    number,
  },
  tasks: {
    overdue:  number,
    dueToday: number,
    upcoming: number,
  },
  documents: {
    expiringIn30Days: number,
  },
  lastUpdated: timestamp
}
```

**Business Rule:** Tất cả aggregate phải được tính bởi BE, không bao giờ tính ở FE

**Phân quyền:** Tất cả roles xem được (data filtered theo org)

---

### UC-07.1.2 — Số liệu sản phẩm / lô hàng

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.1.2 |
| **UI** | Cards: "Tổng sản phẩm", "Lô hàng đang xử lý", "Lô hàng đã xong" |

---

### UC-07.1.3 — Biểu đồ xu hướng rủi ro

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.1.3 |
| **API** | `GET /api/dashboard/trends?period=30d|90d|1y` |
| **Output** | `{ dates: string[], riskScores: number[], checkCounts: number[] }` |
| **UI** | Line chart (Recharts hoặc Chart.js) |

---

### UC-07.1.4 — Action Items cần xử lý

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.1.4 |
| **Tên** | Priority queue các việc cần làm |
| **API** | `GET /api/dashboard/action-items` |
| **Output** | List priority items: type, entity, severity, dueDate |

**Loại action items:**
```typescript
type ActionItem = 
  | { type: "CRITICAL_FINDING",    findingId, batchCode, severity: "critical" }
  | { type: "TASK_OVERDUE",        taskId, title, dueDate }
  | { type: "DOCUMENT_EXPIRING",   documentId, type, expiryDate }
  | { type: "REGULATION_CHANGED",  regulationId, title, impactLevel }
  | { type: "BATCH_NEEDS_CHECK",   batchId, batchCode, productName }
```

**Sắp xếp:** critical first, sau đó theo dueDate

---

## UC-07.2 — Danh sách kiểm tra gần đây

### UC-07.2.1 — Recent Compliance Checks

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.2.1 |
| **API** | `GET /api/dashboard/recent-checks?limit=10` |
| **Output** | `[{ checkId, batchCode, productName, result, riskScore, createdAt, checker }]` |
| **UI** | Table với color-coded result badge |

---

## UC-07.3 — Thư viện quy định pháp lý

### UC-07.3.1 — Tìm kiếm văn bản quy định

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.3.1 |
| **Tên** | Tìm kiếm regulation |
| **API** | `GET /api/regulations?search&market&status&sort&page` |
| **Input** | `search: keyword`, `market: EU|USA|...`, `status: effective|upcoming|...` |
| **Output** | Paged list regulations |

**Full-text search:** PostgreSQL `tsvector` hoặc pgvector similarity

---

### UC-07.3.2 — Xem chi tiết regulation

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.3.2 |
| **API** | `GET /api/regulations/:id` |
| **Output** | Regulation metadata + latest version + version history |

**Hiển thị:**
- Tên quy định, số hiệu
- Ngày ban hành, ngày có hiệu lực
- Thị trường áp dụng
- Loại sản phẩm áp dụng
- Nội dung tóm tắt (AI-generated summary từ chunks)
- Link nguồn gốc chính thức (EUR-Lex, USDA, ...)

---

### UC-07.3.3 — Lịch sử version quy định

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.3.3 |
| **API** | `GET /api/regulations/:id/versions` |
| **Business Rule** | Regulation không bao giờ bị xóa, chỉ thêm version mới |

---

## UC-07.4 — Cảnh báo thay đổi quy định

### UC-07.4.1 — Danh sách cập nhật quy định mới

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.4.1 |
| **Tên** | Legal Updates Feed |
| **API** | `GET /api/dashboard/legal-updates` |
| **Output** | `[{ regulationId, title, changeType, effectiveDate, impactedProducts[] }]` |

**changeType:**
- `new_regulation` — Quy định mới hoàn toàn
- `mrl_limit_changed` — Giới hạn MRL thay đổi
- `requirement_added` — Yêu cầu mới được thêm
- `deadline_approaching` — Ngày hiệu lực sắp đến

---

### UC-07.4.2 — Phân tích tác động với sản phẩm

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.4.2 |
| **Trigger** | Sau khi regulation version mới được sync (UC-08) |
| **Actor** | System (AI) + Manager review |
| **API** | `POST /api/regulations/:id/analyze-impact` (trigger manual analysis) |
| **Output** | `RegulationImpact { affectedProducts[], riskLevel, recommendation }` |

**AI xử lý:**
- So sánh regulation version cũ và mới
- Xác định changes
- Map changes với products/batches của org
- Sinh impact summary bằng ngôn ngữ tự nhiên

---

### UC-07.4.3 — Đồng hồ đếm ngược EUDR

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.4.3 |
| **Mô tả** | Widget hiển thị thời gian còn lại đến ngày EUDR có hiệu lực |
| **UI** | Countdown timer: ngày, giờ, phút |
| **Data source** | EUDR effective date từ RegulationVersion của quy định EUDR |

**Logic:**
```typescript
const eudrDeadline = await getEUDREffectiveDate() // từ DB
const countdown = differenceInDays(eudrDeadline, now())
// Hiển thị màu: >90 ngày=xanh, 30-90 ngày=vàng, <30 ngày=đỏ
```

---

## UC-07.5 — Gửi cảnh báo

### UC-07.5.1 — Cảnh báo qua Email

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.5.1 |
| **Trigger** | Các sự kiện: finding critical, task overdue, regulation changed, doc expiring |
| **Actor** | System (Background Job) |
| **Input** | Notification record |
| **Output** | Email gửi đến đúng người |

**Email template:**
- Transactional email (Resend / SendGrid)
- HTML template với branding
- Unsubscribe link (theo regulation chống spam)

**Rate limit:** Không gửi quá 3 email/ngày/user cho cùng 1 loại alert

---

### UC-07.5.2 — In-App Notification Center

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-07.5.2 |
| **UI** | Bell icon + notification panel + unread badge |
| **Realtime** | Supabase Realtime subscription theo userId |

**Notification schema:**
```typescript
{
  id:         uuid
  userId:     uuid
  orgId:      uuid
  type:       "finding_critical" | "task_overdue" | "regulation_changed" | ...
  title:      string
  body:       string
  actionUrl:  string?  // link đến entity liên quan
  isRead:     boolean
  createdAt:  timestamp
}
```

**Main Flow:**
1. System tạo Notification record
2. Supabase Realtime broadcast đến channel `user:${userId}`
3. FE listener nhận event → update badge + show toast
4. User click → mark as read + navigate to actionUrl

**API:**
```
GET    /api/notifications?page&isRead
PATCH  /api/notifications/:id/read
POST   /api/notifications/read-all
```

---

## Screens liên quan

| Screen | Route | Mô tả |
|--------|-------|-------|
| Dashboard | `/dashboard` | Landing page sau login |
| Regulations | `/regulations` | Thư viện quy định |
| Regulation Detail | `/regulations/:id` | Chi tiết + version history |
| Notifications | `/notifications` | Full list notifications |
| History | `/history` | Lịch sử tất cả checks |

---

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/dashboard/summary` | KPI tổng hợp |
| GET | `/api/dashboard/trends` | Xu hướng theo thời gian |
| GET | `/api/dashboard/recent-checks` | Checks gần đây |
| GET | `/api/dashboard/action-items` | Priority action list |
| GET | `/api/dashboard/legal-updates` | Legal update feed |
| GET | `/api/regulations` | Danh sách quy định |
| GET | `/api/regulations/:id` | Chi tiết |
| GET | `/api/regulations/:id/versions` | Version history |
| POST | `/api/regulations/:id/analyze-impact` | Trigger impact analysis |
| GET | `/api/notifications` | Danh sách notifications |
| PATCH | `/api/notifications/:id/read` | Mark read |
| POST | `/api/notifications/read-all` | Mark all read |

---

## Database Tables

| Bảng | Mô tả |
|------|-------|
| `regulations` | Quy định (không bao giờ xóa) |
| `regulation_versions` | Version của từng quy định |
| `regulation_chunks` | Chunks với pgvector embedding |
| `regulation_impacts` | Tác động phân tích per org |
| `notifications` | In-app notifications |
| `notification_preferences` | User preferences (email on/off, ...) |

---

## Background Jobs

| Job | Mô tả |
|-----|-------|
| `send-notification-email` | Gửi email notification |
| `analyze-regulation-impact` | AI phân tích tác động quy định mới |
| `check-document-expiry` | Cron daily: tài liệu sắp hết hạn |
| `update-eudr-countdown` | Cache countdown date |

---

## Audit Log Events

| Event | Khi nào |
|-------|---------|
| `regulation.viewed` | User xem chi tiết regulation |
| `notification.read` | Mark notification as read |
| `impact_analysis.triggered` | POST analyze-impact |

---

## Điều kiện hoàn thành (DoD)

- [ ] Dashboard hiển thị đúng số liệu thật từ BE (không tính ở FE)
- [ ] Legal updates feed hiển thị regulation mới từ sync job
- [ ] EUDR countdown đúng ngày
- [ ] Notification center: realtime badge update
- [ ] Email gửi thật (không mock)
- [ ] Regulation search có full-text search
- [ ] Impact analysis chạy được với AI (Gemini)
- [ ] Dashboard không expose data cross-org

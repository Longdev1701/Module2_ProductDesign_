# 06. Chuẩn API

## Response format

```json
// Thành công
{
  "data": {},
  "meta": { "requestId": "req_abc123" }
}

// Lỗi
{
  "error": {
    "code": "DOCUMENT_REQUIRED",
    "message": "Thiếu kết quả kiểm nghiệm cho lô hàng.",
    "details": {},
    "requestId": "req_abc123"
  }
}
```

## Danh sách endpoint chính

### Auth & Organization
```
GET    /api/me
GET    /api/organizations
POST   /api/organizations
GET    /api/organizations/:id
PATCH  /api/organizations/:id
GET    /api/organizations/:id/members
POST   /api/organizations/:id/invitations
PATCH  /api/organizations/:id/members/:memberId
DELETE /api/organizations/:id/members/:memberId
```

### Products
```
GET    /api/products          ?page&pageSize&search&market&status&sort
POST   /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
POST   /api/products/import
```

### Batches
```
GET    /api/products/:productId/batches
POST   /api/products/:productId/batches
GET    /api/batches/:id
PATCH  /api/batches/:id
DELETE /api/batches/:id
POST   /api/batches/:id/archive
```

### Documents
```
POST   /api/documents/upload-url
POST   /api/documents
GET    /api/documents/:id
DELETE /api/documents/:id
POST   /api/documents/:id/reprocess
GET    /api/documents/:id/extraction
```

### Compliance
```
POST   /api/compliance/checks
GET    /api/compliance/checks
GET    /api/compliance/checks/:id
POST   /api/compliance/checks/:id/cancel
POST   /api/compliance/checks/:id/retry
POST   /api/compliance/checks/:id/recheck
```

### Findings & Remediation Tasks
```
GET    /api/checks/:checkId/findings
PATCH  /api/findings/:id
POST   /api/findings/:id/tasks
GET    /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
POST   /api/tasks/:id/evidence
POST   /api/tasks/:id/complete
POST   /api/tasks/:id/review
```

### Reports
```
GET    /api/reports/:id
POST   /api/reports/:id/approve
POST   /api/reports/:id/request-revision
POST   /api/reports/:id/export
GET    /api/reports/:id/versions
```

### Regulations
```
GET    /api/regulations
GET    /api/regulations/:id
GET    /api/regulations/:id/versions
POST   /api/regulations/:id/analyze-impact
POST   /api/admin/regulations/sync
GET    /api/admin/regulations/sync-runs
```

### Dashboard
```
GET    /api/dashboard/summary
GET    /api/dashboard/trends
GET    /api/dashboard/recent-checks
GET    /api/dashboard/action-items
GET    /api/dashboard/legal-updates
```

### Health
```
GET    /health
GET    /health/database
GET    /health/storage
GET    /health/ai
GET    /health/legal-sources
```

## Pagination & filter (chuẩn chung)

```
?page=1&pageSize=20&search=coffee&market=EU&status=active&sort=createdAt:desc
```

Filter và pagination nên được lưu trên URL để hỗ trợ reload, chia sẻ link, back/forward.

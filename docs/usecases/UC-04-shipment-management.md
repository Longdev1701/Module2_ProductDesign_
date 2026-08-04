# UC-04 — Quản lý Hồ sơ & Lô hàng (Shipment Management)

> **Mức độ:** Level 1 (Use Case chính)  
> **Actor chính:** Nhân viên Compliance, CEO/Owner  
> **Priority:** P0 — Bắt buộc (tiền đề cho UC-01)

---

## Cây phân rã

```
UC-04: Quản lý Hồ sơ & Lô hàng
├── UC-04.1: Quản lý Sản phẩm (Product CRUD)
│   ├── UC-04.1.1: Tạo sản phẩm mới
│   ├── UC-04.1.2: Xem danh sách sản phẩm
│   ├── UC-04.1.3: Cập nhật thông tin sản phẩm
│   ├── UC-04.1.4: Xóa sản phẩm
│   └── UC-04.1.5: Import sản phẩm từ CSV
│
├── UC-04.2: Quản lý Lô hàng (Batch CRUD)
│   ├── UC-04.2.1: Tạo lô hàng mới
│   ├── UC-04.2.2: Xem danh sách lô hàng của sản phẩm
│   ├── UC-04.2.3: Xem chi tiết lô hàng
│   ├── UC-04.2.4: Cập nhật thông tin lô hàng
│   ├── UC-04.2.5: Lưu trữ lô hàng (Archive)
│   └── UC-04.2.6: Xóa lô hàng
│
├── UC-04.3: Lịch sử kiểm tra lô hàng
│   ├── UC-04.3.1: Xem lịch sử compliance check
│   ├── UC-04.3.2: So sánh 2 lần check (diff)
│   └── UC-04.3.3: Xem xu hướng rủi ro theo thời gian
│
└── UC-04.4: Trạng thái tự động
    ├── UC-04.4.1: Auto-update batch status theo quy định mới
    └── UC-04.4.2: Cảnh báo khi tài liệu sắp hết hạn
```

---

## Luồng hoạt động chi tiết

```
CEO / Compliance Analyst
  ↓
[UC-04.1.1] Tạo sản phẩm
  ↓ POST /api/products
  ↓ Tạo Product + ProductMarket (EU)
  ↓
[UC-04.2.1] Tạo lô hàng
  ↓ POST /api/products/:id/batches
  ↓ Batch.status = "draft"
  ↓
[UC-03] Upload tài liệu vào batch
  ↓ Batch.status: draft → collecting_documents
  ↓
Mỗi tài liệu extracted + confirmed
  ↓ Kiểm tra: đủ required docs?
  ↓ Có → Batch.status = "ready_for_check"
  ↓
[UC-01] Chạy compliance check
  ↓ Batch.status = "checking"
  ↓
Check hoàn thành
  ↓ Batch.status = "compliant" | "non_compliant" | "action_required"
  ↓
[UC-04.3.1] Xem lịch sử check của batch
```

---

## UC-04.1 — Quản lý Sản phẩm

### UC-04.1.1 — Tạo sản phẩm mới

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.1.1 |
| **Tên** | Tạo sản phẩm mới |
| **Mục tiêu** | Đăng ký sản phẩm xuất khẩu vào hệ thống |
| **Actor** | Analyst, Manager, Owner |
| **Tiền điều kiện** | User là member active của org |
| **Hậu điều kiện** | Product record tạo thành công, Product.code unique trong org |
| **Trigger** | User click "Thêm sản phẩm" trên trang `/products` |
| **Input** | `name`, `code`, `type`, `hsCode?`, `description?`, `primaryMarket`, `markets[]` |
| **Output** | Product record + ProductMarket records |

**Main Flow:**
1. User mở form "Thêm sản phẩm"
2. Điền tên, mã sản phẩm nội bộ, loại sản phẩm (cà phê/...)
3. Chọn thị trường xuất khẩu (EU, USA, ...)
4. `POST /api/products`
5. BE validate: `code` unique trong org (NOT global)
6. BE tạo `Product` + `ProductMarket[]`
7. BE ghi AuditLog

**Validation:**
```
name:    required | 2–200 ký tự
code:    required | 1–50 ký tự | alphanumeric + dash | unique trong org
type:    required | enum: COFFEE | RICE | SPICE | OTHER
primaryMarket: required | enum: EU | USA | JAPAN | CHINA
markets[]:     optional | array of market enums
hsCode:  optional | 6–10 digit
```

**Business Rule:**
- `Product.code` unique scope: `(organization_id, code)` — KHÔNG phải global
- Không thể tạo 2 sản phẩm cùng mã trong cùng org

**Database:**
- `products`: INSERT
- `product_markets`: INSERT (1 row per market)

**API:** `POST /api/products`

**Audit Log:** `{ action: "product.created", productId, name, code, orgId }`

---

### UC-04.1.2 — Xem danh sách sản phẩm

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.1.2 |
| **API** | `GET /api/products?page&pageSize&search&market&status&sort` |
| **Output** | Paged list với: name, code, type, market, batch count, last check status |

**Filter hỗ trợ:**
```
search:  tìm theo name, code
market:  EU | USA | ...
status:  active | archived
sort:    createdAt:desc | name:asc | lastCheck:desc
```

**Phân quyền:** Tất cả roles (viewer chỉ xem)

---

### UC-04.1.3 — Cập nhật thông tin sản phẩm

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.1.3 |
| **API** | `PATCH /api/products/:id` |
| **Actor** | Analyst, Manager, Owner |
| **Business Rule** | Không đổi được `code` nếu đã có batch gắn vào |

---

### UC-04.1.4 — Xóa sản phẩm

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.1.4 |
| **API** | `DELETE /api/products/:id` |
| **Actor** | Manager, Owner |
| **Business Rule** | Chỉ xóa được nếu chưa có batch hoặc tất cả batch đã archive |

**Exception:**
- Có batch đang active → "Không thể xóa sản phẩm đang có lô hàng. Hãy archive tất cả lô hàng trước"

---

### UC-04.1.5 — Import sản phẩm từ CSV

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.1.5 |
| **Actor** | Manager, Owner |
| **Input** | CSV file: name, code, type, market, hsCode |
| **Output** | Danh sách import result: success/failed per row |

**Main Flow:**
1. User download template CSV
2. Điền danh sách sản phẩm
3. Upload CSV
4. `POST /api/products/import`
5. BE parse CSV, validate từng row, import batch
6. Return: `{ success: N, failed: M, errors: [{ row, reason }] }`

**Validation:**
- Validate format từng field
- Duplicate code check trong cùng org
- Skip (không fail toàn bộ) nếu 1 row lỗi

---

## UC-04.2 — Quản lý Lô hàng

### UC-04.2.1 — Tạo lô hàng mới

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.2.1 |
| **Tên** | Tạo lô hàng xuất khẩu |
| **Mục tiêu** | Đăng ký một lô hàng cụ thể cần kiểm tra compliance |
| **Actor** | Analyst, Manager, Owner |
| **Tiền điều kiện** | Product tồn tại, thuộc org của user |
| **Hậu điều kiện** | Batch record tạo, status = "draft" |
| **Trigger** | User click "Thêm lô hàng" trong Product Detail |
| **Input** | `productId`, `batchCode`, `exportDate`, `targetMarket`, `quantity`, `unit`, `description?` |
| **Output** | Batch record { id, status: "draft" } |

**Main Flow:**
1. User trong Product Detail → "Thêm lô hàng"
2. Điền form: mã lô, ngày xuất khẩu dự kiến, thị trường đích, số lượng
3. `POST /api/products/:productId/batches`
4. BE validate:
   - productId thuộc org hiện tại
   - batchCode unique trong product
   - exportDate phải là tương lai hoặc hiện tại
5. Tạo Batch { status: "draft" }
6. AuditLog

**Validation:**
```
batchCode:    required | unique trong product | max 50 ký tự
exportDate:   required | >= today
targetMarket: required | phải trong product.markets
quantity:     required | > 0
unit:         required | enum: KG | TON | BAG
```

**Business Rule:**
- `Batch.organization_id === Product.organization_id` (kiểm tra ở BE)
- Không thể tạo batch cho product đã archive

**Database:**
- `batches`: INSERT { organization_id, product_id, batch_code, status: "draft", ... }

**API:** `POST /api/products/:productId/batches`

**Audit Log:** `{ action: "batch.created", batchId, batchCode, productId, orgId }`

---

### UC-04.2.2 — Xem danh sách lô hàng

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.2.2 |
| **API** | `GET /api/products/:id/batches?page&status&sort` |
| **Output** | Paged list: batchCode, exportDate, status, lastCheck result, document count |

**Status filter:**
```
draft | collecting_documents | ready_for_check | checking | 
action_required | compliant | non_compliant | expired
```

---

### UC-04.2.3 — Xem chi tiết lô hàng

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.2.3 |
| **API** | `GET /api/batches/:id` |
| **Output** | Batch info + documents list + checks history + current status |

**Sections trong Batch Detail page:**
1. **Header:** batchCode, product, status badge, exportDate
2. **Documents tab:** danh sách docs + trạng thái extraction
3. **Checks tab:** lịch sử compliance check (most recent first)
4. **Timeline tab:** audit events của batch

---

### UC-04.2.4 — Cập nhật thông tin lô hàng

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.2.4 |
| **API** | `PATCH /api/batches/:id` |
| **Business Rule** | Không update được batch đang `checking` |

**Validation:**
- Không thể thay đổi `batchCode` nếu đã có check đã run
- Không thể thay đổi `targetMarket` nếu đã có check

---

### UC-04.2.5 — Archive lô hàng

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.2.5 |
| **API** | `POST /api/batches/:id/archive` |
| **Actor** | Manager, Owner |
| **Business Rule** | Archive khi lô hàng đã xuất khẩu xong hoặc hủy |

**Main Flow:**
1. `POST /api/batches/:id/archive`
2. BE: batch.status = "expired"
3. Batch không hiển thị trong active list nhưng vẫn lưu trong history

---

### UC-04.2.6 — Xóa lô hàng

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.2.6 |
| **API** | `DELETE /api/batches/:id` |
| **Actor** | Manager, Owner |
| **Business Rule** | Chỉ xóa được batch ở trạng thái `draft`, chưa có check |

---

## UC-04.3 — Lịch sử kiểm tra lô hàng

### UC-04.3.1 — Xem lịch sử compliance check

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.3.1 |
| **Mục tiêu** | Theo dõi tất cả lần check của một lô hàng |
| **Output** | List: checkDate, result, riskScore, findings count, checker |

**Hiển thị:**
- Timeline view theo thứ tự thời gian
- Badge kết quả có màu (compliant=green, non_compliant=red, ...)
- Tag "superseded" cho check cũ khi đã recheck

---

### UC-04.3.2 — So sánh 2 lần check

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.3.2 |
| **Mục tiêu** | So sánh findings, risk score giữa 2 lần check để thấy cải thiện |
| **Input** | `checkId1`, `checkId2` |
| **Output** | Diff view: findings mới xuất hiện, findings đã xử lý, risk score delta |

---

### UC-04.3.3 — Xem xu hướng rủi ro

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.3.3 |
| **Output** | Line chart: riskScore theo thời gian cho một batch/product |

---

## UC-04.4 — Trạng thái tự động

### UC-04.4.1 — Auto-update khi quy định mới

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.4.1 |
| **Trigger** | Khi UC-08 (Monitoring) phát hiện regulation thay đổi |
| **Actor** | System |

**Logic:**
```typescript
// Khi có regulation version mới effective
onNewRegulationVersion(regVersionId) {
  // Tìm tất cả batches có status = "compliant" liên quan
  const affectedBatches = await findAffectedBatches(regVersionId)
  for (const batch of affectedBatches) {
    // Đặt lại status: compliant → action_required
    await updateBatchStatus(batch.id, "action_required")
    // Gửi notification
    await notifyBatchOwners(batch, "Quy định áp dụng cho lô hàng này đã thay đổi")
  }
}
```

---

### UC-04.4.2 — Cảnh báo tài liệu sắp hết hạn

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-04.4.2 |
| **Trigger** | Cron job hàng ngày |
| **Business Rule** | Cảnh báo 30 ngày trước khi hết hạn |

```typescript
// Daily cron: 08:00 UTC
const expiringDocs = await prisma.document.findMany({
  where: {
    expiryDate: {
      gte: today,
      lte: addDays(today, 30)
    },
    status: { in: ["extracted", "confirmed"] }
  }
})
// Send notification đến analysts của batch tương ứng
```

---

## Screens liên quan

| Screen | Route | Mô tả |
|--------|-------|-------|
| Products List | `/products` | Danh sách sản phẩm, filter, search |
| Product Detail | `/products/:id` | Chi tiết + list batches |
| Batch Detail | `/batches/:id` | Chi tiết lô hàng + docs + checks |
| Create Product | Modal / `/products/new` | Form tạo sản phẩm |
| Create Batch | Modal trong Product Detail | Form tạo lô hàng |
| Import Products | Modal | Upload CSV |

---

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/products` | Danh sách products (paged) |
| POST | `/api/products` | Tạo product |
| GET | `/api/products/:id` | Chi tiết product |
| PATCH | `/api/products/:id` | Cập nhật |
| DELETE | `/api/products/:id` | Xóa |
| POST | `/api/products/import` | Import CSV |
| GET | `/api/products/:id/batches` | Danh sách batches |
| POST | `/api/products/:id/batches` | Tạo batch |
| GET | `/api/batches/:id` | Chi tiết batch |
| PATCH | `/api/batches/:id` | Cập nhật batch |
| DELETE | `/api/batches/:id` | Xóa batch |
| POST | `/api/batches/:id/archive` | Archive batch |

---

## Database Tables

| Bảng | Thao tác |
|------|---------|
| `products` | INSERT, UPDATE, DELETE (soft) |
| `product_markets` | INSERT, DELETE |
| `batches` | INSERT, UPDATE status, DELETE (soft) |
| `audit_logs` | INSERT |

---

## Notifications

| Sự kiện | Kênh | Người nhận |
|---------|------|-----------|
| Tài liệu sắp hết hạn (30 ngày) | Email + In-App | Analyst + Manager |
| Batch status thay đổi do quy định mới | Email + In-App | Manager + Owner |

---

## Audit Log Events

| Event | Khi nào |
|-------|---------|
| `product.created` | Tạo product |
| `product.updated` | Cập nhật |
| `product.deleted` | Xóa |
| `product.imported` | Import CSV |
| `batch.created` | Tạo batch |
| `batch.updated` | Cập nhật |
| `batch.archived` | Archive |
| `batch.deleted` | Xóa |
| `batch.status_changed` | Tự động hoặc do check |

---

## Điều kiện hoàn thành (DoD)

- [ ] CRUD product hoạt động với validation
- [ ] CRUD batch hoạt động, batch.orgId = product.orgId được enforce
- [ ] Filter + pagination server-side, URL sync
- [ ] Import CSV với error reporting per row
- [ ] Batch status tự động cập nhật theo flow: draft → collecting → ready → checking → result
- [ ] Cảnh báo tài liệu hết hạn gửi đúng người
- [ ] Không user nào xem được data của org khác
- [ ] Audit log đầy đủ

# UC-05 — Khai báo Thẩm định Ủy quyền

> **Mức độ:** Level 1 (Use Case chính)  
> **Actor chính:** Quản lý HTX (Hợp tác xã)  
> **Priority:** P1 — Quan trọng (liên quan EUDR compliance)

---

## Cây phân rã

```
UC-05: Khai báo Thẩm định Ủy quyền
├── UC-05.1: Đăng ký HTX (Due Diligence Entity)
│   ├── UC-05.1.1: Tạo hồ sơ HTX
│   └── UC-05.1.2: Khai báo vùng hoạt động
│
├── UC-05.2: Quản lý nông hộ thành viên
│   ├── UC-05.2.1: Thêm nông hộ vào HTX
│   ├── UC-05.2.2: Xem danh sách nông hộ
│   └── UC-05.2.3: Cập nhật thông tin nông hộ
│
├── UC-05.3: Thu thập tuyên bố thẩm định (Due Diligence Statement)
│   ├── UC-05.3.1: Tạo tuyên bố thẩm định cho lô hàng
│   ├── UC-05.3.2: Đính kèm GPS + GeoJSON
│   ├── UC-05.3.3: Đính kèm tài liệu hỗ trợ
│   └── UC-05.3.4: Ký xác nhận điện tử (e-signature)
│
├── UC-05.4: Kiểm tra EUDR compliance
│   ├── UC-05.4.1: Xác minh vùng trồng với bản đồ rừng EU
│   ├── UC-05.4.2: Kiểm tra deforestation-free
│   └── UC-05.4.3: Tổng hợp kết quả EUDR
│
└── UC-05.5: Ủy quyền và chia sẻ dữ liệu
    ├── UC-05.5.1: Ủy quyền cho doanh nghiệp xuất khẩu
    ├── UC-05.5.2: Xem dữ liệu được chia sẻ
    └── UC-05.5.3: Thu hồi ủy quyền
```

---

## UC-05.1 — Đăng ký HTX

### UC-05.1.1 — Tạo hồ sơ HTX

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-05.1.1 |
| **Tên** | Tạo hồ sơ Hợp tác xã |
| **Mục tiêu** | HTX đăng ký tư cách pháp nhân trên hệ thống |
| **Actor** | Quản lý HTX |
| **Tiền điều kiện** | HTX chưa tồn tại trên hệ thống |
| **Hậu điều kiện** | DueDiligenceEntity record tạo, Quản lý HTX có tài khoản + org riêng |
| **Input** | `htxName`, `taxCode`, `province`, `district`, `address`, `representativeName`, `phone`, `email` |
| **Output** | DueDiligenceEntity record, Org + User account |

**Main Flow:**
1. Quản lý HTX đăng ký tài khoản (qua UC-00.1) với email riêng
2. Onboarding: chọn loại tổ chức = "HTX" 
3. Điền thông tin HTX
4. `POST /api/due-diligence-entities`
5. BE tạo `DueDiligenceEntity` record + liên kết với Organization

**Validation:**
```
htxName:            required | 2–200 ký tự
taxCode:            required | unique | 10-13 số
province:           required
representativeName: required
phone:              required | format VN phone
email:              required | format email
```

---

### UC-05.1.2 — Khai báo vùng hoạt động

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-05.1.2 |
| **Input** | Danh sách tỉnh/huyện hoạt động, tổng diện tích canh tác |

---

## UC-05.2 — Quản lý nông hộ thành viên

### UC-05.2.1 — Thêm nông hộ vào HTX

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-05.2.1 |
| **Actor** | Quản lý HTX |
| **Input** | `farmerName`, `idCard`, `province`, `farmArea`, `farmCount` |
| **Output** | Farmer record liên kết với HTX |

**Main Flow:**
1. Quản lý HTX vào "Quản lý nông hộ" → "Thêm nông hộ"
2. Điền thông tin nông hộ
3. `POST /api/farmers`
4. BE tạo Farmer record với `htxId`
5. Optional: link Farmer với User account (nếu nông hộ có smartphone)

---

## UC-05.3 — Thu thập tuyên bố thẩm định

### UC-05.3.1 — Tạo tuyên bố thẩm định

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-05.3.1 |
| **Tên** | Tạo Due Diligence Statement (DDS) |
| **Mục tiêu** | Tạo tuyên bố thẩm định theo yêu cầu EU EUDR |
| **Actor** | Quản lý HTX |
| **Tiền điều kiện** | HTX đã đăng ký, có danh sách nông hộ + GPS vùng trồng |
| **Hậu điều kiện** | DDS được tạo, liên kết với batch của doanh nghiệp |
| **Input** | `batchId`, `harvestPeriod`, `productType`, `quantity`, `farmerIds[]`, `geolocations[]` |

**Main Flow:**
1. Quản lý HTX tạo DDS cho một lô hàng cụ thể
2. Chọn nông hộ tham gia lô hàng này
3. Nhập / import GPS coordinates
4. Upload tài liệu hỗ trợ (hợp đồng mua bán, bản đồ vùng trồng)
5. `POST /api/due-diligence-statements`
6. BE lưu DDS + GeoJSON data
7. Dispatch job: verify-eudr (kiểm tra với bản đồ rừng)

---

### UC-05.3.2 — Đính kèm GPS + GeoJSON

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-05.3.2 |
| **Input** | `geolocations: Array<{ lat, lng, farmerId, farmName, area }>` hoặc GeoJSON file |
| **Output** | Validated geometry, area calculation |

**Validation:**
```
lat:  valid latitude (-90 to 90)
lng:  valid longitude (-180 to 180)
area: > 0 (hectares)
```

**AI xử lý:** Không dùng AI ở đây, chỉ dùng turf.js cho tính toán geometry

---

### UC-05.3.4 — Ký xác nhận (e-signature)

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-05.3.4 |
| **Mục tiêu** | Quản lý HTX ký số xác nhận tính chính xác của DDS |
| **Implementation** | Click-to-sign + timestamp + userId (không phải chữ ký số pháp lý) |

**Note:** Chữ ký số pháp lý không thuộc MVP

---

## UC-05.4 — Kiểm tra EUDR compliance

### UC-05.4.1 — Xác minh vùng trồng với bản đồ rừng EU

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-05.4.1 |
| **Actor** | System (Background Job) |
| **Input** | GeoJSON polygons của vùng trồng |
| **Output** | `deforestationRisk: low|medium|high`, overlay result |

**Logic:**
```typescript
// Gọi EU Forest Observatory API hoặc Global Forest Watch API
const riskResult = await euForestAPI.checkDeforestation({
  geometry: geoJSON,
  referenceDate: "2020-12-31" // EUDR baseline
})

if (riskResult.deforestationDetected) {
  createFinding({
    code: "EUDR_DEFORESTATION_RISK",
    severity: "critical",
    title: "Phát hiện dấu hiệu phá rừng trong vùng canh tác",
    evidence: riskResult.details
  })
}
```

**API tích hợp:**
- EU Forest Observatory API (nếu available)
- Global Forest Watch API (fallback)
- Hoặc upload file shapefile từ Cục Kiểm lâm VN

---

## UC-05.5 — Ủy quyền và chia sẻ dữ liệu

### UC-05.5.1 — Ủy quyền cho doanh nghiệp xuất khẩu

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-05.5.1 |
| **Mục tiêu** | HTX chia sẻ DDS với doanh nghiệp để dùng trong compliance check |
| **Actor** | Quản lý HTX |
| **Input** | `exporterOrgId`, `statementId`, `permissions: read`, `expiresAt?` |

**Main Flow:**
1. HTX tạo Authorization record
2. Doanh nghiệp xuất khẩu có thể đọc DDS khi chạy compliance check
3. DDS data được include vào context của UC-01

---

### UC-05.5.3 — Thu hồi ủy quyền

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-05.5.3 |
| **Business Rule** | Thu hồi ủy quyền không ảnh hưởng đến check đã chạy trước đó |

---

## Screens liên quan

| Screen | Route | Mô tả |
|--------|-------|-------|
| HTX Dashboard | `/htx/dashboard` | Overview cho quản lý HTX |
| Nông hộ | `/htx/farmers` | Danh sách nông hộ |
| DDS Management | `/htx/statements` | Danh sách tuyên bố thẩm định |
| DDS Detail | `/htx/statements/:id` | Chi tiết + map + GPS |
| GPS Map | trong DDS Detail | Interactive map với polygon vùng trồng |

---

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/due-diligence-entities` | Đăng ký HTX |
| GET | `/api/due-diligence-entities/:id` | Chi tiết HTX |
| POST | `/api/farmers` | Thêm nông hộ |
| GET | `/api/farmers` | Danh sách nông hộ |
| POST | `/api/due-diligence-statements` | Tạo DDS |
| GET | `/api/due-diligence-statements/:id` | Chi tiết DDS |
| POST | `/api/due-diligence-authorizations` | Ủy quyền chia sẻ |
| DELETE | `/api/due-diligence-authorizations/:id` | Thu hồi |

---

## Database Tables

| Bảng | Mô tả |
|------|-------|
| `due_diligence_entities` | Hồ sơ HTX |
| `farmers` | Danh sách nông hộ |
| `due_diligence_statements` | Tuyên bố thẩm định (DDS) |
| `statement_geolocations` | GPS coordinates (chuỗi JSON hoặc PostGIS) |
| `due_diligence_authorizations` | Ủy quyền chia sẻ |
| `audit_logs` | Nhật ký |

---

## Background Jobs

| Job | Mô tả |
|-----|-------|
| `verify-eudr-geolocation` | Kiểm tra GPS với bản đồ rừng EU |
| `calculate-farm-area` | Tính tổng diện tích từ polygon GeoJSON |

---

## Điều kiện hoàn thành (DoD)

- [ ] Quản lý HTX đăng ký được tài khoản riêng
- [ ] Thêm được nông hộ với thông tin cơ bản
- [ ] Tạo DDS với GPS data
- [ ] Bản đồ hiển thị polygon vùng trồng
- [ ] EUDR check chạy được (có thể là mock API nếu EU API chưa available)
- [ ] Ủy quyền chia sẻ data với doanh nghiệp
- [ ] Audit log đầy đủ

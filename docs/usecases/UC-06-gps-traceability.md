# UC-06 — GPS Vùng trồng & Truy xuất nguồn gốc

> **Mức độ:** Level 1 (Use Case chính)  
> **Actor chính:** Nông hộ  
> **Priority:** P1 — Quan trọng (EUDR requirement)

---

## Cây phân rã

```
UC-06: GPS Vùng trồng & Truy xuất nguồn gốc
├── UC-06.1: Thu thập GPS vùng trồng
│   ├── UC-06.1.1: Ghi GPS thực địa (mobile app / GPS device)
│   ├── UC-06.1.2: Vẽ polygon ranh giới vùng trồng trên bản đồ
│   ├── UC-06.1.3: Upload file GeoJSON / Shapefile
│   └── UC-06.1.4: Chụp ảnh thực địa với GPS tag
│
├── UC-06.2: Xác minh GPS với bản đồ lâm nghiệp
│   ├── UC-06.2.1: Kiểm tra vùng trồng không chồng lấn với rừng
│   ├── UC-06.2.2: Kiểm tra ranh giới với bản đồ hành chính
│   └── UC-06.2.3: Tính tổng diện tích canh tác
│
├── UC-06.3: Quản lý truy xuất nguồn gốc
│   ├── UC-06.3.1: Liên kết lô cà phê với vùng trồng
│   ├── UC-06.3.2: Ghi nhận mùa vụ thu hoạch
│   └── UC-06.3.3: Tạo QR code truy xuất nguồn gốc
│
└── UC-06.4: Xem bản đồ & báo cáo
    ├── UC-06.4.1: Xem bản đồ tổng hợp tất cả vùng trồng
    └── UC-06.4.2: Xuất báo cáo truy xuất nguồn gốc
```

---

## UC-06.1 — Thu thập GPS vùng trồng

### UC-06.1.1 — Ghi GPS thực địa

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-06.1.1 |
| **Tên** | Ghi GPS tại thực địa |
| **Mục tiêu** | Nông hộ thu thập tọa độ GPS chính xác của vùng trồng |
| **Actor** | Nông hộ |
| **Tiền điều kiện** | Nông hộ có tài khoản (hoặc qua Quản lý HTX), có smartphone/GPS device |
| **Hậu điều kiện** | GPS coordinates được lưu, liên kết với farmer profile |
| **Trigger** | Nông hộ / cán bộ HTX ra thực địa thu thập |
| **Input** | `lat[]`, `lng[]` (điểm đo), `farmerId`, `farmName`, `area?` |
| **Output** | FarmLocation record với GPS polygon |

**Main Flow:**
1. Nông hộ / cán bộ dùng web app (mobile responsive) tại thực địa
2. Click "Ghi điểm GPS" → lấy vị trí hiện tại từ browser Geolocation API
3. Đi vòng theo ranh giới rẫy, ghi nhiều điểm
4. Hệ thống tự tạo polygon từ các điểm ghi
5. Xem preview trên bản đồ (Leaflet/MapLibre)
6. Xác nhận và lưu

**Validation:**
```
points:   minimum 3 điểm (để tạo polygon)
accuracy: browser GPS accuracy < 30m được chấp nhận
```

**Alternative:** Nhập tọa độ thủ công từ file GPS

---

### UC-06.1.2 — Vẽ polygon trên bản đồ

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-06.1.2 |
| **Mục tiêu** | Vẽ ranh giới vùng trồng trực tiếp trên bản đồ web |
| **UI** | Interactive map (MapLibre GL JS + draw plugin) |
| **Input** | Draw polygon action |
| **Output** | GeoJSON Polygon |

**Main Flow:**
1. Mở bản đồ (satellite view)
2. Chọn công cụ vẽ polygon
3. Click để tạo điểm, double-click để đóng polygon
4. Hiển thị diện tích tính toán tự động (turf.js)
5. Lưu GeoJSON

---

### UC-06.1.3 — Upload GeoJSON / Shapefile

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-06.1.3 |
| **Input** | `.geojson`, `.kml`, `.shp` (zip) |
| **Output** | Normalized GeoJSON polygon |

**Processing:**
- GeoJSON → parse trực tiếp
- KML → convert sang GeoJSON
- Shapefile → shpjs → GeoJSON

---

### UC-06.1.4 — Chụp ảnh thực địa với GPS tag

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-06.1.4 |
| **Input** | Ảnh JPEG/HEIC có EXIF GPS data |
| **Output** | Photo evidence với GPS coordinate extracted từ EXIF |

**Logic:**
```typescript
const exif = await extractExif(imageBuffer)
const gpsFromPhoto = {
  lat: exif.GPSLatitude,
  lng: exif.GPSLongitude,
  timestamp: exif.DateTime
}
```

---

## UC-06.2 — Xác minh GPS với bản đồ lâm nghiệp

### UC-06.2.1 — Kiểm tra chồng lấn với rừng

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-06.2.1 |
| **Actor** | System (Background Job) |
| **Input** | GeoJSON polygon của vùng trồng |
| **Output** | `overlapWithForest: boolean`, `overlapArea: hectares`, `riskLevel` |

**Implementation:**
```typescript
// Option 1: Call Global Forest Watch API
const gfwResult = await globalForestWatchAPI.checkDeforestation({
  geometry: polygon,
  canopyDensity: 30,    // 30% canopy = forest definition
  referenceYear: 2020  // EUDR baseline date: Dec 31, 2020
})

// Option 2: Local PostGIS query với forest map layer
const intersection = await prisma.$queryRaw`
  SELECT 
    ST_Area(ST_Intersection(farm.geom, forest.geom)) as overlap_area
  FROM farm_polygons farm
  JOIN forest_map_2020 forest ON ST_Intersects(farm.geom, forest.geom)
  WHERE farm.id = ${farmId}
`
```

---

### UC-06.2.3 — Tính tổng diện tích

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-06.2.3 |
| **Library** | turf.js (FE preview) + PostGIS (BE accurate) |

---

## UC-06.3 — Quản lý truy xuất nguồn gốc

### UC-06.3.1 — Liên kết lô cà phê với vùng trồng

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-06.3.1 |
| **Mục tiêu** | Tạo chain of custody: vùng trồng → nông hộ → HTX → lô hàng xuất khẩu |
| **Actor** | Quản lý HTX |
| **Input** | `batchId`, `farmerIds[]`, `farmPolygonIds[]`, `harvestWeight`, `harvestDate` |
| **Output** | TraceabilityRecord liên kết đầy đủ |

**Mô hình dữ liệu truy xuất:**
```
ExportBatch (lô xuất khẩu)
  └── contains → HTX Collection (gom hàng HTX)
        └── from → Farmer Harvests (thu hoạch nông hộ)
              └── grown at → Farm Polygons (vùng trồng GPS)
                    └── verified by → ForestCheck (xác minh EUDR)
```

---

### UC-06.3.3 — Tạo QR code truy xuất

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-06.3.3 |
| **Output** | QR code image + public URL truy xuất (không yêu cầu đăng nhập) |

**Main Flow:**
1. Tạo public traceability page: `/trace/:batchCode`
2. Page này hiển thị công khai (không cần login):
   - Tên sản phẩm, HTX, khu vực
   - Bản đồ vùng trồng (geofenced, không hiển thị GPS chính xác)
   - Kết quả kiểm tra (tóm tắt, không hiển thị chi tiết internal)
3. Generate QR code dẫn đến URL trên
4. QR code có thể in lên bao bì

**Security:**
- Public page KHÔNG hiển thị: tọa độ GPS chính xác, tên nông hộ đầy đủ, chi tiết compliance internal
- Chỉ hiển thị: khu vực (tỉnh/huyện), thông tin tổng hợp, kết quả EUDR pass/fail

---

## UC-06.4 — Xem bản đồ & báo cáo

### UC-06.4.1 — Bản đồ tổng hợp

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-06.4.1 |
| **Mục tiêu** | Xem tổng quan tất cả vùng trồng trên một bản đồ |
| **Actor** | Quản lý HTX, Compliance Manager |
| **UI** | MapLibre GL JS với cluster + polygon layers |

**Layers:**
- Farm polygons (color-coded: EUDR ok=green, risk=red, pending=yellow)
- Satellite imagery overlay
- Administrative boundaries
- Forest map overlay (optional toggle)

---

## Screens liên quan

| Screen | Route | Mô tả |
|--------|-------|-------|
| GPS Map | `/htx/farms/map` | Bản đồ tổng hợp |
| Farm Detail | `/htx/farms/:id` | Chi tiết vùng trồng + ảnh |
| Add Farm | `/htx/farms/new` | Vẽ polygon + upload GeoJSON |
| Traceability (Public) | `/trace/:code` | Public page không cần login |

---

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/farm-polygons` | Tạo polygon vùng trồng |
| GET | `/api/farm-polygons` | Danh sách vùng trồng |
| GET | `/api/farm-polygons/:id` | Chi tiết |
| PATCH | `/api/farm-polygons/:id` | Cập nhật |
| POST | `/api/traceability` | Tạo liên kết truy xuất |
| GET | `/api/public/trace/:code` | Public traceability (no auth) |
| POST | `/api/farm-polygons/:id/qr` | Tạo QR code |

---

## Database Tables

| Bảng | Mô tả |
|------|-------|
| `farm_polygons` | Polygon vùng trồng (GeoJSON hoặc PostGIS geometry) |
| `farm_photos` | Ảnh thực địa với GPS tag |
| `traceability_records` | Chain of custody |
| `forest_check_results` | Kết quả xác minh EUDR |

---

## Background Jobs

| Job | Mô tả |
|-----|-------|
| `verify-forest-overlap` | Kiểm tra GPS với GFW/EU Forest API |
| `calculate-polygon-area` | Tính diện tích chính xác qua PostGIS |

---

## Điều kiện hoàn thành (DoD)

- [ ] Vẽ polygon trên bản đồ và lưu được GeoJSON
- [ ] Upload GeoJSON file
- [ ] GPS từ browser Geolocation API
- [ ] Bản đồ hiển thị polygon với màu trạng thái EUDR
- [ ] EUDR forest check chạy (có thể placeholder nếu GFW API chưa integrate)
- [ ] QR code tạo được, public page hiển thị đúng
- [ ] Chain of custody: farm → farmer → HTX → batch

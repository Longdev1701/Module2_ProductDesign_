# UC-10 — So sánh Quy định Đa thị trường

> **Mức độ:** Level 1 (Use Case chính)  
> **Actor chính:** CEO, Compliance Manager  
> **Priority:** P1 — Quan trọng

---

## Cây phân rã

```
UC-10: So sánh Quy định Đa thị trường
├── UC-10.1: So sánh yêu cầu giữa các thị trường
│   ├── UC-10.1.1: Chọn sản phẩm và các thị trường cần so sánh
│   ├── UC-10.1.2: Lấy applicable regulations cho mỗi thị trường
│   └── UC-10.1.3: AI tổng hợp và so sánh yêu cầu
│
├── UC-10.2: So sánh giới hạn MRL đa thị trường
│   ├── UC-10.2.1: Matrix MRL theo pesticide × market
│   └── UC-10.2.2: Highlight market có yêu cầu khắt khe nhất
│
├── UC-10.3: Phân tích thị trường tối ưu
│   ├── UC-10.3.1: Ranking thị trường theo độ dễ compliance
│   ├── UC-10.3.2: Gap analysis: thiếu gì để vào thị trường mới
│   └── UC-10.3.3: Ước tính cost of compliance
│
└── UC-10.4: Export báo cáo so sánh
    ├── UC-10.4.1: Export bảng so sánh PDF
    └── UC-10.4.2: Export dữ liệu CSV
```

---

## UC-10.1 — So sánh yêu cầu giữa các thị trường

### UC-10.1.1 — Chọn sản phẩm và thị trường

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-10.1.1 |
| **Tên** | Cấu hình so sánh đa thị trường |
| **Actor** | CEO, Compliance Manager |
| **Tiền điều kiện** | Có ít nhất 2 thị trường trong regulation database |
| **Input** | `productType: COFFEE`, `markets: [EU, USA, JAPAN]`, `checkDate: today` |
| **Output** | Comparison session khởi tạo |

**Main Flow:**
1. User vào `/regulations/compare`
2. Chọn loại sản phẩm (cà phê)
3. Chọn >= 2 thị trường từ danh sách có sẵn trong DB
4. Click "So sánh"
5. `POST /api/regulation-comparisons { productType, markets[], date }`
6. BE dispatch analysis job (vì tổng hợp phức tạp)

---

### UC-10.1.2 — Lấy applicable regulations

```typescript
async function getApplicableRegs(productType: string, markets: string[]) {
  const regs: Record<string, RegulationVersion[]> = {}
  
  for (const market of markets) {
    regs[market] = await prisma.regulationVersion.findMany({
      where: {
        regulation: {
          markets: { has: market },
          productTypes: { has: productType }
        },
        status: { in: ["effective", "upcoming"] },
        effective_at: { lte: new Date() }
      }
    })
  }
  return regs
}
```

---

### UC-10.1.3 — AI tổng hợp so sánh

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-10.1.3 |
| **Actor** | System (Gemini AI) |
| **Input** | Regulation texts từ các thị trường |
| **Output** | ComparisonMatrix JSON |

**Output Schema:**
```typescript
type ComparisonMatrix = {
  categories: ComparisonCategory[]
  marketSummaries: Record<Market, MarketSummary>
}

type ComparisonCategory = {
  category:    string    // "MRL", "Labeling", "Certification", "Traceability"
  requirements: Record<Market, RequirementDetail>
  strictestMarket: Market
  commonalities: string[]
  differences:   string[]
}

type RequirementDetail = {
  required:     boolean
  description:  string
  specifics:    string[]
  citations:    string[]  // regulation chunk IDs
  severity:     "mandatory" | "conditional" | "recommended"
}
```

**Prompt:**
```
Hãy so sánh yêu cầu xuất khẩu cà phê sang các thị trường: EU, USA, Nhật Bản.

Với mỗi danh mục yêu cầu (MRL, Nhãn hiệu, Chứng nhận, Truy xuất nguồn gốc):
- Liệt kê yêu cầu cụ thể của từng thị trường
- Chỉ ra thị trường nào khắt khe nhất
- Chỉ ra yêu cầu chung (có thể làm một lần để đáp ứng nhiều thị trường)

Chỉ dùng thông tin trong context được cung cấp. Trả JSON theo schema.
```

---

## UC-10.2 — So sánh MRL Matrix

### UC-10.2.1 — MRL Matrix theo pesticide × market

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-10.2.1 |
| **Tên** | Bảng so sánh MRL |
| **UI** | Table: Hàng = pesticide, Cột = market, Cell = giới hạn mg/kg |

**Output:**
```
| Pesticide       | EU (mg/kg) | USA (mg/kg) | Japan (mg/kg) | Strictest |
|-----------------|-----------|------------|--------------|-----------|
| Chlorpyrifos    | 0.01      | 0.10       | 0.05         | EU ⚠️     |
| Glyphosate      | 0.10      | 5.00       | 0.20         | EU ⚠️     |
| Imidacloprid    | 0.05      | 0.30       | 0.10         | EU ⚠️     |
```

**Color coding:**
- 🔴 Giới hạn EU < 0.05 mg/kg (rất nghiêm ngặt)
- 🟡 Giới hạn khác nhau đáng kể giữa markets
- 🟢 Giới hạn tương đương

---

### UC-10.2.2 — Highlight thị trường khắt khe nhất

**Logic:**
```typescript
function findStrictestMarket(mrlData: MrlMatrix): Map<Pesticide, Market> {
  const strictest = new Map<string, string>()
  for (const pesticide of mrlData.pesticides) {
    let minLimit = Infinity
    let strictestMarket = ""
    for (const market of mrlData.markets) {
      const limit = mrlData.getLimit(pesticide, market)
      if (limit < minLimit) {
        minLimit = limit
        strictestMarket = market
      }
    }
    strictest.set(pesticide, strictestMarket)
  }
  return strictest
}
```

---

## UC-10.3 — Phân tích thị trường tối ưu

### UC-10.3.1 — Ranking thị trường

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-10.3.1 |
| **Mục tiêu** | Giúp CEO quyết định thị trường nào dễ enter nhất |
| **Output** | Ranking với scores theo nhiều tiêu chí |

**Scoring criteria:**
```
ComplianceEase = weighted average of:
  - Số lượng yêu cầu bắt buộc (ít hơn = dễ hơn)
  - Độ khắt khe của MRL (cao hơn = dễ hơn)
  - Số loại tài liệu required
  - Độ phức tạp của EUDR/traceability
  - Mức độ thay đổi regulation (ổn định hơn = dễ hơn)
```

---

### UC-10.3.2 — Gap Analysis

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-10.3.2 |
| **Input** | `productId`, `targetMarket` (thị trường mới muốn vào) |
| **Output** | Danh sách gaps: điều kiện còn thiếu để vào thị trường |

**Main Flow:**
1. User chọn sản phẩm hiện có + thị trường mới
2. BE: lấy current compliance state + target market requirements
3. AI: so sánh và liệt kê gaps
4. Return: `[{ category, gap, priority, estimatedEffort }]`

**Output example:**
```
Gaps để xuất cà phê sang Nhật Bản:
1. [Critical] Chứng nhận Japan Agricultural Standard (JAS) — Chưa có
2. [High] Kết quả test MRL theo phương pháp JMAFF — Chưa có
3. [Medium] Nhãn tiếng Nhật theo JAS regulations — Chưa có
4. [Low] Đăng ký nhà xuất khẩu với MAFF — Chưa có
```

---

### UC-10.3.3 — Ước tính cost of compliance

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-10.3.3 |
| **Ghi chú** | Tính năng P2 — sau MVP. Cần data về chi phí certification |
| **Output** | Ước tính chi phí: lab testing, certification, audit |

---

## UC-10.4 — Export báo cáo so sánh

### UC-10.4.1 — Export PDF

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-10.4.1 |
| **API** | `POST /api/regulation-comparisons/:id/export?format=pdf` |
| **Output** | PDF report: comparison matrix, MRL table, gap analysis |

---

### UC-10.4.2 — Export CSV

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-10.4.2 |
| **API** | `POST /api/regulation-comparisons/:id/export?format=csv` |
| **Output** | CSV với MRL matrix data |

---

## Screens liên quan

| Screen | Route | Mô tả |
|--------|-------|-------|
| Market Comparison | `/regulations/compare` | Setup + xem kết quả |
| MRL Matrix | trong Compare page | Tab MRL |
| Gap Analysis | trong Compare page | Tab Gap Analysis |
| Market Ranking | trong Compare page | Tab Ranking |

---

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/regulation-comparisons` | Tạo so sánh |
| GET | `/api/regulation-comparisons/:id` | Kết quả so sánh |
| POST | `/api/regulation-comparisons/:id/export` | Export report |
| GET | `/api/regulation-comparisons/history` | Lịch sử so sánh |

---

## Database Tables

| Bảng | Mô tả |
|------|-------|
| `regulation_comparisons` | Metadata của mỗi lần so sánh |
| `comparison_results` | Cached kết quả (JSON) |

---

## Điều kiện hoàn thành (DoD)

- [ ] User chọn được sản phẩm + >= 2 thị trường
- [ ] Hệ thống lấy đúng regulations theo market + productType
- [ ] AI sinh bảng so sánh có citation
- [ ] MRL matrix hiển thị đúng với color coding
- [ ] Gap analysis hoạt động cho thị trường mới
- [ ] Export PDF thực tế
- [ ] Kết quả có citations đến regulation cụ thể

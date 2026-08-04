# UC-02 — AI Compliance Assistant

> **Mức độ:** Level 1 (Use Case chính — Hỗ trợ)  
> **Actor chính:** Tất cả actor (có tài khoản, đã đăng nhập)  
> **Priority:** P1 — Quan trọng

---

## Cây phân rã

```
UC-02: AI Compliance Assistant
├── UC-02.1: Chat với AI về quy định pháp lý
│   ├── UC-02.1.1: Đặt câu hỏi về quy định EU/thị trường
│   ├── UC-02.1.2: Hỏi về kết quả compliance check
│   ├── UC-02.1.3: Hỏi hướng xử lý finding
│   └── UC-02.1.4: Hỏi về thay đổi quy định mới
│
├── UC-02.2: Giải thích báo cáo compliance
│   ├── UC-02.2.1: Giải thích finding chi tiết
│   ├── UC-02.2.2: Đề xuất hành động khắc phục cụ thể
│   └── UC-02.2.3: Tóm tắt ngôn ngữ đơn giản (non-technical)
│
├── UC-02.3: Hỗ trợ chuẩn bị hồ sơ
│   ├── UC-02.3.1: Gợi ý danh sách tài liệu cần chuẩn bị
│   ├── UC-02.3.2: Hướng dẫn điền form / checklist
│   └── UC-02.3.3: Cảnh báo nguy cơ trước khi check
│
└── UC-02.4: Lịch sử và context chat
    ├── UC-02.4.1: Duy trì context trong phiên chat
    └── UC-02.4.2: Xem lại lịch sử câu hỏi
```

---

## UC-02.1 — Chat với AI về quy định pháp lý

### UC-02.1.1 — Đặt câu hỏi về quy định EU/thị trường

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-02.1.1 |
| **Tên** | Hỏi AI về quy định pháp lý |
| **Mục tiêu** | Cung cấp câu trả lời có căn cứ, có citation từ regulation database |
| **Actor** | Tất cả actor (viewer, analyst, manager, owner) |
| **Tiền điều kiện** | User đã đăng nhập, có org context |
| **Hậu điều kiện** | AI trả lời có nguồn dẫn, được lưu vào lịch sử chat |
| **Trigger** | User gõ câu hỏi vào ô chat |
| **Input** | `question: string`, `context?: { batchId, checkId, reportId }` |
| **Output** | `answer: string`, `citations: RegulationChunk[]`, `confidence: number` |

**Main Flow:**
1. User gõ câu hỏi trong chat interface (bottom-right widget hoặc `/assistant` page)
2. FE gọi `POST /api/assistant/chat`
3. BE nhận câu hỏi + optional context (batchId/checkId)
4. RAG retrieval: tìm regulation chunks liên quan (pgvector similarity search)
5. Build prompt: system + question + retrieved_chunks
6. Gọi Gemini API
7. Parse response → extract citations
8. Validate: nếu AI trả lời không có citation → thêm disclaimer
9. Return: `{ answer, citations, confidence, sessionId }`
10. FE render: markdown answer + citation references có thể click

**Luồng chi tiết:**
```
User gõ câu hỏi
  ↓
FE: POST /api/assistant/chat {
  question: "MRL của chlorpyrifos trong cà phê xuất khẩu EU là bao nhiêu?",
  sessionId: "session_xyz",
  context: { market: "EU", productType: "COFFEE" }
}
  ↓
BE: RAG retrieval
  → embed(question) → pgvector cosine search → top 10 chunks
  → keyword boost: "chlorpyrifos", "MRL", "EU", "coffee"
  ↓
BE: Build prompt
  → System: "Chỉ dùng context được cung cấp..."
  → Context: regulation chunks
  → User: câu hỏi
  ↓
BE: Gemini API call
  ↓
BE: Parse response
  → Extract citation references
  → Validate confidence
  ↓
Return {
  answer: "Theo EU Regulation (EC) No 396/2005...",
  citations: [{ chunkId, title, text, url }],
  confidence: 0.91,
  sessionId: "session_xyz"
}
  ↓
FE: Render markdown + citation badges
```

**Alternative Flow:**
- Câu hỏi ngoài domain (không liên quan quy định) → AI từ chối lịch sự: "Tôi chỉ hỗ trợ câu hỏi về pháp lý nông sản xuất khẩu"
- Không tìm được chunk liên quan → "Không tìm thấy thông tin trong cơ sở pháp lý hiện tại. Vui lòng liên hệ chuyên gia"

**Exception Flow:**
- Gemini API timeout → "Hệ thống AI tạm thời không phản hồi. Vui lòng thử lại"
- Confidence < 0.6 → Thêm disclaimer: "Câu trả lời có độ tin cậy thấp, khuyến nghị xác nhận với chuyên gia pháp chế"

**Business Rules:**
- AI KHÔNG được tạo văn bản quy định không có trong database
- Mọi câu trả lời phải có citation nếu đưa ra con số cụ thể
- AI KHÔNG thay thế tư vấn pháp lý chuyên nghiệp → hiển thị disclaimer

**Validation:**
```
question: required | 5–2000 ký tự
sessionId: optional | uuid format
context.market: optional | enum: EU|USA|Japan|China
```

**Database tác động:**
- `assistant_sessions`: INSERT session (nếu mới) hoặc UPDATE lastActiveAt
- `assistant_messages`: INSERT (question + answer + citations)
- `ai_usage_events`: INSERT (token count, cost)

**API:**
```
POST /api/assistant/chat
GET  /api/assistant/sessions          -- danh sách session
GET  /api/assistant/sessions/:id/messages  -- lịch sử chat
```

**Audit Log:** `{ action: "assistant.question_asked", userId, orgId, sessionId, questionLength, citations_count }`

**Rate limit:** 30 questions/hour/user

---

### UC-02.1.2 — Hỏi về kết quả compliance check

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-02.1.2 |
| **Mục tiêu** | Giải thích ngôn ngữ đơn giản kết quả check đã có |
| **Input** | `checkId` + câu hỏi của user |
| **Extra context** | Check findings, report summary được inject vào prompt |

**Main Flow:**
1. User trong trang Check Detail, click "Hỏi AI về kết quả này"
2. Chat widget tự động attach context: `{ checkId, findings summary }`
3. BE load findings của check đó → inject vào prompt context
4. AI giải thích dựa trên findings cụ thể

---

### UC-02.1.3 — Hỏi hướng xử lý finding

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-02.1.3 |
| **Input** | `findingId` + "Làm thế nào để xử lý lỗi này?" |
| **Output** | Khuyến nghị cụ thể từng bước |

**AI xử lý:**
- Load finding data: code, severity, observedData, recommendation
- RAG: tìm regulation chunks liên quan finding
- Sinh action plan từng bước có thể thực hiện

---

## UC-02.2 — Giải thích báo cáo

### UC-02.2.3 — Tóm tắt ngôn ngữ đơn giản

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-02.2.3 |
| **Mục tiêu** | Chuyển báo cáo kỹ thuật sang ngôn ngữ cho CEO/người không chuyên |
| **Actor** | Owner/CEO, Viewer |

**Main Flow:**
1. User trong Report page, click "Tóm tắt đơn giản"
2. FE gọi `POST /api/assistant/summarize { reportId, audience: "executive" }`
3. AI sinh: 1 đoạn tóm tắt ngắn, bullet points hành động cần làm
4. Hiển thị ngay dưới report

**AI Output format:**
```
TÓM TẮT CHO LÃNH ĐẠO
Lô hàng [X] CÀ PHÊ — Kiểm tra EU ngày [date]

Kết quả: ⚠️ Chưa đủ điều kiện xuất khẩu

3 vấn đề cần xử lý ngay:
1. Dư lượng chlorpyrifos vượt ngưỡng → cần kiểm nghiệm lại
2. Thiếu khai báo EUDR → cần bổ sung tọa độ vùng trồng
3. Chứng nhận hữu cơ sắp hết hạn (còn 12 ngày)

Thời gian ước tính xử lý: 7–14 ngày
```

---

## UC-02.3 — Hỗ trợ chuẩn bị hồ sơ

### UC-02.3.1 — Gợi ý tài liệu cần chuẩn bị

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-02.3.1 |
| **Input** | `productType`, `targetMarket`, `checkType` |
| **Output** | Checklist tài liệu cần có (required + recommended) |

**Main Flow:**
1. User hỏi: "Tôi cần tài liệu gì để xuất cà phê sang EU?"
2. BE: Query `required_documents` cho market=EU + product=COFFEE
3. AI tổng hợp + giải thích từng tài liệu
4. Return checklist có thể download

---

## UC-02.4 — Lịch sử chat

### UC-02.4.1 — Duy trì context phiên chat

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-02.4.1 |
| **Mục tiêu** | AI nhớ các câu hỏi trước trong cùng phiên làm việc |

**Implementation:**
- Session ID được tạo khi mở chat
- `assistant_messages` lưu cả user messages + AI responses
- BE load N messages gần nhất vào prompt context (sliding window)
- Max context: 10 turns (20 messages)

---

## Screens liên quan

| Screen | Route | Mô tả |
|--------|-------|-------|
| AI Assistant Page | `/assistant` | Trang chat full-screen |
| Chat Widget | Mọi trang | Floating button bottom-right |
| Report Detail | `/reports/:id` | Button "Tóm tắt đơn giản" |
| Check Detail | `/checks/:id` | Button "Hỏi AI về kết quả" |
| Finding Card | trong Check Detail | Button "Hướng xử lý" |

---

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/assistant/chat` | Gửi câu hỏi |
| POST | `/api/assistant/summarize` | Tóm tắt report |
| POST | `/api/assistant/prepare-checklist` | Gợi ý tài liệu |
| GET | `/api/assistant/sessions` | Danh sách phiên |
| GET | `/api/assistant/sessions/:id/messages` | Lịch sử chat |

---

## Database Tables

| Bảng | Mô tả |
|------|-------|
| `assistant_sessions` | Phiên chat (sessionId, userId, orgId, context) |
| `assistant_messages` | Từng tin nhắn (role: user/assistant, content, citations) |
| `ai_usage_events` | Token tracking |

---

## Background Jobs

| Job | Mô tả |
|-----|-------|
| `cleanup-old-sessions` | Xóa session > 90 ngày (cron weekly) |

---

## Điều kiện hoàn thành (DoD)

- [ ] Chat hoạt động thật với Gemini (không mock)
- [ ] Mọi câu trả lời có citation từ regulation DB
- [ ] Disclaimer hiển thị khi confidence < 0.6
- [ ] Session lưu lịch sử trong DB
- [ ] Widget hiển thị trên mọi trang dashboard
- [ ] Tóm tắt report cho CEO hoạt động
- [ ] Rate limit 30/hour/user được enforce ở backend
- [ ] AI không trả lời câu hỏi ngoài domain

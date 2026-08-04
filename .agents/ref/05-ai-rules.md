# 05. Quy tắc AI — Compliance Engine

## AI được phép làm gì

- Trích xuất dữ liệu từ tài liệu (PDF, DOCX, XLSX, hình ảnh).
- Phân loại và tổng hợp thông tin.
- Giải thích, so sánh quy định.
- Đề xuất hành động khắc phục.

## AI KHÔNG được phép làm gì

- Tự tạo văn bản pháp luật không có trong context.
- Kết luận `compliant` khi thiếu citation.
- Thay đổi dữ liệu trực tiếp khi chưa có xác nhận người dùng.
- Kết luận khi `confidence < 0.6`.
- Dẫn nguồn ngoài context được cung cấp.

> **Mọi finding phải có `citationIds` trỏ về `regulation_version_id` cụ thể.**
> Không có citation = không được lưu vào database.

## Structured Output Schema (bắt buộc)

Backend validate bằng **Zod** trước khi lưu. AI phải trả đúng schema này:

```json
{
  "summary": {
    "result": "conditionally_compliant",
    "riskScore": 68,
    "confidence": 0.87
  },
  "findings": [
    {
      "code": "MRL_LIMIT_EXCEEDED",
      "title": "Chlorpyrifos vượt ngưỡng MRL",
      "severity": "critical",
      "status": "open",
      "requirement": "EU Regulation (EC) No 396/2005 giới hạn 0.01 mg/kg",
      "observedData": "0.05 mg/kg (từ lab result ngày 2026-06-12)",
      "recommendation": "Không xuất khẩu lô hàng này đến EU cho đến khi có kết quả kiểm nghiệm lại.",
      "citationIds": ["reg_chunk_8291"],
      "confidence": 0.96,
      "manualReviewRequired": false
    }
  ],
  "missingInformation": [
    {
      "field": "farmGeolocation",
      "reason": "Không tìm thấy tọa độ vùng trồng trong tài liệu đã tải lên."
    }
  ]
}
```

## Confidence thresholds

| Mức | Hành động |
|---|---|
| < 0.6 | Bắt buộc `manualReviewRequired: true` |
| 0.6 – 0.8 | Hiển thị cảnh báo cho người dùng |
| > 0.8 | Vẫn phải có citation |
| Bất kỳ | Không có citation → không được kết luận compliant |

## Pipeline phân tích

```
Documents
  → Text & field extraction
  → User verification (xác nhận dữ liệu trích xuất)
  → Determine applicable regulations
      → Deterministic rule engine (MRL, ngày hết hạn, thiếu tài liệu, ...)
      → RAG retrieval (pgvector hybrid search)
           → Gemini analysis
           → Schema validation (Zod)
  → Merge findings
  → Risk scoring
  → Report generation
  → Human review
```

## Deterministic rules (KHÔNG dùng AI)

Các trường hợp phải kiểm tra bằng code:
- Giá trị MRL vượt giới hạn.
- Tài liệu hết hạn.
- Thiếu tài liệu bắt buộc.
- Đơn vị không hợp lệ.
- Ngày phát hành sau ngày xuất khẩu.
- Batch code không khớp giữa các chứng từ.
- Số certificate bị trùng.
- Quy định chưa có hiệu lực.

```typescript
// Ví dụ
if (measuredValue > allowedMrl) {
  createFinding({
    severity: "critical",
    code: "MRL_LIMIT_EXCEEDED",
    observedValue: measuredValue,
    expectedValue: allowedMrl,
    citationIds: [regulationChunkId]
  });
}
```

## Prompt structure

**System prompt** quy định:
- Chỉ dùng context được cung cấp.
- Không tự tạo văn bản pháp luật.
- Không kết luận khi thiếu thông tin.
- Phân biệt ngày công bố vs ngày hiệu lực.
- Trả đúng JSON schema.

**Domain prompt** chứa: thị trường, loại sản phẩm, loại kiểm tra, tiêu chuẩn severity.

**User context** chứa: batch data, extracted document data.

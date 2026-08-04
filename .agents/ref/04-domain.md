# 04. Trạng thái nghiệp vụ & Domain Model

## Trạng thái lô hàng (Batch.status)

```
draft → collecting_documents → ready_for_check → checking
                                                       ↓
                                          action_required / compliant / non_compliant / expired
```

## Trạng thái kiểm tra (ComplianceCheck.status)

```
queued → processing → completed
                   ↘ needs_input
                   ↘ failed
                   ↘ cancelled
                   ↘ superseded
```

## Kết quả kiểm tra (ComplianceCheck.result)

| Giá trị | Ý nghĩa |
|---|---|
| `compliant` | Đáp ứng đầy đủ yêu cầu |
| `conditionally_compliant` | Đạt nhưng có điều kiện cần hoàn thành |
| `non_compliant` | Không đáp ứng |
| `insufficient_information` | Thiếu dữ liệu để kết luận |
| `not_applicable` | Quy định không áp dụng |
| `manual_review_required` | Cần người chuyên môn xem xét |

> **KHÔNG dùng** `pass` / `fail` / `warning` làm giá trị result.

## Mức độ rủi ro (Finding.severity)

| Mức | Ý nghĩa |
|---|---|
| `critical` | Có thể ngăn lô hàng xuất khẩu hoặc gây vi phạm nghiêm trọng |
| `high` | Cần xử lý trước khi hoàn thành hồ sơ xuất khẩu |
| `medium` | Chưa vi phạm trực tiếp nhưng có rủi ro đáng kể |
| `low` | Khuyến nghị cải thiện |
| `informational` | Thông tin tham khảo hoặc thay đổi chưa có hiệu lực |

## Trạng thái tài liệu (Document.status)

`uploaded` → `queued` → `processing` → `extracted` / `needs_review` / `failed`

## Trạng thái văn bản pháp lý (RegulationVersion.status)

`draft` | `published` | `upcoming` | `effective` | `amended` | `repealed` | `unknown`

## Các entity chính & quan hệ

```
Organization
  └── OrganizationMember (role: owner/manager/analyst/viewer)
  └── Product
        └── ProductMarket (market: EU/USA/Japan/China)
        └── Batch
              └── Document (lab result, CO, traceability, ...)
                    └── DocumentVersion
                    └── DocumentExtraction
              └── ComplianceCheck
                    └── ComplianceCheckDocument (version snapshot)
                    └── Finding
                          └── FindingCitation (regulation_version_id)
                          └── RemediationTask
                                └── RemediationEvidence

Regulation
  └── RegulationVersion (immutable once used in check)
        └── RegulationApplicability
        └── RegulationChunk (pgvector embedding)
  └── RegulationImpact (per organization)

AuditLog (immutable, per organization)
Notification (per user)
SyncRun (legal data sync history)
AIUsageEvent (token tracking per check)
```

## Quy tắc bất biến

- **Report đã approve = immutable.** Chỉ tạo version mới.
- **Regulation không bao giờ bị xóa.** Chỉ thêm version mới.
- **DocumentVersion đã dùng trong check không được cập nhật.**
- **Không tạo batch nếu product không cùng organization.**
- **Không approve report khi check vẫn đang processing.**

# Themis LexiGuard — Use Case Breakdown

> **Nhánh:** `feat/breakdown-usecases`  
> **Tác giả phân tích:** AI Senior BA + Solution Architect  
> **Cập nhật:** 2026-08-04  
> **Phạm vi:** MVP — Cà phê × EU

---

## Danh sách Use Case

| Mã UC | Tên | Actor chính | File |
|-------|-----|-------------|------|
| UC-00 | Xác thực & Phân quyền (Auth & RBAC) | Tất cả actor | [UC-00-auth-rbac.md](./UC-00-auth-rbac.md) |
| UC-01 | AI Compliance Check | Compliance, CEO | [UC-01-compliance-check.md](./UC-01-compliance-check.md) |
| UC-02 | AI Compliance Assistant | Tất cả actor | [UC-02-ai-assistant.md](./UC-02-ai-assistant.md) |
| UC-03 | AI Document Review | Compliance, HTX | [UC-03-document-review.md](./UC-03-document-review.md) |
| UC-04 | Quản lý Hồ sơ & Lô hàng | Compliance, CEO | [UC-04-shipment-management.md](./UC-04-shipment-management.md) |
| UC-05 | Khai báo Thẩm định Ủy quyền | Quản lý HTX | [UC-05-delegation.md](./UC-05-delegation.md) |
| UC-06 | GPS Vùng trồng & Truy xuất nguồn gốc | Nông hộ | [UC-06-gps-traceability.md](./UC-06-gps-traceability.md) |
| UC-07 | Dashboard & Cảnh báo Quy định | CEO, Compliance, Hiệp hội | [UC-07-dashboard-alerts.md](./UC-07-dashboard-alerts.md) |
| UC-08 | Continuous Compliance Monitoring | Dịch vụ nền (Service) | [UC-08-continuous-monitoring.md](./UC-08-continuous-monitoring.md) |
| UC-10 | So sánh Quy định Đa thị trường | CEO, Compliance | [UC-10-multi-market.md](./UC-10-multi-market.md) |

---

## Tổng hợp hệ thống

- [00-system-overview.md](./00-system-overview.md) — System Map, Feature Tree, Use Case Tree, Business Flow, System Flow, Data Flow, AI Flow, Event Flow, CRUD Matrix, Permission Matrix, Module Breakdown, MVP/Future Modules

---

## Actors trong hệ thống

| Actor | Mô tả | Role nội bộ |
|-------|-------|-------------|
| **CEO / Owner** | Đại diện doanh nghiệp xuất khẩu | owner |
| **Compliance Manager** | Chuyên viên pháp chế cấp cao | manager |
| **Compliance Analyst** | Nhân viên phân tích tuân thủ | analyst |
| **Viewer** | Nhân sự chỉ xem báo cáo | viewer |
| **Quản lý HTX** | Đại diện hợp tác xã nông nghiệp | Tài khoản riêng / org riêng |
| **Nông hộ** | Người trực tiếp canh tác, khai báo GPS | User liên kết với HTX |
| **System Admin** | Quản trị viên hệ thống | Service role (backend only) |
| **Dịch vụ nền (Service)** | Background worker tự động | Không có UI |

---

## Mối quan hệ giữa Use Case (UML)

```
UC-00 (Auth/RBAC)
    <<include>> UC-01, UC-02, UC-03, UC-04, UC-05, UC-06, UC-07, UC-10

UC-04 (Shipment Mgmt)
    <<include>> UC-03 (Document Review)
    <<precede>> UC-01 (Compliance Check)

UC-03 (Document Review)
    <<precede>> UC-01 (Compliance Check)

UC-06 (GPS Traceability)
    <<extend>> UC-05 (Delegation)

UC-08 (Monitoring Service)
    <<trigger>> UC-01, UC-07

UC-01 (Compliance Check)
    <<extend>> UC-10 (Multi-Market Comparison)
    <<include>> UC-02 (AI Assistant)

UC-07 (Dashboard)
    <<include>> UC-02 (AI Assistant)
```

# 03. Phân quyền người dùng (RBAC)

## Ma trận quyền

| Chức năng | Owner | Manager | Analyst | Viewer |
|---|:---:|:---:|:---:|:---:|
| Quản lý organization | ✓ | ✗ | ✗ | ✗ |
| Mời / phân quyền thành viên | ✓ | ✗ | ✗ | ✗ |
| Tạo sản phẩm | ✓ | ✓ | ✓ | ✗ |
| Xóa sản phẩm | ✓ | ✓ | ✗ | ✗ |
| Tạo lô hàng | ✓ | ✓ | ✓ | ✗ |
| Upload tài liệu | ✓ | ✓ | ✓ | ✗ |
| Chạy compliance check | ✓ | ✓ | ✓ | ✗ |
| Phê duyệt báo cáo | ✓ | ✓ | ✗ | ✗ |
| Xem báo cáo | ✓ | ✓ | ✓ | ✓ |
| Tạo remediation task | ✓ | ✓ | ✗ | ✗ |
| Xem audit log | ✓ | ✓ | ✗ | ✗ |
| Quản lý dữ liệu pháp lý | ✗ | ✗ | ✗ | ✗ (System Admin) |

## Mô tả từng role

### Owner
Đại diện doanh nghiệp, tạo workspace. Có toàn quyền trong organization.

### Compliance Manager
Người chịu trách nhiệm tuân thủ. Tạo/phê duyệt check, giao task, theo dõi quy định.

### Compliance Analyst
Nhân viên phân tích. Chạy check, tải chứng từ, hoàn thành task. Không đổi quyền thành viên.

### Viewer
Chỉ xem dashboard, sản phẩm, báo cáo, thư viện pháp lý. Không chỉnh sửa, không chạy AI.

### System Admin
Quản trị toàn hệ thống (không phải role organization). Quản lý sync pháp lý, tài khoản bị khóa. Sử dụng service role tại backend — KHÔNG đưa service key xuống frontend.

## Quy tắc quan trọng

> **Phân quyền PHẢI được kiểm tra ở backend.**
> UI ẩn nút không phải bảo mật. Mọi endpoint phải kiểm tra:
> 1. Người dùng có thuộc organization không.
> 2. Membership có status `active` không.
> 3. Role có quyền thực hiện hành động không.
> 4. Entity có thuộc đúng organization không.

## Row Level Security (RLS)

Mọi bảng nghiệp vụ phải có `organization_id` trực tiếp hoặc truy xuất được qua quan hệ.

Nguyên tắc: *Người dùng chỉ được đọc dữ liệu thuộc organization mà họ là thành viên active.*

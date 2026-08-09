# UC-00 — Xác thực & Phân quyền (Authentication & RBAC)

> **Mức độ:** Level 1 (Use Case chính)  
> **Actor chính:** Tất cả actor  
> **Priority:** P0 — Bắt buộc (tiền đề của toàn hệ thống)

---

## 🔑 Tài Khoản Thử Nghiệm (Sample Test Credentials)

> **Dữ liệu tài khoản doanh nghiệp thử nghiệm sẵn có trên Database Supabase:**

* **Email:** `themis_exporter_1786179990121@yopmail.com`
* **Mật khẩu:** `ThemisLexiGuard2026!`
* **Doanh nghiệp đã gắn sẵn:** *Công ty CP Xuất Nhập Khẩu Nông Sản Tây Nguyên* (`Org ID: 8f694b72-d9ce-4026-8854-31637e869af4`)
* **Vai trò (OrganizationRole):** `OWNER` (Chủ doanh nghiệp)
* **Sản phẩm chiến lược:** Sầu riêng Tươi Ri6 / Dona & Sầu riêng Cấp đông (Mã HS: 0810.60.00)
* **Thị trường xuất khẩu mục tiêu:** CHINA (Tổng cục Hải quan Trung Quốc - GACC Protocol)
* **Hồ sơ tuân thủ trọng điểm:** Mã số Vùng trồng (PUC), Mã số Cơ sở đóng gói (PHC), Kiểm nghiệm vi sinh & Dư lượng kim loại nặng Cadmium, Hoạt chất Bảo vệ thực vật.

---

## Cây phân rã

```
UC-00: Xác thực & Phân quyền (Admin-Provisioned Enterprise SaaS)
├── UC-00.1: Đăng ký tài khoản & Chờ cấp quyền (Access Pending)
│   ├── UC-00.1.1: Nhập thông tin đăng ký (Họ tên, Email, Mật khẩu)
│   ├── UC-00.1.2: Tự động khởi tạo Profile tài khoản (Chưa thuộc Doanh nghiệp)
│   └── UC-00.1.3: Chuyển hướng màn hình Chờ Cấp Quyền (/pending-access)
│
├── UC-00.2: Đăng nhập, Đăng xuất & Khôi phục Mật khẩu
│   ├── UC-00.2.1: Đăng nhập bằng Email + Password
│   ├── UC-00.2.2: Đăng xuất & Ghi vết Audit Log (Logout)
│   ├── UC-00.2.3: Quên mật khẩu & Đặt lại mật khẩu mới (Forgot & Reset Password)
│   └── UC-00.2.4: Phân luồng chuyển hướng (Có Org -> /dashboard | Chưa Org -> /pending-access | Admin -> /admin)
│
├── UC-00.3: Quản trị Platform Admin (Admin Provisioning Portal)
│   ├── UC-00.3.1: Platform Admin khởi tạo Doanh nghiệp xuất khẩu mới (Create Organization)
│   ├── UC-00.3.2: Platform Admin cấp quyền & gán User vào Doanh nghiệp (Assign User & OrganizationRole)
│   ├── UC-00.3.3: Platform Admin quản lý danh sách Doanh nghiệp & User hệ thống
│   └── UC-00.3.4: OWNER / MANAGER cập nhật hồ sơ năng lực Doanh nghiệp (org.manage)
│
├── UC-00.4: Quản lý thành viên nội bộ Doanh nghiệp (Tenant Member Management)
│   ├── UC-00.4.1: OWNER / MANAGER gửi lời mời nhân sự mới qua email (member.invite)
│   ├── UC-00.4.2: Nhân sự chấp nhận lời mời và gia nhập Doanh nghiệp
│   └── UC-00.4.3: OWNER đổi vai trò / tạm khóa thành viên (member.role_change)
│
├── UC-00.5: Kiểm soát phân quyền 2 tầng (Two-Tier Authorization)
│   ├── UC-00.5.1: Tầng Nền tảng (PlatformRole: SUPER_ADMIN, PLATFORM_ADMIN, SUPPORT, USER)
│   ├── UC-00.5.2: Tầng Doanh nghiệp (OrganizationRole: OWNER, MANAGER, COMPLIANCE, VIEWER)
│   └── UC-00.5.3: Ma trận phân quyền 13 Quyền nghiệp vụ chuyên sâu (TENANT_PERMISSION_MATRIX)
│
└── UC-00.6: Audit Log xác thực & Quản trị
```

---

## UC-00.1 — Đăng ký tài khoản

### UC-00.1.1 — Nhập thông tin đăng ký

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.1.1 |
| **Tên** | Nhập thông tin đăng ký |
| **Mục tiêu** | Người dùng cung cấp email, password và họ tên để tạo tài khoản |
| **Actor** | Người dùng mới (chưa có tài khoản) |
| **Tiền điều kiện** | Truy cập trang `/register`, chưa đăng nhập |
| **Hậu điều kiện** | Tài khoản chờ xác thực email được tạo trong Supabase Auth |
| **Trigger** | Người dùng truy cập trang đăng ký |
| **Input** | `email`, `password`, `confirmPassword`, `fullName` |
| **Output** | Tài khoản tạm thời + email xác thực được gửi đi |

**Main Flow:**
1. User truy cập `/register`
2. Điền form: email, password, confirm password, họ tên
3. FE validate Zod: email format, password >= 8 ký tự, confirm match
4. FE gọi Supabase Auth: `signUp({ email, password })`
5. BE nhận event từ Supabase Auth webhook → tạo `Profile` record
6. Supabase gửi email xác thực tới user
7. FE hiển thị thông báo "Kiểm tra email để xác thực tài khoản"

**Alternative Flow:**
- Email đã tồn tại → hiển thị lỗi "Email này đã được đăng ký. Đăng nhập?"

**Exception Flow:**
- Supabase Auth service down → hiển thị "Dịch vụ đăng ký tạm thời không khả dụng"
- Email invalid → highlight lỗi ngay field

**Validation:**
```
email:           required | format email
password:        required | min 8 ký tự | có chữ hoa + số
confirmPassword: phải trùng với password
fullName:        required | min 2 ký tự | max 100 ký tự
```

**Database tác động:**
- `auth.users` (Supabase Auth): INSERT user record
- `profiles`: INSERT (via webhook/trigger)

**API:**
- Supabase Auth SDK: `supabase.auth.signUp()`
- Webhook → `POST /api/internal/auth/user-created` (BE xử lý tạo Profile)

**Audit Log:** `{ action: "user.registered", userId, email, ip, userAgent, timestamp }`

**Notification:** Email xác thực từ Supabase

---

### UC-00.1.2 — Xác thực email

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.1.2 |
| **Tên** | Xác thực email |
| **Mục tiêu** | Xác nhận email hợp lệ, kích hoạt tài khoản |
| **Actor** | Người dùng đã đăng ký |
| **Tiền điều kiện** | Email xác thực đã được gửi |
| **Hậu điều kiện** | Tài khoản active, chuyển sang Onboarding |
| **Trigger** | User click link trong email |

**Main Flow:**
1. User click link xác thực trong email
2. Supabase Auth xác nhận token, cập nhật `email_confirmed_at`
3. FE redirect → `/onboarding` (nếu chưa có org) hoặc `/dashboard`

**Exception Flow:**
- Token hết hạn (>24h) → hiển thị "Link đã hết hạn. Gửi lại email xác thực?"
- Token không hợp lệ → "Link xác thực không hợp lệ"

**Notification:** Không gửi thêm, chỉ redirect

**Audit Log:** `{ action: "user.email_verified", userId, timestamp }`

---

### UC-00.1.3 — Khởi tạo Profile

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.1.3 |
| **Tên** | Khởi tạo hồ sơ cá nhân |
| **Actor** | System (tự động) / User (onboarding) |
| **Tiền điều kiện** | Email đã xác thực |
| **Hậu điều kiện** | Profile record tồn tại, user có thể tạo/tham gia org |

**Database tác động:**
- `profiles`: INSERT `{ id: userId, fullName, email, avatarUrl, createdAt }`

---

## UC-00.2 — Đăng nhập

### UC-00.2.1 — Đăng nhập bằng email + password

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.2.1 |
| **Tên** | Đăng nhập email/password |
| **Mục tiêu** | Xác thực danh tính, cấp JWT session |
| **Actor** | Tất cả actor đã có tài khoản |
| **Tiền điều kiện** | Email đã xác thực, tài khoản không bị khóa |
| **Hậu điều kiện** | JWT access token + refresh token được cấp, user vào `/dashboard` |
| **Trigger** | User nhấn nút "Đăng nhập" |
| **Input** | `email`, `password` |
| **Output** | JWT session (access_token, refresh_token, expires_at) |

**Main Flow:**
1. User nhập email + password trên `/login`
2. FE validate: không trống, format email
3. FE gọi: `supabase.auth.signInWithPassword({ email, password })`
4. Supabase trả về session (JWT access_token, refresh_token)
5. FE lưu session vào memory + httpOnly cookie (via Supabase SSR helper)
6. FE kiểm tra: user đã thuộc organization nào chưa?
   - Có org → redirect `/dashboard`
   - Chưa có org → redirect `/onboarding`

**Rate Limit:** 5 lần/phút/IP

**Alternative Flow:**
- Quên mật khẩu → `supabase.auth.resetPasswordForEmail(email)`

**Exception Flow:**
- Sai password quá 5 lần → tạm khóa 15 phút
- Email chưa xác thực → "Vui lòng xác thực email trước"
- Tài khoản bị khóa bởi Admin → "Tài khoản bị tạm khóa. Liên hệ quản trị viên"

**Validation:**
```
email:    required | format email
password: required | không trống
```

**Database tác động:** Không ghi trực tiếp (Supabase Auth quản lý)

**Audit Log:** `{ action: "user.login_success" | "user.login_failed", userId/email, ip, userAgent, timestamp }`

---

### UC-00.2.2 — Refresh Token tự động

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.2.2 |
| **Actor** | System (tự động) |
| **Trigger** | Access token sắp hết hạn (Supabase SDK tự xử lý) |

**Main Flow:**
1. Supabase SDK tự động refresh khi token < 60s hết hạn
2. BE middleware kiểm tra token hợp lệ mỗi request
3. Nếu refresh_token hết hạn → FE redirect `/login?next=<current_path>`

**Exception Flow:**
- Refresh thất bại → clear session → redirect `/login`

---

### UC-00.2.3 — Đăng xuất

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.2.3 |
| **Trigger** | User nhấn nút "Đăng xuất" |

**Main Flow:**
1. FE gọi `supabase.auth.signOut()`
2. Supabase invalidate refresh token
3. Clear local session
4. Redirect `/login`

**Audit Log:** `{ action: "user.logout", userId, ip, timestamp }`

---

## UC-00.3 — Quản trị Platform Admin & Organization (Admin-Provisioned Enterprise SaaS)

### UC-00.3.1 — Platform Admin khởi tạo Doanh nghiệp xuất khẩu (Enterprise Provisioning)

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.3.1 |
| **Tên** | Platform Admin khởi tạo Doanh nghiệp xuất khẩu |
| **Mục tiêu** | Quản trị viên hệ thống (Platform Admin) khởi tạo hồ sơ Doanh nghiệp xuất khẩu nông sản chính thức |
| **Actor** | Platform Admin (`SUPER_ADMIN`, `PLATFORM_ADMIN`) — **Cấm User thường tự tạo** |
| **Tiền điều kiện** | Platform Admin đăng nhập thành công, có quyền `platformRole IN ('SUPER_ADMIN', 'PLATFORM_ADMIN')` |
| **Hậu điều kiện** | Bản ghi Doanh nghiệp (`Organization`) được tạo lập sẵn sàng để cấp quyền nhân sự |
| **Trigger** | Platform Admin truy cập Admin Portal (`/admin`) chọn "Tạo Doanh nghiệp Mới" |
| **Input** | `name`, `taxCode`, `address`, `legalRepresentative`, `contactEmail`, `contactPhone`, `primaryProduct`, `exportMarkets` |
| **Output** | Doanh nghiệp mới khởi tạo thành công + Ghi vết Audit Log `org.created` |

**Main Flow:**
1. Platform Admin truy cập Admin Portal `/admin` chọn "Tạo Doanh nghiệp Mới".
2. Điền đầy đủ thông tin Doanh nghiệp xuất khẩu: Tên công ty, Mã số thuế, Địa chỉ trụ sở, Người đại diện, Email liên hệ XNK, Sản phẩm chiến lược, Thị trường xuất khẩu.
3. FE gửi request `POST /api/admin/organizations`.
4. BE middleware `platformRbacMiddleware(['SUPER_ADMIN', 'PLATFORM_ADMIN'])` xác thực quyền Admin.
5. BE tạo bản ghi `Organization` mới trong Database.
6. BE ghi vết `AuditLog`: `{ action: "org.created", entity: "Organization", entityId }`.
7. FE hiển thị thông báo thành công và chuyển sang bước cấp quyền nhân sự (`Assign Member`).

**Exception Flow:**
- User thường cố tình gửi `POST /api/organizations` ──► BE từ chối trả về **403 Forbidden**.
- Mã số thuế / Tên doanh nghiệp bị trùng ──► BE trả về 409 Conflict.

### UC-00.3.2 — Platform Admin Cấp Quyền & Gán Thành Viên vào Doanh Nghiệp (User Provisioning)

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.3.2 |
| **Tên** | Platform Admin cấp quyền & gán thành viên vào Doanh nghiệp |
| **Mục tiêu** | Gán nhân sự cá nhân (`Profile`) vào Doanh nghiệp xuất khẩu với vai trò cụ thể (`OrganizationRole`) mà **không cần tạo hay can thiệp mật khẩu nhân viên** |
| **Actor** | Platform Admin (`SUPER_ADMIN`, `PLATFORM_ADMIN`) |
| **Tiền điều kiện** | Platform Admin đăng nhập thành công, Doanh nghiệp đã được khởi tạo trước đó |
| **Hậu điều kiện** | Bản ghi `OrganizationMember` được tạo mới với trạng thái `ACTIVE` |
| **Trigger** | Admin chọn User trên Admin Portal (`/admin`) và bấm "Cấp / Sửa Quyền" |
| **Input** | `userId`, `organizationId`, `role` (`OWNER`, `MANAGER`, `COMPLIANCE`, `VIEWER`) |
| **Output** | Bản ghi kết nối Doanh nghiệp - Nhân sự + Audit Log `admin.member_assigned` |

**Main Flow:**
1. Platform Admin truy cập Admin Portal (`/admin`), chuyển tab "Quản lý User & Cấp quyền".
2. Hệ thống hiển thị danh sách tất cả User cá nhân (gồm cả User đang ở trạng thái `PENDING_PROVISIONING`).
3. Admin chọn một User, chọn Doanh nghiệp mục tiêu và chọn Vai trò Doanh nghiệp (`OWNER` | `MANAGER` | `COMPLIANCE` | `VIEWER`).
4. FE gửi request `POST /api/admin/organizations/:id/assign-member` với `userId` và `role`.
5. BE middleware `platformRbacMiddleware` kiểm tra quyền Platform Admin.
6. BE thực hiện upsert `OrganizationMember` gắn `userId` vào `organizationId` với vai trò `role` được chỉ định.
7. BE ghi vết `AuditLog`: `{ action: "admin.member_assigned", targetUserId, orgId, role }`.
8. Lần tiếp theo User đăng nhập hoặc refresh trang `/pending-access`, hệ thống tự động nhận dạng Doanh nghiệp và cho phép truy cập `/dashboard`.

**Exception Flow:**
- Admin chọn User không tồn tại ──► BE trả về 404 Not Found.
- User thường truy cập API Admin ──► BE từ chối **403 Forbidden**.

---

### UC-00.3.2 — Cập nhật thông tin Organization

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.3.2 |
| **Actor** | Owner |
| **Tiền điều kiện** | User là owner của org |
| **Input** | `orgName`, `taxCode`, `logoUrl`, `contactEmail`, `address` |

**Main Flow:**
1. Owner vào Settings > Organization
2. Chỉnh sửa thông tin
3. `PATCH /api/organizations/:id`
4. BE verify: user là owner
5. Update record
6. Audit Log

**Phân quyền:** Chỉ `owner` được thực hiện

---

### UC-00.3.3 — Organization Switcher

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.3.3 |
| **Mục tiêu** | User thuộc nhiều org có thể chuyển đổi context |
| **Actor** | User thuộc >= 2 organizations |

**Main Flow:**
1. Header hiển thị org hiện tại + dropdown
2. User chọn org khác
3. FE lưu `selectedOrgId` vào localStorage / cookie
4. FE reload data với org context mới
5. Toàn bộ API request sau đó gửi kèm org context

---

## UC-00.4 — Quản lý thành viên

### UC-00.4.1 — Mời thành viên

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.4.1 |
| **Tên** | Mời thành viên qua email |
| **Actor** | Owner |
| **Tiền điều kiện** | User là owner của org |
| **Hậu điều kiện** | Invitation record tạo, email được gửi |
| **Input** | `email`, `role` (manager/analyst/viewer) |

**Main Flow:**
1. Owner vào Settings > Members > "Mời thành viên"
2. Nhập email + chọn role
3. `POST /api/organizations/:id/invitations`
4. BE kiểm tra: email chưa là member, role hợp lệ
5. BE tạo `Invitation { token, email, role, expiresAt: +7d }`
6. BE gửi email mời (background job)
7. FE hiển thị "Đã gửi lời mời"

**Exception Flow:**
- Email đã là thành viên → "Email này đã là thành viên của tổ chức"
- Email chưa có tài khoản → vẫn gửi, khi đăng ký sẽ được join tự động

**Validation:**
```
email: required | format email
role:  required | enum: manager | analyst | viewer
```

**Audit Log:** `{ action: "org.member_invited", inviterId: userId, inviteeEmail, role, orgId }`

**Notification:** Email mời tham gia org

---

### UC-00.4.2 — Chấp nhận lời mời

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.4.2 |
| **Actor** | Người nhận lời mời |
| **Trigger** | User click link trong email mời |

**Main Flow:**
1. User click link `/join?token=<invitation_token>`
2. FE gọi `POST /api/organizations/join { token }`
3. BE validate token: chưa hết hạn, email match user đang login
4. BE tạo `OrganizationMember { role, status: "active" }`
5. BE xóa Invitation record
6. Redirect `/dashboard`

**Exception Flow:**
- Token hết hạn → "Lời mời đã hết hạn"
- Token đã dùng → "Lời mời này đã được sử dụng"

---

### UC-00.4.3 — Thay đổi role thành viên

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.4.3 |
| **Actor** | Owner |
| **Input** | `memberId`, `newRole` |

**Main Flow:**
1. `PATCH /api/organizations/:id/members/:memberId { role }`
2. BE kiểm tra: không thể downgrade chính mình nếu là owner duy nhất
3. Cập nhật role
4. Audit Log

**Business Rule:** Phải luôn có ít nhất 1 owner trong org

---

### UC-00.4.4 — Tạm khóa / xóa thành viên

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.4.4 |
| **Actor** | Owner |

**Main Flow:**
1. `DELETE /api/organizations/:id/members/:memberId`
2. BE set `status: "inactive"` (không xóa cứng)
3. Member không còn truy cập được vào org data
4. Audit Log

---

## UC-00.5 — Phân Quyền 2 Tầng (Two-Tier Authorization Architecture)

> **NGUYÊN TẮC BẢO MẬT TUYỆT ĐỐI (Zero-Trust Data Boundary):**
> Tách biệt hoàn toàn **Tầng Nền tảng (Platform Level)** và **Tầng Doanh nghiệp (Tenant Level)**.
> Admin hệ thống (`SUPER_ADMIN`, `PLATFORM_ADMIN`) quản lý hạ tầng và người dùng, nhưng **KHÔNG mặc định có quyền đọc/sửa dữ liệu nghiệp vụ riêng của Doanh nghiệp (Shipments, Documents, Reports)** để ngăn ngừa nguy cơ rò rỉ dữ liệu chéo (Cross-tenant Data Leakage).

```
PlatformRole (Hệ thống):   SUPER_ADMIN  ──► PLATFORM_ADMIN ──► SUPPORT ──► USER
OrganizationRole (Nội bộ): OWNER        ──► MANAGER        ──► COMPLIANCE ──► VIEWER
```

### UC-00.5.1 — Middleware Phân Quyền

**Pipeline kiểm tra mỗi request:**
```
Request
  → authMiddleware:
      1. Đọc header: Authorization: Bearer <token>
      2. Verify JWT via Supabase Auth
      3. Extract userId = token.sub (KHÔNG lấy từ req.body)
      4. Attach req.user = { id, email, platformRole }
  → platformRbacMiddleware (cho các API Admin /api/admin/...):
      1. Verify req.user.platformRole IN (SUPER_ADMIN, PLATFORM_ADMIN)
      2. Cho phép quản trị hệ thống / từ chối 403 Forbidden
  → orgMiddleware (cho các API Doanh nghiệp /api/organizations/:id/...):
      1. Đọc orgId từ route param / header x-organization-id
      2. Query: OrganizationMember WHERE userId = req.user.id AND organizationId AND status = "ACTIVE"
      3. Attach req.orgMember = { id, organizationId, role: OrganizationRole }
  → rbacMiddleware (requiredTenantPermission):
      1. Kiểm tra req.orgMember.role có nằm trong TENANT_PERMISSION_MATRIX không
      2. Cho phép truy cập / từ chối 403 Forbidden
  → Controller
```

### UC-00.5.2 — Ma trận Phân quyền Doanh nghiệp (Tenant Level)

| Permission | OWNER (Chủ DN/CEO) | MANAGER (Trưởng phòng XNK) | COMPLIANCE (Cán bộ Tuân thủ) | VIEWER (Nhân sự xem) |
|---|:---:|:---:|:---:|:---:|
| `org.manage` (Cấu hình Doanh nghiệp) | **✓** | ✗ | ✗ | ✗ |
| `member.invite` (Mời thành viên) | **✓** | **✓** *(Theo scope)* | ✗ | ✗ |
| `member.role_change` (Đổi phân quyền) | **✓** | ✗ | ✗ | ✗ |
| `shipment.create` (Tạo lô hàng) | **✓** | **✓** | **✓** | ✗ |
| `shipment.delete` (Xóa lô hàng) | **✓** | **✓** | ✗ | ✗ |
| `document.upload` (Upload chứng từ) | **✓** | **✓** | **✓** | ✗ |
| `check.run` (Chạy AI Compliance Engine) | **✓** | **✓** | **✓** | ✗ |
| `finding.resolve` (Xử lý & Khắc phục lỗi) | **✓** | **✓** | **✓** | ✗ |
| `report.draft` (Lập dự thảo Báo cáo) | **✓** | **✓** | **✓** | ✗ |
| `report.approve` (Duyệt Báo cáo Chính thức) | **✓** | **✓** | ✗ | ✗ |
| `report.view` (Xem Báo cáo) | **✓** | **✓** | **✓** | **✓** |
| `auditlog.view` (Xem Nhật ký Kiểm toán) | **✓** | **✓** | ✗ | ✗ |
| `dashboard.view` (Xem Dashboard) | **✓** | **✓** | **✓** | **✓** |

### UC-00.5.3 — Tích hợp Frontend Dynamic Session & Kiến trúc Component Đơn nhiệm (SRP)

**1. Đồng bộ Session & Header Topbar (`fe/src/components/layout/`):**
* `UserDropdown.tsx`: Tự động gọi `GET /api/auth/me` nạp tên thật, avatar ký tự đầu, Tên Doanh nghiệp đang hoạt động và Badge vai trò phân quyền (`OWNER`, `MANAGER`, `COMPLIANCE`, `VIEWER`).
* `Topbar.tsx`: Hiển thị thanh tìm kiếm độc lập và nhúng `UserDropdown`.
* `Sidebar.tsx`: Chuyên trách menu điều hướng ứng dụng.

**2. Trang Cài Đặt & Quản trị Nhân sự Modular (`fe/src/features/settings/`):**
* `ProfileSettingsTab.tsx`: Form cập nhật thông tin cá nhân và hồ sơ năng lực Doanh nghiệp xuất khẩu (`PATCH /api/organizations/:id`). Chỉ mở khóa nút lưu cho vai trò `OWNER` / `MANAGER` (`org.manage`).
* `MemberSettingsTab.tsx`: Bảng hiển thị danh sách nhân sự thực tế (`GET /api/organizations/:id`) và Form gửi lời mời thành viên mới (`POST /api/organizations/:id/invitations`) (`member.invite`).
* `SecuritySettingsTab.tsx`: Trực quan hóa kiến trúc phân quyền 2 tầng và ma trận RBAC.
* `NotificationSettingsTab.tsx`: Cấu hình nhận cảnh báo luật EUDR/MRL khẩn cấp.
* `index.tsx`: Component điều phối quản lý tab chính.

---

## UC-00.6 — Audit Log xác thực

Mọi sự kiện auth quan trọng đều ghi vào `AuditLog` với schema:

```typescript
{
  id:         uuid
  orgId:      uuid | null  // null cho event toàn hệ thống
  userId:     uuid
  action:     string       // "user.login_success" | "org.member_invited" | ...
  entityType: string | null
  entityId:   string | null
  meta:       JSON         // ip, userAgent, oldValue, newValue
  createdAt:  timestamp    // immutable
}
```

**Các sự kiện cần log:**
- `user.registered` | `user.email_verified` | `user.login_success` | `user.login_failed`
- `user.password_reset_requested` | `user.password_changed`
- `user.logout`
- `org.created` | `org.updated`
- `org.member_invited` | `org.member_joined` | `org.member_role_changed` | `org.member_removed`

---

## Screens liên quan

| Screen | Route | Actor |
|--------|-------|-------|
| Trang đăng ký | `/register` | Anonymous |
| Trang đăng nhập | `/login` | Anonymous |
| Onboarding | `/onboarding` | User mới |
| Settings — Organization | `/settings/organization` | Owner |
| Settings — Members | `/settings/members` | Owner |
| Settings — Profile | `/settings/profile` | Tất cả |

---

## Database Tables

| Bảng | Mô tả |
|------|-------|
| `auth.users` | Supabase Auth (managed) |
| `profiles` | Thông tin bổ sung user |
| `organizations` | Tổ chức / workspace |
| `organization_members` | Membership + role |
| `invitations` | Lời mời tham gia |
| `audit_logs` | Nhật ký mọi thao tác |

---

## Background Jobs

| Job | Mô tả |
|-----|-------|
| `send-invitation-email` | Gửi email mời thành viên |
| `send-verification-email` | Gửi email xác thực (do Supabase) |
| `cleanup-expired-invitations` | Xóa invitation quá hạn (cron daily) |

---

## Điều kiện hoàn thành (DoD)

- [ ] Đăng ký, xác thực email, đăng nhập hoạt động thực tế qua Supabase Auth
- [ ] Onboarding tạo được org, gán owner
- [ ] Mời thành viên gửi email thật
- [ ] RBAC middleware hoạt động: 401 khi chưa đăng nhập, 403 khi không có quyền
- [ ] Audit log ghi đầy đủ
- [ ] Không lộ service key ở frontend
- [ ] RLS: user không đọc được dữ liệu org khác

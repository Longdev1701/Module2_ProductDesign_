# UC-00 — Xác thực & Phân quyền (Authentication & RBAC)

> **Mức độ:** Level 1 (Use Case chính)  
> **Actor chính:** Tất cả actor  
> **Priority:** P0 — Bắt buộc (tiền đề của toàn hệ thống)

---

## Cây phân rã

```
UC-00: Xác thực & Phân quyền
├── UC-00.1: Đăng ký tài khoản
│   ├── UC-00.1.1: Nhập thông tin đăng ký
│   ├── UC-00.1.2: Xác thực email (OTP / magic link)
│   └── UC-00.1.3: Khởi tạo hồ sơ cá nhân (Profile)
│
├── UC-00.2: Đăng nhập
│   ├── UC-00.2.1: Đăng nhập bằng email + password
│   ├── UC-00.2.2: Refresh token tự động
│   └── UC-00.2.3: Đăng xuất (Logout)
│
├── UC-00.3: Quản lý Organization
│   ├── UC-00.3.1: Tạo organization mới (Onboarding)
│   ├── UC-00.3.2: Cập nhật thông tin organization
│   └── UC-00.3.3: Chuyển đổi organization (Organization Switcher)
│
├── UC-00.4: Quản lý thành viên (Member Management)
│   ├── UC-00.4.1: Mời thành viên qua email
│   ├── UC-00.4.2: Chấp nhận lời mời
│   ├── UC-00.4.3: Thay đổi role thành viên
│   ├── UC-00.4.4: Tạm khóa / xóa thành viên
│   └── UC-00.4.5: Rời khỏi organization
│
├── UC-00.5: Kiểm soát phân quyền (RBAC Enforcement)
│   ├── UC-00.5.1: Kiểm tra quyền tại backend middleware
│   ├── UC-00.5.2: Kiểm tra org membership
│   └── UC-00.5.3: Kiểm tra entity ownership
│
└── UC-00.6: Audit Log xác thực
    ├── UC-00.6.1: Ghi log đăng nhập thành công / thất bại
    ├── UC-00.6.2: Ghi log thay đổi phân quyền
    └── UC-00.6.3: Ghi log thay đổi cấu hình org
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

## UC-00.3 — Quản lý Organization

### UC-00.3.1 — Tạo Organization mới (Onboarding)

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-00.3.1 |
| **Tên** | Tạo organization (Onboarding) |
| **Mục tiêu** | Người dùng đầu tiên thiết lập workspace cho doanh nghiệp |
| **Actor** | User đã đăng nhập, chưa thuộc org nào |
| **Tiền điều kiện** | Email đã xác thực, chưa có org |
| **Hậu điều kiện** | Organization tạo thành công, user được gán role `owner`, redirect `/dashboard` |
| **Trigger** | Redirect từ login (chưa có org) hoặc user truy cập `/onboarding` |
| **Input** | `orgName`, `taxCode`, `industry`, `country`, `primaryMarket` |
| **Output** | Organization record + OrganizationMember(owner) |

**Main Flow:**
1. User vào `/onboarding`
2. Bước 1: Nhập tên doanh nghiệp, mã số thuế, ngành nghề
3. Bước 2: Chọn thị trường xuất khẩu chính (EU / USA / ...)
4. FE gọi `POST /api/organizations` với payload
5. BE validate Zod: tên doanh nghiệp không trống, taxCode unique trong hệ thống
6. BE tạo `Organization` + tạo `OrganizationMember { userId, role: "owner", status: "active" }`
7. BE ghi Audit Log
8. FE redirect `/dashboard`

**Validation:**
```
orgName:       required | 3–200 ký tự
taxCode:       optional | format 10-13 số
primaryMarket: required | enum: EU | USA | Japan | China
```

**Database tác động:**
- `organizations`: INSERT
- `organization_members`: INSERT (owner)

**API:** `POST /api/organizations`

**Audit Log:** `{ action: "org.created", userId, orgId, orgName, timestamp }`

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

## UC-00.5 — RBAC Enforcement (Backend Middleware)

### UC-00.5.1 — Kiểm tra Auth Middleware

**Flow mỗi request:**
```
Request
  → authMiddleware:
      1. Đọc header: Authorization: Bearer <token>
      2. Verify JWT via Supabase (issuer, audience, expiration)
      3. Extract userId = token.sub (KHÔNG từ body)
      4. Lỗi → 401 Unauthorized
      5. Attach req.user = { id, email }
  → orgMiddleware:
      1. Đọc orgId từ route param / query / body
      2. Query: OrganizationMember WHERE userId = req.user.id AND orgId AND status = "active"
      3. Lỗi → 403 Forbidden
      4. Attach req.orgMember = { role }
  → rbacMiddleware(requiredPermission):
      1. Kiểm tra role có permission không (theo RBAC matrix)
      2. Lỗi → 403 Forbidden
  → Controller
```

### UC-00.5.2 — Ma trận RBAC

| Permission | owner | manager | analyst | viewer |
|-----------|:-----:|:-------:|:-------:|:------:|
| org.manage | ✓ | ✗ | ✗ | ✗ |
| member.invite | ✓ | ✗ | ✗ | ✗ |
| product.create | ✓ | ✓ | ✓ | ✗ |
| product.delete | ✓ | ✓ | ✗ | ✗ |
| batch.create | ✓ | ✓ | ✓ | ✗ |
| document.upload | ✓ | ✓ | ✓ | ✗ |
| check.run | ✓ | ✓ | ✓ | ✗ |
| report.approve | ✓ | ✓ | ✗ | ✗ |
| report.view | ✓ | ✓ | ✓ | ✓ |
| task.create | ✓ | ✓ | ✗ | ✗ |
| auditlog.view | ✓ | ✓ | ✗ | ✗ |
| ai.run | ✓ | ✓ | ✓ | ✗ |
| dashboard.view | ✓ | ✓ | ✓ | ✓ |
| export.report | ✓ | ✓ | ✓ | ✓ |

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

# 08. Bảo mật & Audit Log

## Secrets — KHÔNG vi phạm

| Secret | Vị trí cho phép |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Backend only |
| `GEMINI_API_KEY` | Backend only |
| `DATABASE_URL` | Backend only |
| `SUPABASE_ANON_KEY` | Frontend (chỉ key anon, không phải service key) |

**Service key KHÔNG được xuất hiện trong frontend bundle.**

## Authentication

- JWT được validate tại backend: issuer, audience, expiration.
- Lấy `userId` từ token — KHÔNG tin `userId` gửi từ frontend body.
- Session được khôi phục sau reload.
- Logout phải xóa session và cache dữ liệu nhạy cảm.

## File & Storage

- Bucket phải **private**. Không dùng public URL cho chứng từ.
- Dùng Signed URL có thời hạn để truy cập file.
- Log mọi lượt tải tài liệu.
- Không hiển thị storage path trực tiếp trong response.
- Validate MIME type, extension, kích thước, checksum khi upload.

## Rate Limiting

Giới hạn riêng cho từng nhóm:
- Đăng nhập thất bại.
- Compliance check.
- AI chat.
- Upload.
- Export.
- Manual sync.

## Audit Log — bắt buộc ghi cho các hành động sau

| Hành động | Ghi audit |
|---|:---:|
| Tạo / sửa / xóa sản phẩm | ✓ |
| Upload, thay thế tài liệu | ✓ |
| Chạy compliance check | ✓ |
| Approve / request revision báo cáo | ✓ |
| Đổi role thành viên | ✓ |
| Đăng nhập thất bại nhiều lần | ✓ |
| Manual sync dữ liệu pháp lý | ✓ |
| Admin access | ✓ |

### AuditLog schema

```
actor_id        — ID người thực hiện
action          — Tên hành động (CREATE_PRODUCT, APPROVE_REPORT, ...)
entity_type     — Loại đối tượng (product, batch, check, ...)
entity_id       — ID đối tượng
before_data     — Dữ liệu trước thay đổi (JSON)
after_data      — Dữ liệu sau thay đổi (JSON)
request_id      — ID request HTTP
ip_hash         — Hash của IP người dùng
created_at      — Timestamp (UTC)
```

**Audit log là immutable.** Không được sửa hoặc xóa sau khi tạo.

## Không log những thông tin sau

- Password hoặc hash password.
- JWT đầy đủ.
- Service key.
- Nội dung tài liệu nhạy cảm.
- Toàn bộ prompt chứa dữ liệu riêng của doanh nghiệp.

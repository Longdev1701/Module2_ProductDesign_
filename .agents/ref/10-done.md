# 10. Definition of Done & Quy tắc nhóm

## Definition of Done

Một feature chỉ được merge vào `main` khi có đủ:

- [ ] **UI** — màn hình hoàn chỉnh, không placeholder.
- [ ] **API** — real endpoint, không mock / setTimeout.
- [ ] **Validation** — Zod schema ở cả FE lẫn BE.
- [ ] **Authorization** — kiểm tra quyền ở backend-side.
- [ ] **Loading state** — skeleton hoặc spinner khi đang tải.
- [ ] **Empty state** — giao diện khi chưa có dữ liệu.
- [ ] **Error state** — hiển thị lỗi thật, không fake success.
- [ ] **Audit log** — ghi log cho hành động quan trọng.
- [ ] **Không dùng dữ liệu mock trong production path.**
- [ ] **Không hardcode secret.**
- [ ] **Build production thành công** (`next build`, `tsc --noEmit`).
- [ ] **Không lỗi console** khi chạy production build.
- [ ] **Không làm lộ dữ liệu organization khác.**

## Quy tắc làm việc cho nhóm

1. **Không commit mock data vào production path.**
   Mock chỉ dùng trong Storybook hoặc test fixtures.

2. **Không ghi đè report đã approve.**
   Luôn tạo report version mới.

3. **Không hardcode giá trị.**
   Màu → CSS token. Status → enum/constant. Market code → enum.

4. **Mỗi PR phải pass CI:**
   type check + lint + unit test + build.

5. **Quy tắc đặt tên branch:**
   - `feat/sprint-N-ten-feature`
   - `fix/mo-ta-loi`
   - `chore/ten-viec`

6. **Không merge vào `main` khi CI đỏ.**

7. **Mọi finding AI phải có citation.**
   Không có citation = không được lưu vào database.

8. **Regulation không bao giờ bị xóa.**
   Chỉ thêm RegulationVersion mới.

9. **Báo cáo đã approve là immutable.**
   Chỉ tạo report mới nếu cần cập nhật.

10. **Secrets không bao giờ xuất hiện trong frontend bundle.**

## Kịch bản demo cuối (14 bước)

Dùng để bảo vệ hoặc trình diễn sản phẩm:

1. Đăng nhập với tài khoản **Compliance Manager**.
2. Dashboard hiển thị cảnh báo pháp lý.
3. Mở sản phẩm **"Cà phê Robusta Đắk Lắk"**.
4. Tạo lô `COFFEE-2026-001`, chọn thị trường **EU**.
5. Upload: Lab result · Traceability document · Certificate.
6. Hệ thống trích xuất và người dùng xác nhận giá trị MRL.
7. Chạy **Full Compliance Check**.
8. Hệ thống phát hiện: MRL đạt · Thiếu vùng trồng · Chứng từ sắp hết hạn.
9. Báo cáo hiển thị **citation** pháp lý cụ thể.
10. Manager tạo task → Analyst bổ sung minh chứng → Manager duyệt.
11. Chạy re-check → Trạng thái `conditionally_compliant`.
12. Report version 2 được tạo, không ghi đè version 1.
13. Dashboard cập nhật pass rate.
14. Một regulation mới được sync → hệ thống cảnh báo sản phẩm bị ảnh hưởng.

Kịch bản này thể hiện đầy đủ: Auth · Product · Batch · Document · AI · Rule engine · Regulation · Finding · Task · Report · Realtime · Audit.

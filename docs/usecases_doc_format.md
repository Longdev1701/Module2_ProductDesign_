# DÀNH CHO BÁO CÁO DOCX — BẢNG ĐẶC TẢ USECASE HỆ THỐNG THEMIS LEXIGUARD

---

### 1.6.1. Usecase Đăng ký tài khoản & Chờ cấp quyền

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Đăng ký tài khoản & Chờ cấp quyền (Access Pending) |
| **Tác nhân** | Khách vãng lai, Người dùng Doanh nghiệp mới |
| **Mô tả ngắn** | Cho phép người dùng mới cung cấp thông tin cá nhân cơ bản để đăng ký tài khoản. Hệ thống tự động tạo hồ sơ (Profile) và chuyển hướng tới màn hình Chờ cấp quyền (`/pending-access`) để chờ Platform Admin phê duyệt và gán vào Doanh nghiệp. |
| **Điều kiện tiên quyết** | Người dùng chưa đăng nhập và truy cập vào trang "Đăng ký" (`/register`). |
| **Điều kiện sau** | Tài khoản được tạo thành công trên Supabase Auth và bảng `profiles`. Người dùng ở trạng thái chờ cấp quyền Doanh nghiệp. |
| **Luồng sự kiện chính** | 1. Người dùng chọn "Đăng ký" trên trang Đăng nhập.<br>2. Hệ thống hiển thị Form đăng ký gồm: Họ tên, Email, Mật khẩu, Chức danh.<br>3. Người dùng nhập đầy đủ thông tin và nhấn "Đăng ký".<br>4. Hệ thống gửi yêu cầu về Backend API (`POST /api/auth/register`) để kiểm tra dữ liệu với Supabase Auth.<br>5. Mật khẩu được mã hóa và tài khoản được khởi tạo với vai trò nền tảng `USER`.<br>6. Hệ thống khởi tạo hồ sơ `Profile` trong CSDL PostgreSQL.<br>7. Hệ thống tự động chuyển hướng người dùng sang trang Chờ cấp quyền (`/pending-access`). |
| **Luồng ngoại lệ** | - Tại bước 4: Nếu Email đã tồn tại, hiển thị thông báo "Email này đã được sử dụng trong hệ thống".<br>- Nếu Mật khẩu quá ngắn (<8 ký tự) hoặc thiếu định dạng chuẩn, báo lỗi validation.<br>- Nếu để trống trường bắt buộc, hiển thị cảnh báo đỏ tại ô nhập liệu tương ứng. |

---

### 1.6.2. Usecase Đăng nhập hệ thống & Phân luồng vai trò

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Đăng nhập hệ thống & Phân luồng vai trò |
| **Tác nhân** | Thành viên Doanh nghiệp (Owner, Manager, Compliance, Viewer), Platform Admin |
| **Mô tả ngắn** | Xác thực danh tính người dùng bằng Email và Mật khẩu, cấp JWT Token và phân luồng điều hướng mượt mà tới đúng giao diện làm việc theo vai trò. |
| **Điều kiện tiên quyết** | Người dùng đã có tài khoản và đang ở trang "Đăng nhập" (`/login`). |
| **Điều kiện sau** | Hệ thống lưu trữ `access_token` và `refresh_token` vào `localStorage`, đồng thời thiết lập phiên làm việc được xác thực. |
| **Luồng sự kiện chính** | 1. Người dùng nhập Email và Mật khẩu trên Form đăng nhập, sau đó nhấn "Đăng nhập".<br>2. Hệ thống gửi request `POST /api/auth/login` tới Backend API.<br>3. Backend kiểm tra thông tin đăng nhập qua Supabase Auth.<br>4. Nếu hợp lệ, Backend cấp `access_token` và `refresh_token` cùng thông tin vai trò (`PlatformRole` và `OrganizationRole`).<br>5. Frontend lưu Token vào `localStorage` và tự động điều hướng:<br>&nbsp;&nbsp;&nbsp;&nbsp;• Nếu là Platform Admin (`SUPER_ADMIN` / `PLATFORM_ADMIN`) → Trang Admin Portal (`/admin`).<br>&nbsp;&nbsp;&nbsp;&nbsp;• Nếu thuộc Doanh nghiệp xuất khẩu → Trang Dashboard tổng quan (`/dashboard`).<br>&nbsp;&nbsp;&nbsp;&nbsp;• Nếu chưa được gắn Doanh nghiệp → Trang Chờ cấp quyền (`/pending-access`). |
| **Luồng ngoại lệ** | - Tại bước 3: Nếu sai Email hoặc Mật khẩu, hiển thị thông báo "Email hoặc mật khẩu không chính xác".<br>- Nếu tài khoản bị tạm khóa, hệ thống hiển thị thông báo "Tài khoản của bạn đã bị ngưng hoạt động, vui lòng liên hệ Admin". |

---

### 1.6.3. Usecase Đăng xuất hệ thống & Ghi vết Audit Log

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Đăng xuất hệ thống (Logout) |
| **Tác nhân** | Người dùng đã đăng nhập |
| **Mô tả ngắn** | Hủy bỏ phiên làm việc hiện tại, xóa mã thông báo xác thực và ghi vết bảo mật vào Nhật ký kiểm toán. |
| **Điều kiện tiên quyết** | Người dùng đang trong trạng thái đã đăng nhập vào hệ thống. |
| **Điều kiện sau** | Mã Token trong bộ nhớ bị xóa sạch, người dùng được chuyển hướng về trang Đăng nhập (`/login`). |
| **Luồng sự kiện chính** | 1. Người dùng nhấn vào Menu Tài khoản ở thanh Topbar và chọn "Đăng xuất".<br>2. Frontend gửi yêu cầu `POST /api/auth/logout` kèm Bearer Token lên Backend API.<br>3. Backend ghi nhận sự kiện vào bảng `audit_logs` (`user.logout`).<br>4. Client tự động xóa `access_token`, `refresh_token`, `active_org_id` khỏi `localStorage` và chuyển hướng về `/login`. |
| **Luồng ngoại lệ** | - Nếu kết nối mạng bị gián đoạn, Client vẫn chủ động xóa Token cục bộ và đưa người dùng về trang Đăng nhập để đảm bảo an toàn. |

---

### 1.6.4. Usecase Khôi phục mật khẩu & Đặt lại mật khẩu

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Khôi phục mật khẩu & Đặt lại mật khẩu |
| **Tác nhân** | Người dùng quên mật khẩu |
| **Mô tả ngắn** | Cho phép người dùng lấy lại quyền truy cập tài khoản thông qua liên kết xác thực gửi đến Email đã đăng ký. |
| **Điều kiện tiên quyết** | Người dùng chọn mục "Quên mật khẩu?" tại trang Đăng nhập. |
| **Điều kiện sau** | Mật khẩu tài khoản được cập nhật mới trên Supabase Auth và người dùng có thể đăng nhập bằng mật khẩu mới. |
| **Luồng sự kiện chính** | 1. Người dùng nhập Email tài khoản và nhấn "Gửi yêu cầu đặt lại mật khẩu".<br>2. Hệ thống kiểm tra sự tồn tại của Email và gửi Email chứa Token khôi phục mật khẩu.<br>3. Người dùng mở Email và nhấn vào liên kết đặt lại mật khẩu (`/reset-password?token=...`).<br>4. Hệ thống hiển thị giao diện nhập Mật khẩu mới và Xác nhận mật khẩu mới.<br>5. Người dùng nhập mật khẩu mới hợp lệ và nhấn "Lưu mật khẩu".<br>6. Hệ thống cập nhật mật khẩu mới, ghi Audit Log và chuyển hướng về trang Đăng nhập với thông báo thành công. |
| **Luồng ngoại lệ** | - Tại bước 2: Nếu Email không tồn tại, báo lỗi "Email chưa được đăng ký trong hệ thống".<br>- Tại bước 3: Nếu Token đặt lại mật khẩu đã hết hạn hoặc không hợp lệ, báo lỗi "Liên kết đã hết hạn, vui lòng thực hiện lại". |

---

### 1.6.5. Usecase Quản trị Doanh nghiệp (Platform Admin Provisioning)

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tác nhân** | Quản trị viên Nền tảng (SUPER_ADMIN, PLATFORM_ADMIN) |
| **Tên Usecase** | Khởi tạo & Phân quyền Doanh nghiệp xuất khẩu |
| **Mô tả ngắn** | Quản trị viên nền tảng tạo Doanh nghiệp xuất khẩu nông sản mới, thiết lập thông tin Mã số thuế, Nông sản chủ lực và gán tài khoản quản trị doanh nghiệp (`OWNER`). |
| **Điều kiện tiên quyết** | Tài khoản có vai trò `SUPER_ADMIN` hoặc `PLATFORM_ADMIN` đã đăng nhập và truy cập trang Admin Portal (`/admin`). |
| **Điều kiện sau** | Doanh nghiệp mới được khởi tạo trong CSDL, tài khoản người dùng được gán vai trò `OWNER` và truy cập được vào hệ thống. |
| **Luồng sự kiện chính** | 1. Admin truy cập trang `/admin` chọn tab "Quản lý Doanh nghiệp" và nhấn "Tạo Doanh nghiệp mới".<br>2. Admin nhập thông tin Doanh nghiệp: Tên công ty, Mã số thuế, Địa chỉ, Nông sản chủ lực (Sầu riêng, Cà phê), Thị trường xuất khẩu (Trung Quốc GACC, EU).<br>3. Admin chọn tài khoản người dùng từ danh sách người dùng đang chờ duyệt để chỉ định làm `OWNER`.<br>4. Hệ thống khởi tạo bản ghi `Organization` và `OrganizationMember` với vai trò `OWNER`.<br>5. Hệ thống ghi vết Audit Log và gửi email thông báo cho tài khoản được cấp quyền. |
| **Luồng ngoại lệ** | - Tại bước 2: Nếu Mã số thuế trùng lặp, hệ thống báo lỗi "Mã số thuế doanh nghiệp đã tồn tại".<br>- Nếu Admin không có đủ thẩm quyền, Backend trả về lỗi `403 Forbidden`. |

---

### 1.6.6. Usecase Quản lý thành viên & Phân quyền Doanh nghiệp

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Quản lý thành viên & Phân quyền Doanh nghiệp |
| **Tác nhân** | Chủ doanh nghiệp (`OWNER`), Quản lý Pháp chế (`MANAGER`) |
| **Mô tả ngắn** | Cho phép ban quản lý doanh nghiệp mời thêm nhân sự vào hệ thống, phân quyền vai trò (`MANAGER`, `COMPLIANCE`, `VIEWER`) hoặc hủy quyền truy cập. |
| **Điều kiện tiên quyết** | Người dùng đăng nhập với vai trò `OWNER` hoặc `MANAGER` trong Doanh nghiệp và truy cập trang Cài đặt (`/settings`). |
| **Điều kiện sau** | Thành viên mới được thêm vào danh sách nhân sự doanh nghiệp với vai trò và quyền hạn tương ứng. |
| **Luồng sự kiện chính** | 1. Người dùng truy cập trang `/settings` chọn tab "Nhân sự & Phân quyền".<br>2. Người dùng nhấn "Mời thành viên mới", nhập Email và chọn Vai trò (`MANAGER`, `COMPLIANCE`, `VIEWER`).<br>3. Hệ thống tạo mã lời mời `Invitation` và gửi Email thông báo tới nhân sự được mời.<br>4. Nhân sự nhấn chấp nhận lời mời để tham gia vào Doanh nghiệp.<br>5. `OWNER` có thể điều chỉnh vai trò hoặc đổi trạng thái thành viên sang `INACTIVE` để thu hồi quyền bất kỳ lúc nào. |
| **Luồng ngoại lệ** | - Nếu Email được mời đã là thành viên của Doanh nghiệp, báo lỗi "Tài khoản đã có trong doanh nghiệp".<br>- Vai trò `COMPLIANCE` và `VIEWER` không được phép truy cập chức năng mời thành viên (nút bị ẩn và Backend chặn authorization). |

---

### 1.6.7. Usecase Khởi tạo & Cấu hình Phiên thẩm định Lô hàng

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Khởi tạo Phiên thẩm định Lô hàng bằng AI (New Compliance Check) |
| **Tác nhân** | Cán bộ Phụ trách Tuân thủ (`COMPLIANCE`), Quản lý (`MANAGER`), Chủ doanh nghiệp (`OWNER`) |
| **Mô tả ngắn** | Cho phép người dùng lựa chọn Lô hàng nông sản xuất khẩu, chỉ định Thị trường xuất khẩu mục tiêu (Trung Quốc GACC, EU) và khởi chạy quét kiểm tra tuân thủ. |
| **Điều kiện tiên quyết** | Người dùng đã đăng nhập, Doanh nghiệp đã có ít nhất 01 Sản phẩm và 01 Lô hàng được khởi tạo. |
| **Điều kiện sau** | Bản ghi `ComplianceCheck` được khởi tạo với trạng thái `QUEUED` và chuyển sang Động cơ thẩm định AI. |
| **Luồng sự kiện chính** | 1. Người dùng chọn "Quét tuân thủ Lô hàng mới" (`/checks/new`).<br>2. Hệ thống hiển thị danh sách Lô hàng xuất khẩu khả dụng.<br>3. Người dùng chọn Lô hàng (ví dụ: Lô sầu riêng `DURIAN-2026-CN01`).<br>4. Người dùng chọn Thị trường xuất khẩu mục tiêu: **Trung Quốc (GACC Nghị định thư)** hoặc **EU (EUDR / MRL)**.<br>5. Người dùng rà soát danh sách chứng từ đính kèm (Phytosanitary, Lab Report MRL, Mã PUC, Mã PHC).<br>6. Người dùng nhấn "Bắt đầu Thẩm định Tuân thủ AI".<br>7. Hệ thống tạo `ComplianceCheck` và đẩy vào hàng đợi xử lý. |
| **Luồng ngoại lệ** | - Ở bước 5: Nếu Lô hàng chưa có bất kỳ chứng từ nào được tải lên, hệ thống hiển thị cảnh báo "Lô hàng chưa có chứng từ. Kết quả thẩm định có thể bị thiếu hụt thông tin" và yêu cầu xác nhận trước khi tiếp tục. |

---

### 1.6.8. Usecase Chạy Động cơ Kiểm tra Quy tắc Cứng (Deterministic Rule Engine)

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Thẩm định Quy tắc Cứng (Deterministic Rule Engine) |
| **Tác nhân** | Động cơ Hệ thống Backend (Backend Automated Service) |
| **Mô tả ngắn** | Tự động đối soát các tiêu chuẩn định tính/định lượng cứng giữa hồ sơ Lô hàng và Thư viện Quy định Pháp lý (MRL dư lượng hóa chất, thời hạn hiệu lực chứng từ, danh mục chứng từ bắt buộc) bằng thuật toán mã nguồn trực tiếp không qua AI. |
| **Điều kiện tiên quyết** | Phiên thẩm định `ComplianceCheck` ở trạng thái `PROCESSING`. |
| **Điều kiện sau** | Các vi phạm quy tắc cứng được ghi nhận chính xác thành danh sách `ComplianceItem` với nhãn mức độ rủi ro (`CRITICAL`, `HIGH`, `MEDIUM`). |
| **Luồng sự kiện chính** | 1. Động cơ truy vấn toàn bộ dữ liệu MRL trong bảng `mrl_limits` tương ứng với Mã HS nông sản (Sầu riêng: 0810.60.00).<br>2. Động cơ lấy dữ liệu kết quả phân tích Lab Report từ chứng từ Lô hàng.<br>3. Động cơ so sánh chỉ số thực tế với ngưỡng cho phép (Ví dụ: Cadmium <= 0.05 mg/kg, Dithiocarbamates <= 2.0 mg/kg).<br>4. Động cơ kiểm tra ngày hết hạn của Giấy chứng nhận Kiểm dịch thực vật (Phytosanitary Certificate).<br>5. Động cơ đối soát sự tồn tại của Mã số Vùng trồng (PUC) và Mã cơ sở đóng gói (PHC) đã được GACC phê duyệt.<br>6. Nếu phát hiện sai lệch, động cơ tự động tạo bản ghi `ComplianceItem` kèm theo giá trị vi phạm cụ thể. |
| **Luồng ngoại lệ** | - Nếu thiếu chỉ số kiểm nghiệm Lab Report, quy tắc đánh dấu trạng thái `INSUFFICIENT_INFORMATION` và yêu cầu bổ sung chứng từ. |

---

### 1.6.9. Usecase Phân tích Chuyên sâu AI Gemini & Trích dẫn Điều khoản Pháp lý

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Phân tích AI Gemini & Trích dẫn Nguồn Luật (Gemini Compliance Orchestration) |
| **Tác nhân** | Động cơ AI Backend (Gemini 1.5/2.0 Pro Service) |
| **Mô tả ngắn** | Sử dụng mô hình AI Gemini phân tích toàn diện ngữ cảnh pháp lý phức tạp (bản đồ tọa độ GPS EUDR, tính đồng nhất chứng từ, quy định mảng ghi nhãn), ép buộc đầu ra theo Zod Schema và bắt buộc gắn mã trích dẫn nguồn luật (`citationIds`). |
| **Điều kiện tiên quyết** | Động cơ Rule Engine hoàn tất bước kiểm tra sơ bộ. |
| **Điều kiện sau** | Danh sách Findings được hoàn thiện với đầy đủ luận cứ pháp lý, độ tin cậy AI (AI Confidence Score) và trích dẫn chuẩn xác. |
| **Luồng sự kiện chính** | 1. Backend đóng gói Prompt gồm: Thông tin Lô hàng, Dữ liệu Chứng từ bóc tách, Các điều khoản Quy định GACC / EUDR trích xuất từ cơ sở dữ liệu.<br>2. Backend gọi Gemini API với cấu hình Zod Structured Output parser.<br>3. AI Gemini phân tích ngữ cảnh và trả về danh sách các phát hiện rủi ro (Findings).<br>4. Backend kiểm tra tính hợp lệ của đầu ra AI:<br>&nbsp;&nbsp;&nbsp;&nbsp;• **QUY TẮC BẮT BUỘC**: Mỗi Finding PHẢI chứa ít nhất 01 `citationId` dẫn chiếu điều khoản pháp lý cụ thể.<br>5. Backend lưu trữ kết quả phân tích vào CSDL và tính toán điểm độ tin cậy tổng thể (AI Confidence Score). |
| **Luồng ngoại lệ** | - Nếu đầu ra AI phát hiện Finding không có `citationId`, hệ thống tự động loại bỏ Finding đó hoặc đánh dấu kết quả là `MANUAL_REVIEW_REQUIRED`, không bao giờ kết luận `COMPLIANT` thiếu căn cứ. |

---

### 1.6.10. Usecase Tổng hợp Báo cáo Thẩm định & Đánh giá Trạng thái Tuân thủ

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Tổng hợp Báo cáo Thẩm định Lô hàng (Compliance Check Completion) |
| **Tác nhân** | Hệ thống Backend |
| **Mô tả ngắn** | Tổng hợp kết quả từ Rule Engine và AI Gemini để đưa ra kết luận tuân thủ cuối cùng cho Lô hàng, đồng thời tạo Báo cáo tuân thủ dự thảo (`Report`). |
| **Điều kiện tiên quyết** | Bước phân tích AI Gemini hoàn tất thành công. |
| **Điều kiện sau** | Trạng thái `ComplianceCheck` chuyển thành `COMPLETED`, Lô hàng được cập nhật trạng thái tuân thủ và Báo cáo phiên bản 1 (v1) được tạo. |
| **Luồng sự kiện chính** | 1. Hệ thống tổng hợp toàn bộ các `ComplianceItem` thu thập được.<br>2. Hệ thống xác định trạng thái tổng thể (`ComplianceResult`):<br>&nbsp;&nbsp;&nbsp;&nbsp;• `COMPLIANT`: 0 vi phạm.<br>&nbsp;&nbsp;&nbsp;&nbsp;• `CONDITIONALLY_COMPLIANT`: Có cảnh báo nhỏ (`LOW`/`MEDIUM`), không vi phạm ngưỡng cấm.<br>&nbsp;&nbsp;&nbsp;&nbsp;• `NON_COMPLIANT`: Vi phạm ngưỡng cấm MRL hoặc vi phạm kiểm dịch thực vật nghiêm trọng (`CRITICAL`/`HIGH`).<br>3. Hệ thống tạo bản ghi `Report` phiên bản 1 (`version: 1`, `status: DRAFT`).<br>4. Hệ thống cập nhật trạng thái Lô hàng (`Batch.status`) tương ứng.<br>5. Hệ thống gửi thông báo Realtime qua Supabase tới người dùng chỉ định. |
| **Luồng ngoại lệ** | - Nếu tiến trình xử lý gặp sự cố kết nối AI, trạng thái check chuyển thành `FAILED` và cho phép người dùng bấm "Thử lại" (Retry). |

---

### 1.6.11. Usecase Tra cứu & Hỏi đáp Pháp lý Nông sản với Trợ lý AI

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Tra cứu & Hỏi đáp Pháp lý Nông sản (AI Legal Assistant) |
| **Tác nhân** | Cán bộ Phụ trách Tuân thủ, Quản lý Doanh nghiệp |
| **Mô tả ngắn** | Cho phép người dùng tương tác trực tiếp với Trợ lý AI để giải đáp các thắc mắc về thủ tục hải quan GACC, quy định MRL, điều kiện vùng trồng sầu riêng hoặc tiêu chuẩn EUDR. |
| **Điều kiện tiên quyết** | Người dùng đang truy cập hệ thống và mở cửa sổ Trợ lý AI. |
| **Điều kiện sau** | Trợ lý AI phản hồi câu hỏi có kèm trích dẫn văn bản pháp lý chính thức. |
| **Luồng sự kiện chính** | 1. Người dùng nhập câu hỏi vào ô chat (Ví dụ: *"Mức MRL Dithiocarbamates cho phép trên sầu riêng tươi xuất sang Trung Quốc là bao nhiêu?"*).<br>2. Frontend gửi câu hỏi về Backend API RAG Service.<br>3. Backend tìm kiếm thông tin quy định trong CSDL vector/relational (nguồn Nghị định thư GACC, Quyết định Hải quan Trung Quốc).<br>4. Động cơ AI tổng hợp câu trả lời chính xác, trích dẫn rõ mã văn bản, điều khoản và ngày hiệu lực.<br>5. Frontend hiển thị câu trả lời dạng Markdown cho người dùng. |
| **Luồng ngoại lệ** | - Nếu thông tin không có trong CSDL pháp lý đã xác minh, AI trả lời rõ "Chưa tìm thấy quy định chính thức trong CSDL" chứ không tự bịa đặt dữ liệu. |

---

### 1.6.12. Usecase Tải lên & Quản lý Chứng từ Lô hàng

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Tải lên & Quản lý Chứng từ Lô hàng (Document Upload & Management) |
| **Tác nhân** | Cán bộ Compliance, Nhân viên Nhập liệu |
| **Mô tả ngắn** | Cho phép tải các file chứng từ xuất khẩu (Giấy kiểm dịch, Kết quả thử nghiệm Lab, Chứng nhận xuất xứ CO, Bản đồ GPS vùng trồng) lên bộ lưu trữ riêng tư an toàn và gán vào Lô hàng. |
| **Điều kiện tiên quyết** | Người dùng có quyền ghi (`doc.upload`) trong Doanh nghiệp. |
| **Điều kiện sau** | File chứng từ được lưu trữ mã hóa trên Supabase Storage Private Bucket và thông tin metadata được lưu vào bảng `documents`. |
| **Luồng sự kiện chính** | 1. Người dùng chọn Lô hàng cần bổ sung hồ sơ và nhấn "Tải lên chứng từ".<br>2. Người dùng chọn loại chứng từ: `PHYTO` (Kiểm dịch), `LAB_REPORT` (Kiểm nghiệm MRL), `CO` (Xuất xứ), `GPS_MAP` (Bản đồ vùng trồng).<br>3. Người dùng kéo thả file (PDF, PNG, JPG) vào vùng tải lên.<br>4. Frontend yêu cầu Backend cấp Presigned Upload URL an toàn.<br>5. File được tải trực tiếp lên Supabase Private Bucket.<br>6. Backend khởi tạo bản ghi `Document` và bản ghi liên kết `BatchDocument`. |
| **Luồng ngoại lệ** | - Nếu dung lượng file vượt quá giới hạn (ví dụ >25MB) hoặc sai định dạng MIME, hệ thống báo lỗi và từ chối tải lên. |

---

### 1.6.13. Usecase Bóc tách Thông tin Chứng từ Tự động (OCR & Text Extraction)

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Bóc tách Thông tin Chứng từ Tự động (Document Text/OCR Extraction) |
| **Tác nhân** | Động cơ Xử lý Tài liệu Backend (Document Processing Worker) |
| **Mô tả ngắn** | Tự động đọc và bóc tách các trường dữ liệu quan trọng từ file chứng từ vừa tải lên (Tên chất thử nghiệm, hàm lượng MRL phát hiện, mã số PUC, ngày cấp, ngày hết hạn). |
| **Điều kiện tiên quyết** | File chứng từ đã được tải lên thành công (`status: uploaded`). |
| **Điều kiện sau** | Dữ liệu cấu trúc trích xuất được lưu trữ vào bộ nhớ đệm và chuyển trạng thái chứng từ sang `extracted`. |
| **Luồng sự kiện chính** | 1. Trình xử lý background nhận thông báo có chứng từ mới.<br>2. Động cơ thực hiện OCR / Text Extraction đọc nội dung tài liệu PDF/Ảnh.<br>3. Động cơ bóc tách các trường cấu trúc (Mã vùng trồng PUC, Tên hóa chất bảo vệ thực vật, Chỉ số phát hiện, Đơn vị mg/kg).<br>4. Động cơ cập nhật bản ghi chứng từ với dữ liệu trích xuất dạng JSON cấu trúc.<br>5. Động cơ thông báo cho người dùng xem lại và xác nhận. |
| **Luồng ngoại lệ** | - Nếu chất lượng file quá mờ không thể đọc OCR, chứng từ chuyển trạng thái `needs_review` và yêu cầu người dùng nhập liệu thủ công. |

---

### 1.6.14. Usecase Chuyên viên Rà soát & Xác nhận Dữ liệu Trích xuất

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Rà soát & Xác nhận Dữ liệu Chứng từ (Human-in-the-loop Verification) |
| **Tác nhân** | Cán bộ Phụ trách Tuân thủ (`COMPLIANCE`) |
| **Mô tả ngắn** | Cho phép chuyên viên pháp chế rà soát, đối sánh giao diện 2 màn hình (file gốc bên trái, dữ liệu bóc tách bên phải), chỉnh sửa nếu có sai sót và bấm "Xác nhận dữ liệu". |
| **Điều kiện tiên quyết** | Chứng từ đã được hệ thống bóc tách tự động (`status: extracted`). |
| **Điều kiện sau** | Dữ liệu chứng từ được khóa xác nhận, sẵn sàng đưa vào phiên kiểm tra tuân thủ chính thức. |
| **Luồng sự kiện chính** | 1. Người dùng mở trang chi tiết chứng từ của Lô hàng.<br>2. Hệ thống hiển thị giao diện đối soát 2 bên: File PDF gốc bên trái và các trường dữ liệu bóc tách bên phải.<br>3. Người dùng kiểm tra các chỉ số (VD: Cadmium = 0.02 mg/kg, Mã PUC: VN-WBPH-0125).<br>4. Người dùng điều chỉnh thông tin nếu phát hiện OCR bóc tách chưa chuẩn xác.<br>5. Người dùng nhấn "Xác nhận dữ liệu chứng từ".<br>6. Hệ thống lưu bản ghi xác nhận và chuyển trạng thái chứng từ sang `VERIFIED`. |
| **Luồng ngoại lệ** | - Nếu người dùng phát hiện nhầm lẫn file, có thể nhấn "Tải lại file thay thế" để tạo phiên bản chứng từ mới. |

---

### 1.6.15. Usecase Quản lý Danh mục Sản phẩm Xuất khẩu

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Quản lý Danh mục Sản phẩm Xuất khẩu (Product CRUD) |
| **Tác nhân** | Quản lý Doanh nghiệp (`MANAGER`), Chủ doanh nghiệp (`OWNER`) |
| **Mô tả ngắn** | Tạo mới, cập nhật thông tin dòng sản phẩm nông sản (Tên sản phẩm, Nhóm hàng, Mã HS, Mô tả quy cách) và thiết lập danh mục thị trường xuất khẩu mục tiêu. |
| **Điều kiện tiên quyết** | Người dùng có quyền `product.create` / `product.update` trong Doanh nghiệp. |
| **Điều kiện sau** | Dữ liệu sản phẩm được lưu trữ trong CSDL và hiển thị trên bảng danh mục sản phẩm (`/products`). |
| **Luồng sự kiện chính** | 1. Người dùng truy cập trang `/products` và chọn "Thêm sản phẩm mới".<br>2. Người dùng nhập thông tin: Tên sản phẩm (*Sầu riêng Tươi Ri6 xuất khẩu*), Mã HS (*0810.60.00*), Xuất xứ (*Tây Nguyên, Việt Nam*).<br>3. Người dùng tick chọn các Thị trường mục tiêu (*Trung Quốc GACC, EU*).<br>4. Người dùng nhấn "Lưu sản phẩm".<br>5. Hệ thống ghi bản ghi `Product` và bản ghi liên kết `ProductMarketRequirement` vào CSDL.<br>6. Hệ thống ghi vết Audit Log và cập nhật bảng danh mục. |
| **Luồng ngoại lệ** | - Nếu Mã HS nhập không đúng định dạng chuẩn hải quan, hệ thống hiển thị thông báo lỗi định dạng. |

---

### 1.6.16. Usecase Khởi tạo & Quản lý Mã Lô hàng Xuất khẩu

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Khởi tạo & Quản lý Mã Lô hàng Xuất khẩu (Batch Management) |
| **Tác nhân** | Cán bộ Phụ trách Tuân thủ, Quản lý Doanh nghiệp |
| **Mô tả ngắn** | Tạo mã lô hàng xuất khẩu cụ thể gắn với một Sản phẩm, khai báo số lượng, đơn vị tính, ngày sản xuất và thời hạn xuất khẩu dự kiến. |
| **Điều kiện tiên quyết** | Sản phẩm tương ứng đã được khởi tạo trong danh mục. |
| **Điều kiện sau** | Mã lô hàng mới được khởi tạo ở trạng thái `DRAFT` hoặc `COLLECTING_DOCUMENTS`. |
| **Luồng sự kiện chính** | 1. Người dùng chọn Sản phẩm từ danh mục và nhấn "Tạo Lô hàng mới".<br>2. Người dùng nhập Mã Lô hàng (VD: `DURIAN-2026-CN088`), Khối lượng (*18.5 tấn*), Ngày đóng gói, Ngày xuất khẩu dự kiến.<br>3. Người dùng nhấn "Khởi tạo Lô hàng".<br>4. Hệ thống kiểm tra tính duy nhất của Mã Lô hàng trong Doanh nghiệp.<br>5. Hệ thống khởi tạo bản ghi `Batch` với trạng thái `COLLECTING_DOCUMENTS`.<br>6. Hệ thống chuyển hướng người dùng tới trang quản lý Hồ sơ chứng từ của Lô hàng vừa tạo. |
| **Luồng ngoại lệ** | - Nếu Mã Lô hàng bị trùng lặp trong Doanh nghiệp, hệ thống báo lỗi "Mã lô hàng này đã tồn tại, vui lòng chọn mã khác". |

---

### 1.6.17. Usecase Khởi tạo Nhiệm vụ Khắc phục Rủi ro từ Finding

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Khởi tạo Nhiệm vụ Khắc phục Rủi ro (Create Remediation Task) |
| **Tác nhân** | Quản lý Doanh nghiệp (`MANAGER`), Cán bộ Compliance |
| **Mô tả ngắn** | Chuyển đổi các phát hiện vi phạm rủi ro (`Finding`/`ComplianceItem` mức `CRITICAL` hoặc `HIGH`) thành Nhiệm vụ hành động khắc phục cụ thể và giao cho nhân sự xử lý. |
| **Điều kiện tiên quyết** | Phiên thẩm định Lô hàng đã hoàn tất và phát hiện có vi phạm/rủi ro. |
| **Điều kiện sau** | Nhiệm vụ khắc phục rủi ro được tạo, thông báo được gửi tới người được giao việc. |
| **Luồng sự kiện chính** | 1. Người dùng xem Báo cáo thẩm định Lô hàng tại trang `/reports/[id]`.<br>2. Tại ô phát hiện vi phạm (VD: *Thiếu Chứng nhận Kiểm dịch thực vật Phytosanitary gốc*), người dùng nhấn "Tạo task khắc phục".<br>3. Người dùng nhập: Tên nhiệm vụ, Giao cho nhân sự, Hạn chót hoàn thành (Deadline), Hướng dẫn khắc phục.<br>4. Người dùng nhấn "Khởi tạo Task".<br>5. Hệ thống tạo nhiệm vụ khắc phục rủi ro và gửi thông báo cho nhân sự được phân công. |
| **Luồng ngoại lệ** | - Nếu hạn chót chọn trong quá khứ, hệ thống báo lỗi "Hạn chót phải là một ngày trong tương lai". |

---

### 1.6.18. Usecase Tải lên Bằng chứng Khắc phục & Hoàn thành Nhiệm vụ

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Cập nhật Bằng chứng & Hoàn thành Nhiệm vụ (Upload Evidence & Resolve Task) |
| **Tác nhân** | Nhân sự được giao việc, Cán bộ Compliance |
| **Mô tả ngắn** | Nhân sự thực hiện bổ sung chứng từ/bằng chứng sửa lỗi, tải file minh chứng lên nhiệm vụ và đánh dấu hoàn thành để chờ quản lý duyệt. |
| **Điều kiện tiên quyết** | Nhiệm vụ khắc phục rủi ro đang ở trạng thái `IN_PROGRESS`. |
| **Điều kiện sau** | File bằng chứng được gắn vào nhiệm vụ và trạng thái chuyển sang `PENDING_REVIEW`. |
| **Luồng sự kiện chính** | 1. Nhân sự truy cập trang danh sách nhiệm vụ được giao.<br>2. Nhân sự mở chi tiết nhiệm vụ và nhấn "Tải lên bằng chứng".<br>3. Nhân sự đính kèm file chứng từ đã bổ sung (VD: Giấy Phytosanitary mới cấp).<br>4. Nhân sự nhập ghi chú giải trình và nhấn "Gửi phê duyệt".<br>5. Hệ thống chuyển trạng thái nhiệm vụ sang `PENDING_REVIEW` và gửi thông báo tới Manager. |
| **Luồng ngoại lệ** | - Nếu file đính kèm không đúng định dạng quy định, hệ thống thông báo yêu cầu chọn lại file. |

---

### 1.6.19. Usecase Duyệt Nhiệm vụ & Khởi chạy Tái Thẩm định Lô hàng

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Duyệt Nhiệm vụ & Khởi chạy Re-check Lô hàng (Task Review & Re-check) |
| **Tác nhân** | Quản lý Doanh nghiệp (`MANAGER`), Chủ doanh nghiệp (`OWNER`) |
| **Mô tả ngắn** | Quản lý thẩm định bằng chứng khắc phục, phê duyệt nhiệm vụ và kích hoạt luồng Re-check AI để xuất Báo cáo phiên bản mới (v2) mà không ghi đè báo cáo cũ. |
| **Điều kiện tiên quyết** | Nhiệm vụ ở trạng thái `PENDING_REVIEW`. |
| **Điều kiện sau** | Nhiệm vụ chuyển thành `COMPLETED`, phiên Re-check mới được khởi chạy và Báo cáo phiên bản 2 (`version: 2`) được khởi tạo. |
| **Luồng sự kiện chính** | 1. Quản lý kiểm tra file bằng chứng minh chứng do nhân sự tải lên.<br>2. Quản lý nhấn "Phê duyệt hoàn tất nhiệm vụ".<br>3. Hệ thống cập nhật trạng thái nhiệm vụ thành `COMPLETED`.<br>4. Hệ thống hiển thị tùy chọn "Tái thẩm định Lô hàng (Re-check)".<br>5. Quản lý nhấn "Chạy Re-check".<br>6. Hệ thống thực hiện lại quy trình thẩm định tuân thủ AI với bộ chứng từ đã cập nhật.<br>7. Hệ thống xuất Báo cáo tuân thủ phiên bản 2 (`Report v2`), giữ nguyên Báo cáo v1 phục vụ lưu trữ kiểm toán. |
| **Luồng ngoại lệ** | - Nếu bằng chứng không đạt yêu cầu, Quản lý nhấn "Yêu cầu bổ sung lại", nhập lý do từ chối và đưa task về lại `IN_PROGRESS`. |

---

### 1.6.20. Usecase Kiểm tra Tọa độ GPS Vùng trồng EUDR & Thẩm định Phá rừng

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Kiểm tra Tọa độ GPS Vùng trồng EUDR (GPS Traceability & Deforestation Check) |
| **Tác nhân** | Cán bộ Phụ trách Tuân thủ, Động cơ Hệ thống Backend |
| **Mô tả ngắn** | Kiểm tra định dạng bản đồ ranh giới vùng trồng (GeoJSON/KML Polygon), đối soát tọa độ GPS và xác thực vùng trồng không nằm trên đất phá rừng sau ngày 31/12/2020 theo chuẩn EUDR. |
| **Điều kiện tiên quyết** | File tọa độ GPS vùng trồng (`GPS_MAP`) đã được tải lên Lô hàng xuất khẩu sang EU. |
| **Điều kiện sau** | Kết quả thẩm định tọa độ GPS và mức độ rủi ro phá rừng được ghi nhận vào báo cáo tuân thủ Lô hàng. |
| **Luồng sự kiện chính** | 1. Động cơ đọc dữ liệu file GeoJSON/KML bản đồ vùng trồng.<br>2. Động cơ phân tích danh sách các điểm tọa độ Polygon (Kinh độ, Vĩ độ).<br>3. Động cơ đối soát vùng Polygon với bản đồ che phủ rừng vệ tinh công bố của EU.<br>4. Động cơ xác nhận tính hợp lệ của tọa độ GPS và tính toán chỉ số rủi ro phá rừng.<br>5. Hệ thống hiển thị bản đồ trực quan ranh giới vùng trồng và dán nhãn kết quả "EUDR Compliant" hoặc "Deforestation Risk Warning". |
| **Luồng ngoại lệ** | - Nếu file GPS chứa dữ liệu tọa độ bị hở đường ranh giới (Invalid Polygon) hoặc thiếu tọa độ điểm, hệ thống báo lỗi "Dữ liệu bản đồ GPS không khép kín, vui lòng kiểm tra file KML/GeoJSON". |

---

### 1.6.21. Usecase Giám sát Dashboard Chỉ số Tuân thủ & Cảnh báo Pháp lý

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Giám sát Dashboard Chỉ số Tuân thủ (Compliance Summary Dashboard) |
| **Tác nhân** | Tất cả người dùng Doanh nghiệp |
| **Mô tả ngắn** | Hiển thị bức tranh toàn cảnh về năng lực tuân thủ của Doanh nghiệp: Tỷ lệ Lô hàng đạt yêu cầu, số lượng cảnh báo rủi ro cần xử lý, biểu đồ phân bổ rủi ro theo thị trường và danh sách quy định pháp lý mới cập nhật. |
| **Điều kiện tiên quyết** | Người dùng đã đăng nhập thành công vào hệ thống. |
| **Điều kiện sau** | Giao diện Dashboard hiển thị số liệu thống kê realtime từ Backend API. |
| **Luồng sự kiện chính** | 1. Người dùng truy cập trang chủ Dashboard (`/dashboard`).<br>2. Frontend gọi đồng thời các API thống kê: `/api/dashboard/summary`, `/api/dashboard/recent-checks`, `/api/dashboard/legal-updates`.<br>3. Hệ thống hiển thị 4 thẻ chỉ số KPI: Tổng số Lô kiểm tra, Số Lô Đạt (`COMPLIANT`), Số Lô Cảnh báo (`ACTION_REQUIRED`), Số Lô Không đạt (`NON_COMPLIANT`).<br>4. Hệ thống hiển thị widget "Theo dõi Thay đổi Pháp lý" cập nhật thông tin Nghị định thư GACC Sầu riêng và Quy định MRL EU.<br>5. Người dùng có thể nhấn vào từng thẻ chỉ số để xem chi tiết danh sách Lô hàng tương ứng. |
| **Luồng ngoại lệ** | - Nếu kết nối API bị gián đoạn, hệ thống hiển thị nút "Tải lại dữ liệu" kèm thông báo lỗi thân thiện. |

---

### 1.6.22. Usecase Theo dõi Thay đổi Quy định & Đánh giá Tác động Lô hàng

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Đánh giá Tác động Thay đổi Quy định (Regulation Impact Analysis) |
| **Tác nhân** | Cán bộ Phụ trách Tuân thủ, Quản lý Doanh nghiệp |
| **Mô tả ngắn** | Khi có quy định pháp lý mới được công bố (VD: Trung Quốc hạ ngưỡng dư lượng Cadmium hoặc EU bổ sung hoạt chất bảo vệ thực vật vào danh mục cấm), hệ thống tự động quét và cảnh báo các Lô hàng/Sản phẩm đang chịu tác động. |
| **Điều kiện tiên quyết** | Quy định pháp lý mới hoặc bản sửa đổi quy định (`RegulationVersion`) được nạp vào hệ thống. |
| **Điều kiện sau** | Cảnh báo tác động được gửi tới các Doanh nghiệp có Sản phẩm/Lô hàng chịu ảnh hưởng. |
| **Luồng sự kiện chính** | 1. Động cơ nhận thông báo có Quy định mới được cập nhật (Ví dụ: *Sửa đổi mức MRL trong Nghị định thư GACC*).<br>2. Động cơ thực hiện truy vấn tất cả các Sản phẩm và Lô hàng có mã HS tương ứng (`0810.60.00`).<br>3. Động cơ tính toán danh sách các Lô hàng bị ảnh hưởng bởi quy định mới.<br>4. Hệ thống phát thông báo cảnh báo "Cập nhật pháp lý mới ảnh hưởng tới Lô hàng của bạn" trên Dashboard.<br>5. Người dùng nhấn xem báo cáo đánh giá tác động chi tiết và thực hiện cập nhật hồ sơ kiểm nghiệm nếu cần thiết. |
| **Luồng ngoại lệ** | - Nếu không có Lô hàng nào chịu ảnh hưởng, hệ thống chỉ lưu nhật ký cập nhật quy định mà không phát cảnh báo diện rộng. |

---

### 1.6.23. Usecase Ghi vết Nhật ký Kiểm toán Bảo mật (Audit Log & System Integrity)

| Thuộc tính | Mô tả chi tiết |
|---|---|
| **Tên Usecase** | Ghi vết Nhật ký Kiểm toán Bảo mật (Audit Logging & Integrity) |
| **Tác nhân** | Động cơ Hệ thống Backend (Audit Logger Service) |
| **Mô tả ngắn** | Tự động ghi lại nhật ký tất cả các hành động tác động tới dữ liệu và bảo mật (Đăng nhập, Thay đổi quyền, Khởi tạo Lô hàng, Phê duyệt Báo cáo, Upload chứng từ) đảm bảo tính minh bạch và phục vụ giải trình kiểm toán. |
| **Điều kiện tiên quyết** | Người dùng thực hiện một hành động làm thay đổi dữ liệu trong hệ thống. |
| **Điều kiện sau** | Bản ghi nhật ký kiểm toán không thể sửa xóa (Append-only) được tạo trong bảng `audit_logs`. |
| **Luồng sự kiện chính** | 1. Người dùng thực hiện một thao tác nghiệp vụ (VD: `MANAGER` phê duyệt Báo cáo phiên v1).<br>2. Middleware Backend tự động bắt sự kiện và trích xuất: `userId`, `action` (`report.approve`), `entity` (`Report`), `entityId`, `ipAddress`, `timestamp`.<br>3. Backend ghi bản ghi mới vào bảng `audit_logs`.<br>4. Quản trị viên và Chủ doanh nghiệp có thể truy cập màn hình `/integrity` để xem dòng thời gian (Timeline) nhật ký hoạt động bất kỳ lúc nào. |
| **Luồng ngoại lệ** | - Bản ghi Audit Log tuân thủ chính sách append-only, tuyệt đối ngăn chặn mọi thao tác UPDATE hoặc DELETE để bảo vệ tính toàn vẹn dữ liệu. |

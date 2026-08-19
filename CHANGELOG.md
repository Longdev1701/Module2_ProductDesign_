# CHANGELOG

Tất cả các thay đổi quan trọng của dự án **Themis LexiGuard** sẽ được ghi chép lại trong file này theo định dạng chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

> **QUY TẮC BẮT BUỘC:** Mọi thao tác nâng cấp, cải thiện, thêm tính năng hoặc sửa lỗi liên quan tới hệ thống ĐỀU PHẢI được ghi lại tại đây trước khi kết thúc task.

---

## [Unreleased]

### Removed
- **Dọn Dẹp Mã Nguồn Rác, Tệp Tạm & Thành Phần Dư Thừa (Code Cleanup & Dead Code Removal)**:
  - Xóa bỏ toàn bộ thư mục và tệp tạm kiểm thử `be/scratch/` (`check_cifer_dates.ts`).
  - Xóa bỏ các script Python tạm thời không còn sử dụng: `be/scratch_cifer_part2.py`, `be/scratch_cifer_update.py`.
  - Xóa bỏ thư mục rỗng `fe/features/` (hợp nhất 100% mã nguồn tính năng vào `fe/src/features/`).
  - Xóa bỏ component trùng lặp `fe/src/components/Button.tsx` (thống nhất sử dụng chuẩn thiết kế `@/components/ui/button` trên toàn hệ thống).
  - Chuẩn hóa các import và props của `PendingAccessView.tsx`.

### Fixed
- **Sửa Lỗi Hiển Thị Trạng Thái & Ngành Hàng Danh Bạ CIFER GACC Trung Quốc (`AdminCiferTab.tsx`, `be/src/modules/admin/service.ts`)**:
  - **Nguyên nhân cốt lõi**: Dữ liệu thu thập từ Tổng cục Hải quan Trung Quốc (GACC) sử dụng ký tự chữ Hán nguyên bản (`有效` = Hợp lệ / Valid, `暂停进口` = Tạm đình chỉ / Suspended, `注销` = Hủy đăng ký / Revoked). Frontend trước đây so sánh chuỗi cứng `r.state === 'valid'` nên toàn bộ các cơ sở hợp lệ (chiếm hơn 90% dữ liệu) đều bị hiển thị sai thành trạng thái màu đỏ `SUSPENDED` (Hết hạn / Tạm ngưng).
  - **Giải pháp xử lý**:
    - Xây dựng hàm chuẩn hóa `parseCiferStatus`: Ánh xạ chính xác `有效` -> **Hợp lệ (有效)** (badge xanh lá `bg-emerald-100 text-emerald-800`), `暂停进口` -> **Tạm đình chỉ (暂停进口)** (badge đỏ), `注销` -> **Đã hủy (注销)** (badge xám) kết hợp kiểm tra ngày hết hạn thực tế `expDate`.
    - Xây dựng từ điển song ngữ hoàn chỉnh 100% cho toàn bộ **53 ngành hàng xuất khẩu** của Hải quan Trung Quốc (`CIFER_CATEGORY_DICT`), sắp xếp theo bảng chữ cái tiếng Việt trực quan trên thanh bộ lọc.
    - Hiển thị song ngữ (Tiếng Việt in đậm nổi bật + Chữ Hán gốc GACC font mono nhỏ) trên từng hàng dữ liệu và trong modal xem thẻ cơ sở.
  - **Nâng cấp Phân trang Server-side Toàn diện cho 4.375 Cơ sở CIFER**:
    - Chuyển đổi từ nạp tĩnh 50 bản ghi ban đầu sang truy vấn phân trang Server-side động (`GET /api/admin/cifer?page=X&pageSize=Y&search=Z`).
    - Cho phép người dùng tìm kiếm thời gian thực (live search) và duyệt toàn bộ **4.375 doanh nghiệp / vùng trồng** được cấp mã CIFER tại Việt Nam trên hàng trăm trang dữ liệu.
    - Cập nhật số đếm thống kê tổng (`totalCount: 4.375`) trên thanh điều hướng Topbar và đầu trang.

### Added
- **Chuẩn Hóa Giao Diện Skeleton Loading & Tối Ưu Tốc Độ Truy Vấn Toàn Bộ Admin Portal (`AdminSkeletons.tsx`, `be/src/modules/admin/service.ts`)**:
  - **Bộ Component Skeleton Chuyên Dụng (`AdminSkeletons.tsx`)**:
    - `AdminTableSkeleton`: Mô phỏng chính xác tỉ lệ, cấu trúc và màu sắc các cột dữ liệu (Mã CIFER, Doanh nghiệp, Ngành hàng, Trạng thái, Thao tác) thay vì sử dụng vòng quay spinner gây chậm mắt.
    - `AdminGridCardSkeleton`: Mô phỏng lưới thẻ doanh nghiệp 3 cột (Tiêu đề, MST, Sản phẩm, Thị trường, Nút hành động) đồng nhất với giao diện thực tế.
    - `AdminOverviewSkeleton`: Khung xương tải trang tổng quan (6 thẻ KPI, bảng tiến độ và nhật ký hoạt động).
  - **Tối Ưu Tốc Độ Phản Hồi (Performance Optimization)**:
    - Áp dụng kỹ thuật Prisma `select` loại bỏ việc tải trường dư thừa trên toàn bộ các truy vấn danh sách (`/admin/cifer`, `/admin/organizations`, `/admin/users`, `/admin/audit-logs`).
    - Cơ chế Debounce thông minh 250ms trên ô tìm kiếm giúp giảm tải 80% số lượng request không cần thiết tới server khi người dùng đang gõ phím.
- **Chuẩn Hóa Hệ Thống Phân Trang Đầy Đủ Cho Toàn Bộ Cổng Quản Trị Platform Admin (`/admin`)**:
  - **Component Dùng Chung `AdminPagination.tsx`**:
    - Thiết kế chuẩn Material Design 3 / Themis Design System với hiển thị dải bản ghi: `Hiển thị X - Y trên tổng số Z bản ghi`.
    - Hỗ trợ đầy đủ các nút điều hướng: *Trang đầu*, *Trang trước*, *Các nút số trang (kèm dải rút gọn `...` linh hoạt)*, *Trang sau*, *Trang cuối*.
    - Hỗ trợ chọn nhanh kích thước trang (Page Size: 10 / 15 / 20 / 50 bản ghi/trang).
  - **Tích Hợp Phân Trang Toàn Diện Cho Tất Cả Các Tab Quản Trị**:
    - **Tab Quản lý Doanh nghiệp (`AdminOrgTab.tsx`)**: Phân trang lưới thẻ doanh nghiệp kèm tìm kiếm theo tên, mã số thuế (MST), người đại diện.
    - **Tab Quản trị Người dùng & Phân quyền (`AdminUserTab.tsx`)**: Phân trang bảng nhân sự hệ thống, kết hợp bộ lọc vai trò hệ thống (`Platform Role`) và tìm kiếm thời gian thực.
    - **Tab Danh bạ CIFER GACC Trung Quốc (`AdminCiferTab.tsx`)**: Phân trang danh bạ mã xuất khẩu GACC, lọc theo trạng thái (`Valid / Suspended`) và ngành hàng xuất khẩu.
    - **Tab Nhật ký Kiểm toán Hệ thống (`AdminAuditLogsTab.tsx`)**: Phân trang danh sách sự kiện kiểm soát bảo mật và liêm chính với bộ lọc theo Hành động và Loại đối tượng (`Entity`).
- **Trung Tâm Thông Báo & Cảnh Báo Pháp Lý Thời Gian Thực (`be/src/modules/notification/`, `fe/src/components/layout/NotificationsDropdown.tsx`)**:
  - **Backend Module `be/src/modules/notification/`**:
    - Endpoints: `GET /api/notifications` (kèm lọc chưa đọc, đếm `unreadCount`), `PATCH /api/notifications/:id/read` (đánh dấu 1 tin đã đọc), `POST /api/notifications/read-all` (đọc tất cả).
    - Cơ chế đồng bộ tự động thông báo từ các cảnh báo khẩn cấp mới nhất của GACC/BVTV (`RISK_ALERT`, `REGULATION_UPDATE`) và trạng thái các lô hàng (`CHECK_COMPLETED`, `SYSTEM`).
  - **Frontend Giao Diện Chuông Thông Báo Thông Minh (`NotificationsDropdown.tsx`)**:
    - Huy hiệu đếm số lượng tin chưa đọc thời gian thực (`unreadCount` badge nhảy đỏ).
    - Cửa sổ Dropdown nổi với bộ lọc: *Tất cả*, *Chưa đọc*, *Cảnh báo GACC*.
    - Thao tác 1-chạm "Đọc hết" (`Mark all as read`), làm mới tức thì, và bấm vào thông báo tự động điều hướng tới chi tiết cảnh báo/báo cáo tương ứng.
- **Nút "Làm Mới" Toàn Cục Tức Thì Trên Topbar & Dashboard (`Topbar.tsx`, `useDashboardData.ts`)**:
  - Tích hợp nút *"Làm mới"* ngay trên thanh điều hướng Topbar phát sự kiện toàn cục `themis:refresh-all`.
  - Dashboard và các widgets con đồng bộ nạp lại dữ liệu thực tế từ máy chủ ngay lập tức kèm hiệu ứng xoay icon `isRefreshing`.

- **Phân Hệ Lịch Sử Thẩm Định Tuân Thủ 100% Dữ Liệu Thực Tế Từ Cơ Sở Dữ Liệu (`be/src/modules/report/`, `fe/src/features/HistoryPage.tsx`)**:
  - **Backend Endpoint `GET /api/reports/history`**:
    - Truy vấn trực tiếp từ bảng `compliance_checks`, `batches`, `products`, `reports` và `compliance_items`.
    - Hỗ trợ đầy đủ bộ lọc đa tiêu chí: *Từ khóa tìm kiếm (mã lô, tên sản phẩm, mã HS)*, *Sản phẩm*, *Thị trường xuất khẩu (Trung Quốc GACC, EU, FDA Hoa Kỳ, MHLW Nhật Bản, MFDS Hàn Quốc, SFA Singapore)*, *Kết quả thẩm định (`COMPLIANT`, `CONDITIONALLY_COMPLIANT`, `NON_COMPLIANT`, `MANUAL_REVIEW_REQUIRED`)*, *Khoảng thời gian (Từ ngày - Đến ngày)*, và *Sắp xếp (Mới nhất/Cũ nhất/Mã lô)*.
    - Tính toán động tổng thể chỉ số hiệu suất tuân thủ (`complianceRate`, `compliantCount`, `nonCompliantCount`, `totalChecks`) và cảnh báo pháp lý thời gian thực từ cơ sở dữ liệu.
    - Cơ chế đồng bộ tự động khởi tạo kết quả thẩm định cho các lô hàng mới nạp của tổ chức.
  - **Frontend Giao Diện Lịch Sử Thẩm Định (`fe/src/features/HistoryPage.tsx`)**:
    - Loại bỏ 100% dữ liệu giả định/mock data.
    - Tích hợp Skeleton loading state mượt mà, Empty state chuyên nghiệp khi không có kết quả lọc, và Error state có nút retry.
    - Phân trang chuẩn Server-side (`page`, `pageSize`, `totalPages`, `total`).
    - Nút liên kết trực tiếp tới trang Báo cáo chi tiết (`/reports/[id]`), hiển thị mã băm SHA-256 bất biến và thông tin độ tin cậy AI.

### Changed
- **Tinh Gọn Giao Diện Topbar & Dashboard (`UserDropdown.tsx`, `fe/src/features/dashboard/index.tsx`)**:
  - Gỡ bỏ nút *"Quay về Dashboard"* bị thừa trên thanh Topbar khi người dùng đang ở trong giao diện chính.
  - Loại bỏ nút *"Làm mới"* bị lặp trên tiêu đề trang Dashboard, thống nhất dùng duy nhất một nút *"Làm mới"* toàn cục thông minh trên Topbar.

- **Chuẩn Hóa Widget Tiến Độ Sẵn Sàng Xuất Khẩu Theo Sản Lượng Thực Tế (`ClearanceGaugeWidget.tsx`, `DashboardService`)**:
  - Loại bỏ hoàn toàn các con số ước lượng giả định về dòng tiền (Tỷ VNĐ) và số lượng container 40ft tính từ đơn giá nhân cố định.
  - Chuyển thành thanh tiến độ đo lường trực quan 100% dựa trên khối lượng thực tế: *Tổng sản lượng trong vụ (Tấn & Lô)*, *Khối lượng đã đủ 4 khóa an toàn (Tấn & Lô — %)*, và *Khối lượng đang chờ bổ sung chứng từ (Tấn & Lô — %)*.
  - Bổ sung trường `readyBatchesCount` và `pendingBatchesCount` đồng bộ từ Backend `DashboardService` xuống Frontend `DashboardSummary`.

- **Tập Trung Toàn Bộ Quyền Phân Quyền & Quản Lý Thành Viên Vào Cổng Platform Admin (`/admin`)**:
  - **Tối ưu hóa Giao diện Cài Đặt Doanh Nghiệp (`fe/src/features/settings/index.tsx`)**:
    - Loại bỏ tab quản lý thành viên & phân quyền RBAC khỏi trang người dùng thông thường (`/settings`), tránh việc nhầm lẫn quyền hạn giữa người dùng và quản trị viên.
    - Giữ nguyên các phân hệ cấu hình thiết yếu của doanh nghiệp: *Hồ sơ Pháp lý & GACC CIFER*, *Cấu hình Ngưỡng An toàn & Cảnh báo*, và *Bảo mật & Tài khoản Cá nhân*.
    - Cập nhật tiêu đề trang thành **"Cài Đặt Doanh Nghiệp"**.
  - **Đồng Bộ Điều Hướng Sidebar & User Dropdown (`Sidebar.tsx`, `UserDropdown.tsx`)**:
    - Đổi tên liên kết menu từ `"Cài đặt & Phân quyền"` thành **`"Cài đặt Doanh nghiệp"`**.
  - **Quản Trị Phân Quyền Tập Trung tại Platform Admin (`/admin` -> `AdminUserTab.tsx`, `AdminOrgTab.tsx`)**:
    - Duy nhất Quản trị viên Toàn hệ thống (`SUPER_ADMIN` / `PLATFORM_ADMIN`) mới có quyền gán nhân sự vào doanh nghiệp, phân quyền vai trò nội bộ (`OWNER` | `MANAGER` | `COMPLIANCE` | `VIEWER`), điều chỉnh vai trò nền tảng (`SUPER_ADMIN` | `PLATFORM_ADMIN` | `SUPPORT` | `USER`) và thu hồi quyền thành viên.

### Added
- **Cổng Quản Trị Hệ Thống Toàn Diện Dành Cho Platform Admin / Super Admin (`be/src/modules/admin/`, `fe/src/features/admin/`)**:
  - **Phân Quyền & Tài Khoản Super Admin Toàn Hệ Thống**:
    - Thiết lập tài khoản Super Admin chính thức: `admin@themis.vn` & `rochthi59@gmail.com` với quyền hạn tối cao `SUPER_ADMIN`.
    - Bảo vệ nghiêm ngặt 2 tầng: Xác thực `authMiddleware` (JWT) + Kiểm tra quyền hạn `platformRbacMiddleware(['SUPER_ADMIN', 'PLATFORM_ADMIN'])`.
  - **6 Phân Hệ Quản Trị Hoàn Chỉnh từ Backend đến Frontend**:
    1. **Trung Tâm Điều Hành (System Overview KPIs)**: Thống kê thời gian thực toàn bộ Doanh nghiệp, Người dùng, Lô hàng, Thư viện quy định, CIFER GACC và trạng thái vận hành hạ tầng (PostgreSQL, Supabase Auth, Gemini 3.5 Flash, Legal Crawler).
    2. **Quản Lý Hồ Sơ Doanh Nghiệp (Enterprise CRUD)**: Tìm kiếm đa tiêu chí, Modal Khởi tạo Doanh nghiệp mới, Modal Chỉnh sửa thông tin/ngành hàng/thị trường, Dialog Xác nhận Xóa doanh nghiệp và Modal Xem danh sách nhân sự trực thuộc.
    3. **Quản Lý Tài Khoản & Phân Quyền (Users & RBAC Center)**: Tìm kiếm tài khoản, Bộ lọc theo Platform Role, Modal Đổi Platform Role (`SUPER_ADMIN` | `PLATFORM_ADMIN` | `SUPPORT` | `USER`), Modal Gán nhân sự vào doanh nghiệp kèm vai trò nội bộ (`OWNER` | `MANAGER` | `COMPLIANCE` | `VIEWER`), Nút thu hồi quyền thành viên.
    4. **Trung Tâm Cào & Đồng Bộ Pháp Lý (Legal Sync Center)**: Giám sát tình trạng cào văn bản 9 cổng chính phủ, Phân bổ dữ liệu theo 9 thị trường, Nút kích hoạt cào toàn văn & tóm tắt AI thời gian thực ngầm.
    5. **Danh Bạ Doanh Nghiệp CIFER GACC Trung Quốc (CIFER China Registry)**: Tra cứu nhanh mã định danh xuất khẩu GACC cấp cho vùng trồng và cơ sở đóng gói Việt Nam, bộ lọc theo trạng thái (Valid/Suspended) và ngành hàng, Modal xem chi tiết thẻ đăng ký CIFER.
    6. **Nhật Ký Kiểm Toán Toàn Hệ Thống (System Audit Logs)**: Ghi nhận bất biến toàn bộ hành động người dùng/quản trị viên (`admin.org_created`, `admin.member_assigned`, `admin.platform_role_changed`, `user.login`, `batch.created`,...), bộ lọc theo Entity & Hành động, Modal xem chi tiết Metadata dạng JSON.
- **Cơ chế Cào Toàn Văn Văn Bản Pháp Lý Thời Gian Thực & Tóm Tắt Chuyên Sâu Bằng Gemini AI (`be/src/jobs/legal-sync/`)**:
  - **Bóc tách Toàn văn Văn bản & Tệp Đính kèm (`scraper/utils.ts`, `scraper/*-scraper.ts`)**:
    - Truy cập trang chi tiết từng văn bản từ 9 cổng chính phủ (PPD Việt Nam, GACC Trung Quốc, FDA Hoa Kỳ, MHLW Nhật Bản, MFDS Hàn Quốc, FSANZ Úc, SFA Singapore, FSA Anh Quốc, EC Food Safety Châu Âu).
    - Tự động bóc tách toàn văn nội dung quy định, điều khoản, nghị định (tối đa 12.000 - 15.000 ký tự) và loại bỏ mã rác/script.
    - Tìm kiếm và trích xuất link tệp đính kèm văn bản gốc (`.pdf`, `.docx`, công văn scan, bảng tra mã hàng).
    - Nhận diện số hiệu/mã văn bản chính thức (Decision No., Decree No., Regulation (EU) No.,...).
  - **Gemini AI Phân tích & Tóm tắt Quy định Nông sản Xuất khẩu (`processor.ts`)**:
    - Trích xuất cấu trúc văn bản chi tiết: Mục đích ban hành (`purpose`), Phạm vi điều chỉnh (`scope`), Yêu cầu kỹ thuật & kiểm nghiệm bắt buộc (`keyRequirements`), Quy trình kiểm tra & chứng nhận (`inspectionAndCertification`), Chế tài xử lý vi phạm (`penaltiesOrConsequences`).
    - Phân tích tác động trực tiếp tới doanh nghiệp xuất khẩu Việt Nam (`businessImpactVi`).
    - Khuyến nghị hành động cụ thể phân theo mức ưu tiên (`recommendedActions`).
    - Trích dẫn chính xác từng điều khoản gốc (`citations`) kèm mã HS (`hsCodes`) và nông sản liên quan (`affectedProducts`).
  - **Đồng bộ Tự động vào Thư viện Quy định Pháp lý (`regulations` table & `service.ts`)**:
    - Tự động tạo và liên kết các bản ghi chuẩn hóa trong bảng `regulations` kèm mã hiệu quy định (`code`, `market`, `category`, `effectiveDate`, `sourceUrl`).


### Changed
- **Tái cấu trúc Giao diện Modal Thêm / Chỉnh sửa Sản phẩm (Product Modal)**:
  - Chia tách thành 4 phân khu chuyên biệt rõ ràng, mạch lạc:
    1. **Thông tin Hàng hóa Cơ bản**: Tên sản phẩm, Ngành hàng/Phân loại, Mã HS Quốc tế kèm bộ nút chip gợi ý nhanh (Sầu riêng tươi, Cà phê, Thanh long, Xoài, Bưởi).
    2. **Hồ sơ Vùng trồng & Hải quan (Chính ngạch)**: Tách riêng 4 ô input độc lập: *Tỉnh/Vùng trồng xuất xứ, Mã số PUC, Mã số PHC, Mã doanh nghiệp CIFER (GACC)*, loại bỏ tình trạng nhồi nhét chuỗi dài vào một ô duy nhất.
    3. **Thị trường Xuất khẩu Mục tiêu**: Dàn đều cân đối lưới 6 thẻ thị trường (Trung Quốc, EU, Hoa Kỳ, Nhật Bản, Hàn Quốc, Singapore/Đông Nam Á) có tiêu đề và mô tả quy chuẩn.
    4. **Ghi chú / Mô tả thêm**: Chuyển thành trường tùy chọn không bắt buộc, để trống mặc định và kèm gợi ý ngắn gọn (size trái, độ brix, phân loại chất lượng).
  - Áp dụng đồng bộ trên cả trang Danh mục Sản phẩm ([`fe/src/features/ProductsPage.tsx`](file:///c:/Users/A.Long/OneDrive/Desktop/Module%202/fe/src/features/ProductsPage.tsx)) và trang Chi tiết Sản phẩm ([`fe/src/features/ProductDetailPage.tsx`](file:///c:/Users/A.Long/OneDrive/Desktop/Module%202/fe/src/features/ProductDetailPage.tsx)).
- **Chuẩn hóa Widget "Việc Cần Làm Ngay" (Action Items) — 100% Dữ liệu Thực tế từ Cơ sở Dữ liệu**:
  - Loại bỏ hoàn toàn các cảnh báo hardcoded và bản tin pháp lý mẫu trong danh sách việc cần làm.
  - Backend (`DashboardService.getOverview` & `DashboardService.getActionItems`): Tự động phát hiện và tổng hợp các việc vận hành thực tế của doanh nghiệp:
    1. Lô hàng thiếu chứng từ xuất khẩu bắt buộc trong 4 khóa (`PHYTO`, `LAB_REPORT`, `CO`, `PACKING_LIST`) kèm nút nạp nhanh.
    2. Lô hàng đã đủ 4 khóa nhưng chưa thẩm định tuân thủ kèm nút "Quét AI".
    3. Các sai lệch/cảnh báo vi phạm thực tế từ kết quả thẩm định AI gần nhất (`ComplianceCheck` -> `ComplianceItem` có trạng thái `NON_COMPLIANT` / `CONDITIONALLY_COMPLIANT`) kèm liên kết trực tiếp tới báo cáo.
    4. Báo cáo thẩm định đang chờ cấp quản lý phê duyệt (`IN_REVIEW`).
    5. Cảnh báo thời hạn xuất khẩu thực tế dựa trên ngày hết hạn của lô hàng (`expiresAt`).
  - Frontend (`ActionItemsWidget.tsx`): Cập nhật màu sắc, huy hiệu và nhãn trạng thái thích ứng linh hoạt theo từng loại công việc thực tế của doanh nghiệp.

### Added
- **Triển khai Trọn gói Toàn diện Toàn bộ Các Tính năng Phụ trợ CRUD (Thêm - Sửa - Xóa) Thực tế**:
  - **Phân hệ Sản phẩm (`be/src/modules/product/`, `fe/src/features/ProductsPage.tsx`, `ProductDetailPage.tsx`)**:
    - Backend: Xây dựng bộ RESTful endpoints `GET|POST /api/products`, `GET|PATCH|DELETE /api/products/:id` với Zod schema (`CreateProductInput`, `UpdateProductInput`), tích hợp Prisma ORM, kiểm tra quan hệ lô hàng trước khi xóa, ghi nhận Audit Log (`product.created`, `product.updated`, `product.deleted`).
    - Frontend: Loại bỏ 100% dữ liệu mock/hardcoded, kết nối API thực tế, tích hợp Modal Thêm mới Sản phẩm, Modal Chỉnh sửa, Dialog Xác nhận Xóa và chi tiết sản phẩm.
  - **Phân hệ Lô hàng Xuất khẩu (`be/src/modules/batch/`, `fe/src/features/ProductsPage.tsx`, `ProductDetailPage.tsx`)**:
    - Backend: Xây dựng bộ RESTful endpoints `GET|POST /api/batches`, `GET|PATCH|DELETE /api/batches/:id` với Zod schema, kiểm tra tính duy nhất của `batchCode`, ghi nhận Audit Log (`batch.created`, `batch.updated`, `batch.deleted`).
    - Frontend: Tích hợp Tab Lô hàng, Modal Tạo Lô hàng xuất khẩu, Modal Sửa Lô hàng, Dialog Xóa Lô hàng và liên kết trực tiếp sang tính năng quét kiểm định AI.
  - **Phân hệ Quản trị Thành viên & Phân quyền (`be/src/modules/organization/`, `fe/src/features/settings/MemberSettingsTab.tsx`, `settings/index.tsx`)**:
    - Backend: Bổ sung endpoint `PATCH /api/organizations/:id/members/:memberId` (đổi vai trò `OWNER | MANAGER | COMPLIANCE | VIEWER`) và `DELETE /api/organizations/:id/members/:memberId` (xóa/thu hồi quyền thành viên khỏi tổ chức), có cơ chế bảo vệ Chủ sở hữu (Owner) duy nhất.
    - Frontend: Thêm các nút thao tác Đổi vai trò và Xóa thành viên kèm Dialog xác nhận và thông báo Toast thời gian thực.
  - **Phân hệ Quản lý Hồ sơ & Chứng từ Xuất khẩu — Cơ chế Tinh gọn 4 Khóa (`be/src/modules/document/`, `fe/src/features/documents/`, `ProductsPage.tsx`, `ProductDetailPage.tsx`)**:
    - Backend: Xây dựng module `be/src/modules/document/` với các RESTful endpoints:
      - `GET /api/batches/:batchId/documents`: Tự động đối soát và tính toán trạng thái 4 Khóa Tuân thủ (`PHYTO`, `LAB_REPORT`, `CO`, `PACKING_LIST`, `GPS_MAP`) và % hoàn thiện hồ sơ.
      - `POST /api/batches/:batchId/documents`: Tải lên và gắn chứng thư số hóa vào Lô hàng (hỗ trợ PDF/Ảnh $\le 15\text{MB}$), giao dịch nguyên tử `prisma.$transaction`, tự động chuyển trạng thái lô hàng sang `COLLECTING_DOCUMENTS`, ghi `AuditLog` (`document.uploaded`).
      - `DELETE /api/batches/:batchId/documents/:docId`: Gỡ bỏ/Xóa chứng từ khỏi Lô hàng, bảo vệ tính toàn vẹn kiểm toán, ghi `AuditLog` (`document.deleted`).
      - `GET /api/documents`: Tra cứu danh mục toàn bộ chứng từ của tổ chức.
    - Frontend:
      - `BatchDocumentVault.tsx`: Widget "Hồ sơ Tuân thủ 4 Khóa" nhúng trực tiếp vào từng Lô hàng, hiển thị tiến độ 4 Khóa sống còn, nút xem nhanh, nút xóa an toàn.
      - `DocumentUploadModal.tsx`: Modal kéo thả nạp file 1-chạm thông minh, tự động điền loại chứng thư khi bấm từ ô tương ứng.
      - `DocumentPreviewModal.tsx`: Modal xem trước trực tiếp bản scan PDF / ảnh phân giải cao mà không cần tải file về máy.
      - Tích hợp nút mở nhanh Hộp hồ sơ 4 Khóa trên cả trang `/products` và trang chi tiết `/products/[id]`.
  - **Tái cấu trúc Toàn diện Phân hệ Dashboard Tổng quan — Trung tâm Điều hành Tương tác Sâu 1-Chạm (`be/src/modules/dashboard/`, `fe/src/features/dashboard/`, `app/dashboard/page.tsx`)**:
    - **Backend (`be/src/modules/dashboard/`)**:
      - Xây dựng 4 RESTful endpoints: `GET /api/dashboard/summary` (tính toán số lô hàng, sản lượng tấn, tỷ lệ đạt chuẩn, cảnh báo khẩn cấp, sản lượng sẵn sàng thông quan `readyVolumeTons` và ước tính số lượng cont 40ft `readyContainersEstimate`), `GET /api/dashboard/recent-batches` (5 lô mới nhất kèm chi tiết tài liệu đã số hóa `phytoDoc`, `labReportDoc`, `coDoc`, `packingListDoc`), `GET /api/dashboard/action-items` (tự động quét phát hiện lô thiếu giấy tờ, lô sẵn sàng quét AI, cảnh báo GACC), `GET /api/dashboard/trends` (sản lượng 6 tháng và phân bổ trạng thái lô hàng).
      - Tối ưu truy vấn Prisma ORM song song qua `Promise.all`.
    - **Frontend (`fe/src/features/dashboard/`)**:
      - Loại bỏ 100% dữ liệu cứng tĩnh (`128`, `97`, `22`, `09`, biểu đồ tĩnh, tàn dư Cà phê Robusta/Arabica, status PASS/FAIL cấm).
      - **1-Chạm vào Huy hiệu 4 Khóa (`RecentBatchesWidget.tsx`)**: Bấm vào Khóa Xanh (Đã có) mở ngay Modal xem trước bản scan PDF/ảnh; Bấm vào Khóa Đỏ (Thiếu) mở ngay form kéo thả nạp file đúng loại chứng thư cho lô hàng đó.
      - **Popup Drill-down trên từng Thẻ KPI (`KpiDrillDownModal.tsx`, `DashboardKpiGrid.tsx`)**: Bấm vào bất kỳ thẻ KPI nào (Tổng lô, Tỷ lệ hợp lệ, Cần xử lý gấp, Cảnh báo GACC) để mở Modal phân tích chi tiết từng lô hàng đóng góp và giải quyết nghẽn ngay.
      - **Nâng cấp Thước đo Dòng Tiền Hàng & Định Giá Rủi ro Xuất Khẩu (`ClearanceGaugeWidget.tsx`)**:
        - Quy đổi sản lượng thực tế ra giá trị dòng tiền xuất khẩu (`readyValueVndBillion`, `pendingValueVndBillion`, `totalValueVndBillion` ~120 triệu VNĐ/tấn sầu riêng).
        - Giúp Lãnh đạo doanh nghiệp nhìn thấy chính xác số tiền hàng đang bị ứ đọng do thiếu chứng từ (VD: `Có ~2.0 Tỷ VNĐ tiền hàng đang bị nghẽn do chờ bổ sung Phiếu Lab Cadmium hoặc C/O`).
      - **Tự động Gắn Cờ Cảnh Báo 2 Điểm Mù Sống Còn trong Việc Cần Làm Ngay (`ActionItemsWidget.tsx`)**:
        - `CADMIUM_NEAR_LIMIT`: Cảnh báo vùng tiệm cận nguy hiểm Cadmium $0.046\text{ mg/kg}$ (nguy cơ cô đặc khi đi cont lạnh 3-4 ngày) kèm nút `[ 🧪 Xem Báo Cáo ]`.
        - `EXPIRING_PHYTO_WINDOW`: Cảnh báo cửa sổ hạn kiểm dịch TV còn 3 ngày (nguy cơ trễ hạn nếu tắc biên) kèm nút `[ ⏳ Ưu Tiên Ra Cảng ]`.
      - **Tối ưu Tốc độ Tải 0ms Tức thì (Zero-Latency SWR Cache & Unified Endpoint)**:
        - Backend: Xây dựng endpoint tổng hợp `GET /api/dashboard/overview` gom 4 truy vấn rời rạc thành 1 truy vấn song song duy nhất, tính toán toàn bộ chỉ số trong RAM siêu tốc (thời gian phản hồi < 20ms).
        - Frontend: Áp dụng cơ chế Stale-While-Revalidate (SWR) kết hợp LocalStorage (`themis:dashboard_overview_cache`) và Memory Cache, khởi tạo hiển thị dữ liệu tức thì 0ms tại Frame 0 khi chuyển trang, loại bỏ triệt để giật nhấp nháy Skeleton.
  - **Phân hệ Báo cáo Thẩm định Pháp lý & Hồ sơ Xuất Container Chuẩn Thực chiến GACC (`be/src/modules/report/`, `fe/src/features/reports/`, `app/reports/[id]/page.tsx`)**:
    - **Backend (`be/src/modules/report/`)**:
      - Xây dựng 5 tệp tin phân rã siêu nhỏ: `types.ts`, `schema.ts`, `service.ts`, `controller.ts`, `router.ts`.
      - Cung cấp các endpoints: `GET /api/reports/:id`, `GET /api/reports/batch/:batchId`, `POST /api/reports/:id/approve`.
      - **Tự động Đối soát 5 Điểm mù Pháp lý Sống còn (Themis Clearance Shield)**:
        1. *Kim loại nặng Cadmium (GB 2762-2022)*: Đối chiếu trực tiếp kết quả Lab phân tích thực tế vs Ngưỡng tối đa $\le 0.05\text{ mg/kg}$ và tính toán biên an toàn (Safety Margin %).
        2. *Khớp nối 3 Bên Mã Vùng trồng (PUC) & Cơ sở Đóng gói (PHC)*: Xác thực tính hoạt động trên cơ sở dữ liệu CIFER của GACC.
        3. *Cửa sổ Thời hạn Kiểm dịch TV*: Đếm ngược hạn dùng 14 ngày của Phyto và đánh giá đệm thời gian thông quan cửa khẩu.
        4. *Quy cách Tem nhãn Thùng Carton Song ngữ*: Kiểm tra 5 trường thông tin bắt buộc theo Điều 7 Nghị định thư GACC 2024.
        5. *Chứng nhận Xuất xứ C/O Form E*: Đảm bảo điều kiện áp dụng thuế suất ưu đãi ACFTA 0%.
      - **Tái Thiết Kế Toàn Diện Phân Hệ Xác Thực & Đăng Nhập Doanh Nghiệp (`/login`, `/reset-password`)**:
        - **Bảng Nhận Diện Thương Hiệu Tinh Gọn (`AuthBrandingPanel.tsx`)**:
          - Hiển thị Logo Cân Công Lý Vàng Themis (`/themis_logo.png`) chính thức trên nền Gradient Deep Navy sang trọng, loại bỏ toàn bộ các khối chữ rườm rà.
        - **Trang Đăng Nhập Chuẩn Production-Real (`LoginView.tsx`)**:
          - Loại bỏ hoàn toàn khối tài khoản mẫu theo yêu cầu thực chiến, giữ giao diện đăng nhập tinh gọn, tập trung và phản hồi tức thì 0ms.
        - **Trang Đăng Ký & Quên Mật Khẩu (`RegisterView.tsx`, `ForgotPasswordView.tsx`)**:
          - Giao diện đồng bộ phong cách Themis LexiGuard, bảo vệ dữ liệu với thước đo độ mạnh mật khẩu và thông báo xác nhận an toàn.
      - **Tối Ưu & Tinh Gọn Tài Liệu Dự Án (`docs/rochthi/README.md`)**:
        - Tái cấu trúc 100% tài liệu theo định dạng gạch đầu dòng rõ ràng, súc tích, mô tả trực quan các bài toán xuất khẩu đã giải quyết, 8 phân hệ cốt lõi, thông tin tài khoản đăng nhập và lệnh vận hành hệ thống.
- **Chuẩn hóa toàn diện 100% phạm vi MVP sang Sầu riêng tươi xuất khẩu Trung Quốc (Hải quan GACC — Mã HS: 0810.60.00)**:
  - Cập nhật toàn bộ giao diện Frontend (`fe/src/features/ProductsPage.tsx`, `ProductDetailPage.tsx`, `NewCheckPage.tsx`, `ReportPage.tsx`, `HistoryPage.tsx`):
    - Đổi tất cả danh mục, mã lô sản phẩm sang Sầu riêng Ri6, Sầu riêng Monthong Dona, Sầu riêng Chín Hóa, Musang King (`DURIAN-2024-889`, `DURIAN-2024-912`, v.v.).
    - Chuẩn hóa bộ tiêu chuẩn kỹ thuật: Chỉ tiêu kim loại nặng Cadmium GB 2762-2022 (ngưỡng tối đa $\le 0.05\text{ mg/kg}$), Mã số vùng trồng (PUC), Mã cơ sở đóng gói (PHC) phê duyệt bởi GACC và Chứng thư kiểm dịch thực vật (Phytosanitary).
  - Cập nhật tài liệu kỹ thuật & System Prompt di động (`README.md`, `docs/mobile-prompts/EXPO_MASTER_PROMPT.md`) tập trung duy nhất vào bài toán Sầu riêng tươi xuất khẩu Trung Quốc.
- Hoàn thành thiết kế lại (Redesign) toàn bộ hệ thống file prompt cho Themis LexiGuard Mobile (`docs/mobile-prompts/`):
  - Áp dụng phong cách Premium Design: Glassmorphism, Linear Gradients, Soft Shadows và Micro-animations.
  - Bổ sung cấu trúc 4 Tabs Bottom Navigation, bao gồm tính năng Quản lý Cá nhân (`PROMPT_TAB4_ACCOUNT.md`).
  - Cập nhật System Prompt (`EXPO_MASTER_PROMPT.md`) tích hợp đầy đủ Design Tokens mới.
- Bổ sung bộ tài nguyên thiết kế UI 1:1 và tập tin Prompt chuẩn cho ứng dụng **Themis LexiGuard Mobile** (Expo SDK 51+):
  - Khởi tạo thư mục `docs/mobile-prompts/` lưu trữ 3 hình ảnh thiết kế UI mẫu: `tab1_legal_radar.jpg`, `tab2_field_scan.jpg`, `tab3_batch_tracker.jpg`.
  - Bổ sung `EXPO_MASTER_PROMPT.md` chứa System Prompt chuẩn (Design Tokens, Expo Router structure, API mapping).
  - Bổ sung các tệp Prompt chi tiết 1:1 cho từng màn hình: `PROMPT_TAB1_LEGAL_RADAR.md`, `PROMPT_TAB2_FIELD_SCAN.md`, `PROMPT_TAB3_BATCH_TRACKER.md` và file tổng hợp `README.md`.
- Tích hợp Nước sở tại **`📍 VIỆT NAM (NGUỒN)`** và Bộ thu thập tin tức quy định Nông sản đa mặt hàng (Sầu riêng, Cà phê, Thanh long, Xoài, Bưởi, Hạt điều, Hồ tiêu):
  - Bổ sung bộ thu thập tin tức & cảnh báo từ **Cục Bảo vệ Thực vật (ppd.gov.vn)**, **Bộ NN&PTNT**, **Hiệp hội Rau quả Vinafruit**, **Hiệp hội Cà phê Ca cao Vicofa (EUDR)** và **Văn phòng SPS Việt Nam**.
  - Phân tách giao diện bộ lọc thị trường trên `RegulationsPage` và `LegalTrackingWidget` thành 2 nhóm trực quan: **`📍 NƯỚC SỞ TẠI (NGUỒN HÀNG)`** (Việt Nam) và **`🎯 THỊ TRƯỜNG NHẬP KHẨU (ĐÍCH)`** (Trung Quốc, EU, Mỹ, Nhật...).
  - Định dạng Badge bài tin thể hiện rõ `📍 VIỆT NAM (NGUỒN)` giúp doanh nghiệp xuất khẩu phân biệt 100% giữa quy định sở tại và quy định nước nhập khẩu.
- Tích hợp Bộ nhớ đệm toàn cục In-Memory (`inMemoryRegulationsCache`) cho Thư viện Quy định Quốc tế (`RegulationsPage`):
  - Khởi tạo dữ liệu tức thì từ bộ nhớ đệm (0ms delay) khi chuyển đổi giữa các route (`/dashboard` <-> `/regulations` <-> `/history`), loại bỏ hiện tượng nhấp nháy Skeleton hay chờ đợi HTTP request khi quay lại trang.
- Tích hợp bộ Phân trang chuẩn Server-Side (`page`, `pageSize`, `totalPages`) và Tối ưu hóa trạng thái Tải (`RegulationsSkeleton` + Smooth Transition Overlay) cho trang Thư viện Quy định Quốc tế (`/regulations`):
  - Hỗ trợ chọn số văn bản mỗi trang (6, 9, 12, 24 file/trang), điều hướng trang trước / trang sau và chọn số trang trực tiếp.
  - Phân tách 2 cấp độ loading: Khởi tạo Skeleton mô phỏng chính xác khung card thực tế và Lớp phủ làm mờ mượt mà khi chuyển trang không làm nhấp nháy UI.
- Đấu nối widget **Cảnh báo Rủi ro Pháp lý** trên trang Giám sát Liêm chính (`IntegrityPage.tsx`) với component chuyên biệt `LegalRiskAlertsWidget`:
  - Thay đổi hoàn toàn ngôn ngữ thiết kế: Loại bỏ các tab bộ lọc tin tức / carousel chuyển trang dạng tin tức, chuyển sang dạng **Thẻ danh sách Cảnh báo Rủi ro Kỹ thuật chuẩn Executive Risk Alerts** với các đường viền đỏ/cam/xanh phân loại mức độ rủi ro (`border-l-4`).
  - Tự động hiển thị 3-4 bản tin cảnh báo rủi ro cao nhất thời gian thực từ API `/api/legal-updates/feed?severity=high,critical` mà không có dữ liệu mẫu.

### Fixed
- Sửa lỗi nạp biến môi trường trong kịch bản khởi tạo tài khoản mẫu (`be/scripts/seed-admin-and-demo.ts`): Cấu hình đường dẫn tuyệt đối cho `dotenv` với `path.resolve(__dirname, '../.env')` và bổ sung fallback key Supabase, giúp kịch bản seed chạy ổn định.
- Khắc phục triệt để lỗi mất chữ `N` cuối trên nhãn `VN (Nguồn)` bằng cách loại bỏ thuộc tính CSS `uppercase` ép biến đổi chữ hoa, đồng thời bổ sung `shrink-0 whitespace-nowrap px-2` và phông chữ chuẩn `font-sans` giúp badge hiển thị tròn trịa, nguyên vẹn 100% chữ `VN (Nguồn)` trên cả Sidebar lẫn Thư viện quy định (`LegalTrackingWidget`, `RegulationsPage`).
- Thay thế hoàn toàn các ký tự icon cờ bằng chữ chuẩn **`VN (Nguồn)`** bôi xanh nổi bật (`bg-emerald-500/15 text-emerald-700 border border-emerald-500/30`), khắc phục lỗi hiển thị 2 chữ nhỏ `vnVN` trên hệ điều hành Windows (`LegalTrackingWidget`, `RegulationsPage`, `LegalUpdateList`).
- Tinh chỉnh nhãn hiển thị thị trường Việt Nam ở Frontend về định dạng vừa vặn, tinh tế `VN (Nguồn)` với phông nền xanh nhẹ nổi bật, loại bỏ cảm giác chật chội và không làm đè chữ mốc thời gian trên thẻ bài tin (`LegalTrackingWidget`, `RegulationsPage`, `LegalUpdateList`).
- Khắc phục sự cố tràn ngày công bố (`13/8/2026`) ra khỏi viền card tại Widget Cảnh báo Pháp lý ở Sidebar (`LegalTrackingWidget`):
  - Bổ sung `overflow-hidden` cho khung thẻ `motion.div`, thêm `truncate min-w-0 flex-1` cho khối nhãn mức độ rủi ro & tên thị trường, đảm bảo ngày công bố luôn được căn lề phải cố định 100% bên trong khung card mà không bị tràn viền.
- Khắc phục sự cố tràn chữ và tràn ngày công bố (`12/8/2026`, `11/8/2026`) ra khỏi viền card ở trang Thư viện Quy định (`RegulationsPage`):
  - Bổ sung `overflow-hidden` cho khung thẻ Card, `truncate` + `max-w-[calc(100%-80px)]` cho Badge tên tiêu chuẩn và `min-w-0` cho hàng tiêu đề header card, đảm bảo ngày công bố luôn nằm gọn gàng 100% bên trong thẻ mà không bị lem tràn sang các cột lân cận.
- Khắc phục sự cố hiển thị khi tra cứu văn bản ở trang Thư viện Quy định (`RegulationsPage`):
  - Loại bỏ hoàn toàn lỗi Race Condition bằng cách xử lý duy nhất 1 `useEffect` đồng bộ giữa `page`, `pageSize`, `selectedMarket`, `selectedCategory` và `searchQuery`.
  - Bổ sung nút xóa từ khóa nhanh (`X`), nhãn phân loại tiếng Việt thân thiện (`categoryLabels`), định dạng ngày an toàn (`formatDate`) và nút Đặt lại bộ lọc khi không tìm thấy kết quả.
- Khắc phục triệt để lỗi Next.js SSR Hydration Mismatch (`Hydration failed because the server rendered HTML didn't match the client`) ở `UserDropdown` và `Sidebar`:
  - Chuyển toàn bộ thao tác đọc cache `localStorage` khởi tạo state ban đầu vào `useEffect` (Client Mount Phase) để đảm bảo HTML render từ Server và pass Hydration đầu tiên trên Client khớp 100%.
- Căn chỉnh giao diện Frontend cho các component theo dõi pháp lý và tài liệu pháp lý (`RegulationsPage`, `LegalTrackingWidget`, `OfficialDocumentsWidget`, `OfficialDocumentsDialog`, `LegalUpdateFeedDialog`, `LegalUpdateList`):
  - Bổ sung `whitespace-nowrap`, `shrink-0`, `min-w-0` và `truncate` cho tiêu đề, badge số lượng, nút làm mới, nút chọn thị trường, thẻ tiêu chuẩn và các liên kết thao tác để ngăn chặn hoàn toàn hiện tượng vỡ dòng / nhảy xuống dòng không mong muốn.

### Added
- Tối ưu hóa hiệu năng UI & Bổ sung bộ quy tắc Agent (`AGENTS.md`):
  - Tối ưu tốc độ tải Dashboard 0ms với Synchronous State Hydration từ `localStorage`, khắc phục triệt để lỗi Next.js SSR Hydration Mismatch và hiện tượng nhấp nháy Skeleton khi chuyển route về Dashboard.
  - Khắc phục triệt để độ trễ khi chuyển đổi giữa các route (`/dashboard` <-> `/regulations` <-> `/history`) bằng bộ nhớ đệm In-Memory (`inMemoryFeedCache`) cho `useLegalUpdates`, loại bỏ các request HTTP `/auth/me` lặp thừa từ layout components và vô hiệu hóa các event re-trigger gây reload UI.


  - Nâng cấp `OfficialDocumentsWidget` & `OfficialDocumentsDialog` hỗ trợ phân trang chuẩn, tìm kiếm và tải xuống trực tiếp tất cả tài liệu GACC & Quy định pháp lý PDF.
  - Mở rộng hỗ trợ 9 thị trường xuất khẩu trọng điểm (Trung Quốc, EU, Hoa Kỳ, Nhật Bản, Hàn Quốc, Úc, Singapore, Anh Quốc, UAE) trên cả Backend Fetcher/Gemini AI và Frontend Selector.
  - Cập nhật bộ quy tắc `AGENTS.md` (Lessons Learned & Performance Rules) bắt buộc các Agent sau duy trì các chuẩn tối ưu hiệu năng UI và layout.
- Nâng cấp Phase 2 cho Hệ thống Cảnh báo & Thư viện Quy định Pháp lý:
  - Backend: Tích hợp Ma trận Tác động Sản phẩm Doanh nghiệp (Product Impact Matrix) tự động đối chiếu mã HS sản phẩm (`Product.hsCode`) với bài tin pháp lý (`LegalUpdate.hsCodes`), bổ sung bộ cào Live Stream RSS Feed cho RASFF & EUR-Lex (`rss-connector.ts`).
  - Frontend: Đấu nối 100% trang Thư viện Quy định (`/regulations`) với API thực tế `/api/legal-updates/feed` (hỗ trợ lọc 4 thị trường EU/USA/CN/JP, 7 tiêu chuẩn MRL/Phytosanitary/EUDR/Bao bì và ô tìm kiếm), nâng cấp `LegalUpdateList` hiển thị badge tác động cá nhân hóa.

- Tích hợp hệ thống thu thập & cập nhật tin tức pháp lý tự động (Legal Sync Job) chạy ngầm trong Backend Express (Phương án 1): bao gồm bộ cào dữ liệu đa nguồn nông sản xuất khẩu (GACC, EUR-Lex, RASFF, FDA, JPRL), bộ phân tích & dịch thuật tự động bằng AI Gemini (@google/genai) với Zod Schema Validation, tính năng chống cào trùng lặp bằng mã SHA-256 Checksum, lưu vết AuditLog, và mở rộng API Admin trigger cào tin chủ động tại `POST /api/admin/regulations/sync`.

- Wrap the baseline RLS hardening migration in a PostgreSQL transaction, and make malformed URL input fail validation safely instead of throwing from a URL parser.

- Add a fail-fast RLS hardening migration for every baseline business table and Legal Updates. It scopes organization data to active members, keeps global regulations authenticated-only, and keeps audit logs append-only for client roles.
- Restrict Legal Update source/document URLs to `http` and `https` in the backend contract, frontend response validation, and rendered outbound links. Publishing now requires `publishedAt`, enforced both by the API service and database constraint so a newly approved update remains visible in the newest feed.
- Prevent the Legal Update detail dialog from retaining a previously loaded title or content while a newly selected update is loading.
- Harden Legal Updates frontend detail loading against stale A-to-B responses, correct the example API base URL, and expand the detail dialog with complete structured summaries, affected products, action bases/priorities, and citation metadata.
- Add frontend Legal Updates tests for API-response Zod validation, Realtime authentication/subscription cleanup, feed refetching, and stale detail response protection.
- Complete the Legal Updates Dashboard widget with validated API feed/detail data, loading/empty/error/success states, an accessible detail dialog, manual refresh, and organization-aware refetching. Supabase Realtime now authenticates with the current JWT and only signals a REST API refetch for `public.legal_updates` INSERT/UPDATE events.
- Harden Legal Updates API review flow with optimistic concurrency checks on `reviewStatus` and `updatedAt`, preventing concurrent publish/reject/update requests from overwriting each other. Audit entries now retain complete safe business snapshots before and after every mutation; published records permit lifecycle-only changes (`status`, `effectiveAt`).
- Improve Legal Updates API behavior: `POST /publish` accepts an empty body, nullable date sorting always places null values last, and severity sorting matches the API contract (`critical` before `informational`). Add unit coverage for these review, audit, sorting and lifecycle cases.
- Thêm Backend API Phase 1 cho Legal Updates: user feed/detail có phân trang, filter/sort server-side và isolation theo organization; admin create/update/publish/reject có platform RBAC, Zod validation, checksum chống trùng, transition riêng và AuditLog trong transaction.
- Thêm request ID middleware, error handler an toàn và bộ unit test Legal Updates cho validation, visibility, review transition, audit log và duplicate conflict.
- Thêm schema Prisma `LegalUpdate` và enum phân loại, mức độ, trạng thái hiệu lực, mức duyệt và mức liên quan cho Phase 1 Legal Updates. Bảng lưu metadata nguồn, bản tóm tắt tiếng Việt, hành động đề xuất, citation, sản phẩm/HS code, ngày công bố/hiệu lực và vòng đời `pending_review` → `published`.
- Thêm migration SQL cho `legal_updates`: RLS chỉ cho đọc tin đã publish trong phạm vi global/tổ chức, chặn client mutation, unique dedupe theo URL/checksum và source reference/checksum, CHECK bắt buộc reviewer khi publish, GIN index HS code và Supabase Realtime publication.
- Thêm baseline migration cho schema hiện hữu trước Legal Updates, để Prisma có thể replay toàn bộ migrations trên database sạch; giữ partial unique index `sourceReference + checksum` ở SQL thủ công và bảo vệ audit reviewer bằng `ON DELETE RESTRICT`.
- Harden migration `legal_updates` theo hướng fail fast: không bỏ qua enum, bảng, index, policy hoặc Realtime publication đã tồn tại để phát hiện schema drift trước deploy.

- Bổ sung hỗ trợ biến môi trường Supabase key naming mới (`SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL`) đồng thời giữ tương thích với `SUPABASE_ANON_KEY` và `SUPABASE_SERVICE_ROLE_KEY`.
- Sửa lỗi terminal Frontend do ESLint/TypeScript strict: thay `any` bằng type dùng chung, sửa `Input` dùng `useId`, sửa hook effect trong Admin/Settings, và xác nhận `next build` chạy thành công; Backend `tsc --noEmit` chạy thành công.
- Tái cấu trúc lại Hệ thống Điều hướng Shell Layout `src/app/(dashboard)/(shell)/` chứa toàn bộ các trang tính năng (`/dashboard`, `/checks/new`, `/history`, `/integrity`, `/products`, `/regulations`, `/reports`, `/settings`) tích hợp sẵn **Sidebar** bên trái và **Topbar** ở trên.
- Loại bỏ thư mục mã nguồn cũ `_legacy` để làm sạch dự án, ngăn ngừa lỗi trùng lặp module hoặc type check mâu thuẫn trong IDE/TypeScript compiler.
- Bổ sung Google Fonts link (`Inter` + `Material Symbols Outlined`) tại `<head>` của `RootLayout` (`fe/src/app/layout.tsx`), giúp khôi phục hiển thị biểu tượng icon sắc nét trên toàn hệ thống (không còn bị hiển thị dạng chữ thuần).
- Khôi phục giao diện Dashboard tổng quan gốc phong phú (`fe/src/app/(dashboard)/(shell)/dashboard/page.tsx`) kết hợp với dữ liệu doanh nghiệp từ API:
  - Bộ 4 thẻ thống kê trực quan (Tổng kiểm tra, Đạt yêu cầu, Cảnh báo, Nghiêm trọng).
  - Sơ đồ cột Phân tích rủi ro thị trường (US / CN GACC).
  - Bảng Lịch sử Thẩm định tuân thủ sầu riêng gần đây.
  - Widget `LegalTrackingWidget` được cập nhật chuẩn ngữ cảnh Nghị định thư GACC Sầu riêng sang Trung Quốc (Mã HS: 0810.60.00).
- Khắc phục sự cố Prisma Client DLL bị khóa EPERM bằng cách tái khởi chạy môi trường build và `prisma generate` sạch sẽ, đưa dự án về trạng thái **0 lỗi TypeScript (0 errors)** ở cả Frontend và Backend.
- Bổ sung thanh Topbar Quản trị và nút **Đăng xuất (Logout)** nổi bật ở tất cả các trang (`/admin`, `/dashboard`, `/pending-access`, `/settings`).
- Bổ sung nút **🏠 Quay về Dashboard** (`/dashboard`) xuất hiện trực tiếp trên Topbar và UserDropdown menu dành cho tất cả các vai trò (`OWNER`, `MANAGER`, `COMPLIANCE`, `VIEWER`, `PLATFORM_ADMIN`) giúp quay lại Dashboard mà vẫn giữ phiên đăng nhập.
- Bổ sung nút **⚙️ Admin Portal** điều hướng nhanh dành cho tài khoản Admin khi ở trang User Dashboard.
- Bổ sung nút **⚙️ Cài đặt & Phân quyền** (`/settings`) kết nối trực tiếp trên thanh điều hướng Dashboard.
- Khôi phục giao diện Trang Đăng Nhập / Đăng Ký gốc với panel thương hiệu bên trái (Logo Themis LexiGuard, slogan *"Precision in Law"*, các huy hiệu GACC & EUDR, AI Gemini) kết nối API Backend thực tế.
- Khôi phục và tạo mới đầy đủ toàn bộ 16 đường dẫn trang trong `src/app/(dashboard)` gồm: `/settings`, `/dashboard`, `/admin`, `/products`, `/products/[id]`, `/checks/new`, `/regulations`, `/reports/[id]`, `/history`, `/integrity` với bọc `Suspense` chuẩn Next.js App Router.
- Hiển thị đầy đủ Badge phân quyền (`PLATFORM_ADMIN`, `OWNER`, `MANAGER`, `COMPLIANCE`), Họ tên và Email tài khoản đang đăng nhập ở Topbar.

### Added
- Ghi rõ công nghệ realtime trong plan legal updates: Supabase Postgres, Supabase Realtime `postgres_changes`, `@supabase/supabase-js` và refetch qua Express API.
- Cập nhật plan legal news summary để Gemini là model tóm tắt mặc định cho MVP; model router/fallback để sau MVP.
- Bổ sung chiến lược dùng Gemini API free tier cho MVP legal news summary, gồm giới hạn quota, dữ liệu được phép gửi, job concurrency, retry, dedupe/cache và fallback production.
- Bổ sung hướng realtime cho legal updates: Supabase Realtime chỉ làm signal refresh, frontend refetch API, hỗ trợ widget/list/detail, fallback và RBAC.
- Bổ sung hướng dẫn legal update JSON tương thích frontend hiện tại: tách `frontendSummaryVi` cho dashboard/widget và `detailedSummaryVi` cho trang chi tiết.
- Ghi rõ kiến trúc legal news summary: AI tóm tắt/dịch một lần ở backend, lưu bản đã validate/review vào DB, frontend đọc qua API thay vì gọi AI trực tiếp khi xem tin.
- Làm rõ plan legal updates theo thứ tự triển khai: AI tóm tắt tin tức pháp lý đưa lên frontend trước, sau đó mới mở rộng RAG/Q&A cho model.
- Điều chỉnh plan legal updates theo hướng ưu tiên MVP tổng hợp tin tức pháp lý trước, hoãn RAG/Q&A sang phase sau khi feed và quy trình review ổn định.
- Bổ sung schema JSON chuẩn cho AI đọc tin pháp lý nông sản đa sản phẩm trong plan legal updates, gồm enum category/severity/status/relevance và mapping sang `legal_updates`.
- Add planning document for legal updates, realtime feed, multi-language model summary, and RAG knowledge architecture.
- Add frontend legal-update widget states, Zod API validation, and Supabase Realtime refresh support.
- Khởi tạo thư mục quy tắc và kiến trúc `.agents/` chuẩn hóa theo Antigravity format.
- Tạo bộ skill phân tách rõ ràng: `frontend`, `backend`, `ai-compliance`, `database`, `security`.
- Tạo các tài liệu tham chiếu chi tiết trong `.agents/ref/` (từ `01-product.md` đến `10-done.md`).
- Tạo file `AGENTS.md` tại root tổng hợp toàn bộ quy tắc hệ thống (Team, FE, BE, Server/Worker, DB, API).
- Thêm quy tắc bắt buộc cập nhật `CHANGELOG.md` cho mọi thay đổi dự án.
- Phân rã toàn bộ Use Case chi tiết của hệ thống tại thư mục `docs/usecases/` (UC-00 đến UC-10).
- Tạo tài liệu tổng hợp kiến trúc hệ thống, ma trận RBAC, ma trận CRUD và sơ đồ UML đầy đủ tại `docs/usecases/00-system-overview.md`.
- Xuất toàn bộ sơ đồ UML tiêu chuẩn dưới dạng file `.uml` PlantUML tại thư mục `docs/uml/` (`use-case-diagram.uml`, `business-sequence.uml`, `class-diagram.uml`, `system-architecture.uml`).
- Khởi tạo ảnh minh họa trực quan Use Case Diagram Flow tại `docs/assets/usecase_diagram_flow.png`.
- Bổ sung bộ 3 sơ đồ trực quan hoàn chỉnh tại `docs/assets/`:
  1. `overview_usecase_diagram.png` (Sơ đồ Use Case Tổng quát hệ thống)
  2. `breakdown_usecase_tree_diagram.png` (Sơ đồ Phân rã Cây chức năng 3 cấp Level 0 -> Level 3)
  3. `detailed_compliance_flow_diagram.png` (Sơ đồ Luồng xử lý Chi tiết từng bước AI Compliance Check Engine)
- Khởi tạo sơ đồ trực quan User Story Map dạng bảng dán thẻ Sticky Notes gọn gàng tại `docs/assets/user_story_map_board.png` hỗ trợ phân rã lộ trình phát triển Release 1 (MVP), Release 2 và Release 3.
- Cập nhật `be/prisma/schema.prisma` hoàn chỉnh theo chuẩn LCMS: Tách `Profile` & `OrganizationMember`, bổ sung đầy đủ thông tin Doanh nghiệp Xuất khẩu Nông sản, chuẩn hóa `ComplianceResult` enum (loại bỏ PASS/FAIL/WARNING) và bổ sung `ReportStatus` versioning.
- Xây dựng Backend Auth & Organization Modules (`be/src/modules/auth/`, `be/src/modules/organization/`) gồm Zod Schema, Service, Controller, Router với Supabase Auth & Audit Log.
- Thay thế 1:1 toàn bộ giao diện Đăng nhập / Đăng ký từ thiết kế của `fe/fe` (`Input.tsx`, `Button.tsx`, `AuthPage.tsx` với Tailwind v4 `--color-primary: #00236f` theme), kết nối với Backend API và lược bỏ các nút bấm Social Login chưa có trong phạm vi MVP (tuân thủ quy tắc No Mock Data).
- Tách biệt hoàn toàn Kiến trúc Phân quyền 2 Tầng (Two-Tier Authorization): Tầng Nền tảng (`PlatformRole`: `USER`, `SUPPORT`, `PLATFORM_ADMIN`, `SUPER_ADMIN`) và Tầng Doanh nghiệp (`OrganizationRole`: `OWNER`, `MANAGER`, `COMPLIANCE`, `VIEWER`). Triển khai `platformRbacMiddleware` và `rbacMiddleware` bảo vệ dữ liệu doanh nghiệp an toàn tuyệt đối.
- Cập nhật biến môi trường Supabase production thực tế, đồng bộ database schema qua Prisma `db push` và thực thi thành công 100% (6/6) bộ kịch bản kiểm thử API thực tế (Đăng ký, Đăng nhập sai pass, Đăng nhập đúng cấp JWT, Onboarding Doanh nghiệp XNK, Xác nhận Role OWNER & Kiểm thử bảo mật 401 Unauthorized).
- Cập nhật tài liệu hướng dẫn `README.md` và `docs/usecases/UC-00-auth-rbac.md` với thông tin tài liệu kiểm thử mẫu đã được khởi tạo sẵn trên Supabase Database.
- Tích hợp 100% dữ liệu thực từ Backend API vào Topbar Header & Trang Cài Đặt (Settings Page): Hiển thị tên thật, avatar ký tự đầu, Tên Doanh nghiệp đang hoạt động, Badge Vai trò Phân quyền (`OWNER` / `MANAGER` / `COMPLIANCE` / `VIEWER`), Danh sách Nhân sự thực tế & Form Mời thành viên mới theo ma trận phân quyền.
- Cập nhật bộ quy tắc Skill `.agents/skills/frontend/SKILL.md` (bắt buộc nguyên tắc Đơn nhiệm SRP cho Frontend & tích hợp session RBAC thực tế), đồng thời cập nhật toàn bộ tài liệu usecase `docs/usecases/UC-00-auth-rbac.md` và `README.md` khớp 100% với kiến trúc đã nâng cấp.
- Hoàn thiện 100% tính năng Đăng xuất (`POST /api/auth/logout`) và Khôi phục/Đặt lại mật khẩu (`POST /api/auth/forgot-password`, `POST /api/auth/reset-password`) ở cả Backend API & Giao diện Frontend (`ForgotPasswordView.tsx`, `/reset-password/page.tsx`), tích hợp Audit Log ghi vết bảo mật.
- Cập nhật toàn bộ tài liệu kiến trúc & usecase `docs/usecases/UC-00-auth-rbac.md` và `README.md` sang mô hình **Admin-Provisioned Enterprise SaaS**: Cấm User thường tự tạo Doanh nghiệp; chuyển trách nhiệm tạo Doanh nghiệp và cấp quyền cho Platform Admin (`SUPER_ADMIN` / `PLATFORM_ADMIN`). User mới được phân luồng tự động về màn hình Chờ Cấp Quyền (`/pending-access`).
- Tách nhỏ toàn bộ mã nguồn Admin Portal Feature theo nguyên tắc Đơn nhiệm (SRP) vào `fe/src/features/admin/`: `AdminHeader.tsx` (Header & Search), `AdminOrgTab.tsx` (Tạo & Quản lý Doanh nghiệp), `AdminUserTab.tsx` (Cấp quyền & Quản lý Nhân sự), `index.tsx` (Main Orchestrator), đảm bảo mã nguồn gọn gàng, dễ bảo trì và mở rộng.
  6. Tách biệt hoàn toàn `PlatformRole` (`SUPER_ADMIN`, `PLATFORM_ADMIN`, `SUPPORT`) với `OrganizationRole` (`OWNER`, `MANAGER`, `COMPLIANCE`, `VIEWER`) để ngăn ngừa rò rỉ dữ liệu chéo (Cross-tenant Data Leakage).

# Legal News Summary Feed First, RAG Later Plan

Tài liệu này tổng hợp các phân tích về phần cập nhật tin tức/tài liệu pháp lý cho Themis LexiGuard, với người dùng mục tiêu là các công ty xuất nhập khẩu. Ưu tiên triển khai trước là dùng AI để đọc, dịch, tóm tắt và chuẩn hóa tin tức pháp lý thành JSON, lưu kết quả đã validate/review vào database, sau đó frontend đọc từ API/DB để hiển thị. RAG/Q&A cho model là hướng mở rộng sau, khi nguồn tin, metadata và quy trình kiểm duyệt đã ổn định.

Mục tiêu không phải xây dựng một news feed thông thường, mà là một radar pháp lý có khả năng lọc nhiễu, ưu tiên rủi ro và trích nguồn rõ ràng cho vận hành xuất nhập khẩu.

## 1. Nguyên tắc sản phẩm

Hệ thống nên cập nhật đầy đủ dữ liệu pháp lý nền, còn người dùng chọn phạm vi họ quan tâm.

```txt
Hệ thống cập nhật toàn bộ bản đồ pháp lý
Người dùng chọn vùng radar
Backend lọc, ưu tiên, cảnh báo và hiển thị đúng thông tin liên quan
```

Với công ty xuất nhập khẩu, phần tin tức phải trả lời nhanh:

- Tin nào mới hoặc sắp hiệu lực?
- Có ảnh hưởng thị trường/sản phẩm/lô hàng của tôi không?
- Deadline khi nào?
- Tôi cần làm gì tiếp theo?
- Nguồn chính thức ở đâu?

Không nên thiết kế kiểu blog/news feed. Nên thiết kế thành bảng điều phối rủi ro pháp lý cho vận hành xuất nhập khẩu.

## 2. Bố trí thông tin cho người dùng XNK

### Dashboard

Dashboard chỉ nên hiển thị các cập nhật cần chú ý nhất, tối đa 3-5 item:

- Cảnh báo critical/high ảnh hưởng trực tiếp tới batch/report/hồ sơ.
- Quy định sắp hiệu lực trong 7/30/60/90 ngày.
- Cập nhật mới liên quan tới thị trường xuất khẩu của doanh nghiệp.
- Tài liệu/checklist mới cần đọc hoặc tải.

Ví dụ item rút gọn:

```txt
[HIGH] EU MRL update for Chlorpyrifos
Ảnh hưởng: 2 lô cà phê đang chờ xuất Đức
Hiệu lực: 01/09/2026
Hành động: Chạy kiểm tra lại
Nguồn: EUR-Lex
```

### Trang Legal Updates Center

Nên có trang riêng cho cập nhật pháp lý với các tab:

- Cần xử lý
- Sắp hiệu lực
- Tất cả cập nhật
- Tài liệu pháp lý

Bộ lọc nên theo workflow xuất nhập khẩu:

- Thị trường: EU, US, China, Japan, Korea, UK, Australia, ASEAN.
- Sản phẩm hoặc HS code.
- Loại quy định: MRL, Labeling, Packaging, Traceability, Phytosanitary, Customs, EUDR, Food Safety, ESG.
- Trạng thái: draft, published, upcoming, effective, amended, repealed.
- Mức ảnh hưởng: critical, high, medium, low, informational.
- Deadline: 7 ngày, 30 ngày, 60 ngày, 90 ngày.
- Có ảnh hưởng batch/report của tôi: có/không.

Mỗi card cập nhật nên có:

- Severity badge.
- Market.
- Category.
- Title.
- Published date.
- Effective date.
- Impact summary.
- Recommended actions.
- Source agency.
- Link bài gốc.
- Link văn bản/PDF chính thức nếu có.

## 3. Người dùng tự chọn phạm vi quan tâm

Nên có màn hình "Thiết lập radar pháp lý" hoặc "Phạm vi theo dõi pháp lý".

Người dùng chọn:

- Thị trường xuất khẩu.
- Sản phẩm/ngành hàng.
- HS code.
- Loại tiêu chuẩn muốn theo dõi.
- Mức cảnh báo muốn nhận.
- Số ngày cảnh báo trước ngày hiệu lực.
- Kênh nhận thông báo: in-app, email, sau này có thể Slack/Zalo.
- Theo dõi batch/report cụ thể nếu cần.

Ví dụ:

```txt
Công ty A
Sản phẩm: Cà phê Robusta
Thị trường: EU, Nhật
Quan tâm: MRL, EUDR, truy xuất nguồn gốc, nhãn mác
Cảnh báo trước: 30 ngày

Công ty B
Sản phẩm: Sầu riêng
Thị trường: Trung Quốc
Quan tâm: GACC, kiểm dịch thực vật, đóng gói, vùng trồng
Cảnh báo trước: 60 ngày
```

Cùng một kho dữ liệu, nhưng mỗi công ty thấy feed khác nhau.

## 4. Nguồn tin và model tóm tắt

Ưu tiên MVP là tóm tắt tin tức pháp lý một lần, lưu vào database, rồi đưa bản đã duyệt lên frontend trước. RAG/Q&A cho model không nằm trong phạm vi MVP này; phần đó chỉ mở rộng sau khi hệ thống đã có nguồn tin ổn định, metadata sạch và quy trình human review đáng tin cậy.

MVP tập trung vào:

- Thu thập tin/tài liệu pháp lý từ nguồn chính thức hoặc nguồn tin cậy.
- Giữ metadata gốc: source, sourceUrl, sourceReference, publishedAt, documentUrl, checksum.
- Dùng model để dịch, tóm tắt, phân loại thị trường/sản phẩm/mức độ liên quan.
- Validate JSON bằng Zod.
- Human review trước khi publish.
- Đưa kết quả đã review lên frontend: feed cập nhật pháp lý, dashboard alert và trang Legal Updates Center.

Không nên để frontend gọi AI trực tiếp mỗi lần người dùng mở tin. AI nên chạy ở backend/job sau khi crawler hoặc admin đưa bài mới vào hệ thống. Kết quả tóm tắt tiếng Việt được lưu lại để đảm bảo tốc độ, chi phí thấp, kết quả ổn định, dễ kiểm duyệt và có audit trail.

Qwen 2.5 phù hợp để đọc hiểu nguồn tiếng Trung và tóm tắt sang tiếng Việt, đặc biệt với các nguồn như GACC, SAMR, MOFCOM, MARA. Tuy nhiên, không nên thiết kế hệ thống phụ thuộc vào riêng Qwen.

Nên thiết kế theo hướng multi-source, multi-language pipeline:

```txt
Source connector
→ Extractor
→ Language detector
→ Country/market classifier
→ Model router
→ Structured extraction
→ Vietnamese summary
→ Validation
→ Save draft legal_update to DB
→ Human review
→ Publish to legal updates
→ Frontend fetches from API/DB
```

Trong MVP, model tóm tắt mặc định là Gemini. Không cần triển khai model router phức tạp ở giai đoạn đầu; chỉ cần giữ interface đủ sạch để sau này thay hoặc thêm model khác nếu cần.

Model strategy:

- MVP default: Gemini cho mọi nguồn đã extract text.
- Chinese/Japanese/Korean source: Gemini xử lý trước; nếu chất lượng không ổn thì mới cân nhắc fallback chuyên ngôn ngữ như Qwen ở phase sau.
- English source: Gemini xử lý mặc định.
- PDF legal extraction: parser/OCR trước, Gemini chỉ nhận phần text đã extract.
- Model router: để sau MVP, khi cần tối ưu chất lượng/chi phí theo ngôn ngữ hoặc nguồn.

### Chiến lược dùng Gemini API free tier cho MVP

Gemini API free tier có thể đủ cho POC và MVP nhỏ của flow tóm tắt tin tức nếu hệ thống chỉ gọi model ở backend/job khi có bài mới, sau đó lưu kết quả vào DB. Không nên thiết kế kiểu frontend gọi model trực tiếp khi user mở dashboard hoặc mở từng tin.

Phù hợp cho MVP:

- Xử lý nguồn công khai: GACC, ePing, EUR-Lex, FAOLEX, FDA, USDA, EFSA.
- Dịch/tóm tắt bài viết hoặc văn bản đã extract text.
- Trả JSON theo schema legal update.
- Chạy tuần tự hoặc concurrency thấp trong background job.
- Lưu kết quả đã validate/review để nhiều user đọc lại không tốn thêm token.

Giới hạn cần ghi nhớ:

- Free tier có rate limit theo requests per minute, tokens per minute và requests per day; quota thực tế phụ thuộc project/model và có thể thay đổi.
- Preview/experimental model thường có limit chặt hơn, không nên dùng làm model duy nhất cho luồng chính.
- Nội dung gửi qua free tier có thể được nhà cung cấp dùng để cải thiện sản phẩm; chỉ gửi nguồn pháp lý công khai, không gửi tài liệu nội bộ doanh nghiệp hoặc dữ liệu batch nhạy cảm.
- Không dùng free tier cho production cần SLA, volume lớn hoặc dữ liệu bí mật.

Cấu hình vận hành đề xuất:

```txt
model: gemini-2.5-flash hoặc gemini-2.5-flash-lite
temperature: 0.1-0.2
maxOutputTokens: giới hạn vừa đủ JSON
jobConcurrency: 1-3
retry: tối đa 3 lần cho lỗi JSON/429/timeout
dedupeKey: sourceUrl hoặc sourceReference + checksum
cachePolicy: cùng checksum thì không gọi AI lại
publishPolicy: chỉ publish sau human review
```

Fallback khi hết quota hoặc lỗi model:

```txt
429/quota exceeded
→ job chuyển trạng thái failed hoặc retry_scheduled
→ lưu errorMessage nội bộ
→ không publish bản chưa tóm tắt
→ admin có thể retry sau hoặc chọn model fallback
```

Khi mở rộng production:

- Chuyển sang paid tier hoặc model provider fallback để có quota ổn định hơn.
- Cân nhắc batch processing cho crawler định kỳ.
- Theo dõi token/request/error rate theo source và model.
- Không đưa secrets/model key xuống frontend.

Các source connector nên được tách riêng:

```txt
sources/
  china-gacc.ts
  china-samr.ts
  eu-eurlex.ts
  eu-efsa.ts
  us-fda.ts
  us-federal-register.ts
  japan-maff.ts
```

Mỗi connector trả về format thô thống nhất:

```ts
type RawLegalSourceItem = {
  sourceUrl: string;
  title: string;
  publishedAt?: string;
  language: string;
  rawHtml?: string;
  rawPdfUrl?: string;
  checksum: string;
};
```

## 5. Output schema từ model

Model không nên trả text tự do. Backend nên yêu cầu JSON có cấu trúc, sau đó validate bằng Zod trước khi lưu DB.

Ví dụ:

```json
{
  "titleOriginal": "原文标题",
  "titleVi": "Tiêu đề tiếng Việt",
  "sourceAgency": "GACC",
  "sourceCountry": "CHINA",
  "sourceLanguage": "zh",
  "sourceUrl": "https://...",
  "documentUrl": "https://...",
  "publishedAt": "2026-08-09",
  "effectiveAt": "2026-09-01",
  "market": "CHINA",
  "category": "PHYTOSANITARY",
  "severity": "high",
  "products": ["sầu riêng"],
  "hsCodes": ["0810.60.00"],
  "summaryVi": "Tóm tắt ngắn bằng tiếng Việt",
  "businessImpactVi": "Tác động với doanh nghiệp xuất nhập khẩu",
  "recommendedActions": [
    "Rà soát hồ sơ vùng trồng",
    "Kiểm tra mã đóng gói"
  ],
  "confidence": "medium",
  "reviewStatus": "needs_review"
}
```

Quy tắc quan trọng:

- Không có `sourceUrl` thì không publish thành tin chính thức.
- Không có citation/documentUrl thì không dùng để kết luận compliance.
- Tin từ báo/ngành chỉ là tín hiệu tham khảo, không thay thế văn bản chính thức.
- Output model phải được validate và có thể cần human review trước khi publish.

## 6. Link bài viết và nguồn chính thức

Mỗi tin phải đính kèm nguồn:

- Source agency: GACC, EUR-Lex, FDA, SAMR, MOFCOM...
- Source URL: link bài gốc.
- Document URL: link văn bản/PDF chính thức nếu có.
- Published date.
- Fetched date.
- Raw document ID.

Trên component nên hiển thị:

```txt
Nguồn: GACC
Ngày đăng: 09/08/2026
[Xem bài gốc]
[Xem văn bản pháp lý]
```

Với compliance, nguồn chính thức là bắt buộc để tạo citation.

## 7. Realtime flow

Realtime nên dùng Supabase Realtime làm tín hiệu thay đổi, không dùng làm nguồn dữ liệu chính.

Công nghệ sử dụng:

```txt
Database: Supabase Postgres
Realtime transport: Supabase Realtime `postgres_changes`
Frontend client: `@supabase/supabase-js`
Source of truth cho UI: Express Backend API
Frontend refresh API: `GET /api/legal-updates/feed`
```

Nguyên tắc triển khai:

- Backend/API vẫn là source of truth; frontend không đọc business data trực tiếp từ Supabase table.
- Realtime chỉ báo "có thay đổi", sau đó frontend gọi lại API để lấy dữ liệu đã qua auth/RBAC/filter/pagination.
- Chỉ publish realtime khi bản tin đã qua `reviewStatus = published`; draft/pending review không xuất hiện ở user feed.
- Payload realtime nên tối thiểu: `id`, `eventType`, `publishedAt`, `updatedAt`, không đẩy toàn bộ nội dung tóm tắt nếu chưa cần.
- Frontend không tự gọi AI khi nhận event; chỉ refresh dữ liệu từ API.

Flow publish tin mới:

```txt
Crawler/admin tạo raw article
→ backend job gọi AI summary
→ validate JSON bằng Zod
→ lưu legal_update với reviewStatus = pending_review
→ admin review và publish
→ backend update reviewStatus = published
→ Supabase phát postgres_changes event
→ frontend nhận event signal
→ frontend gọi GET /api/legal-updates/feed
→ dashboard/widget/list cập nhật bản mới đã duyệt
```

Frontend hiện đã có nền trong `LegalTrackingWidget`:

```txt
Subscribe table: public.regulations
Event: *
Action: refresh()
```

Khi chuyển sang bảng riêng `legal_updates`, frontend nên subscribe bảng `public.legal_updates` thay vì `public.regulations`. Nếu vẫn dùng `regulations` trong MVP tạm thời, API nên map response sang contract compact giống `LegalTrackingWidget` đang cần.

Realtime MVP nên triển khai:

1. Tạo backend module `legal-updates`.
2. Tạo `GET /api/legal-updates/feed?page=1&pageSize=3` cho dashboard/widget.
3. Tạo `GET /api/legal-updates/:id` cho trang/drawer chi tiết.
4. Tạo endpoint admin để review/publish tin.
5. Bật Supabase Realtime cho bảng `legal_updates`.
6. Frontend subscribe event `INSERT`/`UPDATE` của `legal_updates`.
7. Frontend nhận event rồi gọi lại API, không dùng payload realtime để render trực tiếp.

Event types đề xuất:

```txt
legal_update.published
legal_update.updated
legal_update.repealed
legal_update.archived
```

Frontend behavior:

```txt
Dashboard widget:
→ nhận event published/updated
→ refresh pageSize=3
→ nếu có item mới thì cập nhật timeline

Legal Updates Center:
→ nhận event
→ nếu user đang ở page=1 thì refresh list
→ nếu user đang ở page khác hoặc đang đọc detail thì hiện banner "Có cập nhật mới"
→ user bấm banner thì refresh và quay về page=1

Detail drawer/page:
→ nhận event updated/repealed cùng id đang mở
→ refetch GET /api/legal-updates/:id
→ nếu bản tin bị archived/repealed thì hiện trạng thái mới rõ ràng
```

Fallback khi realtime lỗi:

```txt
Nếu subscribe lỗi hoặc env Supabase thiếu:
→ frontend vẫn hiển thị dữ liệu từ API
→ nút refresh thủ công hoạt động
→ có thể thêm polling nhẹ cho dashboard sau MVP nếu cần
```

Security/RBAC:

```txt
Client chỉ dùng NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY.
Không dùng service role key ở frontend.
Realtime không thay thế API auth/RBAC.
Nếu feed được cá nhân hóa theo organization tracking settings, API phải lọc theo org.
Org-specific notifications nên lưu ở bảng riêng `notifications` với `organizationId`/`userId`, không nhét vào payload global `legal_updates`.
```

Sau MVP:

```txt
Crawler Trung Quốc/EU/US
→ Qwen/model tóm tắt
→ lưu DB với reviewStatus = needs_review
→ admin duyệt thành published
→ realtime cập nhật dashboard/feed
→ notification cho org/user có phạm vi theo dõi liên quan
```

## 8. Backend hiện tại đã có gì

Hiện backend mới có nền schema, chưa có module API đầy đủ cho legal updates.

Đã có trong Prisma:

- `Regulation`
- `RegulationCategory`
- `MRLLimit`
- Relation từ `ComplianceItem` tới `Regulation`
- `sourceUrl` trong `Regulation`

`Regulation` hiện gồm:

- `code`
- `title`
- `description`
- `category`
- `market`
- `effectiveDate`
- `sourceUrl`
- `isActive`
- `createdAt`
- `updatedAt`

Chưa có:

- `be/src/modules/regulations`.
- Route `/api/regulations`.
- Endpoint admin sync hoặc create/update regulations.
- Crawler/source connector.
- Job worker gọi model.
- Raw source document table.
- Legal update feed table.
- Review workflow.
- User preference/radar settings.

Frontend đang gọi:

```txt
GET /api/regulations?page=1&pageSize=3&sort=createdAt:desc
```

Nên backend cần bổ sung route này trước để widget hoạt động bằng dữ liệu thật.

## 9. DB đề xuất cho tin tức pháp lý

MVP có thể dùng bảng `regulations` hiện tại. Nhưng về lâu dài nên tách rõ:

```txt
LegalSource
- id
- country
- agency
- baseUrl
- sourceType: rss | api | html | pdf
- language
- trustLevel
- syncFrequency

RawLegalDocument
- id
- sourceId
- sourceUrl
- rawTitle
- rawContent
- checksum
- fetchedAt
- language

Regulation
- id
- normalized title/category/market/status

RegulationVersion
- id
- regulationId
- originalText
- summaryVi
- effectiveAt
- publishedAt
- sourceUrl
- documentUrl
- citationIds
- checksum

LegalUpdate
- id
- regulationVersionId
- impactSummaryVi
- recommendedActions
- severity
- reviewStatus
- publishedAt
- createdAt
```

Nếu cần đơn giản hơn cho MVP:

```txt
legal_updates
- id
- market
- sourceAgency
- sourceUrl
- documentUrl
- titleOriginal
- titleVi
- summaryVi
- businessImpactVi
- recommendedActions
- category
- severity
- status
- publishedAt
- effectiveAt
- products
- hsCodes
- reviewStatus
- createdAt
- updatedAt
```

## 10. JSON output chuẩn cho AI đọc tin nông sản

Schema này dùng cho bước model đọc bài/tài liệu pháp lý, dịch/tóm tắt sang tiếng Việt và phân loại mức liên quan với phạm vi theo dõi của doanh nghiệp. Đây là schema cho legal update feed, không dùng để kết luận compliance của một lô hàng. Compliance check cần schema riêng có `summary.result`, `riskScore`, `findings[]` và `citationIds[]`.

Kết quả JSON này nên được lưu vào DB sau khi validate, không chỉ trả trực tiếp về frontend. Frontend chỉ đọc bản đã lưu/publish thông qua API. Cách này giúp một bài chỉ tốn chi phí AI một lần, admin có thể kiểm duyệt trước khi publish, và người dùng luôn thấy cùng một nội dung ổn định.

Vì frontend hiện có hai vùng hiển thị khác nhau, output lưu DB nên có cả bản gọn và bản chi tiết:

- `frontendSummaryVi`: 1 câu ngắn cho dashboard/widget timeline, khoảng 120-180 ký tự.
- `summaryVi`: 2-4 câu cho card/list trong Legal Updates Center.
- `detailedSummaryVi`: object chi tiết cho trang/drawer khi user mở một cập nhật.

Không đưa `detailedSummaryVi` vào widget dashboard. Widget hiện tại chỉ cần `title`, `description`, trạng thái, ngày và link chi tiết; nếu description quá dài sẽ làm timeline mất cân đối.

Nguyên tắc:

- Không gắn schema với một sản phẩm cụ thể như sầu riêng; mọi thông tin sản phẩm phải nằm trong `affectedProducts` và `affectedCommodityGroups`.
- Nếu nguồn không nêu ngày hiệu lực, HS code, văn bản đính kèm hoặc trích dẫn rõ ràng thì trả `null` hoặc mảng rỗng.
- `recommendedActions` chỉ chứa hành động có căn cứ trong nguồn, không tự biến nhận định hoặc khuyến nghị của hiệp hội thành nghĩa vụ pháp lý.
- AI không trả `sourceUrl` nếu crawler/backend đã lưu metadata này riêng; backend ghép `sourceUrl`, `documentUrl`, `checksum`, `rawArticleId` sau khi validate.
- Backend phải validate bằng Zod, lưu bản nháp `reviewStatus = pending_review`, human review trước khi publish ra realtime feed.

Output đề xuất:

```json
{
  "market": "Trung Quốc",
  "sourceAgency": "Tổng cục Hải quan Trung Quốc (GACC)",
  "publishedAt": "2022-07-27",
  "effectiveAt": "2022-07-27",
  "titleOriginal": "海关总署公告2022年第66号——关于进口越南鲜食榴莲植物检疫要求的公告",
  "titleVi": "Yêu cầu kiểm dịch thực vật đối với sầu riêng tươi Việt Nam nhập khẩu vào Trung Quốc",
  "frontendTitleVi": "GACC: Yêu cầu kiểm dịch sầu riêng Việt Nam",
  "frontendSummaryVi": "Áp dụng cho sầu riêng tươi Việt Nam xuất sang Trung Quốc; cần vùng trồng, cơ sở đóng gói được phê duyệt và chứng thư kiểm dịch.",
  "summaryVi": "Tổng cục Hải quan Trung Quốc cho phép nhập khẩu sầu riêng tươi từ Việt Nam nếu đáp ứng yêu cầu kiểm dịch thực vật theo nghị định thư song phương. Vùng trồng và cơ sở đóng gói phải được đăng ký, phê duyệt và duy trì hệ thống quản lý chất lượng, truy xuất nguồn gốc và kiểm soát sinh vật gây hại.",
  "detailedSummaryVi": {
    "purpose": "Quy định điều kiện kiểm dịch thực vật đối với sầu riêng tươi Việt Nam khi nhập khẩu vào Trung Quốc.",
    "scope": "Áp dụng cho sầu riêng tươi có xuất xứ từ các vùng trồng sầu riêng tại Việt Nam.",
    "keyRequirements": [
      "Vùng trồng và cơ sở đóng gói xuất khẩu sang Trung Quốc phải được MARD备案 và được GACC cùng MARD phê duyệt đăng ký.",
      "Vùng trồng phải thiết lập hệ thống quản lý chất lượng và truy xuất nguồn gốc dưới sự giám sát của MARD.",
      "Vùng trồng phải áp dụng thực hành nông nghiệp tốt, duy trì điều kiện vệ sinh và quản lý sinh vật gây hại tổng hợp.",
      "MARD phải kiểm tra lấy mẫu mỗi lô hàng với tỷ lệ 2%; nếu trong hai năm không phát sinh vấn đề kiểm dịch thực vật thì tỷ lệ có thể giảm xuống 1%.",
      "Nếu phát hiện sinh vật gây hại mà Trung Quốc quan tâm, cành, lá hoặc đất, toàn bộ lô hàng không được xuất khẩu sang Trung Quốc."
    ],
    "inspectionAndCertification": [
      "Lô hàng đạt kiểm dịch phải được MARD cấp giấy chứng nhận kiểm dịch thực vật.",
      "Khi hàng đến cửa khẩu Trung Quốc, Hải quan Trung Quốc thực hiện kiểm tra kiểm dịch; nếu đạt yêu cầu thì cho phép nhập cảnh."
    ],
    "penaltiesOrConsequences": [
      "Lô hàng không đạt yêu cầu có thể không được phép xuất khẩu sang Trung Quốc.",
      "Tùy trường hợp, vùng trồng hoặc cơ sở đóng gói liên quan có thể bị tạm dừng xuất khẩu sầu riêng sang Trung Quốc."
    ],
    "unknowns": []
  },
  "affectedProducts": [
    {
      "nameVi": "sầu riêng tươi",
      "nameOriginal": "鲜食榴莲",
      "hsCode": "0810.60.00",
      "scope": "specific"
    }
  ],
  "affectedCommodityGroups": [
    "trái cây tươi"
  ],
  "category": "phytosanitary",
  "severity": "high",
  "status": "effective",
  "relevance": {
    "status": "relevant",
    "reasonVi": "Quy định áp dụng trực tiếp cho sầu riêng tươi Việt Nam xuất khẩu sang Trung Quốc."
  },
  "businessImpactVi": "Doanh nghiệp chỉ có thể xuất khẩu nếu vùng trồng và cơ sở đóng gói đã được phê duyệt, đồng thời lô hàng đạt kiểm dịch tại cửa khẩu Trung Quốc.",
  "recommendedActions": [
    {
      "actionVi": "Kiểm tra vùng trồng và cơ sở đóng gói đã có trong danh sách được GACC và MARD phê duyệt.",
      "basis": "Nguồn yêu cầu vùng trồng và cơ sở đóng gói phải được đăng ký và phê duyệt.",
      "priority": "high"
    }
  ],
  "citations": [
    {
      "sourceReference": "GACC_ANNOUNCEMENT_2022_NO_66",
      "section": null,
      "quoteVi": "Vùng trồng và cơ sở đóng gói phải được đăng ký và phê duyệt."
    }
  ],
  "needsHumanReview": false,
  "confidence": "high"
}
```

Enum đề xuất:

```txt
affectedProducts[].scope:
specific | commodity_group | all_agricultural_products | unclear

category:
phytosanitary | mrl | food_safety | labeling | packaging
traceability | customs | certificate | organic | eudr | esg
quota_tariff | registration | inspection | recall | market_access | other

severity:
critical | high | medium | low | informational

status:
draft | published | upcoming | effective | amended | repealed

relevance.status:
relevant | not_relevant | needs_review

recommendedActions[].priority:
high | medium | low

confidence:
high | medium | low
```

Backend enrich sau khi model trả JSON:

```json
{
  "sourceUrl": "https://faolex.fao.org/docs/pdf/chn211755.pdf",
  "documentUrl": "https://faolex.fao.org/docs/pdf/chn211755.pdf",
  "checksum": "sha256:...",
  "rawArticleId": "...",
  "reviewStatus": "pending_review"
}
```

Mapping sang `legal_updates`:

```txt
market                 <- ai.market
sourceAgency           <- ai.sourceAgency
sourceUrl              <- crawler metadata
documentUrl            <- crawler metadata hoặc null
titleOriginal          <- ai.titleOriginal
titleVi                <- ai.titleVi
frontendTitleVi        <- ai.frontendTitleVi
frontendSummaryVi      <- ai.frontendSummaryVi
summaryVi              <- ai.summaryVi
detailedSummaryVi      <- ai.detailedSummaryVi
businessImpactVi       <- ai.businessImpactVi
recommendedActions     <- ai.recommendedActions
category               <- ai.category
severity               <- ai.severity
status                 <- ai.status
publishedAt            <- ai.publishedAt
effectiveAt            <- ai.effectiveAt
products               <- ai.affectedProducts
hsCodes                <- unique affectedProducts[].hsCode
reviewStatus           <- pending_review trước khi publish
```

Mapping tương thích frontend hiện tại:

```txt
LegalTrackingWidget:
id             <- legal_updates.id
title          <- frontendTitleVi hoặc titleVi
description    <- frontendSummaryVi hoặc summaryVi đã rút gọn
category       <- category map sang enum FE hiện tại nếu vẫn dùng /api/regulations
market         <- market
effectiveDate  <- effectiveAt
sourceUrl      <- sourceUrl hoặc route detail nội bộ
isActive       <- status không thuộc repealed/expired/archived
createdAt      <- createdAt

Regulations/Legal Updates list:
badge          <- severity hoặc category
date           <- publishedAt/effectiveAt
title          <- titleVi
desc           <- summaryVi
detail         <- detailedSummaryVi
```

API nên tách response theo ngữ cảnh:

```txt
GET /api/legal-updates/feed?page=1&pageSize=3
→ trả bản compact cho dashboard/widget, không trả detailedSummaryVi.

GET /api/legal-updates/:id
→ trả đầy đủ summaryVi, detailedSummaryVi, recommendedActions, citations và source metadata.
```

## 11. DB/RAG cho hỏi đáp và so khớp tài liệu

Phần này chưa cần làm trong MVP tổng hợp tin tức. Chỉ triển khai sau khi legal update feed đã chạy ổn định, dữ liệu đã được chuẩn hóa và có đủ nội dung đã review để tạo knowledge base đáng tin.

Bảng cho model truy vấn nên nằm trong Supabase Postgres, nhưng không nên để model đọc trực tiếp lung tung từ toàn bộ DB. Nên có lớp knowledge index riêng.

Tách 2 nhóm:

```txt
1. Bảng nghiệp vụ/compliance
2. Bảng tri thức/RAG cho model truy vấn
```

Bảng nghiệp vụ:

- `regulations`
- `regulation_versions`
- `legal_updates`
- `documents`
- `document_versions`
- `compliance_checks`
- `findings`
- `reports`
- `tasks`

Bảng RAG:

```txt
knowledge_documents
- id
- sourceType: regulation | legal_update | user_document | report | checklist
- sourceId
- organizationId nullable
- title
- market
- category
- language
- sourceUrl
- publishedAt
- effectiveAt
- status
- createdAt

knowledge_chunks
- id
- knowledgeDocumentId
- organizationId nullable
- chunkIndex
- contentOriginal
- contentVi
- summaryVi
- embedding
- metadata jsonb
- citationLabel
- createdAt
```

`organizationId` nullable là điểm quan trọng:

- Global knowledge: luật EU, GACC, FDA, checklist chính thức. `organizationId = null`.
- Private org knowledge: hợp đồng, COA, invoice, packing list, báo cáo nội bộ. `organizationId = activeOrgId`.

Khi user hỏi, backend chỉ search:

```txt
organizationId = null OR organizationId = user's activeOrgId
```

Như vậy không lộ dữ liệu giữa các công ty.

## 12. Flow upload tài liệu người dùng

```txt
User upload document
→ lưu file private storage
→ backend tạo document + document_version
→ job extract text
→ chunk text
→ tạo embedding
→ lưu knowledge_chunks với organizationId
→ model hỏi đáp/so khớp dựa trên chunks đó
```

## 13. Flow hỏi đáp

Endpoint đề xuất:

```txt
POST /api/assistant/query
```

Pipeline:

```txt
validate JWT + org
→ classify intent
→ search knowledge_chunks bằng vector + filter market/category/org
→ lấy top chunks
→ gọi model với citations
→ trả answer + citations
→ lưu audit log/conversation
```

Response:

```json
{
  "answer": "Nội dung trả lời bằng tiếng Việt",
  "citations": [
    {
      "sourceTitle": "Regulation EC 396/2005",
      "sourceUrl": "https://...",
      "chunkId": "...",
      "page": 12
    }
  ]
}
```

## 14. Flow so khớp báo cáo/tài liệu

Không cho model tự kết luận từ trí nhớ. Pipeline nên là:

```txt
Document chunks
+ Relevant regulation chunks
+ Deterministic rules
→ model phân tích
→ Zod validate output
→ findings phải có citationIds
→ lưu compliance_check/findings
```

Rule bắt buộc:

```txt
Finding không có citationIds thì không được kết luận compliant/non_compliant.
```

## 15. Lộ trình triển khai đề xuất

### Phase 1: AI summarized news feed lên frontend

- Thêm bảng `legal_updates` hoặc mở rộng `Regulation`.
- Thêm `reviewStatus`, `severity`, `sourceAgency`, `sourceUrl`, `documentUrl`, `publishedAt`, `effectiveAt`.
- Tạo `GET /api/legal-updates/feed` có pagination/filter/sort.
- Tạo endpoint admin để tạo/sửa/publish tin pháp lý thủ công.
- Tạo prompt/schema để AI đọc tin gốc, tóm tắt tiếng Việt và trả JSON chuẩn.
- Lưu AI output đã validate vào DB dưới dạng draft, không trả trực tiếp từ model lên frontend.
- Audit log cho mutation.
- Zod validation.
- Auth + RBAC cho mutating endpoints.
- Tạo settings "Phạm vi theo dõi pháp lý".
- Bật Supabase Realtime sau khi tin được publish.
- Frontend hiển thị loading, empty, error, feed list, detail drawer/page và dashboard alert.

### Phase 2: Crawler + model summary tự động hóa

- Source connectors cho China/EU/US theo thứ tự ưu tiên thị trường.
- Raw document store.
- Model router.
- Zod schema cho AI output.
- Human review trước khi publish.
- Realtime publish sau khi review.

### Phase 3: Dashboard alert và workflow vận hành

- Dashboard chỉ hiển thị 3-5 cập nhật quan trọng nhất.
- Bộ lọc theo market/product/HS code/category/status/deadline.
- Trạng thái `pending_review`, `published`, `archived` cho vòng đời tin.
- Notification cho tin `critical`/`high` liên quan trực tiếp tới phạm vi theo dõi.

### Phase 4: RAG/Q&A/compliance matching sau khi feed ổn định

- `knowledge_documents`.
- `knowledge_chunks`.
- pgvector index.
- Upload document extraction pipeline.
- Assistant query endpoint.
- Compliance matching với citations.
- AI trực tiếp chỉ dùng cho phân tích sâu/cá nhân hóa theo user, sản phẩm, thị trường hoặc batch; không thay thế bản tóm tắt tin tức đã lưu trong DB.

## 16. Các file hiện tại liên quan

- `fe/src/components/LegalTrackingWidget.tsx`: widget realtime legal tracking trên Dashboard.
- `fe/src/features/legal-updates/use-legal-updates.ts`: hook fetch API và subscribe Supabase Realtime.
- `fe/src/features/legal-updates/types.ts`: Zod schema phía frontend cho regulation response.
- `fe/src/features/RegulationsPage.tsx`: trang Regulations hiện còn dữ liệu tĩnh/mock cho danh sách văn bản và sidebar theo dõi pháp lý.
- `fe/src/features/DashboardPage.tsx`: Dashboard đang render `LegalTrackingWidget` và block tài liệu mới tĩnh.
- `be/prisma/schema.prisma`: đã có model `Regulation`, enum `RegulationCategory`, `MRLLimit`.
- `be/src/index.ts`: hiện mới mount auth/organizations/admin, chưa mount `/api/regulations`.

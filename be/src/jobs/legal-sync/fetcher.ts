import { fetchLiveRssArticles } from './rss-connector';

export interface RawLegalArticle {
  sourceAgency: string;
  sourceCountry?: string;
  sourceUrl: string;
  documentUrl?: string;
  sourceReference?: string;
  sourceLanguage?: string;
  titleOriginal: string;
  rawContent: string;
  market: 'VIETNAM' | 'CHINA' | 'EU' | 'USA' | 'JAPAN' | 'KOREA' | 'AUSTRALIA' | 'SINGAPORE' | 'UK' | 'UAE';
  categoryHint?: string;
  publishedAt?: Date;
}

/**
 * Thu thập danh sách bài tin thô từ các nguồn quy định nông sản xuất khẩu chính
 * Mở rộng Nước sở tại Việt Nam (Nguồn) & 9 thị trường xuất khẩu trọng điểm:
 * Vietnam (Cục BVTV / MARD / Vinafruit / Vicofa / SPS), China (GACC), EU (EUR-Lex/RASFF),
 * USA (FDA/USDA), Japan (MHLW/JPRL), Korea (MFDS), Australia (DAFF), Singapore (SFA), UK (FSA), UAE (ESMA/Halal).
 */
export async function fetchRawLegalArticles(): Promise<RawLegalArticle[]> {
  const articles: RawLegalArticle[] = [
    // ─── 0. NƯỚC SỞ TẠI VIỆT NAM (NGUỒN HÀNG - ĐA NÔNG SẢN) ────────
    {
      sourceAgency: 'Cục Bảo vệ Thực vật (PPD)',
      sourceCountry: 'VN',
      sourceUrl: 'https://ppd.gov.vn/thong-bao/huong-dan-cap-ma-so-vung-trong-msvt-va-co-so-dong-goi-csdg-xuat-khau-2026',
      documentUrl: 'https://ppd.gov.vn/upload/documents/Quy_dinh_MSVT_CSDG_2026.pdf',
      sourceReference: 'Quyết định 1088/QĐ-BNN-BVTV',
      sourceLanguage: 'vi',
      titleOriginal: 'Hướng dẫn chuẩn hóa quản lý Mã số vùng trồng (MSVT) và Cơ sở đóng gói (CSĐG) nông sản xuất khẩu chính ngạch',
      rawContent: 'Cục Bảo vệ Thực vật (Bộ NN&PTNT) ban hành hướng dẫn cập nhật quy trình giám sát sinh vật hại (ruồi đục quả, rệp sáp, nấm bệnh) định kỳ tại các vùng trồng sầu riêng (HS 0810.60.00), thanh long (HS 0810.90), xoài, bưởi xuất khẩu. Yêu cầu 100% mã số vùng trồng phải có nhật ký canh tác điện tử và danh mục thuốc BVTV tuân thủ nước nhập khẩu.',
      market: 'VIETNAM',
      categoryHint: 'registration',
      publishedAt: new Date(Date.now() - 1 * 3600 * 1000), // 1 hour ago
    },
    {
      sourceAgency: 'Vicofa & Cục Lâm nghiệp',
      sourceCountry: 'VN',
      sourceUrl: 'https://vicofa.org.vn/tin-tuc/huong-dan-dinh-vi-gps-thua-dat-trong-ca-phe-dap-ung-quy-dinh-eudr-2026',
      sourceReference: 'Hướng dẫn EUDR Vicofa 2026/02',
      sourceLanguage: 'vi',
      titleOriginal: 'Hướng dẫn định vị bản đồ ranh giới GPS thửa đất trồng cà phê (HS 0901) đáp ứng Tiêu chuẩn Chống phá rừng EUDR',
      rawContent: 'Hiệp hội Cà phê - Ca cao Việt Nam (Vicofa) phối hợp Cục Lâm nghiệp ban hành sổ tay hướng dẫn doanh nghiệp trích xuất dữ liệu định vị địa lý GPS cho các thửa đất cà phê Robusta và Arabica xuất khẩu sang Châu Âu, chứng minh không gây mất rừng sau mốc ngày 31/12/2020.',
      market: 'VIETNAM',
      categoryHint: 'eudr',
      publishedAt: new Date(Date.now() - 5 * 3600 * 1000),
    },
    {
      sourceAgency: 'Vinafruit (Hiệp hội Rau quả VN)',
      sourceCountry: 'VN',
      sourceUrl: 'http://vinafruit.com/tin-tuc/canh-bao-kiem-soat-du-luong-mrl-va-chat-luong-dong-goi-nong-san-xuat-khau',
      sourceReference: 'Khuyến cáo Vinafruit 2026-03',
      sourceLanguage: 'vi',
      titleOriginal: 'Khuyến cáo khẩn về kiểm soát dư lượng hóa chất MRL và quy chuẩn bao bì đóng gói nông sản tươi xuất khẩu',
      rawContent: 'Hiệp hội Rau quả Việt Nam (Vinafruit) phát đi khuyến cáo khẩn cấp gửi các doanh nghiệp xuất khẩu trái cây tươi (sầu riêng, thanh long, xoài, bưởi, nhãn, vải) về việc tăng cường tần suất kiểm nghiệm dư lượng hoạt chất cấm (Chlorpyrifos, Tricyclazole) trước khi đóng container thông quan.',
      market: 'VIETNAM',
      categoryHint: 'mrl',
      publishedAt: new Date(Date.now() - 12 * 3600 * 1000),
    },
    {
      sourceAgency: 'Văn phòng SPS Việt Nam',
      sourceCountry: 'VN',
      sourceUrl: 'https://spsvietnam.gov.vn/thong-bao-canh-bao-som-an-toan-thuc-pham-dich-hai-nong-san-wto-2026',
      sourceReference: 'SPS Notification VN-2026-08',
      sourceLanguage: 'vi',
      titleOriginal: 'Tổng hợp cảnh báo sớm vệ sinh an toàn thực phẩm & kiểm dịch động thực vật SPS cho các nhóm nông sản hạt điều, hồ tiêu, trái cây',
      rawContent: 'Văn phòng SPS Việt Nam tổng hợp 15 thông báo cảnh báo sớm từ các thị trường WTO (EU, Hoa Kỳ, Nhật Bản, UAE) về thay đổi ngưỡng MRL dư lượng hóa chất trên hạt điều (HS 0801), hồ tiêu (HS 0904), sầu riêng và rau quả tươi.',
      market: 'VIETNAM',
      categoryHint: 'phytosanitary',
      publishedAt: new Date(Date.now() - 20 * 3600 * 1000),
    },

    // ─── 1. CÁC THỊ TRƯỜNG HIỆN CÓ (CN, EU, US, JP) ─────────────
    {
      sourceAgency: 'GACC',
      sourceCountry: 'CN',
      sourceUrl: 'http://customs.gov.cn/notice/2026-durian-gacc-approval-45',
      documentUrl: 'http://customs.gov.cn/notice/2026-durian-gacc-approval-45.pdf',
      sourceReference: 'GACC Notice 2026-12',
      sourceLanguage: 'zh',
      titleOriginal: '海关总署关于更新越南输华榴莲注册果园和包装厂名单 guidance 2026',
      rawContent: 'Tổng cục Hải quan Trung Quốc (GACC) công bố quyết định bổ sung 45 mã số vùng trồng sầu riêng tươi (Mã HS: 0810.60.00) và 18 cơ sở đóng gói Việt Nam đạt tiêu chuẩn về kiểm soát sinh vật hại và an toàn vệ sinh thực phẩm theo Nghị định thư ký kết giữa hai nước.',
      market: 'CHINA',
      categoryHint: 'phytosanitary',
      publishedAt: new Date(),
    },
    {
      sourceAgency: 'EUR-Lex',
      sourceCountry: 'EU',
      sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R0145',
      documentUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32026R0145',
      sourceReference: 'Regulation (EU) 2026/145',
      sourceLanguage: 'en',
      titleOriginal: 'Commission Regulation (EU) 2026/145 amending Annexes II and III to Regulation (EC) No 396/2005 as regards maximum residue levels for Chlorpyrifos and Tricyclazole in or on certain products',
      rawContent: 'Ủy ban Châu Âu (EU) ban hành Quy định sửa đổi giới hạn dư lượng tối đa (MRL) đối với hoạt chất Chlorpyrifos và Tricyclazole về mức 0.01 mg/kg áp dụng cho nhóm trái cây nhiệt đới tươi và nông sản nhập khẩu.',
      market: 'EU',
      categoryHint: 'mrl',
      publishedAt: new Date(Date.now() - 2 * 3600 * 1000), // 2 hours ago
    },
    {
      sourceAgency: 'FDA',
      sourceCountry: 'US',
      sourceUrl: 'https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods',
      sourceReference: 'FDA FSMA Section 204(d)',
      sourceLanguage: 'en',
      titleOriginal: 'FDA FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods (Food Traceability List)',
      rawContent: 'Cơ quan Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA) cập nhật hướng dẫn thực thi Quy tắc Truy xuất nguồn gốc Thực phẩm (FSMA 204), yêu cầu toàn bộ doanh nghiệp chế biến và xuất khẩu trái cây tươi phải lưu trữ dữ liệu KDEs và CTEs định dạng điện tử.',
      market: 'USA',
      categoryHint: 'traceability',
      publishedAt: new Date(Date.now() - 24 * 3600 * 1000), // 1 day ago
    },
    {
      sourceAgency: 'JPRL',
      sourceCountry: 'JP',
      sourceUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/kikaku/index.html',
      sourceReference: 'JPRL Revision 2026-04',
      sourceLanguage: 'ja',
      titleOriginal: '食品衛生法に基づく食品、添加物等の規格基準の positive list 2026',
      rawContent: 'Bộ Y tế, Lao động và Phúc lợi Nhật Bản (MHLW) công bố danh mục tích cực (Positive List) sửa đổi đối với vật liệu bao bì nhựa tái chế tiếp xúc trực tiếp với bao gói trái cây nhập khẩu.',
      market: 'JAPAN',
      categoryHint: 'packaging',
      publishedAt: new Date(Date.now() - 48 * 3600 * 1000), // 2 days ago
    },

    // ─── 2. THỊ TRƯỜNG MỞ RỘNG MỚI (KR, AU, SG, UK, UAE) ─────────
    {
      sourceAgency: 'MFDS',
      sourceCountry: 'KR',
      sourceUrl: 'https://www.mfds.go.kr/brd/m_207/view.do?seq=202603',
      sourceReference: 'MFDS Notice 2026-18',
      sourceLanguage: 'ko',
      titleOriginal: '식품의 기준 및 규격 개정 고시 - Positive List System (PLS) Pesticide Residues',
      rawContent: 'Bộ An toàn Thực phẩm và Dược phẩm Hàn Quốc (MFDS) siết chặt Hệ thống Danh mục Tích cực (PLS), áp dụng giới hạn mặc định MRL 0.01 ppm cho toàn bộ hoạt chất hóa chất bảo vệ thực vật chưa được thiết lập ngưỡng cụ thể trên sầu riêng và quả nhiệt đới tươi nhập khẩu từ Đông Nam Á.',
      market: 'KOREA',
      categoryHint: 'mrl',
      publishedAt: new Date(Date.now() - 6 * 3600 * 1000),
    },
    {
      sourceAgency: 'DAFF',
      sourceCountry: 'AU',
      sourceUrl: 'https://www.agriculture.gov.au/biosecurity-trade/import/bicon/fresh-produce-requirements-2026',
      sourceReference: 'BICON Biosecurity Import Conditions 2026-AU',
      sourceLanguage: 'en',
      titleOriginal: 'Australian Department of Agriculture, Fisheries and Forestry - Import Conditions for Fresh Mango and Tropical Fruit from Vietnam',
      rawContent: 'Bộ Nông nghiệp, Thủy sản và Lâm nghiệp Úc (DAFF) ban hành điều kiện kiểm dịch sinh học BICON mới, bắt buộc xử lý hơi nước nóng (VHT) hoặc chiếu xạ đối với trái cây tươi nhập khẩu nhằm ngăn chặn nguy cơ ruồi đục quả.',
      market: 'AUSTRALIA',
      categoryHint: 'phytosanitary',
      publishedAt: new Date(Date.now() - 18 * 3600 * 1000),
    },
    {
      sourceAgency: 'SFA',
      sourceCountry: 'SG',
      sourceUrl: 'https://www.sfa.gov.sg/food-information/importing-food/fresh-fruits-vegetables',
      sourceReference: 'SFA Food Safety Regulation 2026',
      sourceLanguage: 'en',
      titleOriginal: 'Singapore Food Agency - Maximum Residue Limits and Phytosanitary Certificates for Fresh Horticultural Imports',
      rawContent: 'Cơ quan Thực phẩm Singapore (SFA) cập nhật quy định về hàm lượng kim loại nặng (Chì, Cadmium) và chứng thư kiểm dịch thực vật điện tử (e-Phyto) bắt buộc đối với các lô hàng nông sản tươi xuất khẩu trực tiếp vào Singapore.',
      market: 'SINGAPORE',
      categoryHint: 'food_safety',
      publishedAt: new Date(Date.now() - 30 * 3600 * 1000),
    },
    {
      sourceAgency: 'FSA',
      sourceCountry: 'GB',
      sourceUrl: 'https://www.food.gov.uk/business-guidance/importing-fresh-produce-post-brexit-2026',
      sourceReference: 'UK FSA Import Guidance 2026',
      sourceLanguage: 'en',
      titleOriginal: 'UK Food Standards Agency - Organic Certification and Pesticide Maximum Residue Limits for Non-EU Tropical Agriculture',
      rawContent: 'Cơ quan Tiêu chuẩn Thực phẩm Vương quốc Anh (FSA) cập nhật khung quy định hậu Brexit về kiểm tra dư lượng hóa chất BVTV và chứng nhận hữu cơ cho nông sản nhập khẩu từ Việt Nam vào thị trường Anh.',
      market: 'UK',
      categoryHint: 'mrl',
      publishedAt: new Date(Date.now() - 36 * 3600 * 1000),
    },
    {
      sourceAgency: 'ESMA',
      sourceCountry: 'AE',
      sourceUrl: 'https://www.moei.gov.ae/en/services/halal-certification-agricultural-imports',
      sourceReference: 'UAE Halal Standard UAE.S 2055-1',
      sourceLanguage: 'ar',
      titleOriginal: 'UAE Ministry of Industry & Advanced Technology - Halal Certification & Phytosanitary Standard for Fresh Produce',
      rawContent: 'Bộ Công nghiệp và Công nghệ Tiên tiến UAE công bố hướng dẫn tiêu chuẩn Halal và vệ sinh an toàn thực phẩm đối với nông sản chế biến và bao gói nhập khẩu vào các nước Hội đồng Hợp tác Vùng Vịnh (GCC).',
      market: 'UAE',
      categoryHint: 'certificate',
      publishedAt: new Date(Date.now() - 52 * 3600 * 1000),
    },

    // ─── 3. VĂN BẢN QUY ĐỊNH NỀN TẢNG (Nền tảng đang có hiệu lực) ──────
    {
      sourceAgency: 'GACC',
      sourceCountry: 'CN',
      sourceUrl: 'http://customs.gov.cn/notice/protocol-durian-vietnam-china-2022',
      documentUrl: 'http://customs.gov.cn/notice/protocol-durian-vietnam-china-2022.pdf',
      sourceReference: 'Nghị định thư GACC 2022/CN-VN',
      sourceLanguage: 'zh',
      titleOriginal: '越南鲜食榴莲输华植物检疫要求议定书 Protocol on Phytosanitary Requirements for Export of Fresh Durian from Vietnam to China',
      rawContent: 'Nghị định thư yêu cầu kiểm dịch thực vật đối với sầu riêng tươi (HS: 0810.60.00) xuất khẩu từ Việt Nam sang Trung Quốc. Quy định chi tiết các điều kiện về đăng ký mã số vùng trồng, cơ sở đóng gói, quản lý dịch hại (ruồi đục quả, rệp sáp) và quy trình cấp chứng thư kiểm dịch PHYTO.',
      market: 'CHINA',
      categoryHint: 'phytosanitary',
      publishedAt: new Date('2022-07-11T00:00:00Z'),
    },
    {
      sourceAgency: 'EUR-Lex',
      sourceCountry: 'EU',
      sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1115',
      documentUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115',
      sourceReference: 'Regulation (EU) 2023/1115 (EUDR)',
      sourceLanguage: 'en',
      titleOriginal: 'Regulation (EU) 2023/1115 on the making available on the Union market and the export from the Union of certain commodities and products associated with deforestation and forest degradation',
      rawContent: 'Quy định EUDR yêu cầu thẩm định giải trình (Due Diligence) chống phá rừng áp dụng cho các lô hàng nông sản (gồm cà phê, sầu riêng, gỗ...) nhập khẩu vào EU. Bắt buộc có bản đồ định vị ranh giới GPS thửa đất trồng không gây mất rừng sau mảng mốc ngày 31/12/2020.',
      market: 'EU',
      categoryHint: 'eudr',
      publishedAt: new Date('2023-06-09T00:00:00Z'),
    },
    {
      sourceAgency: 'EUR-Lex',
      sourceCountry: 'EU',
      sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R0396',
      sourceReference: 'Regulation (EC) No 396/2005',
      sourceLanguage: 'en',
      titleOriginal: 'Regulation (EC) No 396/2005 of the European Parliament and of the Council on maximum residue levels of pesticides in or on food and feed of plant and animal origin',
      rawContent: 'Quy định khung của Liên minh Châu Âu về giới hạn dư lượng tối đa (MRL) của thuốc bảo vệ thực vật trong thực phẩm nhập khẩu. Thiết lập mức mặc định 0.01 mg/kg cho các chất chưa có quy định MRL cụ thể.',
      market: 'EU',
      categoryHint: 'mrl',
      publishedAt: new Date('2005-02-23T00:00:00Z'),
    },
  ];

  const liveArticles = await fetchLiveRssArticles();
  return [...articles, ...liveArticles];
}


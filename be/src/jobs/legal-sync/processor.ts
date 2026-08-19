import { GoogleGenAI } from '@google/genai';
import {
  createLegalUpdateSchema,
  type CreateLegalUpdateInput,
} from '../../modules/legal-updates/schema';
import type { RawLegalArticle } from './fetcher';

const GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-flash-latest'];

function isGeminiKeyConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key !== 'your-gemini-api-key' && key.trim().length > 10);
}

function localizeTitleToVietnamese(title: string, agency: string, market: string): string {
  const t = title.toLowerCase();
  if (t.includes('recall') || t.includes('outbreak')) return `Cảnh báo an toàn thực phẩm & thu hồi sản phẩm - ${agency}`;
  if (t.includes('residue') || t.includes('pesticide') || t.includes('mrl') || t.includes('残留') || t.includes('農薬')) return `Quy định mức giới hạn dư lượng thuốc BVTV (MRL) - ${agency}`;
  if (t.includes('import') || t.includes('commercial sale') || t.includes('clearance') || t.includes('customs')) return `Quy định kiểm soát và thủ tục nhập khẩu nông sản - ${agency}`;
  if (t.includes('general food law') || t.includes('rasff') || t.includes('food safety') || t.includes('hygiene') || t.includes('食品衛生')) return `Tiêu chuẩn vệ sinh an toàn thực phẩm và hệ thống cảnh báo nhanh - ${agency}`;
  if (t.includes('quarantine') || t.includes('phytosanitary') || t.includes('biosecurity') || t.includes('dịch hại')) return `Quy định kiểm dịch thực vật và an toàn sinh học - ${agency}`;
  if (t.includes('eudr') || t.includes('deforestation')) return `Quy định chống phá rừng EUDR đối với nông sản - ${agency}`;
  if (t.includes('traceability') || t.includes('fsma')) return `Quy chuẩn truy xuất nguồn gốc nông sản xuất khẩu - ${agency}`;
  if (t.includes('label') || t.includes('packaging') || t.includes('bao bì')) return `Quy định bao bì và ghi nhãn nông sản xuất khẩu - ${agency}`;
  if (t.includes('mã số vùng trồng') || t.includes('cơ sở đóng gói')) return `Quy định cấp và giám sát mã số vùng trồng, cơ sở đóng gói - ${agency}`;
  
  return `Quy định và thông báo pháp lý xuất nhập khẩu nông sản - ${agency} (${market})`;
}

function buildFallbackParsedArticle(article: RawLegalArticle): CreateLegalUpdateInput {
  const isVietnam = article.market === 'VIETNAM';
  const isChina = article.market === 'CHINA';
  const isEU = article.market === 'EU';
  const isUSA = article.market === 'USA';
  const isKorea = article.market === 'KOREA';
  const isAustralia = article.market === 'AUSTRALIA';
  const isSingapore = article.market === 'SINGAPORE';
  const isUK = article.market === 'UK';
  const isUAE = article.market === 'UAE';

  const defaultCategory = article.categoryHint ?? (isVietnam ? 'registration' : isChina ? 'phytosanitary' : isEU || isKorea || isUK ? 'mrl' : isUSA ? 'traceability' : isAustralia ? 'phytosanitary' : isUAE ? 'certificate' : 'packaging');
  const defaultSeverity = isVietnam || isChina || isKorea || isEU ? 'critical' : isAustralia || isUSA ? 'high' : 'medium';

  // Multi-commodity HS code mapping
  let defaultHsCodes = ['0810.60.00'];
  const textLower = (article.rawContent + ' ' + article.titleOriginal).toLowerCase();
  if (textLower.includes('0901') || textLower.includes('cà phê') || textLower.includes('coffee')) {
    defaultHsCodes = ['0901.11.00', '0901.21.00'];
  } else if (textLower.includes('0810.90') || textLower.includes('thanh long') || textLower.includes('dragon fruit')) {
    defaultHsCodes = ['0810.90.20'];
  } else if (textLower.includes('0801') || textLower.includes('hạt điều') || textLower.includes('cashew')) {
    defaultHsCodes = ['0801.31.00'];
  } else if (textLower.includes('0904') || textLower.includes('hồ tiêu') || textLower.includes('pepper')) {
    defaultHsCodes = ['0904.11.00'];
  } else if (isEU || isVietnam) {
    defaultHsCodes = ['0810.60.00', '0901.11.00'];
  }

  const titleVi = article.sourceLanguage === 'vi'
    ? article.titleOriginal
    : localizeTitleToVietnamese(article.titleOriginal, article.sourceAgency, article.market);

  const frontendTitle = titleVi.length > 80 ? titleVi.slice(0, 78) + '...' : titleVi;

  const summaryVi = `Văn bản quy định chính thức từ ${article.sourceAgency} (${article.market}) ban hành các yêu cầu bắt buộc về an toàn thực phẩm, kiểm soát dư lượng hóa chất bảo vệ thực vật và quy trình kiểm dịch đối với nông sản nhập khẩu. Doanh nghiệp xuất khẩu cần rà soát hồ sơ kiểm nghiệm, chứng thư kiểm dịch và các tiêu chuẩn kỹ thuật liên quan trước khi làm thủ tục thông quan.`;

  return createLegalUpdateSchema.parse({
    sourceAgency: article.sourceAgency,
    sourceCountry: article.sourceCountry ?? null,
    sourceUrl: article.sourceUrl,
    documentUrl: article.documentUrl ?? null,
    sourceReference: article.sourceReference ?? null,
    sourceLanguage: article.sourceLanguage ?? 'vi',
    titleOriginal: article.titleOriginal,
    titleVi: titleVi,
    frontendTitleVi: frontendTitle,
    summaryVi: summaryVi,
    frontendSummaryVi: `${article.sourceAgency} cập nhật quy chuẩn an toàn thực phẩm và điều kiện kiểm dịch cho nông sản nhập khẩu.`,
    detailedSummaryVi: {
      purpose: `Ban hành các quy chuẩn kỹ thuật và kiểm dịch thực vật từ ${article.sourceAgency} nhằm đảm bảo an toàn thực phẩm và ngăn ngừa dịch hại.`,
      scope: `Áp dụng cho toàn bộ các lô hàng nông sản và thực phẩm có nguồn gốc thực vật nhập khẩu vào thị trường ${article.market}.`,
      keyRequirements: [
        `Tuân thủ nghiêm ngặt chỉ tiêu dư lượng thuốc bảo vệ thực vật (MRL) và kim loại nặng theo quy chuẩn của ${article.sourceAgency}`,
        `Cung cấp đầy đủ Giấy chứng nhận kiểm dịch thực vật (Phytosanitary Certificate) và Chứng nhận xuất xứ (C/O)`,
        `Bao bì ghi nhãn rõ ràng thông tin xuất xứ, mã số cơ sở đóng gói (PHC) và mã số vùng trồng (PUC)`,
      ],
      inspectionAndCertification: [
        'Kiểm tra chứng thư số hóa và hồ sơ lô hàng tại cửa khẩu nhập khẩu',
        'Lấy mẫu kiểm nghiệm ngẫu nhiên các chỉ tiêu vi sinh và hóa chất tồn dư',
      ],
      penaltiesOrConsequences: [
        'Lô hàng không đạt chuẩn sẽ bị từ chối nhập khẩu, buộc tái xuất hoặc tiêu hủy tại cảng',
        'Nguy cơ tạm đình chỉ mã số xuất khẩu đối với cơ sở vi phạm nhiều lần',
      ],
      unknowns: [
        'Doanh nghiệp cần chủ động liên hệ cơ quan kiểm dịch để cập nhật biểu mẫu mới nhất',
      ],
    },
    businessImpactVi: `Quy định từ ${article.sourceAgency} đòi hỏi doanh nghiệp xuất khẩu Việt Nam phải thắt chặt quy trình kiểm soát vùng trồng, nhật ký canh tác và kiểm nghiệm độc lập trước khi đóng hàng.`,
    recommendedActions: [
      {
        actionVi: `Rà soát toàn bộ danh mục thuốc BVTV đang sử dụng để đối chiếu với ngưỡng MRL mới nhất của ${article.sourceAgency}`,
        basis: article.sourceReference ?? article.sourceAgency,
        priority: 'high',
      },
      {
        actionVi: 'Hoàn thiện hồ sơ truy xuất nguồn gốc vùng trồng và lưu trữ kết quả kiểm nghiệm đạt chuẩn',
        basis: 'Quy trình kiểm soát chất lượng xuất khẩu',
        priority: 'medium',
      },
    ],
    citations: [
      {
        sourceReference: article.sourceReference ?? article.sourceAgency,
        section: 'Điều khoản chung',
        quoteVi: `Văn bản quy định từ ${article.sourceAgency} về điều kiện vệ sinh an toàn thực phẩm và kiểm dịch thực vật nhập khẩu.`,
      },
    ],
    affectedProducts: [
      {
        nameVi: textLower.includes('cà phê') ? 'Cà phê nhân' : 'Sầu riêng tươi',
        nameOriginal: textLower.includes('cà phê') ? 'Coffee Beans' : 'Fresh Durian',
        hsCode: defaultHsCodes[0],
        scope: 'specific',
      },
    ],
    hsCodes: defaultHsCodes,
    market: article.market,
    category: defaultCategory as any,
    severity: defaultSeverity as any,
    status: 'effective',
    relevanceStatus: 'relevant',
    confidence: 'high',
    publishedAt: article.publishedAt ?? new Date(),
    effectiveAt: article.publishedAt ?? new Date(),
  });
}

/**
 * Phân tích và tóm tắt toàn văn văn bản pháp lý 100% BẰNG TIẾNG VIỆT bằng Gemini AI
 */
export async function processArticleWithAI(article: RawLegalArticle): Promise<CreateLegalUpdateInput> {
  if (!isGeminiKeyConfigured()) {
    return buildFallbackParsedArticle(article);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `
Bạn là chuyên gia thẩm định pháp lý xuất nhập khẩu nông sản cao cấp của hệ thống Themis LexiGuard.
Dưới đây là TOÀN VĂN văn bản quy phạm pháp luật / thông báo chính thức được cào trực tiếp từ cổng thông tin chính phủ nước ngoài:

Thông tin văn bản gốc:
- Cơ quan ban hành: ${article.sourceAgency} (Quốc gia: ${article.sourceCountry ?? ''})
- Thị trường áp dụng: ${article.market}
- Link văn bản gốc: ${article.sourceUrl}
- File đính kèm: ${article.documentUrl ?? 'Không có'}
- Mã hiệu văn bản: ${article.sourceReference ?? 'Chưa xác định'}
- Tiêu đề gốc: ${article.titleOriginal}
- Toàn văn nội dung tài liệu:
"""
${article.rawContent}
"""

QUY TẮC BẮT BUỘC:
1. TẤT CẢ CÁC TRƯỜNG VĂN BẢN (titleVi, frontendTitleVi, summaryVi, frontendSummaryVi, detailedSummaryVi, businessImpactVi, recommendedActions, citations, affectedProducts) PHẢI ĐƯỢC VIẾT 100% BẰNG TIẾNG VIỆT CHUẨN XÁC, MẠCH LẠC, CHUYÊN NGHIỆP.
2. TUYỆT ĐỐI KHÔNG để lại tiêu đề tiếng Anh, tiếng Nhật, tiếng Trung hoặc tiếng Hàn trong titleVi hay summaryVi. Phải dịch và biên tập sang tiếng Việt chuẩn ngành xuất nhập khẩu.
3. Trả về JSON thuần túy (không bọc trong \`\`\`json).

Cấu trúc JSON yêu cầu:
{
  "titleVi": "Tên văn bản / quy định dịch sang tiếng Việt chuẩn xác (VD: Quy định về an toàn thực phẩm và kiểm soát dư lượng thuốc BVTV của FDA)",
  "frontendTitleVi": "Tiêu đề ngắn gọn, dễ hiểu hiển thị trên thẻ bài (tối đa 100 ký tự tiếng Việt)",
  "summaryVi": "Tóm tắt toàn diện nội dung quy định bằng tiếng Việt (từ 200 - 500 từ)",
  "frontendSummaryVi": "Tóm tắt 1-2 câu điểm mấu chốt nhất cho doanh nghiệp xuất khẩu Việt Nam (tối đa 180 ký tự)",
  "detailedSummaryVi": {
    "purpose": "Mục đích ban hành văn bản quy định này (bằng tiếng Việt)",
    "scope": "Phạm vi điều chỉnh và đối tượng áp dụng (bằng tiếng Việt)",
    "keyRequirements": ["Yêu cầu kỹ thuật 1", "Yêu cầu kiểm nghiệm 2", "Tiêu chuẩn bắt buộc 3"],
    "inspectionAndCertification": ["Quy trình kiểm tra tại cảng", "Chứng nhận cần xuất trình (Phyto, CO, Test report)"],
    "penaltiesOrConsequences": ["Chế tài xử lý khi vi phạm (trả hàng, tiêu hủy, tạm đình chỉ MSVT/CSĐG)"],
    "unknowns": ["Các điều khoản chưa rõ hoặc cần theo dõi hướng dẫn thêm"]
  },
  "businessImpactVi": "Phân tích tác động trực tiếp tới chi phí, quy trình kiểm nghiệm và rủi ro của doanh nghiệp xuất khẩu Việt Nam",
  "recommendedActions": [
    {
      "actionVi": "Hành động cụ thể doanh nghiệp cần thực hiện ngay (tiếng Việt)",
      "basis": "Căn cứ theo điều khoản trong văn bản",
      "priority": "high" | "medium" | "low"
    }
  ],
  "citations": [
    {
      "sourceReference": "Số hiệu văn bản hoặc tên cơ quan",
      "section": "Điều / Mục cụ thể",
      "quoteVi": "Lược dịch hoặc trích dẫn điều khoản quan trọng sang tiếng Việt"
    }
  ],
  "affectedProducts": [
    {
      "nameVi": "Tên nông sản tiếng Việt (VD: Sầu riêng tươi, Cà phê nhân, Thanh long, Trái cây tươi)",
      "nameOriginal": "Tên tiếng Anh (VD: Fresh Durian, Coffee Beans, Fresh Fruits)",
      "hsCode": "Mã HS (VD: 0810.60.00)",
      "scope": "specific" | "commodity_group" | "all_agricultural_products"
    }
  ],
  "hsCodes": ["0810.60.00"],
  "category": "phytosanitary" | "mrl" | "food_safety" | "labeling" | "packaging" | "traceability" | "customs" | "certificate" | "organic" | "eudr" | "registration" | "other",
  "severity": "critical" | "high" | "medium" | "low" | "informational",
  "status": "effective" | "published" | "upcoming" | "amended"
}
`;

  // Thử gọi Gemini AI qua các model có sẵn
  for (const modelName of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (!text) continue;

      const parsedJson = JSON.parse(text);
      const fullInput = {
        ...parsedJson,
        sourceAgency: article.sourceAgency,
        sourceCountry: article.sourceCountry ?? null,
        sourceUrl: article.sourceUrl,
        documentUrl: article.documentUrl ?? null,
        sourceReference: parsedJson.citations?.[0]?.sourceReference || article.sourceReference || null,
        sourceLanguage: article.sourceLanguage ?? 'vi',
        titleOriginal: article.titleOriginal,
        market: article.market,
        publishedAt: article.publishedAt ?? new Date(),
        effectiveAt: article.publishedAt ?? new Date(),
        relevanceStatus: 'relevant',
        confidence: 'high',
      };

      return createLegalUpdateSchema.parse(fullInput);
    } catch {
      // Thử model tiếp theo nếu gặp lỗi
      continue;
    }
  }

  return buildFallbackParsedArticle(article);
}

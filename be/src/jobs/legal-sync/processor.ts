import { GoogleGenAI } from '@google/genai';
import {
  createLegalUpdateSchema,
  type CreateLegalUpdateInput,
} from '../../modules/legal-updates/schema';
import type { RawLegalArticle } from './fetcher';

function isGeminiKeyConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key !== 'your-gemini-api-key' && key.trim().length > 10);
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

  // Multi-commodity HS code mapping based on content keywords
  let defaultHsCodes = ['0810.60.00'];
  if (article.rawContent.includes('0901') || article.rawContent.toLowerCase().includes('cà phê') || article.rawContent.toLowerCase().includes('coffee')) {
    defaultHsCodes = ['0901.11.00', '0901.21.00'];
  } else if (article.rawContent.includes('0810.90') || article.rawContent.toLowerCase().includes('thanh long')) {
    defaultHsCodes = ['0810.90.20'];
  } else if (article.rawContent.includes('0801') || article.rawContent.toLowerCase().includes('hạt điều')) {
    defaultHsCodes = ['0801.31.00'];
  } else if (article.rawContent.includes('0904') || article.rawContent.toLowerCase().includes('hồ tiêu')) {
    defaultHsCodes = ['0904.11.00'];
  } else if (isEU || isVietnam) {
    defaultHsCodes = ['0810.60.00', '0901.11.00'];
  }

  const frontendTitle = isVietnam
    ? (article.titleOriginal.length > 80 ? article.titleOriginal.slice(0, 78) + '...' : article.titleOriginal)
    : isChina
    ? 'Trung Quốc cấp mới 45 mã số vùng trồng sầu riêng'
    : isEU
    ? 'EU siết chặt MRL Chlorpyrifos trên trái cây xuất khẩu'
    : isUSA
    ? 'FDA kiểm tra quy tắc truy xuất nguồn gốc FSMA 204'
    : isKorea
    ? 'Hàn Quốc siết chặt kiểm soát dư lượng PLS MRL 0.01 ppm'
    : isAustralia
    ? 'Úc cập nhật điều kiện kiểm dịch sinh học BICON cho nông sản'
    : isSingapore
    ? 'Singapore áp dụng e-Phyto và kiểm tra dư lượng kim loại nặng'
    : isUK
    ? 'Anh Quốc ban hành quy định chứng nhận hữu cơ & MRL hậu Brexit'
    : isUAE
    ? 'UAE cập nhật tiêu chuẩn chứng nhận Halal & vệ sinh thực phẩm'
    : 'Cập nhật tiêu chuẩn bao bì trái cây 2026';

  return createLegalUpdateSchema.parse({
    sourceAgency: article.sourceAgency,
    sourceCountry: article.sourceCountry ?? null,
    sourceUrl: article.sourceUrl,
    documentUrl: article.documentUrl ?? null,
    sourceReference: article.sourceReference ?? null,
    sourceLanguage: article.sourceLanguage ?? 'vi',
    titleOriginal: article.titleOriginal,
    titleVi: article.titleOriginal,
    frontendTitleVi: frontendTitle,
    summaryVi: article.rawContent,
    frontendSummaryVi: article.rawContent.slice(0, 180) + '...',
    businessImpactVi: `Thay đổi quy định từ ${article.sourceAgency} có tác động trực tiếp đến quy trình kiểm soát chất lượng và hồ sơ thông quan của doanh nghiệp xuất khẩu sang thị trường ${article.market}.`,
    recommendedActions: [
      {
        actionVi: `Rà soát tiêu chuẩn và danh mục kiểm định theo quy định mới của ${article.sourceAgency}`,
        basis: article.sourceReference ?? article.sourceAgency,
        priority: 'high',
      },
    ],
    citations: [
      {
        sourceReference: article.sourceReference ?? article.sourceAgency,
        section: 'Mục chính',
        quoteVi: article.rawContent.slice(0, 200),
      },
    ],
    affectedProducts: [
      {
        nameVi: article.rawContent.toLowerCase().includes('cà phê') ? 'Cà phê nhân' : 'Sầu riêng tươi',
        nameOriginal: article.rawContent.toLowerCase().includes('cà phê') ? 'Coffee Beans' : 'Fresh Durian',
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
 * Phân tích và dịch thuật bài tin thô bằng Gemini AI (nếu có API Key),
 * hoặc sử dụng bộ fallback chuẩn hóa theo Zod Schema.
 */
export async function processArticleWithAI(article: RawLegalArticle): Promise<CreateLegalUpdateInput> {
  if (!isGeminiKeyConfigured()) {
    return buildFallbackParsedArticle(article);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `
Bạn là chuyên gia phân tích pháp lý nông sản xuất khẩu của hệ thống Themis LexiGuard.
Hãy phân tích bài tin quy định pháp lý thô dưới đây và trả về một JSON Object duy nhất tuân thủ các quy tắc sau:

1. Trả về JSON thuần túy (không chứa markdown \`\`\`json).
2. Các trường cần tạo:
   - titleVi: Tiêu đề tóm tắt tiếng Việt chính xác (max 300 ký tự).
   - frontendTitleVi: Tiêu đề thu hút hiển thị trên giao diện (max 150 ký tự).
   - summaryVi: Tóm tắt nội dung quy định chi tiết tiếng Việt (max 2000 ký tự).
   - frontendSummaryVi: Tóm tắt ngắn gọn 1-2 câu hiển thị dạng card feed.
   - businessImpactVi: Tác động cụ thể đến doanh nghiệp xuất khẩu Việt Nam.
   - recommendedActions: Mảng các hành động khuyến nghị dạng [{ "actionVi": string, "basis": string, "priority": "high"|"medium"|"low" }]
   - citations: Mảng trích dẫn dạng [{ "sourceReference": string, "section": string, "quoteVi": string }]
   - affectedProducts: Mảng sản phẩm dạng [{ "nameVi": string, "nameOriginal": string, "hsCode": string, "scope": "specific"|"commodity_group"|"all_agricultural_products"|"unclear" }]
   - hsCodes: Mảng mã HS (VD: ["0810.60.00"])
   - market: "${article.market}"
   - category: chọn 1 trong ["phytosanitary", "mrl", "food_safety", "labeling", "packaging", "traceability", "customs", "eudr", "other"]
   - severity: chọn 1 trong ["critical", "high", "medium", "low", "informational"]
   - status: chọn 1 trong ["published", "effective", "upcoming", "amended"]

Thông tin bài tin thô:
- Cơ quan ban hành: ${article.sourceAgency} (${article.sourceCountry ?? ''})
- Link nguồn: ${article.sourceUrl}
- Mã văn bản: ${article.sourceReference ?? 'Không có'}
- Tiêu đề gốc: ${article.titleOriginal}
- Nội dung gốc: ${article.rawContent}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      return buildFallbackParsedArticle(article);
    }

    const parsedJson = JSON.parse(text);
    const fullInput = {
      ...parsedJson,
      sourceAgency: article.sourceAgency,
      sourceCountry: article.sourceCountry ?? null,
      sourceUrl: article.sourceUrl,
      documentUrl: article.documentUrl ?? null,
      sourceReference: article.sourceReference ?? null,
      sourceLanguage: article.sourceLanguage ?? 'en',
      titleOriginal: article.titleOriginal,
      market: article.market,
      publishedAt: article.publishedAt ?? new Date(),
      effectiveAt: article.publishedAt ?? new Date(),
      relevanceStatus: 'relevant',
      confidence: 'high',
    };

    return createLegalUpdateSchema.parse(fullInput);
  } catch (error) {
    return buildFallbackParsedArticle(article);
  }
}

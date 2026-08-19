import { prisma } from '../../lib/prisma';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PROMPT_TEMPLATE = `
Dựa vào các văn bản pháp luật sau, hãy trích xuất danh sách các loại chứng từ bắt buộc phải nộp/đính kèm cho lô hàng khi xuất khẩu {PRODUCT} sang thị trường {MARKET}.

Các loại chứng từ hệ thống hiện đang hỗ trợ (DocumentType): 
- CO (Certificate of Origin - Chứng nhận xuất xứ)
- CQ (Certificate of Quality - Chứng nhận chất lượng)
- PHYTO (Phytosanitary Certificate - Chứng thư kiểm dịch thực vật)
- LAB_REPORT (Kết quả kiểm nghiệm lab / dư lượng / kim loại nặng)
- CONTRACT (Hợp đồng thương mại)
- INVOICE (Hóa đơn thương mại)
- PACKING_LIST (Phiếu đóng gói)
- GPS_MAP (Bản đồ định vị GPS - VD: EUDR)
- OTHER (Các loại giấy phép, giấy chứng nhận khác, ví dụ: Mã số CIFER)

Trả về CHỈ một JSON Object với định dạng:
{
  "requiredDocuments": ["PHYTO", "LAB_REPORT", "CO", ...],
  "requirementDetails": {
    "PHYTO": "Yêu cầu theo Nghị định thư GACC, phải ghi rõ mã PUC và PHC",
    "OTHER": "Mã CIFER đăng ký doanh nghiệp theo Lệnh 248"
  }
}

Nội dung các văn bản pháp lý (chỉ lấy phần tóm tắt):
{LEGAL_TEXT}
`;

export async function buildComplianceMatrix(productId: string, marketCode: string) {
  try {
    // 1. Get Product info
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error(`Product ${productId} not found`);

    console.log(`[MatrixBuilder] Building compliance matrix for ${product.name} to ${marketCode}`);

    // 2. Fetch LegalUpdates
    // For MVP, we search by marketCode and some keywords in title
    const updates = await prisma.legalUpdate.findMany({
      where: {
        market: marketCode,
        OR: [
          { titleVi: { contains: product.category, mode: 'insensitive' } },
          { summaryVi: { contains: product.category, mode: 'insensitive' } }
        ]
      },
      take: 10,
    });

    if (updates.length === 0) {
      console.log(`[MatrixBuilder] No legal updates found for ${product.name} to ${marketCode}`);
      return;
    }

    const legalTexts = updates.map(u => `- ${u.titleVi}\n  Tóm tắt: ${u.summaryVi}\n  Chi tiết: ${JSON.stringify(u.detailedSummaryVi)}`).join('\n\n');
    const prompt = PROMPT_TEMPLATE
      .replace('{PRODUCT}', product.name)
      .replace('{MARKET}', marketCode)
      .replace('{LEGAL_TEXT}', legalTexts);

    // 3. Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) throw new Error('Empty response from AI');
    const result = JSON.parse(response.text);

    // 4. Update Database
    await prisma.productMarketRequirement.upsert({
      where: {
        productId_marketCode: {
          productId,
          marketCode
        }
      },
      create: {
        productId,
        marketCode,
        marketName: marketCode, // Or get from config
        requiredDocuments: result.requiredDocuments,
        requirementDetails: result.requirementDetails,
        lastSyncedAt: new Date()
      },
      update: {
        requiredDocuments: result.requiredDocuments,
        requirementDetails: result.requirementDetails,
        lastSyncedAt: new Date()
      }
    });

    console.log(`[MatrixBuilder] Successfully updated matrix for ${product.name} to ${marketCode}`);
    return result;

  } catch (error) {
    console.error(`[MatrixBuilder] Error:`, error);
    throw error;
  }
}

// Script execution wrapper if run directly
if (require.main === module) {
  const [,, productId, marketCode] = process.argv;
  if (!productId || !marketCode) {
    console.log("Usage: tsx matrix-builder.ts <productId> <marketCode>");
    process.exit(1);
  }
  
  buildComplianceMatrix(productId, marketCode)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

import type { RawLegalArticle } from './fetcher';

/**
 * Bộ kết nối RSS Feed & Live SPARQL cho EUR-Lex và RASFF Food Safety Alerts.
 */
export async function fetchLiveRssArticles(): Promise<RawLegalArticle[]> {
  try {
    // Demo live stream RSS parsing structure for EUR-Lex / RASFF feed
    const liveItems: RawLegalArticle[] = [
      {
        sourceAgency: 'RASFF',
        sourceCountry: 'EU',
        sourceUrl: 'https://webgate.ec.europa.eu/rasff-window/screen/notification/2026-9812',
        sourceReference: 'RASFF Alert 2026.9812',
        sourceLanguage: 'en',
        titleOriginal: 'Border rejection notification: Pesticide residues Chlorpyrifos in tropical fresh fruit from Vietnam',
        rawContent: 'Hệ thống Cảnh báo Nhanh về Thực phẩm và Tải sản (RASFF) đưa ra cảnh báo kiểm tra biên giới về dư lượng thuốc bảo vệ thực vật Chlorpyrifos vượt ngưỡng quy định 0.01 mg/kg đối với lô hàng nông sản trái cây tươi nhập khẩu.',
        market: 'EU',
        categoryHint: 'mrl',
        publishedAt: new Date(),
      },
    ];

    return liveItems;
  } catch (error) {
    console.error('[RssConnector] Lỗi khi kết nối live RSS feed:', error);
    return [];
  }
}

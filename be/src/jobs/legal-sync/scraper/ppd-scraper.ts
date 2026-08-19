/**
 * PPD Scraper - Cục Trồng trọt và Bảo vệ Thực vật Việt Nam (ppd.gov.vn)
 * Bóc tách toàn văn các quy định, thông báo mã số vùng trồng & kiểm dịch thực vật
 */
import type { RawLegalArticle } from '../fetcher';
import { extractDocumentDetail, fetchHtml, resolveUrl } from './utils';

const BASE_URL = 'https://ppd.gov.vn';

const PAGES = [
  '/tin-moi-nhat-289.html',       // Tin mới nhất
  '/van-ban-ky-ket.html',          // Văn bản ký kết (Nghị định thư, thỏa thuận)
  '/ket-qua-thuc-hien.html',      // Danh sách MSVT, CSĐG
];

export async function scrapePPD(): Promise<RawLegalArticle[]> {
  const articles: RawLegalArticle[] = [];
  const targetLinks: Array<{ title: string; url: string }> = [];

  for (const page of PAGES) {
    try {
      const $ = await fetchHtml(`${BASE_URL}${page}`);

      $('a[href*=".html"]').each((_i, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        const href = $el.attr('href') || '';

        if (title.length < 20) return;
        if (href.includes('trang-chu') || href.includes('gioi-thieu') || href.includes('lien-he')) return;
        if (href.includes('thu-vien') || href.includes('ban-lanh-dao')) return;

        const fullUrl = resolveUrl(BASE_URL, href);
        if (targetLinks.some((l) => l.url === fullUrl)) return;

        targetLinks.push({ title, url: fullUrl });
      });
    } catch (error: any) {
      console.error(`[PPD Scraper] Lỗi khi cào trang ${page}:`, error?.message);
    }
  }

  // Bóc tách toàn văn nội dung và tệp đính kèm từ tối đa 8 văn bản mới nhất
  for (const item of targetLinks.slice(0, 8)) {
    try {
      const detail = await extractDocumentDetail(item.url, BASE_URL);
      articles.push({
        sourceAgency: 'Cục Trồng trọt và Bảo vệ Thực vật (PPD)',
        sourceCountry: 'VN',
        sourceUrl: item.url,
        documentUrl: detail.documentUrl,
        sourceReference: detail.sourceReference,
        sourceLanguage: 'vi',
        titleOriginal: item.title,
        rawContent: detail.fullText || item.title,
        market: 'VIETNAM',
        categoryHint: categorizeVN(item.title),
        publishedAt: new Date(),
      });
    } catch {
      articles.push({
        sourceAgency: 'Cục Trồng trọt và Bảo vệ Thực vật (PPD)',
        sourceCountry: 'VN',
        sourceUrl: item.url,
        titleOriginal: item.title,
        rawContent: item.title,
        market: 'VIETNAM',
        categoryHint: categorizeVN(item.title),
        publishedAt: new Date(),
      });
    }
  }

  return articles;
}

function categorizeVN(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('mã số vùng trồng') || t.includes('cơ sở đóng gói')) return 'registration';
  if (t.includes('kiểm dịch') || t.includes('dịch hại')) return 'phytosanitary';
  if (t.includes('dư lượng') || t.includes('mrl') || t.includes('thuốc bvtv') || t.includes('thuốc bảo vệ')) return 'mrl';
  if (t.includes('an toàn thực phẩm')) return 'food_safety';
  if (t.includes('xuất khẩu') || t.includes('nhập khẩu') || t.includes('hải quan') || t.includes('nghị định thư')) return 'customs';
  if (t.includes('eudr') || t.includes('phá rừng') || t.includes('gps')) return 'eudr';
  return 'other';
}

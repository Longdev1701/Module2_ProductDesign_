/**
 * FDA Scraper - U.S. Food and Drug Administration (fda.gov)
 * Bóc tách toàn văn các quy định FSMA, cảnh báo an toàn thực phẩm, thủ tục nhập khẩu Hoa Kỳ
 */
import type { RawLegalArticle } from '../fetcher';
import { extractDocumentDetail, fetchHtml, resolveUrl } from './utils';

const BASE_URL = 'https://www.fda.gov';

const PAGES = [
  '/food/recalls-outbreaks-emergencies',           // Thu hồi & khẩn cấp
];

export async function scrapeFDA(): Promise<RawLegalArticle[]> {
  const articles: RawLegalArticle[] = [];
  const targetLinks: Array<{ title: string; url: string }> = [];

  for (const page of PAGES) {
    try {
      const $ = await fetchHtml(`${BASE_URL}${page}`);

      $('a[href^="/food/"]').each((_i, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        const href = $el.attr('href') || '';

        if (title.length < 15) return;
        if (href === page) return;

        const fullUrl = resolveUrl(BASE_URL, href);
        if (targetLinks.some((l) => l.url === fullUrl)) return;

        targetLinks.push({ title, url: fullUrl });
      });
    } catch (error: any) {
      console.error(`[FDA Scraper] Error scraping ${page}:`, error?.message);
    }
  }

  for (const item of targetLinks.slice(0, 6)) {
    try {
      const detail = await extractDocumentDetail(item.url, BASE_URL);
      articles.push({
        sourceAgency: 'U.S. Food and Drug Administration (FDA)',
        sourceCountry: 'US',
        sourceUrl: item.url,
        documentUrl: detail.documentUrl,
        sourceReference: detail.sourceReference,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: detail.fullText || item.title,
        market: 'USA',
        categoryHint: categorizeFDA(item.title),
        publishedAt: new Date(),
      });
    } catch {
      articles.push({
        sourceAgency: 'U.S. Food and Drug Administration (FDA)',
        sourceCountry: 'US',
        sourceUrl: item.url,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: item.title,
        market: 'USA',
        categoryHint: categorizeFDA(item.title),
        publishedAt: new Date(),
      });
    }
  }

  return articles;
}

function categorizeFDA(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('recall') || t.includes('outbreak')) return 'food_safety';
  if (t.includes('fsma') || t.includes('traceability')) return 'traceability';
  if (t.includes('import') || t.includes('prior notice')) return 'customs';
  if (t.includes('residue') || t.includes('pesticide')) return 'mrl';
  if (t.includes('label')) return 'labeling';
  return 'food_safety';
}

/**
 * MHLW Scraper - Bộ Y tế, Lao động và Phúc lợi Nhật Bản (mhlw.go.jp)
 * Bóc tách toàn văn các quy định về Dư lượng thuốc BVTV & An toàn thực phẩm Nhật Bản
 */
import type { RawLegalArticle } from '../fetcher';
import { extractDocumentDetail, fetchHtml, resolveUrl } from './utils';

const BASE_URL = 'https://www.mhlw.go.jp';

const PAGES = [
  '/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryu/index.html', // Dư lượng thuốc BVTV
];

export async function scrapeMHLW(): Promise<RawLegalArticle[]> {
  const articles: RawLegalArticle[] = [];
  const targetLinks: Array<{ title: string; url: string }> = [];

  for (const page of PAGES) {
    try {
      const $ = await fetchHtml(`${BASE_URL}${page}`);

      $('a[href*="/stf/"]').each((_i, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        const href = $el.attr('href') || '';

        if (title.length < 10) return;
        if (href === page) return;

        const fullUrl = resolveUrl(BASE_URL, href);
        if (targetLinks.some((l) => l.url === fullUrl)) return;

        targetLinks.push({ title, url: fullUrl });
      });
    } catch (error: any) {
      console.error(`[MHLW Scraper] Error scraping ${page}:`, error?.message);
    }
  }

  for (const item of targetLinks.slice(0, 6)) {
    try {
      const detail = await extractDocumentDetail(item.url, BASE_URL);
      articles.push({
        sourceAgency: 'Bộ Y tế, Lao động và Phúc lợi Nhật Bản (MHLW)',
        sourceCountry: 'JP',
        sourceUrl: item.url,
        documentUrl: detail.documentUrl,
        sourceReference: detail.sourceReference,
        sourceLanguage: 'ja',
        titleOriginal: item.title,
        rawContent: detail.fullText || item.title,
        market: 'JAPAN',
        categoryHint: categorizeJP(item.title),
        publishedAt: new Date(),
      });
    } catch {
      articles.push({
        sourceAgency: 'Bộ Y tế, Lao động và Phúc lợi Nhật Bản (MHLW)',
        sourceCountry: 'JP',
        sourceUrl: item.url,
        sourceLanguage: 'ja',
        titleOriginal: item.title,
        rawContent: item.title,
        market: 'JAPAN',
        categoryHint: categorizeJP(item.title),
        publishedAt: new Date(),
      });
    }
  }

  return articles.slice(0, 6);
}

function categorizeJP(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('残留') || t.includes('農薬') || t.includes('pesticide') || t.includes('residue')) return 'mrl';
  if (t.includes('食品衛生') || t.includes('food hygiene')) return 'food_safety';
  if (t.includes('包装') || t.includes('容器') || t.includes('packaging')) return 'packaging';
  if (t.includes('表示') || t.includes('label')) return 'labeling';
  return 'food_safety';
}

/**
 * MFDS Scraper - Bộ An toàn Thực phẩm và Dược phẩm Hàn Quốc (mfds.go.kr)
 * Bóc tách toàn văn các thông báo rủi ro an toàn thực phẩm & MRL PLS Hàn Quốc
 */
import type { RawLegalArticle } from '../fetcher';
import { extractDocumentDetail, fetchHtml, resolveUrl } from './utils';

const BASE_URL = 'https://www.mfds.go.kr';

const PAGES = [
  '/eng/brd/m_60/list.do',  // International Risk Information
];

export async function scrapeMFDS(): Promise<RawLegalArticle[]> {
  const articles: RawLegalArticle[] = [];
  const targetLinks: Array<{ title: string; url: string }> = [];

  for (const page of PAGES) {
    try {
      const $ = await fetchHtml(`${BASE_URL}${page}`, 15000);

      $('a[href*="view.do"]').each((_i, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        const href = $el.attr('href') || '';

        if (title.length < 15) return;

        const pageDir = page.substring(0, page.lastIndexOf('/') + 1);
        const resolvedHref = href.startsWith('./') ? `${pageDir}${href.substring(2)}` : href;
        const fullUrl = resolveUrl(BASE_URL, resolvedHref);

        if (targetLinks.some((l) => l.url === fullUrl)) return;

        targetLinks.push({ title, url: fullUrl });
      });
    } catch (error: any) {
      console.error(`[MFDS Scraper] Error scraping ${page}:`, error?.message);
    }
  }

  for (const item of targetLinks.slice(0, 6)) {
    try {
      const detail = await extractDocumentDetail(item.url, BASE_URL);
      articles.push({
        sourceAgency: 'Bộ An toàn Thực phẩm và Dược phẩm Hàn Quốc (MFDS)',
        sourceCountry: 'KR',
        sourceUrl: item.url,
        documentUrl: detail.documentUrl,
        sourceReference: detail.sourceReference,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: detail.fullText || item.title,
        market: 'KOREA',
        categoryHint: categorizeKR(item.title),
        publishedAt: new Date(),
      });
    } catch {
      articles.push({
        sourceAgency: 'Bộ An toàn Thực phẩm và Dược phẩm Hàn Quốc (MFDS)',
        sourceCountry: 'KR',
        sourceUrl: item.url,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: item.title,
        market: 'KOREA',
        categoryHint: categorizeKR(item.title),
        publishedAt: new Date(),
      });
    }
  }

  return articles;
}

function categorizeKR(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('pesticide') || t.includes('residue') || t.includes('pls') || t.includes('mrl')) return 'mrl';
  if (t.includes('recall') || t.includes('safety') || t.includes('outbreak') || t.includes('sick')) return 'food_safety';
  if (t.includes('import') || t.includes('quarantine')) return 'phytosanitary';
  if (t.includes('label') || t.includes('standard') || t.includes('coloring') || t.includes('additive')) return 'labeling';
  return 'food_safety';
}

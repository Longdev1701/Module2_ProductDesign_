/**
 * FSANZ Scraper - Cơ quan Tiêu chuẩn Thực phẩm Úc-New Zealand (foodstandards.gov.au)
 * Bóc tách toàn văn các quy chuẩn kỹ thuật và tiêu chuẩn thực phẩm nhập khẩu Úc
 */
import type { RawLegalArticle } from '../fetcher';
import { extractDocumentDetail, fetchHtml, resolveUrl } from './utils';

const BASE_URL = 'https://www.foodstandards.gov.au';

const PAGES = [
  '/consumer/safety',
  '/consumer/importedfoods',
];

export async function scrapeFSANZ(): Promise<RawLegalArticle[]> {
  const articles: RawLegalArticle[] = [];
  const targetLinks: Array<{ title: string; url: string }> = [];

  for (const page of PAGES) {
    try {
      const $ = await fetchHtml(`${BASE_URL}${page}`);

      $('a').each((_i, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        const href = $el.attr('href') || '';

        if (title.length < 15) return;
        if (href === '#' || href.startsWith('javascript') || href.startsWith('mailto:')) return;
        if (href === page) return;

        const fullUrl = resolveUrl(BASE_URL, href);
        if (!fullUrl.includes('foodstandards.gov.au')) return;
        if (targetLinks.some((l) => l.url === fullUrl)) return;

        targetLinks.push({ title, url: fullUrl });
      });
    } catch (error: any) {
      console.error(`[FSANZ Scraper] Error scraping ${page}:`, error?.message);
    }
  }

  for (const item of targetLinks.slice(0, 6)) {
    try {
      const detail = await extractDocumentDetail(item.url, BASE_URL);
      articles.push({
        sourceAgency: 'Cơ quan Tiêu chuẩn Thực phẩm Úc-NZ (FSANZ)',
        sourceCountry: 'AU',
        sourceUrl: item.url,
        documentUrl: detail.documentUrl,
        sourceReference: detail.sourceReference,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: detail.fullText || item.title,
        market: 'AUSTRALIA',
        categoryHint: categorizeAU(item.title),
        publishedAt: new Date(),
      });
    } catch {
      articles.push({
        sourceAgency: 'Cơ quan Tiêu chuẩn Thực phẩm Úc-NZ (FSANZ)',
        sourceCountry: 'AU',
        sourceUrl: item.url,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: item.title,
        market: 'AUSTRALIA',
        categoryHint: categorizeAU(item.title),
        publishedAt: new Date(),
      });
    }
  }

  return articles;
}

function categorizeAU(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('residue') || t.includes('chemical') || t.includes('mrl')) return 'mrl';
  if (t.includes('import') || t.includes('export')) return 'customs';
  if (t.includes('safety') || t.includes('recall') || t.includes('alert')) return 'food_safety';
  if (t.includes('standard') || t.includes('code')) return 'food_safety';
  if (t.includes('label') || t.includes('packaging')) return 'labeling';
  return 'food_safety';
}

/**
 * SFA Scraper - Cơ quan Thực phẩm Singapore (sfa.gov.sg)
 * Bóc tách toàn văn các quy định & điều kiện nhập khẩu nông sản thực phẩm Singapore
 */
import type { RawLegalArticle } from '../fetcher';
import { extractDocumentDetail, fetchHtml, resolveUrl } from './utils';

const BASE_URL = 'https://www.sfa.gov.sg';

const PAGES = [
  '/food-import-export',
  '/food-import-export/commercial-food-imports',
];

export async function scrapeSFA(): Promise<RawLegalArticle[]> {
  const articles: RawLegalArticle[] = [];
  const targetLinks: Array<{ title: string; url: string }> = [];

  for (const page of PAGES) {
    try {
      const $ = await fetchHtml(`${BASE_URL}${page}`);

      $('a[href*="/food-"]').each((_i, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        const href = $el.attr('href') || '';

        if (title.length < 15) return;
        if (href === page) return;

        const fullUrl = resolveUrl(BASE_URL, href);
        if (!fullUrl.includes('sfa.gov.sg')) return;
        if (targetLinks.some((l) => l.url === fullUrl)) return;

        targetLinks.push({ title, url: fullUrl });
      });
    } catch (error: any) {
      console.error(`[SFA Scraper] Error scraping ${page}:`, error?.message);
    }
  }

  for (const item of targetLinks.slice(0, 6)) {
    try {
      const detail = await extractDocumentDetail(item.url, BASE_URL);
      articles.push({
        sourceAgency: 'Cơ quan Thực phẩm Singapore (SFA)',
        sourceCountry: 'SG',
        sourceUrl: item.url,
        documentUrl: detail.documentUrl,
        sourceReference: detail.sourceReference,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: detail.fullText || item.title,
        market: 'SINGAPORE',
        categoryHint: categorizeSG(item.title),
        publishedAt: new Date(),
      });
    } catch {
      articles.push({
        sourceAgency: 'Cơ quan Thực phẩm Singapore (SFA)',
        sourceCountry: 'SG',
        sourceUrl: item.url,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: item.title,
        market: 'SINGAPORE',
        categoryHint: categorizeSG(item.title),
        publishedAt: new Date(),
      });
    }
  }

  return articles;
}

function categorizeSG(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('import') || t.includes('export')) return 'customs';
  if (t.includes('regulation') || t.includes('standard')) return 'food_safety';
  if (t.includes('safety') || t.includes('recall')) return 'food_safety';
  if (t.includes('label') || t.includes('packaging')) return 'labeling';
  if (t.includes('residue') || t.includes('pesticide')) return 'mrl';
  return 'food_safety';
}

/**
 * FSA Scraper - Cơ quan Tiêu chuẩn Thực phẩm Anh Quốc (food.gov.uk)
 * Bóc tách toàn văn các hướng dẫn kiểm soát thực phẩm nhập khẩu, an toàn vệ sinh & MRL Anh Quốc
 */
import type { RawLegalArticle } from '../fetcher';
import { extractDocumentDetail, fetchHtml, resolveUrl } from './utils';

const BASE_URL = 'https://www.food.gov.uk';

export async function scrapeFSA(): Promise<RawLegalArticle[]> {
  const articles: RawLegalArticle[] = [];
  const targetLinks: Array<{ title: string; url: string }> = [];

  try {
    const $ = await fetchHtml(BASE_URL);

    $('a[href*="/business-guidance"], a[href*="/safety-hygiene"]').each((_i, el) => {
      const $el = $(el);
      const title = $el.text().trim();
      const href = $el.attr('href') || '';

      if (title.length < 15) return;

      const fullUrl = resolveUrl(BASE_URL, href);
      if (targetLinks.some((l) => l.url === fullUrl)) return;

      targetLinks.push({ title, url: fullUrl });
    });
  } catch (error: any) {
    console.error(`[FSA Scraper] Error:`, error?.message);
  }

  for (const item of targetLinks.slice(0, 6)) {
    try {
      const detail = await extractDocumentDetail(item.url, BASE_URL);
      articles.push({
        sourceAgency: 'Cơ quan Tiêu chuẩn Thực phẩm Anh Quốc (FSA)',
        sourceCountry: 'GB',
        sourceUrl: item.url,
        documentUrl: detail.documentUrl,
        sourceReference: detail.sourceReference,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: detail.fullText || item.title,
        market: 'UK',
        categoryHint: categorizeUK(item.title),
        publishedAt: new Date(),
      });
    } catch {
      articles.push({
        sourceAgency: 'Cơ quan Tiêu chuẩn Thực phẩm Anh Quốc (FSA)',
        sourceCountry: 'GB',
        sourceUrl: item.url,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: item.title,
        market: 'UK',
        categoryHint: categorizeUK(item.title),
        publishedAt: new Date(),
      });
    }
  }

  return articles;
}

function categorizeUK(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('residue') || t.includes('pesticide')) return 'mrl';
  if (t.includes('recall') || t.includes('alert') || t.includes('safety')) return 'food_safety';
  if (t.includes('import') || t.includes('export')) return 'customs';
  if (t.includes('label') || t.includes('allergen')) return 'labeling';
  if (t.includes('organic')) return 'eudr';
  return 'food_safety';
}

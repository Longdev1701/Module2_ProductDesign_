/**
 * EU Food Safety Scraper - Cổng An toàn Thực phẩm Châu Âu (food.ec.europa.eu)
 * Bóc tách toàn văn các quy định MRL, EUDR, RASFF và Luật Thực phẩm Châu Âu
 */
import type { RawLegalArticle } from '../fetcher';
import { extractDocumentDetail, fetchHtml, resolveUrl } from './utils';

const BASE_URL = 'https://food.ec.europa.eu';

const PAGES = [
  '/safety/rasff-food-and-feed-safety-alerts_en',     // RASFF - Hệ thống cảnh báo nhanh
  '/horizontal-topics/general-food-law_en',             // Luật thực phẩm chung
  '/plants/plant-health-and-biosecurity_en',            // Kiểm dịch thực vật
];

export async function scrapeEUFoodSafety(): Promise<RawLegalArticle[]> {
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
        if (!fullUrl.includes('europa.eu')) return;
        if (targetLinks.some((l) => l.url === fullUrl)) return;

        targetLinks.push({ title, url: fullUrl });
      });
    } catch (error: any) {
      console.error(`[EU Food Safety Scraper] Error scraping ${page}:`, error?.message);
    }
  }

  for (const item of targetLinks.slice(0, 6)) {
    try {
      const detail = await extractDocumentDetail(item.url, BASE_URL);
      articles.push({
        sourceAgency: 'Ủy ban Châu Âu - An toàn Thực phẩm (EC)',
        sourceCountry: 'EU',
        sourceUrl: item.url,
        documentUrl: detail.documentUrl,
        sourceReference: detail.sourceReference,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: detail.fullText || item.title,
        market: 'EU',
        categoryHint: categorizeEU(item.title),
        publishedAt: new Date(),
      });
    } catch {
      articles.push({
        sourceAgency: 'Ủy ban Châu Âu - An toàn Thực phẩm (EC)',
        sourceCountry: 'EU',
        sourceUrl: item.url,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: item.title,
        market: 'EU',
        categoryHint: categorizeEU(item.title),
        publishedAt: new Date(),
      });
    }
  }

  return articles;
}

function categorizeEU(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('residue') || t.includes('pesticide') || t.includes('mrl')) return 'mrl';
  if (t.includes('deforestation') || t.includes('eudr')) return 'eudr';
  if (t.includes('rasff') || t.includes('alert') || t.includes('recall')) return 'food_safety';
  if (t.includes('import') || t.includes('customs') || t.includes('border')) return 'customs';
  if (t.includes('label') || t.includes('organic')) return 'labeling';
  if (t.includes('plant health') || t.includes('quarantine') || t.includes('phytosanitary')) return 'phytosanitary';
  if (t.includes('traceability')) return 'traceability';
  return 'food_safety';
}

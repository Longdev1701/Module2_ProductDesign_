/**
 * GACC English Scraper - Tổng cục Hải quan Trung Quốc (english.customs.gov.cn)
 * Bóc tách toàn văn các quy định, nghị định, thông báo hải quan Trung Quốc
 */
import type { RawLegalArticle } from '../fetcher';
import { extractDocumentDetail, fetchHtml, resolveUrl } from './utils';

const BASE_URL = 'http://english.customs.gov.cn';

export async function scrapeGACCEnglish(): Promise<RawLegalArticle[]> {
  const articles: RawLegalArticle[] = [];
  const targetLinks: Array<{ title: string; url: string }> = [];

  try {
    const $ = await fetchHtml(BASE_URL);

    $('a').each((_i, el) => {
      const $el = $(el);
      const title = $el.text().trim();
      const href = $el.attr('href') || '';
      const cleanTitle = title.replace(/^[•·\s]+/, '').trim();

      if (cleanTitle.length < 10) return;
      if (href === '#' || href.startsWith('javascript') || href.startsWith('mailto:')) return;
      if (href === '/') return;

      const fullUrl = resolveUrl(BASE_URL, href);
      if (targetLinks.some((l) => l.url === fullUrl)) return;

      targetLinks.push({ title: cleanTitle, url: fullUrl });
    });
  } catch (error: any) {
    console.error(`[GACC Scraper] Error:`, error?.message);
  }

  for (const item of targetLinks.slice(0, 6)) {
    try {
      const detail = await extractDocumentDetail(item.url, BASE_URL);
      articles.push({
        sourceAgency: 'Tổng cục Hải quan Trung Quốc (GACC)',
        sourceCountry: 'CN',
        sourceUrl: item.url,
        documentUrl: detail.documentUrl,
        sourceReference: detail.sourceReference,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: detail.fullText || item.title,
        market: 'CHINA',
        categoryHint: categorizeCN(item.title),
        publishedAt: new Date(),
      });
    } catch {
      articles.push({
        sourceAgency: 'Tổng cục Hải quan Trung Quốc (GACC)',
        sourceCountry: 'CN',
        sourceUrl: item.url,
        sourceLanguage: 'en',
        titleOriginal: item.title,
        rawContent: item.title,
        market: 'CHINA',
        categoryHint: categorizeCN(item.title),
        publishedAt: new Date(),
      });
    }
  }

  return articles;
}

function categorizeCN(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('quarantine') || t.includes('phytosanitary') || t.includes('pest') || t.includes('inspection')) return 'phytosanitary';
  if (t.includes('law') || t.includes('regulation') || t.includes('decree') || t.includes('announcement')) return 'customs';
  if (t.includes('residue') || t.includes('pesticide')) return 'mrl';
  if (t.includes('import') || t.includes('export') || t.includes('customs') || t.includes('tariff') || t.includes('clearance')) return 'customs';
  if (t.includes('food safety') || t.includes('recall')) return 'food_safety';
  if (t.includes('label') || t.includes('packaging')) return 'labeling';
  return 'customs';
}

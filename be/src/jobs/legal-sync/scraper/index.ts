/**
 * Scraper Dispatcher - Thu thập quy định TRỰC TIẾP từ website chính phủ
 * 
 * ❌ KHÔNG dùng Google News, báo chí, hay bất kỳ bên thứ 3 nào
 * ✅ 100% từ cổng thông tin chính thức của chính phủ các nước
 */
import type { RawLegalArticle } from '../fetcher';
import { scrapePPD } from './ppd-scraper';
import { scrapeGACCEnglish } from './gacc-scraper';
import { scrapeFDA } from './fda-scraper';
import { scrapeMHLW } from './mhlw-scraper';
import { scrapeMFDS } from './mfds-scraper';
import { scrapeFSANZ } from './fsanz-scraper';
import { scrapeSFA } from './sfa-scraper';
import { scrapeFSA } from './fsa-scraper';
import { scrapeEUFoodSafety } from './eu-food-safety-scraper';

interface ScraperResult {
  source: string;
  articles: RawLegalArticle[];
  error?: string;
}

/**
 * Thu thập tin tức pháp lý từ 9 cổng thông tin chính phủ chính thức.
 * Tất cả chạy song song (parallel). Mỗi scraper được bọc try-catch riêng.
 */
export async function fetchAllLegalArticles(): Promise<RawLegalArticle[]> {
  const scraperTasks: Promise<ScraperResult>[] = [
    runScraper('🇻🇳 Cục BVTV (ppd.gov.vn)', scrapePPD),
    runScraper('🇨🇳 GACC (english.customs.gov.cn)', scrapeGACCEnglish),
    runScraper('🇺🇸 FDA (fda.gov)', scrapeFDA),
    runScraper('🇯🇵 MHLW (mhlw.go.jp)', scrapeMHLW),
    runScraper('🇰🇷 MFDS (mfds.go.kr)', scrapeMFDS),
    runScraper('🇦🇺 FSANZ (foodstandards.gov.au)', scrapeFSANZ),
    runScraper('🇸🇬 SFA (sfa.gov.sg)', scrapeSFA),
    runScraper('🇬🇧 FSA (food.gov.uk)', scrapeFSA),
    runScraper('🇪🇺 EU Food Safety (food.ec.europa.eu)', scrapeEUFoodSafety),
  ];

  const results = await Promise.all(scraperTasks);

  let totalArticles = 0;
  for (const result of results) {
    if (result.error) {
      console.warn(`[Scraper] ⚠️ ${result.source}: ${result.error}`);
    } else {
      console.log(`[Scraper] ✅ ${result.source}: ${result.articles.length} bài`);
    }
    totalArticles += result.articles.length;
  }

  console.log(`[Scraper] 📊 Tổng cộng: ${totalArticles} bài từ ${results.length} nguồn chính phủ`);

  return results.flatMap((r) => r.articles);
}

async function runScraper(
  source: string,
  scraperFn: () => Promise<RawLegalArticle[]>,
): Promise<ScraperResult> {
  try {
    const articles = await scraperFn();
    return { source, articles };
  } catch (error: any) {
    return { source, articles: [], error: error?.message || 'Unknown error' };
  }
}

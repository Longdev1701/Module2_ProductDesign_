import { fetchAllLegalArticles } from './scraper';

export interface RawLegalArticle {
  sourceAgency: string;
  sourceCountry?: string;
  sourceUrl: string;
  documentUrl?: string;
  sourceReference?: string;
  sourceLanguage?: string;
  titleOriginal: string;
  rawContent: string;
  market: 'VIETNAM' | 'CHINA' | 'EU' | 'USA' | 'JAPAN' | 'KOREA' | 'AUSTRALIA' | 'SINGAPORE' | 'UK' | 'UAE';
  categoryHint?: string;
  publishedAt?: Date;
}

/**
 * Thu thập danh sách bài tin thô từ các nguồn quy định nông sản xuất khẩu chính
 * 10 thị trường: Vietnam (PPD), China (GACC), EU (EUR-Lex), USA (FDA),
 * Japan (MHLW), Korea (MFDS), Australia (DAFF), Singapore (SFA), UK (FSA), UAE (ESMA)
 * 
 * Sử dụng kiến trúc Multi-Strategy Scraper:
 * - Axios + Cheerio: PPD, FDA, MHLW, MFDS, DAFF, EUR-Lex, FSA
 * - Google News site: filter: GACC, SFA, UAE (trang bị chặn Bot)
 */
export async function fetchRawLegalArticles(): Promise<RawLegalArticle[]> {
  return fetchAllLegalArticles();
}

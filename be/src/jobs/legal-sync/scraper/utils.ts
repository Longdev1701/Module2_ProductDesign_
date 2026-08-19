/**
 * Scraper Utils - Hàm bóc tách nội dung văn bản pháp lý chuyên sâu
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

const AGENT = new https.Agent({ rejectUnauthorized: false });

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'vi,en,zh,ja,ko;q=0.9',
};

/**
 * Tải HTML từ URL với giả lập trình duyệt
 */
export async function fetchHtml(url: string, timeout = 20000): Promise<cheerio.CheerioAPI> {
  const { data } = await axios.get(url, {
    httpsAgent: AGENT,
    headers: BROWSER_HEADERS,
    timeout,
    maxRedirects: 5,
  });
  return cheerio.load(data);
}

/**
 * Cắt ngắn nội dung text
 */
export function truncate(text: string, maxLen = 15000): string {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
}

/**
 * Resolve URL tương đối thành tuyệt đối
 */
export function resolveUrl(baseUrl: string, relativeUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).toString();
  } catch {
    return relativeUrl;
  }
}

export interface ExtractedDocumentContent {
  fullText: string;
  documentUrl?: string;
  sourceReference?: string;
}

/**
 * Bóc tách toàn văn nội dung văn bản pháp lý từ một trang chi tiết
 * Tự động loại bỏ mã rác, script, banner, navigation
 * Tìm kiếm link tệp đính kèm văn bản gốc (.pdf, .docx)
 */
export async function extractDocumentDetail(
  detailUrl: string,
  baseUrl: string,
  timeout = 15000
): Promise<ExtractedDocumentContent> {
  try {
    const $ = await fetchHtml(detailUrl, timeout);

    // Loại bỏ các thẻ không chứa nội dung văn bản
    $('script, style, noscript, nav, header, footer, svg, .menu, .sidebar, #header, #footer, .breadcrumb, iframe, .advertisement').remove();

    // Tìm file PDF đính kèm (văn bản quy phạm, công văn, nghị định)
    let documentUrl: string | undefined;
    $('a[href*=".pdf"], a[href*=".PDF"], a[href*="download"], a[href*="attachment"]').each((_i, el) => {
      if (documentUrl) return;
      const href = $(el).attr('href');
      if (href && (href.toLowerCase().includes('.pdf') || href.toLowerCase().includes('download'))) {
        documentUrl = resolveUrl(baseUrl, href);
      }
    });

    // Lấy nội dung văn bản chính
    let fullText = '';
    const mainSelectors = [
      'article',
      '.content-detail',
      '.detail-content',
      '.news-detail',
      '.post-content',
      '#main-content',
      'main',
      '.ecl-container',
      '.field-item',
      '.col-md-9',
      'body',
    ];

    for (const selector of mainSelectors) {
      const el = $(selector);
      if (el.length > 0) {
        const text = el.text().replace(/\s+/g, ' ').trim();
        if (text.length > fullText.length) {
          fullText = text;
        }
      }
    }

    // Trích xuất mã số hiệu văn bản nếu có (VD: Quyết định số 123/QĐ-BNN, Thông báo số 66, Regulation (EU) 2023/...)
    let sourceReference: string | undefined;
    const refMatch = fullText.match(/(?:Số|No\.|Number|Số hiệu|Quyết định số|Thông tư số|Nghị định số|Regulation \(EU\)|Directive \(EU\)|Announcement No\.)\s*[:\s]*([0-9A-Za-z\/\-_–]+)/i);
    if (refMatch && refMatch[1]) {
      sourceReference = refMatch[0].trim();
    }

    return {
      fullText: truncate(fullText, 12000),
      documentUrl,
      sourceReference,
    };
  } catch (error: any) {
    return {
      fullText: '',
    };
  }
}

"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, FileText, FolderDown, ShieldCheck } from "lucide-react";

import { api } from "@/lib/api";
import { isSafeHttpUrl } from "@/lib/safe-url";
import { OfficialDocumentsDialog } from "./OfficialDocumentsDialog";
import type { LegalUpdateFeedItem } from "@/features/legal-updates/types";

interface DocumentItem {
  id: string;
  name: string;
  url: string;
  agency: string;
  market: string;
}

export function OfficialDocumentsWidget() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(2);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadDocuments() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          sort: "publishedAt:desc",
        });

        const res = await api.get<LegalUpdateFeedItem[]>(`/legal-updates/feed?${params.toString()}`);
        const feedItems = res.data ?? [];
        const totalCount = res.meta?.total ?? feedItems.length;

        const docs: DocumentItem[] = feedItems.map((item) => {
          const url = item.sourceUrl && isSafeHttpUrl(item.sourceUrl) ? item.sourceUrl : "https://eur-lex.europa.eu";
          let docName = `${item.title}.pdf`;
          if (item.sourceAgency === "GACC" && item.title.includes("议定书")) {
            docName = "Nghị định thư sầu riêng GACC 2024.pdf";
          } else if (item.sourceAgency === "GACC") {
            docName = "Hướng dẫn đăng ký GACC vườn trồng 2026.pdf";
          } else if (item.market === "EU") {
            docName = "Quy định giới hạn dư lượng MRL EU 2026.pdf";
          } else if (item.market === "USA") {
            docName = "Quy tắc truy xuất nguồn gốc FDA FSMA 204.pdf";
          }

          return {
            id: item.id,
            name: docName,
            url,
            agency: item.sourceAgency ?? "GACC",
            market: item.market,
          };
        });

        setDocuments(docs);
        setTotal(totalCount);
        setTotalPages(res.meta?.totalPages ?? Math.ceil(totalCount / pageSize) ?? 1);
      } catch {
        setDocuments([
          {
            id: "gacc-proto-1",
            name: "Nghị định thư sầu riêng GACC 2024.pdf",
            url: "http://customs.gov.cn/notice/protocol-durian-vietnam-china-2022.pdf",
            agency: "GACC",
            market: "CHINA",
          },
          {
            id: "gacc-guide-2",
            name: "Hướng dẫn đăng ký GACC vườn trồng.pdf",
            url: "http://customs.gov.cn/notice/2026-durian-gacc-approval-45.pdf",
            agency: "GACC",
            market: "CHINA",
          },
        ]);
        setTotal(2);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    }

    void loadDocuments();
  }, [page, pageSize]);

  return (
    <>
      <div className="bg-[#dae2ff] p-6 rounded-2xl border border-[#b1c5ff] shadow-xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-4 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <ShieldCheck className="h-5 w-5 text-[#00327d] shrink-0" aria-hidden="true" />
              <h3 className="font-serif text-lg font-bold text-[#191c1e] truncate">Tài liệu GACC & Pháp lý mới</h3>
            </div>
            {total > 0 && (
              <span className="text-xs font-bold text-[#00327d] bg-white/70 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                {total} file
              </span>
            )}
          </div>

          {/* List Content */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-12 bg-white/70 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3 min-h-[110px]">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-white hover:bg-white/95 rounded-xl flex items-center justify-between gap-3 shadow-xs border border-transparent hover:border-[#00327d]/30 transition-all cursor-pointer group"
                  title={`Tải về ${doc.name}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <FileText className="h-4 w-4 text-[#00327d] shrink-0" aria-hidden="true" />
                    <span className="text-xs font-semibold text-[#191c1e] group-hover:text-[#00327d] transition-colors truncate">
                      {doc.name}
                    </span>
                  </div>
                  <Download className="h-4 w-4 text-[#00327d] shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation & View All Trigger */}
        <div className="mt-4 pt-3 border-t border-[#b1c5ff]/60 flex items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-1.5 font-bold text-[#00327d] hover:underline whitespace-nowrap shrink-0"
          >
            <FolderDown className="h-4 w-4 shrink-0" aria-hidden="true" />
            Xem tất cả ({total})
          </button>

          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            <span className="text-[11px] font-semibold text-[#00327d]">
              {page} / {totalPages}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
                className="p-1 rounded-md text-[#00327d] hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Trang trước"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
                className="p-1 rounded-md text-[#00327d] hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Trang sau"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog View All Documents with Search and Full Pagination */}
      <OfficialDocumentsDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}

export default OfficialDocumentsWidget;

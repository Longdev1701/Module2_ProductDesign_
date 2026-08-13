"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Download, FileText, Search, X } from "lucide-react";
import { api } from "@/lib/api";
import { isSafeHttpUrl } from "@/lib/safe-url";
import type { LegalUpdateFeedItem } from "@/features/legal-updates/types";

interface DocumentItem {
  id: string;
  name: string;
  url: string;
  agency: string;
  market: string;
  date: string | null;
}

export function OfficialDocumentsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(6);
  const [search, setSearch] = useState<string>("");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort: "publishedAt:desc",
      });
      if (search.trim()) {
        params.append("search", search.trim());
      }

      const res = await api.get<LegalUpdateFeedItem[]>(`/legal-updates/feed?${params.toString()}`);
      const feedItems = res.data ?? [];
      const totalCount = res.meta?.total ?? feedItems.length;

      const docs: DocumentItem[] = feedItems.map((item) => {
        const url = item.sourceUrl && isSafeHttpUrl(item.sourceUrl) ? item.sourceUrl : "https://eur-lex.europa.eu";
        let docName = `${item.title}.pdf`;
        if (item.sourceAgency === "GACC" && item.title.includes("议定书")) {
          docName = "Nghị định thư sầu riêng tươi GACC 2024.pdf";
        } else if (item.sourceAgency === "GACC") {
          docName = "Hướng dẫn đăng ký GACC mã số vùng trồng & đóng gói 2026.pdf";
        } else if (item.market === "EU") {
          docName = "Quy định giới hạn dư lượng MRL EU 2026.pdf";
        } else if (item.market === "USA") {
          docName = "Hướng dẫn thực thi quy tắc truy xuất nguồn gốc FDA FSMA 204.pdf";
        }

        return {
          id: item.id,
          name: docName,
          url,
          agency: item.sourceAgency ?? "GACC",
          market: item.market,
          date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("vi-VN") : null,
        };
      });

      setDocuments(docs);
      setTotal(totalCount);
      setTotalPages(res.meta?.totalPages ?? Math.ceil(totalCount / pageSize) ?? 1);
    } catch (err: any) {
      setError(err?.message || "Không thể tải danh sách tài liệu pháp lý");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      void loadDocuments();
    }
  }, [isOpen, page, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div
        aria-modal="true"
        role="dialog"
        aria-labelledby="documents-dialog-title"
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-outline-variant bg-surface p-6 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-outline-variant pb-4">
          <div>
            <h2 id="documents-dialog-title" className="font-serif text-2xl font-bold text-on-surface flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
              Kho Tài liệu GACC & Quy định Pháp lý
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Tổng cộng <span className="font-bold text-primary">{total}</span> tài liệu và văn bản hướng dẫn chính thức
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm kiếm tài liệu GACC, EU, FDA, mã số vùng trồng..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {isLoading && (
            <div className="space-y-3 py-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 rounded-xl border border-outline-variant bg-surface-container-low animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-xl border border-outline-variant p-6 text-center text-on-surface">
              <AlertCircle className="mx-auto h-6 w-6 text-error mb-2" aria-hidden="true" />
              <p className="font-semibold text-sm">{error}</p>
              <button type="button" onClick={() => void loadDocuments()} className="mt-2 text-xs font-semibold text-primary hover:underline">
                Thử lại
              </button>
            </div>
          )}

          {!isLoading && !error && documents.length === 0 && (
            <div className="rounded-xl border border-outline-variant p-8 text-center text-on-surface-variant">
              <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" aria-hidden="true" />
              <p className="font-semibold text-sm text-on-surface">Không tìm thấy tài liệu phù hợp</p>
            </div>
          )}

          {!isLoading && !error && documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 bg-surface hover:bg-surface-container-low rounded-xl flex items-center justify-between gap-3 border border-outline-variant/60 hover:border-primary/40 shadow-2xs transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                    {doc.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                    <span className="font-semibold text-primary">{doc.agency}</span>
                    <span>•</span>
                    <span>Thị trường: {doc.market}</span>
                    {doc.date && (
                      <>
                        <span>•</span>
                        <span>{doc.date}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-primary group-hover:underline hidden sm:inline">Tải PDF</span>
                <Download className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>

        {/* Footer & Pagination */}
        <div className="mt-4 pt-4 border-t border-outline-variant flex items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant">
            Trang <span className="font-bold text-on-surface">{page}</span> / <span className="font-bold text-on-surface">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Trang trước
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Trang sau
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

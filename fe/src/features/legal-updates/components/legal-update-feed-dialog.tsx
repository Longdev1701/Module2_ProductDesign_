"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, FileText, Search, X } from "lucide-react";
import { api } from "@/lib/api";
import { isSafeHttpUrl } from "@/lib/safe-url";
import { LegalUpdateDetailDialog } from "./legal-update-detail-dialog";
import type { LegalUpdateFeedItem } from "../types";

export function LegalUpdateFeedDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [market, setMarket] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);

  const [items, setItems] = useState<LegalUpdateFeedItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort: "publishedAt:desc",
      });
      if (market !== "ALL") params.append("market", market);
      if (search.trim()) params.append("search", search.trim());

      const res = await api.get<LegalUpdateFeedItem[]>(`/legal-updates/feed?${params.toString()}`);
      setItems(res.data ?? []);
      setTotal(res.meta?.total ?? res.data?.length ?? 0);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err: any) {
      setError(err?.message || "Không thể tải danh sách tin tức pháp lý");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      void loadFeed();
    }
  }, [isOpen, page, market, search]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
        <div
          aria-modal="true"
          role="dialog"
          aria-labelledby="feed-dialog-title"
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-outline-variant bg-surface p-6 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-outline-variant pb-4">
            <div>
              <h2 id="feed-dialog-title" className="font-serif text-2xl font-bold text-on-surface">
                Tất cả Cập nhật & Quy định Pháp lý
              </h2>
              <p className="text-sm text-on-surface-variant">
                Tổng cộng <span className="font-bold text-primary">{total}</span> văn bản và thông báo cập nhật
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

          {/* Search & Filters */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm kiếm tin tức..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { code: "ALL", label: "Tất cả" },
                { code: "CHINA", label: "🇨🇳 Trung Quốc" },
                { code: "EU", label: "🇪🇺 EU" },
                { code: "USA", label: "🇺🇸 Hoa Kỳ" },
                { code: "JAPAN", label: "🇯🇵 Nhật Bản" },
                { code: "KOREA", label: "🇰🇷 Hàn Quốc" },
                { code: "AUSTRALIA", label: "🇦🇺 Úc" },
                { code: "SINGAPORE", label: "🇸🇬 Singapore" },
                { code: "UK", label: "🇬🇧 Anh Quốc" },
                { code: "UAE", label: "🇦🇪 UAE" },
              ].map((m) => (
                <button
                  key={m.code}
                  type="button"
                  onClick={() => {
                    setMarket(m.code);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    market === m.code
                      ? "bg-primary text-white"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

          </div>

          {/* Content Body */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
            {isLoading && (
              <div className="space-y-3 py-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-xl border border-outline-variant p-4 space-y-2.5 animate-pulse bg-surface">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-32 rounded bg-surface-container-high" />
                      <div className="h-3 w-16 rounded bg-surface-container-high" />
                    </div>
                    <div className="h-5 w-3/4 rounded bg-surface-container-high" />
                    <div className="h-3.5 w-full rounded bg-surface-container-high" />
                    <div className="pt-2 flex justify-between items-center border-t border-outline-variant/30">
                      <div className="h-3 w-20 rounded bg-surface-container-high" />
                      <div className="h-3 w-16 rounded bg-surface-container-high" />
                    </div>
                  </div>
                ))}
              </div>
            )}


            {!isLoading && error && (
              <div className="rounded-xl border border-outline-variant p-6 text-center text-on-surface">
                <AlertCircle className="mx-auto h-6 w-6 text-error mb-2" aria-hidden="true" />
                <p className="font-semibold">{error}</p>
                <button type="button" onClick={() => void loadFeed()} className="mt-2 text-sm font-semibold text-primary hover:underline">
                  Thử lại
                </button>
              </div>
            )}

            {!isLoading && !error && items.length === 0 && (
              <div className="rounded-xl border border-outline-variant p-8 text-center text-on-surface-variant">
                <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" aria-hidden="true" />
                <p className="font-semibold text-on-surface">Không tìm thấy bản tin nào</p>
                <p className="text-xs mt-1">Hãy thử tìm với từ khóa hoặc bộ lọc khác.</p>
              </div>
            )}

            {!isLoading && !error && items.map((item) => {
              const publishedAt = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("vi-VN") : null;
              const sourceUrl = isSafeHttpUrl(item.sourceUrl) ? item.sourceUrl : null;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedDetailId(item.id)}
                  className="rounded-xl border border-outline-variant bg-surface p-4 hover:border-primary hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary uppercase">{item.market}</span>
                      <span>•</span>
                      <span className="capitalize">{item.category}</span>
                      {typeof item.affectedProductCount === 'number' && item.affectedProductCount > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Ảnh hưởng đến {item.affectedProductCount} sản phẩm
                        </span>
                      )}
                    </div>
                    {publishedAt && <span>{publishedAt}</span>}
                  </div>

                  <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-1 text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-outline-variant/40">
                    <span className="text-on-surface-variant">Nguồn: {item.sourceAgency}</span>
                    <span className="text-primary font-semibold group-hover:underline">Xem chi tiết →</span>
                  </div>
                </div>
              );
            })}
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

      <LegalUpdateDetailDialog id={selectedDetailId} onClose={() => setSelectedDetailId(null)} />
    </>
  );
}

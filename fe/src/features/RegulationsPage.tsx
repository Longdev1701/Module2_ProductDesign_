"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LegalTrackingWidget } from "@/components/LegalTrackingWidget";
import { LegalUpdateDetailDialog } from "@/features/legal-updates/components/legal-update-detail-dialog";
import { api } from "@/lib/api";
import { AlertCircle, ChevronLeft, ChevronRight, FileText, Loader2, Search, Sparkles, X } from "lucide-react";
import type { LegalUpdateFeedItem } from "@/features/legal-updates/types";

const categoryLabels: Record<string, string> = {
  mrl: "MRL (Dư lượng)",
  phytosanitary: "Kiểm dịch PHYTO",
  eudr: "EUDR Chống phá rừng",
  packaging: "Bao bì thực phẩm",
  traceability: "Truy xuất nguồn gốc",
  food_safety: "An toàn thực phẩm",
  customs: "Hải quan",
  certificate: "Chứng nhận",
  organic: "Hữu cơ",
  quota_tariff: "Thuế & Hạn ngạch",
  registration: "Mã vùng trồng",
  inspection: "Kiểm tra",
  recall: "Thu hồi",
  market_access: "Mở cửa thị trường",
  other: "Quy định khác",
};

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "Đang hiệu lực";
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "Đang hiệu lực";
    return date.toLocaleDateString("vi-VN");
  } catch {
    return "Đang hiệu lực";
  }
}

function RegulationsSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-[220px] rounded-xl border border-outline-variant bg-surface p-6 animate-pulse space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 rounded bg-surface-container-high" />
              <div className="h-3 w-16 rounded bg-surface-container-high" />
            </div>
            <div className="h-5 w-4/5 rounded bg-surface-container-high" />
            <div className="h-3.5 w-full rounded bg-surface-container-high" />
            <div className="h-3.5 w-2/3 rounded bg-surface-container-high" />
          </div>
          <div className="pt-3 border-t border-outline-variant/40 flex justify-between items-center">
            <div className="h-3.5 w-24 rounded bg-surface-container-high" />
            <div className="h-3.5 w-16 rounded bg-surface-container-high" />
          </div>
        </div>
      ))}
    </div>
  );
}

type RegulationsCacheEntry = {
  items: LegalUpdateFeedItem[];
  total: number;
  totalPages: number;
  timestamp: number;
};

// Global in-memory cache per query key for instant 0ms route transitions
const inMemoryRegulationsCache: Record<string, RegulationsCacheEntry> = {};

export default function RegulationsPage() {
  const [selectedMarket, setSelectedMarket] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(9);

  const currentCacheKey = `${page}_${pageSize}_${selectedMarket}_${selectedCategory}_${searchQuery.trim()}`;

  const [items, setItems] = useState<LegalUpdateFeedItem[]>(() => {
    return inMemoryRegulationsCache[currentCacheKey]?.items ?? [];
  });
  const [total, setTotal] = useState<number>(() => {
    return inMemoryRegulationsCache[currentCacheKey]?.total ?? 0;
  });
  const [totalPages, setTotalPages] = useState<number>(() => {
    return inMemoryRegulationsCache[currentCacheKey]?.totalPages ?? 1;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return !inMemoryRegulationsCache[currentCacheKey];
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegulations = async (targetPage: number) => {
    const key = `${targetPage}_${pageSize}_${selectedMarket}_${selectedCategory}_${searchQuery.trim()}`;
    const cached = inMemoryRegulationsCache[key];

    if (cached) {
      setItems(cached.items);
      setTotal(cached.total);
      setTotalPages(cached.totalPages);
      setIsLoading(false);
      setIsFetching(true);
    } else if (items.length > 0) {
      setIsFetching(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams({
        page: targetPage.toString(),
        pageSize: pageSize.toString(),
        sort: "publishedAt:desc",
      });
      if (selectedMarket !== "ALL") params.append("market", selectedMarket);
      if (selectedCategory !== "ALL") params.append("category", selectedCategory);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await api.get<LegalUpdateFeedItem[]>(`/legal-updates/feed?${params.toString()}`);
      const feedItems = res.data ?? [];
      const totalCount = res.meta?.total ?? feedItems.length;
      const totalPageCount = res.meta?.totalPages ?? Math.ceil(totalCount / pageSize) ?? 1;

      setItems(feedItems);
      setTotal(totalCount);
      setTotalPages(totalPageCount);

      inMemoryRegulationsCache[key] = {
        items: feedItems,
        total: totalCount,
        totalPages: totalPageCount,
        timestamp: Date.now(),
      };
    } catch (err: any) {
      if (!cached) {
        setError(err?.message || "Không thể tải danh sách quy định pháp lý");
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Clear in-memory cache when organization changes
  useEffect(() => {
    const clearCacheOnOrgChange = () => {
      Object.keys(inMemoryRegulationsCache).forEach((k) => delete inMemoryRegulationsCache[k]);
    };
    window.addEventListener("themis:organization-changed", clearCacheOnOrgChange);
    return () => {
      window.removeEventListener("themis:organization-changed", clearCacheOnOrgChange);
    };
  }, []);

  // Main debounced fetch effect
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchRegulations(page);
    }, 200);
    return () => clearTimeout(timer);
  }, [page, pageSize, selectedMarket, selectedCategory, searchQuery]);

  const handleMarketSelect = (marketCode: string) => {
    setSelectedMarket(marketCode);
    setPage(1);
  };

  const handleCategorySelect = (categoryCode: string) => {
    setSelectedCategory(categoryCode);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedMarket("ALL");
    setSelectedCategory("ALL");
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="mb-2 font-serif text-3xl md:text-4xl font-bold text-on-surface">Thư viện Quy định Quốc tế</h1>
          <p className="max-w-3xl text-base md:text-lg text-on-surface-variant">
            Tra cứu và cập nhật toàn bộ các văn bản quy định pháp lý gốc & thông báo mới nhất từ các thị trường xuất khẩu trọng điểm.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Market Filter */}
          <Card className="p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-on-surface flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">M</span>
                Thị trường & Xuất xứ
              </span>
              <span className="text-[11px] font-normal text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full whitespace-nowrap">
                Phân biệt Nguồn vs Đích
              </span>
            </h3>

            {/* Block 1: Origin Market (Nước sở tại) */}
            <div className="mb-4 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <span>📍 Nước sở tại (Nguồn hàng)</span>
              </div>
              <button
                type="button"
                onClick={() => handleMarketSelect("VIETNAM")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                  selectedMarket === "VIETNAM"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-900 dark:text-emerald-100 shadow-xs"
                    : "border-emerald-500/40 hover:border-emerald-500 text-on-surface bg-surface"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">🇻🇳</span>
                  <span>Việt Nam (Nguồn)</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  MSVT • CSĐG • EUDR • PPD
                </span>
              </button>
            </div>

            {/* Block 2: Destination Export Markets (Thị trường nhập khẩu) */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-1.5">
                <span>🎯 Thị trường nhập khẩu (Đích)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { code: "ALL", label: "Tất cả", icon: "🌐" },
                  { code: "CHINA", label: "Trung Quốc", icon: "🇨🇳" },
                  { code: "EU", label: "EU (Châu Âu)", icon: "🇪🇺" },
                  { code: "USA", label: "USA (Hoa Kỳ)", icon: "🇺🇸" },
                  { code: "JAPAN", label: "Nhật Bản", icon: "🇯🇵" },
                  { code: "KOREA", label: "Hàn Quốc", icon: "🇰🇷" },
                  { code: "AUSTRALIA", label: "Úc", icon: "🇦🇺" },
                  { code: "SINGAPORE", label: "Singapore", icon: "🇸🇬" },
                  { code: "UK", label: "Anh Quốc", icon: "🇬🇧" },
                  { code: "UAE", label: "UAE", icon: "🇦🇪" },
                ].map((m) => (
                  <button
                    key={m.code}
                    type="button"
                    onClick={() => handleMarketSelect(m.code)}
                    className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg border text-xs font-semibold transition-all ${
                      selectedMarket === m.code
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-outline-variant hover:border-outline text-on-surface-variant bg-surface"
                    }`}
                    title={m.label}
                  >
                    <span className="text-xl mb-1 shrink-0">{m.icon}</span>
                    <span className="text-center leading-tight whitespace-nowrap truncate w-full">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Standard Category Filter */}
          <Card className="p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-on-surface flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">T</span>
              Loại tiêu chuẩn
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { code: "ALL", label: "Tất cả tiêu chuẩn" },
                { code: "mrl", label: "MRL (Dư lượng hóa chất)" },
                { code: "phytosanitary", label: "Kiểm dịch thực vật (PHYTO)" },
                { code: "eudr", label: "EUDR (Chống phá rừng)" },
                { code: "registration", label: "MSVT & Cơ sở đóng gói" },
                { code: "food_safety", label: "Vệ sinh An toàn thực phẩm" },
                { code: "certificate", label: "e-Phyto & Chứng nhận (Halal, GAP)" },
                { code: "traceability", label: "Truy xuất nguồn gốc (FSMA)" },
                { code: "packaging", label: "Bao bì & Tiếp xúc thực phẩm" },
                { code: "customs", label: "Hải quan & Nghị định thư" },
                { code: "labeling", label: "Ghi nhãn & Mã QR nông sản" },
                { code: "quota_tariff", label: "Thuế xuất khẩu & Hạn ngạch" },
              ].map((cat) => (
                <button
                  key={cat.code}
                  type="button"
                  onClick={() => handleCategorySelect(cat.code)}
                  className={`p-2.5 rounded-lg border text-xs text-left font-medium transition-all whitespace-nowrap truncate w-full ${
                    selectedCategory === cat.code
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-outline-variant hover:border-outline text-on-surface-variant bg-surface"
                  }`}
                  title={cat.label}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Search & Results Bar */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm kiếm văn bản, mã HS (VD: 0810.60.00, 0901), Chlorpyrifos..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
              )}
            </div>
            <p className="text-sm font-semibold text-on-surface-variant shrink-0 whitespace-nowrap">
              Kết quả tra cứu: <span className="text-primary font-bold">{total}</span> văn bản
            </p>
          </div>

          {/* Initial Loading State */}
          {isLoading && <RegulationsSkeleton count={pageSize} />}

          {/* Error State */}
          {!isLoading && error && (
            <div className="rounded-xl border border-outline-variant p-6 text-center text-on-surface" role="alert">
              <AlertCircle className="mx-auto h-8 w-8 text-error mb-2 shrink-0" aria-hidden="true" />
              <p className="font-semibold text-lg">{error}</p>
              <Button type="button" onClick={() => void fetchRegulations(page)} className="mt-4">Thử lại</Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && items.length === 0 && (
            <div className="rounded-xl border border-outline-variant p-10 text-center text-on-surface-variant bg-surface">
              <FileText className="mx-auto h-10 w-10 mb-3 opacity-60 shrink-0" aria-hidden="true" />
              <p className="text-lg font-bold text-on-surface">Không tìm thấy quy định phù hợp</p>
              <p className="mt-1 text-sm">
                Không tìm thấy văn bản pháp lý nào khớp với bộ lọc hoặc từ khóa "{searchQuery}".
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetFilters}
                className="mt-4 text-xs font-semibold"
              >
                Đặt lại toàn bộ bộ lọc
              </Button>
            </div>
          )}

          {/* Document Cards List & Optimized Fetching Overlay */}
          {!isLoading && !error && items.length > 0 && (
            <div className="relative">
              {/* Smooth Fetching Overlay during Page Transition */}
              {isFetching && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/50 backdrop-blur-[1px] rounded-2xl transition-all">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-outline-variant shadow-md text-xs font-semibold text-primary">
                    <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" aria-hidden="true" />
                    Đang tải danh sách văn bản...
                  </div>
                </div>
              )}

              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
                {items.map((doc) => {
                  const isCritical = doc.severity === "critical";
                  const isHigh = doc.severity === "high";
                  const isOrigin = doc.market === "VIETNAM";
                  const categoryName = categoryLabels[doc.category] || doc.category;
                  const badgeLabel = isOrigin ? `VN (Nguồn) • ${categoryName}` : `${doc.market} • ${categoryName}`;

                  return (
                    <Card
                      key={doc.id}
                      onClick={() => setSelectedUpdateId(doc.id)}
                      className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer border-outline-variant group overflow-hidden"
                    >
                      <CardContent className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3 min-w-0 overflow-hidden">
                            <Badge
                              variant={isOrigin ? "outline" : isCritical ? "destructive" : isHigh ? "default" : "secondary"}
                              className={`text-[10px] py-0.5 px-2 truncate min-w-0 flex-1 max-w-[calc(100%-80px)] ${
                                isOrigin ? "font-sans border-emerald-500/60 text-emerald-700 bg-emerald-500/15 font-bold dark:text-emerald-300" : "font-mono uppercase"
                              }`}
                              title={badgeLabel}
                            >
                              <span className="truncate">{badgeLabel}</span>
                            </Badge>
                            <span className="text-xs text-on-surface-variant whitespace-nowrap shrink-0">
                              {formatDate(doc.publishedAt)}
                            </span>
                          </div>

                          <h3 className="font-serif text-base font-bold mb-2 leading-snug text-on-surface group-hover:text-primary transition-colors">
                            {doc.title}
                          </h3>

                          {doc.description && (
                            <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed mb-4">
                              {doc.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-outline-variant/50 flex items-center justify-between gap-2 text-xs">
                          <span className="text-on-surface-variant font-medium truncate min-w-0">Nguồn: {doc.sourceAgency}</span>
                          <span className="text-primary font-semibold group-hover:underline whitespace-nowrap shrink-0">Chi tiết →</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Server-Side Pagination Bar */}
              <div className="mt-8 pt-4 border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info & PageSize Selector */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-medium">
                  <span>
                    Hiển thị{" "}
                    <strong className="text-on-surface">
                      {total > 0 ? (page - 1) * pageSize + 1 : 0} - {Math.min(page * pageSize, total)}
                    </strong>{" "}
                    trên tổng số <strong className="text-primary">{total}</strong> văn bản
                  </span>

                  <span className="text-outline-variant">•</span>

                  <div className="flex items-center gap-1.5">
                    <label htmlFor="regulations-page-size" className="sr-only">Số văn bản mỗi trang</label>
                    <select
                      id="regulations-page-size"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-2 py-1 rounded-lg border border-outline-variant bg-surface text-xs text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value={6}>6 / trang</option>
                      <option value={9}>9 / trang</option>
                      <option value={12}>12 / trang</option>
                      <option value={24}>24 / trang</option>
                    </select>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || isFetching}
                    className="h-8 text-xs gap-1"
                  >
                    <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Trang trước
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .map((p, idx, arr) => {
                        const prevPage = arr[idx - 1];
                        const showEllipsis = prevPage && p - prevPage > 1;

                        return (
                          <div key={p} className="flex items-center gap-1">
                            {showEllipsis && <span className="px-1 text-xs text-on-surface-variant">...</span>}
                            <button
                              type="button"
                              onClick={() => setPage(p)}
                              disabled={isFetching}
                              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                                page === p
                                  ? "bg-primary text-white shadow-xs"
                                  : "bg-surface text-on-surface-variant hover:bg-surface-container-low border border-outline-variant/40"
                              }`}
                            >
                              {p}
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || isFetching}
                    className="h-8 text-xs gap-1"
                  >
                    Trang sau
                    <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-6 shrink-0">
        <LegalTrackingWidget title="Theo dõi cảnh báo" />

        <div className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden shadow-sm">
          <div className="relative z-10 flex flex-col items-center text-center">
            <Sparkles className="w-8 h-8 text-yellow-300 mb-3" />
            <h3 className="font-serif text-lg font-bold mb-2">AI COMPLY NAVIGATOR</h3>
            <p className="text-xs text-white/80 mb-5 leading-relaxed">
              Tự động phân tích tác động của văn bản quy định mới đến danh mục sản phẩm sầu riêng & nông sản của bạn.
            </p>
            <Button
              onClick={() => setSelectedUpdateId(items[0]?.id ?? null)}
              disabled={items.length === 0}
              className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
            >
              Phân tích tác động ngay
            </Button>
          </div>
        </div>
      </div>

      <LegalUpdateDetailDialog id={selectedUpdateId} onClose={() => setSelectedUpdateId(null)} />
    </div>
  );
}

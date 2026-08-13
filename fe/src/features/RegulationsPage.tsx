"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LegalTrackingWidget } from "@/components/LegalTrackingWidget";
import { LegalUpdateDetailDialog } from "@/features/legal-updates/components/legal-update-detail-dialog";
import { api } from "@/lib/api";
import { AlertCircle, FileText, Search, Sparkles } from "lucide-react";
import type { LegalUpdateFeedItem } from "@/features/legal-updates/types";

export default function RegulationsPage() {
  const [selectedMarket, setSelectedMarket] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | null>(null);

  const [items, setItems] = useState<LegalUpdateFeedItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegulations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: "1",
        pageSize: "20",
        sort: "publishedAt:desc",
      });
      if (selectedMarket !== "ALL") params.append("market", selectedMarket);
      if (selectedCategory !== "ALL") params.append("category", selectedCategory);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await api.get<LegalUpdateFeedItem[]>(`/legal-updates/feed?${params.toString()}`);

      setItems(res.data ?? []);
      setTotal(res.meta?.total ?? res.data?.length ?? 0);

    } catch (err: any) {
      setError(err?.message || "Không thể tải danh sách quy định pháp lý");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchRegulations();
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedMarket, selectedCategory, searchQuery]);

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
            <h3 className="mb-4 font-serif text-lg font-semibold text-on-surface flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">M</span>
              Thị trường mục tiêu
            </h3>
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
                  onClick={() => setSelectedMarket(m.code)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all ${
                    selectedMarket === m.code
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-outline-variant hover:border-outline text-on-surface-variant bg-surface"
                  }`}
                >
                  <span className="text-xl mb-1">{m.icon}</span>
                  <span className="text-center leading-tight">{m.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Standard Category Filter */}
          <Card className="p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-on-surface flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">T</span>
              Loại tiêu chuẩn
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: "ALL", label: "Tất cả tiêu chuẩn" },
                { code: "mrl", label: "MRL (Dư lượng thuốc BVTV)" },
                { code: "phytosanitary", label: "Kiểm dịch thực vật (PHYTO)" },
                { code: "eudr", label: "EUDR (Chống phá rừng)" },
                { code: "packaging", label: "Bao bì & Tiếp xúc thực phẩm" },
                { code: "traceability", label: "Truy xuất nguồn gốc" },
              ].map((cat) => (
                <button
                  key={cat.code}
                  type="button"
                  onClick={() => setSelectedCategory(cat.code)}
                  className={`p-2.5 rounded-lg border text-xs text-left font-medium transition-all ${
                    selectedCategory === cat.code
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-outline-variant hover:border-outline text-on-surface-variant bg-surface"
                  }`}
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm văn bản, mã HS (VD: 0810.60.00), Chlorpyrifos..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <p className="text-sm font-semibold text-on-surface-variant shrink-0">
              Kết quả tra cứu: <span className="text-primary font-bold">{total}</span> văn bản
            </p>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 rounded-xl border border-outline-variant bg-surface p-6 animate-pulse space-y-3">
                  <div className="h-4 w-1/3 bg-surface-container-low rounded" />
                  <div className="h-6 w-4/5 bg-surface-container-low rounded" />
                  <div className="h-16 w-full bg-surface-container-low rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <div className="rounded-xl border border-outline-variant p-6 text-center text-on-surface" role="alert">
              <AlertCircle className="mx-auto h-8 w-8 text-error mb-2" aria-hidden="true" />
              <p className="font-semibold text-lg">{error}</p>
              <Button type="button" onClick={() => void fetchRegulations()} className="mt-4">Thử lại</Button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && items.length === 0 && (
            <div className="rounded-xl border border-outline-variant p-10 text-center text-on-surface-variant bg-surface">
              <FileText className="mx-auto h-10 w-10 mb-3 opacity-60" aria-hidden="true" />
              <p className="text-lg font-bold text-on-surface">Không tìm thấy quy định phù hợp</p>
              <p className="mt-1 text-sm">Hãy thử thay đổi từ khóa hoặc chọn bộ lọc thị trường khác.</p>
            </div>
          )}

          {/* Document Cards List */}
          {!isLoading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((doc) => {
                const isCritical = doc.severity === "critical";
                const isHigh = doc.severity === "high";

                return (
                  <Card
                    key={doc.id}
                    onClick={() => setSelectedUpdateId(doc.id)}
                    className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer border-outline-variant group"
                  >
                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <Badge
                            variant={isCritical ? "destructive" : isHigh ? "default" : "secondary"}
                            className="text-[10px] py-0.5 px-2 font-mono uppercase"
                          >
                            {doc.market} • {doc.category}
                          </Badge>
                          <span className="text-xs text-on-surface-variant">
                            {doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString("vi-VN") : "Đang hiệu lực"}
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

                      <div className="pt-3 border-t border-outline-variant/50 flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Nguồn: {doc.sourceAgency}</span>
                        <span className="text-primary font-semibold group-hover:underline">Chi tiết →</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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

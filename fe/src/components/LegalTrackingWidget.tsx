"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileText,
  Globe,
  Info,
  Layers,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { LegalUpdateDetailDialog } from "@/features/legal-updates/components/legal-update-detail-dialog";
import { LegalUpdateFeedDialog } from "@/features/legal-updates/components/legal-update-feed-dialog";
import { useLegalUpdates } from "@/features/legal-updates/use-legal-updates";
import { isSafeHttpUrl } from "@/lib/safe-url";

const severityLabels = {
  critical: "Nghiêm trọng",
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
  informational: "Thông tin",
} as const;

function SeverityIcon({ severity }: { severity: string }) {
  const iconClassName = "h-4 w-4 shrink-0";
  if (severity === "critical") return <ShieldAlert className={`${iconClassName} text-error`} aria-hidden="true" />;
  if (severity === "high") return <AlertTriangle className={`${iconClassName} text-amber-500`} aria-hidden="true" />;
  if (severity === "medium") return <CircleAlert className={`${iconClassName} text-blue-500`} aria-hidden="true" />;
  return <Info className={`${iconClassName} text-slate-400`} aria-hidden="true" />;
}

function WidgetSkeleton() {
  return (
    <div className="rounded-xl border border-outline-variant p-4 bg-surface space-y-3 animate-pulse" aria-label="Đang tải cập nhật pháp lý">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 rounded-md bg-surface-container-high" />
        <div className="h-3 w-16 rounded-md bg-surface-container-high" />
      </div>
      <div className="h-5 w-4/5 rounded-md bg-surface-container-high" />
      <div className="space-y-1.5 pt-1">
        <div className="h-3.5 w-full rounded-md bg-surface-container-high" />
        <div className="h-3.5 w-2/3 rounded-md bg-surface-container-high" />
      </div>
      <div className="h-6 w-3/4 rounded-full bg-primary/10" />
      <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
        <div className="h-3 w-24 rounded-md bg-surface-container-high" />
        <div className="h-3 w-12 rounded-md bg-surface-container-high" />
      </div>
    </div>
  );
}

export function LegalTrackingWidget({
  title = "Theo dõi pháp lý",
  className = "",
}: {
  title?: string;
  className?: string;
}) {
  const [selectedMarket, setSelectedMarket] = useState<string>("ALL");
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | null>(null);
  const [isFeedDialogOpen, setIsFeedDialogOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const { updates, isLoading, isRefreshing, error, refresh } = useLegalUpdates({ market: selectedMarket });
  const hasUpdates = updates.length > 0;

  // Auto-slide effect every 5 seconds (pauses on hover)
  useEffect(() => {
    if (!hasUpdates || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % updates.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [hasUpdates, isPaused, updates.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + updates.length) % updates.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % updates.length);
  };

  const activeUpdate = hasUpdates ? updates[currentIndex % updates.length] : null;

  return (
    <section
      className={`relative rounded-2xl border border-outline-variant bg-surface p-6 shadow-xs flex flex-col justify-between ${className}`}
      aria-labelledby="legal-tracking-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 id="legal-tracking-title" className="font-serif text-2xl font-bold text-on-surface">
            {title}
          </h3>
          {hasUpdates && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {updates.length} bản tin
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          disabled={isLoading || isRefreshing}
          className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
          aria-label="Làm mới cập nhật pháp lý"
          title="Làm mới dữ liệu"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
        </button>
      </div>

      {/* Target Source / Market Selector Tabs */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {[
          { code: "ALL", label: "Tất cả", icon: "🌐" },
          { code: "CHINA", label: "Trung Quốc", icon: "🇨🇳" },
          { code: "EU", label: "EU", icon: "🇪🇺" },
          { code: "USA", label: "Hoa Kỳ", icon: "🇺🇸" },
          { code: "JAPAN", label: "Nhật Bản", icon: "🇯🇵" },
          { code: "KOREA", label: "Hàn Quốc", icon: "🇰🇷" },
          { code: "AUSTRALIA", label: "Úc", icon: "🇦🇺" },
          { code: "SINGAPORE", label: "Singapore", icon: "🇸🇬" },
          { code: "UK", label: "Anh Quốc", icon: "🇬🇧" },
          { code: "UAE", label: "UAE", icon: "🇦🇪" },
        ].map((tab) => (
          <button
            key={tab.code}
            type="button"
            onClick={() => {
              setSelectedMarket(tab.code);
              setCurrentIndex(0);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedMarket === tab.code
                ? "bg-primary text-white shadow-xs"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/40"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>



      {/* Main Body */}
      <div className="mt-4 flex-1 min-h-[220px]">
        {isLoading && <WidgetSkeleton />}

        {!isLoading && error && !hasUpdates && (
          <div className="rounded-xl border border-outline-variant p-4 text-on-surface" role="alert">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" aria-hidden="true" />
              <div>
                <p className="font-semibold text-sm">Không thể tải cập nhật pháp lý</p>
                <p className="mt-1 text-xs text-on-surface-variant">{error}</p>
                <button type="button" onClick={() => void refresh()} className="mt-2 text-xs font-semibold text-primary hover:underline">
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && !hasUpdates && (
          <div className="rounded-xl border border-outline-variant p-6 text-center text-on-surface-variant">
            <FileText className="mx-auto h-7 w-7 opacity-50" aria-hidden="true" />
            <p className="mt-2 font-semibold text-sm text-on-surface">Chưa có cập nhật cho nguồn này</p>
            <p className="mt-1 text-xs">Hãy chọn "Cập nhật tất cả" hoặc chọn nguồn thị trường khác.</p>
          </div>
        )}

        {!isLoading && activeUpdate && (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeUpdate.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="group relative rounded-xl border border-outline-variant/80 bg-surface p-4 hover:border-primary/50 hover:shadow-xs transition-all cursor-pointer"
                onClick={() => setSelectedUpdateId(activeUpdate.id)}
              >
                {/* Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant mb-2">
                  <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                    <SeverityIcon severity={activeUpdate.severity} />
                    <span>{severityLabels[activeUpdate.severity] || activeUpdate.severity}</span>
                    <span>•</span>
                    <span className="uppercase text-primary font-bold">{activeUpdate.market}</span>
                  </div>

                  {activeUpdate.publishedAt && (
                    <span className="text-[11px] text-on-surface-variant">
                      {new Date(activeUpdate.publishedAt).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {activeUpdate.title}
                </h4>

                {/* Description */}
                {activeUpdate.description && (
                  <p className="mt-1.5 text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {activeUpdate.description}
                  </p>
                )}

                {/* Product Impact Badge */}
                {typeof activeUpdate.affectedProductCount === 'number' && activeUpdate.affectedProductCount > 0 && (
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    <span>Ảnh hưởng đến {activeUpdate.affectedProductCount} sản phẩm trong danh mục</span>
                  </div>
                )}

                {/* Footer Link */}
                <div className="mt-3 pt-2 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">Nguồn: {activeUpdate.sourceAgency}</span>
                  <span className="text-primary font-semibold group-hover:underline inline-flex items-center gap-0.5">
                    Chi tiết
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Widget Footer Controls & Carousel Navigation */}
      {hasUpdates && (
        <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between gap-2">
          {/* View All Dialog Trigger */}
          <button
            type="button"
            onClick={() => setIsFeedDialogOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <Layers className="h-4 w-4" aria-hidden="true" />
            Xem tất cả tin tức ({updates.length})
          </button>

          {/* Carousel Arrows & Index Dots */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-on-surface-variant">
              {currentIndex + 1} / {updates.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-low transition-colors"
                aria-label="Tin trước"
                title="Tin trước"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-low transition-colors"
                aria-label="Tin kế tiếp"
                title="Tin kế tiếp"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog View Detail */}
      <LegalUpdateDetailDialog id={selectedUpdateId} onClose={() => setSelectedUpdateId(null)} />

      {/* Dialog View All News Feed with Pagination */}
      <LegalUpdateFeedDialog isOpen={isFeedDialogOpen} onClose={() => setIsFeedDialogOpen(false)} />
    </section>
  );
}

export default LegalTrackingWidget;

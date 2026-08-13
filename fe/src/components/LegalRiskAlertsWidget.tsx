"use client";

import { useState } from "react";
import { AlertCircle, AlertTriangle, ArrowRight, CircleAlert, FileText, Info, RefreshCw, ShieldAlert } from "lucide-react";

import { LegalUpdateDetailDialog } from "@/features/legal-updates/components/legal-update-detail-dialog";
import { LegalUpdateFeedDialog } from "@/features/legal-updates/components/legal-update-feed-dialog";
import { useLegalUpdates } from "@/features/legal-updates/use-legal-updates";
import type { LegalUpdateFeedItem } from "@/features/legal-updates/types";

const severityBadgeStyles: Record<string, { label: string; badgeClass: string; borderClass: string; bgClass: string }> = {
  critical: {
    label: "NGHIÊM TRỌNG",
    badgeClass: "bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs",
    borderClass: "border-l-4 border-red-600",
    bgClass: "bg-red-500/5 hover:bg-red-500/10 border-outline-variant/60",
  },
  high: {
    label: "CAO",
    badgeClass: "bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs",
    borderClass: "border-l-4 border-red-600",
    bgClass: "bg-red-500/5 hover:bg-red-500/10 border-outline-variant/60",
  },
  medium: {
    label: "TRUNG BÌNH",
    badgeClass: "bg-amber-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs",
    borderClass: "border-l-4 border-amber-600",
    bgClass: "bg-amber-500/5 hover:bg-amber-500/10 border-outline-variant/60",
  },
  low: {
    label: "THẤP",
    badgeClass: "bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs",
    borderClass: "border-l-4 border-blue-600",
    bgClass: "bg-blue-500/5 hover:bg-blue-500/10 border-outline-variant/60",
  },
  informational: {
    label: "KHUYẾN NGHỊ",
    badgeClass: "bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs",
    borderClass: "border-l-4 border-blue-600",
    bgClass: "bg-blue-500/5 hover:bg-blue-500/10 border-outline-variant/60",
  },
};

function RiskItemSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-xl border border-outline-variant bg-surface space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-1/2 rounded bg-surface-container-high" />
            <div className="h-4 w-12 rounded bg-surface-container-high" />
          </div>
          <div className="h-3.5 w-4/5 rounded bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
}

export function LegalRiskAlertsWidget({
  title = "Cảnh báo Rủi ro Pháp lý",
  className = "",
  limit = 3,
}: {
  title?: string;
  className?: string;
  limit?: number;
}) {
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | null>(null);
  const [isFeedDialogOpen, setIsFeedDialogOpen] = useState<boolean>(false);

  const { updates, isLoading, isRefreshing, error, refresh } = useLegalUpdates();

  const displayedUpdates = updates.slice(0, limit);
  const totalCount = updates.length;

  return (
    <section
      className={`rounded-2xl border border-outline-variant bg-surface p-6 shadow-xs space-y-4 ${className}`}
      aria-labelledby="risk-alerts-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 min-w-0">
          <ShieldAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
          <h3 id="risk-alerts-title" className="font-serif text-lg font-bold text-on-surface truncate">
            {title} {totalCount > 0 && <span className="text-red-600 font-bold">({totalCount})</span>}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          disabled={isLoading || isRefreshing}
          className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60 transition-colors shrink-0"
          aria-label="Làm mới cảnh báo rủi ro"
          title="Làm mới dữ liệu"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
        </button>
      </div>

      {/* Main Body */}
      <div>
        {isLoading && <RiskItemSkeleton />}

        {!isLoading && error && (
          <div className="rounded-xl border border-outline-variant p-4 text-on-surface" role="alert">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" aria-hidden="true" />
              <div>
                <p className="font-semibold text-sm">Không thể tải cảnh báo rủi ro</p>
                <p className="mt-1 text-xs text-on-surface-variant">{error}</p>
                <button type="button" onClick={() => void refresh()} className="mt-2 text-xs font-semibold text-primary hover:underline">
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && displayedUpdates.length === 0 && (
          <div className="rounded-xl border border-outline-variant p-6 text-center text-on-surface-variant">
            <FileText className="mx-auto h-7 w-7 opacity-50" aria-hidden="true" />
            <p className="mt-2 font-semibold text-sm text-on-surface">Không có cảnh báo rủi ro mức độ cao</p>
            <p className="mt-1 text-xs">Tất cả tiêu chuẩn pháp lý thị trường đang hoạt động bình thường.</p>
          </div>
        )}

        {!isLoading && !error && displayedUpdates.length > 0 && (
          <div className="space-y-3">
            {displayedUpdates.map((item) => {
              const style = severityBadgeStyles[item.severity] || severityBadgeStyles.high;
              const isOrigin = item.market === "VIETNAM";

              return (
                <article
                  key={item.id}
                  onClick={() => setSelectedUpdateId(item.id)}
                  className={`group rounded-xl border p-4 transition-all cursor-pointer shadow-2xs hover:shadow-xs ${style.borderClass} ${style.bgClass}`}
                >
                  <div className="flex items-start justify-between gap-2 min-w-0 mb-1.5">
                    <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2 min-w-0 flex-1">
                      {item.title}
                    </h4>
                    <span className={`${style.badgeClass} shrink-0 whitespace-nowrap`}>
                      {style.label}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-2.5">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 text-xs pt-2 border-t border-outline-variant/40">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {isOrigin ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shrink-0">
                          VN (Nguồn)
                        </span>
                      ) : (
                        <span className="font-bold text-primary text-[11px] shrink-0 uppercase">
                          🎯 {item.market}
                        </span>
                      )}

                      {typeof item.affectedProductCount === "number" && item.affectedProductCount > 0 && (
                        <span className="text-[11px] font-medium text-on-surface-variant truncate">
                          • {item.affectedProductCount} sản phẩm bị ảnh hưởng
                        </span>
                      )}
                    </div>

                    <span className="text-primary font-semibold group-hover:underline inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 text-xs">
                      Chi tiết
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer link to open feed dialog */}
      {totalCount > 0 && (
        <div className="pt-2 border-t border-outline-variant/60 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setIsFeedDialogOpen(true)}
            className="text-red-700 dark:text-red-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            Xem tất cả cảnh báo rủi ro ({totalCount})
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Dialog View Detail */}
      <LegalUpdateDetailDialog id={selectedUpdateId} onClose={() => setSelectedUpdateId(null)} />

      {/* Dialog View All News Feed with Pagination */}
      <LegalUpdateFeedDialog isOpen={isFeedDialogOpen} onClose={() => setIsFeedDialogOpen(false)} />
    </section>
  );
}

export default LegalRiskAlertsWidget;

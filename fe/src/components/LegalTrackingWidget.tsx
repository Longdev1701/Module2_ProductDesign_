"use client";

import { AlertCircle, FileText, RefreshCw } from "lucide-react";
import { useState } from "react";

import { LegalUpdateDetailDialog } from "@/features/legal-updates/components/legal-update-detail-dialog";
import { LegalUpdateList } from "@/features/legal-updates/components/legal-update-list";
import { useLegalUpdates } from "@/features/legal-updates/use-legal-updates";

function WidgetSkeleton() {
  return (
    <div className="space-y-5" aria-label="Đang tải cập nhật pháp lý">
      {[1, 2, 3].map((item) => (
        <div key={item} className="space-y-2 border-l border-outline-variant pl-5">
          <div className="h-4 w-1/3 animate-pulse rounded bg-surface-container-low" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-surface-container-low" />
          <div className="h-10 animate-pulse rounded bg-surface-container-low" />
        </div>
      ))}
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
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | null>(null);
  const { updates, isLoading, isRefreshing, error, refresh } = useLegalUpdates();
  const hasUpdates = updates.length > 0;

  return (
    <section
      className={`rounded-2xl border border-outline-variant bg-surface p-6 shadow-xs ${className}`}
      aria-labelledby="legal-tracking-title"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id="legal-tracking-title" className="font-serif text-2xl font-bold text-on-surface">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={isLoading || isRefreshing}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-primary hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Làm mới cập nhật pháp lý"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
          Làm mới
        </button>
      </div>

      <div className="mt-6">
        {isLoading && <WidgetSkeleton />}

        {!isLoading && error && !hasUpdates && (
          <div className="rounded-lg border border-outline-variant p-4 text-on-surface" role="alert">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">Không thể tải cập nhật pháp lý</p>
                <p className="mt-1 text-sm text-on-surface-variant">{error}</p>
                <button type="button" onClick={() => void refresh()} className="mt-3 font-semibold text-primary hover:underline">
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && !hasUpdates && (
          <div className="rounded-lg border border-outline-variant p-5 text-center text-on-surface-variant">
            <FileText className="mx-auto h-6 w-6" aria-hidden="true" />
            <p className="mt-2 font-semibold text-on-surface">Chưa có cập nhật pháp lý mới</p>
            <p className="mt-1 text-sm">Các thay đổi liên quan đến thị trường của bạn sẽ xuất hiện tại đây.</p>
          </div>
        )}

        {!isLoading && hasUpdates && (
          <>
            {error && (
              <p className="mb-4 rounded-lg bg-surface-container-low p-3 text-sm text-on-surface-variant" role="status">
                Chưa thể làm mới dữ liệu: {error}. Đang hiển thị bản cập nhật gần nhất.
              </p>
            )}
            <LegalUpdateList updates={updates} onSelect={setSelectedUpdateId} />
          </>
        )}
      </div>

      <LegalUpdateDetailDialog id={selectedUpdateId} onClose={() => setSelectedUpdateId(null)} />
    </section>
  );
}

export default LegalTrackingWidget;

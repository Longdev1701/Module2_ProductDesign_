"use client";

import { AlertTriangle, ArrowUpRight, CalendarDays, CircleAlert, Info, ShieldAlert } from "lucide-react";

import { isSafeHttpUrl } from "@/lib/safe-url";

import type { LegalUpdateFeedItem } from "../types";

const severityLabels = {
  critical: "Nghiêm trọng",
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
  informational: "Thông tin",
} as const;

const statusLabels = {
  draft: "Dự thảo",
  published: "Đã công bố",
  upcoming: "Sắp hiệu lực",
  effective: "Đang hiệu lực",
  amended: "Đã sửa đổi",
  repealed: "Đã bãi bỏ",
  archived: "Đã lưu trữ",
} as const;

function formatDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function SeverityIcon({ severity }: { severity: LegalUpdateFeedItem["severity"] }) {
  const iconClassName = "h-4 w-4 shrink-0";
  if (severity === "critical") return <ShieldAlert className={iconClassName} aria-hidden="true" />;
  if (severity === "high") return <AlertTriangle className={iconClassName} aria-hidden="true" />;
  if (severity === "medium") return <CircleAlert className={iconClassName} aria-hidden="true" />;
  return <Info className={iconClassName} aria-hidden="true" />;
}

export function LegalUpdateList({
  updates,
  onSelect,
}: {
  updates: LegalUpdateFeedItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {updates.map((update) => {
        const publishedAt = formatDate(update.publishedAt);
        const effectiveAt = formatDate(update.effectiveAt);
        const sourceUrl = isSafeHttpUrl(update.sourceUrl) ? update.sourceUrl : null;

        return (
          <article key={update.id} className="border-l border-outline-variant pl-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1 font-semibold text-on-surface whitespace-nowrap shrink-0">
                <SeverityIcon severity={update.severity} />
                {severityLabels[update.severity]}
              </span>
              <span aria-hidden="true" className="shrink-0">•</span>
              <span className={`whitespace-nowrap shrink-0 px-1.5 py-0.5 rounded text-xs ${update.market === "VIETNAM" ? "text-emerald-700 font-bold bg-emerald-500/15 border border-emerald-500/30 dark:text-emerald-300" : "font-semibold text-primary"}`}>
                {update.market === "VIETNAM" ? "VN (Nguồn)" : update.market}
              </span>
              <span aria-hidden="true" className="shrink-0">•</span>
              <span className="whitespace-nowrap shrink-0">{statusLabels[update.status]}</span>
              {typeof update.affectedProductCount === 'number' && update.affectedProductCount > 0 && (
                <>
                  <span aria-hidden="true" className="shrink-0">•</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary whitespace-nowrap shrink-0">
                    Ảnh hưởng đến {update.affectedProductCount} sản phẩm trong danh mục
                  </span>
                </>
              )}
            </div>

            <h4 className="mt-2 text-base font-bold leading-snug text-on-surface">{update.title}</h4>
            {update.description && (
              <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{update.description}</p>
            )}

            <div className="mt-3 space-y-1 text-xs text-on-surface-variant">
              {update.sourceAgency && <p>Cơ quan: {update.sourceAgency}</p>}
              {publishedAt && <p>Ngày công bố: {publishedAt}</p>}
              {effectiveAt && <p className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />Hiệu lực: {effectiveAt}</p>}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
              <button
                type="button"
                onClick={() => onSelect(update.id)}
                className="text-primary hover:underline whitespace-nowrap shrink-0"
              >
                Xem chi tiết
              </button>
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline whitespace-nowrap shrink-0"
                >
                  Nguồn chính thức
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

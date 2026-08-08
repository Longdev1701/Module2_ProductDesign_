"use client";

import { AlertCircle, FileText, RefreshCw } from 'lucide-react';

import { useLegalUpdates } from '@/features/legal-updates/use-legal-updates';

import type { Regulation } from '@/features/legal-updates/types';

export interface LegalTrackingItem {
  id: string | number;
  status: 'MỚI NHẤT' | 'CẢNH BÁO' | 'DỰ THẢO' | string;
  statusType: 'primary' | 'error' | 'neutral';
  title: string;
  description: string;
  actionText?: string;
  href?: string;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

function toTrackingItem(update: Regulation): LegalTrackingItem {
  if (!update.isActive) {
    return {
      id: update.id,
      status: 'NGỪNG HIỆU LỰC',
      statusType: 'error',
      title: update.title,
      description: update.description ?? 'Quy định này không còn hiệu lực. Hãy rà soát các hồ sơ liên quan.',
      actionText: 'Xem chi tiết',
      href: update.sourceUrl ?? undefined,
    };
  }

  if (update.effectiveDate && new Date(update.effectiveDate) > new Date()) {
    return {
      id: update.id,
      status: 'SẮP HIỆU LỰC',
      statusType: 'neutral',
      title: update.title,
      description: update.description ?? `Có hiệu lực từ ${formatDate(update.effectiveDate)}.`,
      actionText: 'Xem quy định',
      href: update.sourceUrl ?? undefined,
    };
  }

  return {
    id: update.id,
    status: 'MỚI NHẤT',
    statusType: 'primary',
    title: update.title,
    description: update.description ?? `Cập nhật ngày ${formatDate(update.createdAt)}.`,
    actionText: 'Xem chi tiết',
    href: update.sourceUrl ?? undefined,
  };
}

export function LegalTrackingWidget({
  title = "Theo dõi pháp lý",
  className = ""
}: {
  title?: string;
  className?: string;
}) {
  const { updates, isLoading, error, refresh } = useLegalUpdates();
  const items = updates.map(toTrackingItem);

  return (
    <section className={`bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-6 ${className}`} aria-labelledby="legal-tracking-title">
      {/* Title */}
      <h3 id="legal-tracking-title" className="font-serif text-2xl font-bold text-on-surface">{title}</h3>

      {isLoading && (
        <div className="space-y-4" aria-label="Đang tải cập nhật pháp lý">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-lg bg-surface-container" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-error bg-error-container p-4 text-on-error-container" role="alert">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">Không thể tải cập nhật pháp lý</p>
              <p className="mt-1 text-sm">{error}</p>
              <button type="button" onClick={() => void refresh()} className="mt-3 inline-flex items-center gap-2 font-semibold underline">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="rounded-lg border border-outline-variant p-5 text-center text-on-surface-variant">
          <FileText className="mx-auto h-6 w-6" aria-hidden="true" />
          <p className="mt-2 font-semibold text-on-surface">Chưa có cập nhật pháp lý</p>
          <p className="mt-1 text-sm">Các quy định mới sẽ xuất hiện tại đây.</p>
        </div>
      )}

      {/* Timeline List */}
      {!isLoading && !error && items.length > 0 && <div className="relative pl-6 space-y-7 before:absolute before:left-2 before:top-2.5 before:bottom-2.5 before:w-px before:bg-outline-variant">
        {items.map((item) => {
          let dotBg = "bg-primary";
          let tagColor = "text-primary";

          if (item.statusType === 'error') {
            dotBg = "bg-error";
            tagColor = "text-error";
          } else if (item.statusType === 'neutral') {
            dotBg = "bg-outline-variant";
            tagColor = "text-outline";
          }

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Indicator Dot */}
              <div 
                className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full ${dotBg} ring-4 ring-white shadow-xs group-hover:scale-125 transition-transform duration-200`}
              />

              {/* Item Content */}
              <div className="space-y-1.5">
                {/* Status Tag */}
                <div className={`text-xs font-bold tracking-wider uppercase ${tagColor}`}>
                  {item.status}
                </div>

                {/* Item Title */}
                <h4 className="font-sans text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {item.description}
                </p>

                {/* Action Link */}
                {item.actionText && item.href && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="pt-1 text-sm font-semibold text-primary hover:text-primary-container hover:underline flex items-center gap-1 transition-all"
                  >
                    {item.actionText}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>}
    </section>
  );
}

export default LegalTrackingWidget;

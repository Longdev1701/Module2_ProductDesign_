"use client";

import React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  UploadCloud,
} from 'lucide-react';
import { DashboardActionItem } from '@/types/api';

interface ActionItemsWidgetProps {
  actionItems: DashboardActionItem[];
  loading: boolean;
  onOpenUpload?: (batchId: string, batchCode: string) => void;
}

export function ActionItemsWidget({ actionItems, loading, onOpenUpload }: ActionItemsWidgetProps) {
  if (loading && actionItems.length === 0) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-xs animate-pulse space-y-3">
        <div className="h-5 bg-slate-200 rounded w-40"></div>
        <div className="h-24 bg-slate-100 rounded-xl"></div>
        <div className="h-24 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-bold text-on-surface truncate">Việc Cần Làm Ngay</h3>
            <p className="text-[11px] text-on-surface-variant truncate">Tự động phát hiện rủi ro &amp; điểm nghẽn</p>
          </div>
        </div>
        <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex-shrink-0">
          {actionItems.length} việc
        </span>
      </div>

      {actionItems.length === 0 ? (
        <div className="p-6 text-center bg-emerald-50/50 border border-emerald-200 rounded-xl">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
          <p className="text-xs font-bold text-emerald-900">Không có việc tồn đọng</p>
          <p className="text-[11px] text-emerald-700 mt-0.5">Tất cả các lô hàng và chứng từ đang ở trạng thái an toàn.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto overflow-x-hidden pr-0.5">
          {actionItems.map((item) => {
            const isCritical = item.severity === 'CRITICAL';
            const isHigh = item.severity === 'HIGH';
            const isMissingDoc = item.type === 'MISSING_DOCUMENT' && item.batchId;
            const isExpiring = item.type === 'EXPIRING_BATCH' || item.type === 'EXPIRING_PHYTO_WINDOW';
            const isReady = item.type === 'READY_FOR_CHECK';

            let badgeLabel = 'Sẵn sàng';
            if (isMissingDoc) badgeLabel = 'Cần nạp';
            else if (isExpiring) badgeLabel = 'Sắp hết hạn';
            else if (isCritical) badgeLabel = 'Khẩn cấp';
            else if (isHigh) badgeLabel = 'Cần xử lý';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all hover:shadow-xs w-full min-w-0 space-y-2.5 ${
                  isCritical
                    ? 'bg-rose-50/70 border-rose-300 hover:border-rose-400'
                    : isExpiring || isHigh
                    ? 'bg-amber-50/70 border-amber-300 hover:border-amber-400'
                    : 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                    {isCritical ? (
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    ) : isExpiring ? (
                      <span className="p-1 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">⏳ HẠN</span>
                    ) : isHigh ? (
                      <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    )}
                    <span className="font-mono text-xs font-bold text-on-surface truncate">
                      {item.batchCode || 'HỒ SƠ XUẤT KHẨU'}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
                      isCritical
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : isExpiring || isHigh
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {badgeLabel}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 space-y-1">
                  <h4 className={`text-xs font-bold leading-snug break-words ${
                    isCritical ? 'text-rose-950' : isHigh || isExpiring ? 'text-amber-950' : 'text-emerald-950'
                  }`}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed break-words">
                    {item.description}
                  </p>
                </div>

                {/* Action Button (Full-width 1-touch resolver) */}
                <div className="pt-1">
                  {isMissingDoc ? (
                    <button
                      onClick={() => onOpenUpload?.(item.batchId!, item.batchCode || 'Lô hàng')}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-bold rounded-lg shadow-2xs transition-all active:scale-98 bg-amber-700 text-white hover:bg-amber-800 border border-amber-800 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      {item.actionLabel || 'Nạp chứng từ còn thiếu'}
                    </button>
                  ) : (
                    <Link
                      href={item.actionUrl}
                      className={`w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-bold rounded-lg shadow-2xs transition-all active:scale-98 ${
                        isCritical
                          ? 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-700'
                          : isExpiring || isHigh
                          ? 'bg-amber-700 text-white hover:bg-amber-800 border border-amber-800'
                          : 'bg-emerald-700 text-white hover:bg-emerald-800 border border-emerald-800'
                      }`}
                    >
                      {item.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

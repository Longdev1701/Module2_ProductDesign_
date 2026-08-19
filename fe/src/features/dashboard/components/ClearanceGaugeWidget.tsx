"use client";

import React from 'react';
import { Truck, ShieldCheck, AlertTriangle, ArrowRight, PackageCheck, Clock } from 'lucide-react';
import { DashboardSummary } from '@/types/api';

interface ClearanceGaugeWidgetProps {
  summary: DashboardSummary | null;
  loading: boolean;
  onOpenDrillDown?: () => void;
}

export function ClearanceGaugeWidget({ summary, loading, onOpenDrillDown }: ClearanceGaugeWidgetProps) {
  if (loading && !summary) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-xs animate-pulse space-y-3">
        <div className="h-5 bg-slate-200 rounded w-48"></div>
        <div className="h-4 bg-slate-100 rounded w-full"></div>
      </div>
    );
  }

  const totalBatches = summary?.totalBatches || 0;
  const totalVolume = summary?.totalExportVolumeTons || summary?.totalVolumeTons || 0;
  const readyVolume = summary?.readyVolumeTons || 0;
  const pendingVolume = summary?.pendingVolumeTons ?? Math.max(0, totalVolume - readyVolume);

  const readyBatches = summary?.readyBatchesCount ?? ((summary?.compliantBatches || 0) + (summary?.readyForCheckBatches || 0));
  const pendingBatches = summary?.pendingBatchesCount ?? Math.max(0, totalBatches - readyBatches);

  const readyPercentage = totalVolume > 0 ? Math.round((readyVolume / totalVolume) * 100) : (totalBatches > 0 ? Math.round((readyBatches / totalBatches) * 100) : 100);
  const pendingPercentage = Math.max(0, 100 - readyPercentage);

  return (
    <div className="bg-gradient-to-br from-[#001946] via-[#002766] to-[#0047ab] text-white p-6 rounded-2xl border border-blue-400/20 shadow-md relative overflow-hidden">
      {/* Background Lighting Decor */}
      <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 border border-white/15 shadow-inner">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-white tracking-tight">
              Tiến Độ Sẵn Sàng Xuất Khẩu Theo Sản Lượng
            </h3>
            <p className="text-xs text-blue-200">
              Tổng sản lượng đăng ký: <b>{totalVolume} tấn</b> ({totalBatches} lô hàng thực tế trong vụ)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-4 h-4" /> {readyPercentage}% ĐÃ ĐỦ ĐIỀU KIỆN ({readyVolume} TẤN)
          </span>
        </div>
      </div>

      {/* Progress Bar with Real Physical Volume (Tons & Batches) */}
      <div className="space-y-2.5 my-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-1">
          <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs"></span>
            Đã đủ 4 khóa an toàn: <b>{readyVolume} tấn</b> ({readyBatches} lô — {readyPercentage}%)
          </span>
          <span className="text-amber-300 font-semibold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs"></span>
            Chờ nạp / bổ sung chứng thư: <b>{pendingVolume} tấn</b> ({pendingBatches} lô — {pendingPercentage}%)
          </span>
        </div>

        <div className="h-3.5 w-full bg-white/10 rounded-full overflow-hidden flex p-0.5 border border-white/15">
          <div
            style={{ width: `${readyPercentage}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full transition-all duration-700 shadow-xs"
          ></div>
          <div
            style={{ width: `${pendingPercentage}%` }}
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-r-full transition-all duration-700"
          ></div>
        </div>
      </div>

      {/* Status Footer */}
      <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-100/90">
        <div className="flex items-center gap-2">
          {pendingVolume > 0 || pendingBatches > 0 ? (
            <span className="text-amber-200 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Có <b>{pendingVolume} tấn</b> ({pendingBatches} lô) đang chờ tải lên đủ 4 Khóa chứng thư (Lab Cadmium, Phyto, C/O, Packing list).
              </span>
            </span>
          ) : (
            <span className="text-emerald-300 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Toàn bộ {totalVolume} tấn hàng ({totalBatches} lô) đã đầy đủ 4 chứng thư hợp lệ, sẵn sàng thông quan!</span>
            </span>
          )}
        </div>

        <button
          onClick={onOpenDrillDown}
          className="text-xs font-bold text-white hover:text-amber-300 transition-colors flex items-center gap-1 underline underline-offset-4 cursor-pointer self-start sm:self-auto shrink-0"
        >
          Xem chi tiết phân bổ <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

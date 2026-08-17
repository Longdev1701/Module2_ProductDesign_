"use client";

import React from 'react';
import { Truck, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';
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

  const totalVolume = summary?.totalExportVolumeTons || 0;
  const readyVolume = summary?.readyVolumeTons || 0;
  const pendingVolume = summary?.pendingVolumeTons || 0;
  const readyContainers = summary?.readyContainersEstimate || 0;

  const readyValue = summary?.readyValueVndBillion ?? Math.round(readyVolume * 0.12 * 10) / 10;
  const pendingValue = summary?.pendingValueVndBillion ?? Math.round(pendingVolume * 0.12 * 10) / 10;
  const totalValue = summary?.totalValueVndBillion ?? Math.round(totalVolume * 0.12 * 10) / 10;

  const readyPercentage = totalVolume > 0 ? Math.round((readyVolume / totalVolume) * 100) : 0;
  const pendingPercentage = 100 - readyPercentage;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-primary-container to-slate-900 text-white p-6 rounded-2xl border border-primary/20 shadow-md relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 border border-white/10">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-white">
              Thước đo Sẵn sàng Thông quan &amp; Dòng Tiền Hàng Xuất Khẩu
            </h3>
            <p className="text-xs text-slate-300">
              Tổng giá trị hàng hóa: <b>~{totalValue} Tỷ VNĐ</b> ({totalVolume} tấn sầu riêng tươi)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> ~{readyContainers} CONTAINER 40FT (~{readyValue} TỶ)
          </span>
        </div>
      </div>

      {/* Progress Bar with Financial Amounts */}
      <div className="space-y-2 my-4">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-emerald-300 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Đã an toàn: {readyVolume} tấn (~{readyValue} Tỷ VNĐ - {readyPercentage}%)
          </span>
          <span className="text-amber-300 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Tiền bị nghẽn: {pendingVolume} tấn (~{pendingValue} Tỷ VNĐ - {pendingPercentage}%)
          </span>
        </div>

        <div className="h-3.5 w-full bg-white/10 rounded-full overflow-hidden flex p-0.5 border border-white/10">
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
      <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          {pendingVolume > 0 ? (
            <span className="text-amber-300 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> Có <b>~{pendingValue} Tỷ VNĐ</b> tiền hàng đang bị nghẽn do chờ bổ sung Phiếu Lab Cadmium hoặc C/O.
            </span>
          ) : (
            <span className="text-emerald-300 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Toàn bộ 100% dòng tiền hàng (~{totalValue} Tỷ) đã sẵn sàng kẹp chì xuất cảng!
            </span>
          )}
        </div>

        <button
          onClick={onOpenDrillDown}
          className="text-xs font-bold text-white hover:text-emerald-300 transition-colors flex items-center gap-1 underline underline-offset-4 cursor-pointer self-start sm:self-auto"
        >
          Xem chi tiết phân bổ <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

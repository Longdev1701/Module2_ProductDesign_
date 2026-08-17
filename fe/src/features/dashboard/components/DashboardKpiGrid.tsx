"use client";

import React from 'react';
import { Package, ShieldCheck, AlertTriangle, Flame, Layers } from 'lucide-react';
import { DashboardSummary } from '@/types/api';
import { KpiDrillDownType } from './KpiDrillDownModal';

interface DashboardKpiGridProps {
  summary: DashboardSummary | null;
  loading: boolean;
  onSelectDrillDown?: (type: KpiDrillDownType) => void;
}

export function DashboardKpiGrid({ summary, loading, onSelectDrillDown }: DashboardKpiGridProps) {
  if (loading && !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-xs animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="h-4 bg-slate-200 rounded w-24"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-16"></div>
            <div className="h-3 bg-slate-100 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalBatches = summary?.totalBatches || 0;
  const complianceRate = summary?.complianceRate ?? 100;
  const actionRequiredBatches = summary?.actionRequiredBatches || 0;
  const criticalLegalAlerts = summary?.criticalLegalAlerts || 0;
  const totalVolumeTons = summary?.totalExportVolumeTons || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* KPI 1: Tổng Lô hàng (Click để Drill-down) */}
      <div
        onClick={() => onSelectDrillDown?.('TOTAL_BATCHES')}
        className="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-xs relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50 group cursor-pointer"
        title="Bấm để xem danh sách toàn bộ lô hàng"
      >
        <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-xs text-on-surface-variant uppercase tracking-wider">LÔ HÀNG TRONG VỤ</h3>
          </div>
          <Layers className="w-4 h-4 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-serif text-3xl font-extrabold text-on-surface">
            {totalBatches} <span className="text-sm font-sans font-normal text-on-surface-variant">lô</span>
          </span>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {totalVolumeTons} tấn
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Sẵn sàng: <strong className="text-on-surface">{summary?.readyForCheckBatches || 0}</strong></span>
          <span className="text-primary font-semibold group-hover:underline flex items-center gap-0.5">
            Chi tiết &rarr;
          </span>
        </div>
      </div>

      {/* KPI 2: Tỷ lệ Hồ sơ Hợp lệ (Click để Drill-down) */}
      <div
        onClick={() => onSelectDrillDown?.('COMPLIANCE_RATE')}
        className="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-xs relative overflow-hidden transition-all hover:shadow-md hover:border-emerald-500/50 group cursor-pointer"
        title="Bấm để xem phân tích tỷ lệ đạt chuẩn 4 Khóa"
      >
        <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-xs text-on-surface-variant uppercase tracking-wider">HỒ SƠ HỢP LỆ</h3>
          </div>
          <Layers className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-serif text-3xl font-extrabold text-emerald-800">
            {complianceRate}%
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Đạt 4 Khóa
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Chuẩn GACC: <strong>{summary?.readyForCheckBatches || 0}/{totalBatches}</strong></span>
          <span className="text-emerald-700 font-semibold group-hover:underline">Xem phân tích &rarr;</span>
        </div>
      </div>

      {/* KPI 3: Lô hàng Cần xử lý gấp (Click để Drill-down) */}
      <div
        onClick={() => onSelectDrillDown?.('ACTION_REQUIRED')}
        className={`bg-white p-5 rounded-2xl border shadow-xs relative overflow-hidden transition-all hover:shadow-md group cursor-pointer ${
          actionRequiredBatches > 0
            ? 'border-l-4 border-l-amber-500 border-outline-variant/60 hover:border-amber-400'
            : 'border-outline-variant/60 hover:border-emerald-400'
        }`}
        title="Bấm để xem danh sách các lô cần bổ sung chứng từ"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-xs text-on-surface-variant uppercase tracking-wider">CẦN XỬ LÝ GẤP</h3>
          </div>
          <Layers className="w-4 h-4 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-serif text-3xl font-extrabold text-amber-900">
            {actionRequiredBatches} <span className="text-sm font-sans font-normal text-on-surface-variant">lô</span>
          </span>
          {actionRequiredBatches > 0 ? (
            <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
              Thiếu chứng từ
            </span>
          ) : (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Ổn định
            </span>
          )}
        </div>
        <div className="mt-3 pt-2.5 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Khắc phục trước đóng cont</span>
          <span className="text-amber-800 font-semibold group-hover:underline">Xử lý ngay &rarr;</span>
        </div>
      </div>

      {/* KPI 4: Cảnh báo Pháp lý Khẩn cấp (Click để Drill-down) */}
      <div
        onClick={() => onSelectDrillDown?.('LEGAL_ALERTS')}
        className={`bg-white p-5 rounded-2xl border shadow-xs relative overflow-hidden transition-all hover:shadow-md group cursor-pointer ${
          criticalLegalAlerts > 0
            ? 'border-l-4 border-l-rose-600 border-outline-variant/60 hover:border-rose-400'
            : 'border-outline-variant/60'
        }`}
        title="Bấm để xem các cảnh báo mới nhất từ GACC và Cục BVTV"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-xs text-on-surface-variant uppercase tracking-wider">CẢNH BÁO GACC/BVTV</h3>
          </div>
          <Layers className="w-4 h-4 text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-serif text-3xl font-extrabold text-rose-700">
            {criticalLegalAlerts} <span className="text-sm font-sans font-normal text-on-surface-variant">tin</span>
          </span>
          <span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
            30 ngày qua
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
          <span>MRL, Cadmium &amp; Mã PUC</span>
          <span className="text-rose-700 font-semibold group-hover:underline">Xem radar &rarr;</span>
        </div>
      </div>
    </div>
  );
}

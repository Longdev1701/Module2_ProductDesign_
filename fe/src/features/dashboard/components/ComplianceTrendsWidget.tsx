"use client";

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Layers, Check } from 'lucide-react';
import { DashboardTrends } from '@/types/api';

interface ComplianceTrendsWidgetProps {
  trends: DashboardTrends | null;
  loading: boolean;
  selectedMonthFilter?: string | null;
  onSelectMonth?: (month: string | null) => void;
  selectedStatusFilter?: string | null;
  onSelectStatus?: (status: string | null, labelVi?: string) => void;
}

export function ComplianceTrendsWidget({
  trends,
  loading,
  selectedMonthFilter,
  onSelectMonth,
  selectedStatusFilter,
  onSelectStatus,
}: ComplianceTrendsWidgetProps) {
  const [activeTab, setActiveTab] = useState<'trends' | 'status'>('trends');

  if (loading && !trends) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 shadow-xs animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-48"></div>
        <div className="h-44 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  const monthlyData = trends?.monthlyTrends || [];
  const statusData = (trends?.statusBreakdown || []).filter((s) => s.count > 0);

  // Tìm sản lượng cao nhất để scale biểu đồ cột
  const maxVolume = Math.max(...monthlyData.map((m) => m.totalVolumeTons), 10);

  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-on-surface flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Tiến độ &amp; Phân bổ Xuất khẩu
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Bấm vào từng cột tháng hoặc trạng thái để lọc bảng lô hàng bên trên
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-surface-container-low rounded-xl border border-outline-variant/50 self-start">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'trends'
                ? 'bg-white text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> 6 Tháng
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'status'
                ? 'bg-white text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Trạng thái
          </button>
        </div>
      </div>

      {activeTab === 'trends' ? (
        <div className="space-y-4">
          {/* Biểu đồ thanh 6 tháng tương tác */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-outline-variant/60 bg-surface-container-lowest/50 rounded-xl">
            {monthlyData.map((item, idx) => {
              const heightPercent = Math.max(Math.round((item.totalVolumeTons / maxVolume) * 100), 8);
              const isSelected = selectedMonthFilter === item.month;

              return (
                <button
                  key={idx}
                  onClick={() => onSelectMonth?.(isSelected ? null : item.month)}
                  className={`flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer focus:outline-hidden ${
                    isSelected ? 'scale-105' : ''
                  }`}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {item.totalVolumeTons} tấn ({item.totalBatches} lô) — Bấm để lọc
                  </div>

                  {/* Cột */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-500 shadow-md ring-2 ring-amber-400'
                        : item.totalVolumeTons > 0
                        ? 'bg-gradient-to-t from-primary/80 to-primary group-hover:brightness-110 shadow-xs'
                        : 'bg-slate-200/60 group-hover:bg-slate-300'
                    }`}
                  >
                    {item.totalVolumeTons > 0 && (
                      <span className="text-[10px] font-mono font-bold text-white mb-1">
                        {item.totalVolumeTons}
                      </span>
                    )}
                  </div>

                  {/* Nhãn tháng */}
                  <span
                    className={`text-[11px] font-mono font-medium transition-colors ${
                      isSelected ? 'text-amber-600 font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    {item.month}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-primary"></span>
              Sản lượng xuất khẩu theo tháng (tấn)
            </span>
            <span className="font-mono text-primary font-semibold">
              Tổng 6 tháng: {Math.round(monthlyData.reduce((s, m) => s + m.totalVolumeTons, 0) * 10) / 10} tấn
            </span>
          </div>
        </div>
      ) : (
        /* Phân bổ theo trạng thái tương tác */
        <div className="space-y-3 py-2">
          {statusData.length === 0 ? (
            <p className="text-xs text-center text-on-surface-variant py-8">Chưa có lô hàng phân loại.</p>
          ) : (
            statusData.map((item, idx) => {
              const isSelected = selectedStatusFilter === item.status;

              return (
                <button
                  key={idx}
                  onClick={() => onSelectStatus?.(isSelected ? null : item.status, item.labelVi)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary'
                      : 'bg-surface-container-low border-outline-variant/40 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isSelected ? 'bg-primary' : 'bg-primary/60'
                      }`}
                    ></span>
                    <span className="text-xs font-semibold text-on-surface">{item.labelVi}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-white rounded-full border border-outline-variant text-on-surface">
                      {item.count} lô
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

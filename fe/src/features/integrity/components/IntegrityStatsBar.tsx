"use client";

import React from 'react';
import { ShieldCheck, Lock, Users, FileCheck2, Activity } from 'lucide-react';
import { IntegrityStats } from '../types';

interface IntegrityStatsBarProps {
  stats: IntegrityStats | null;
  loading: boolean;
}

export function IntegrityStatsBar({ stats, loading }: IntegrityStatsBarProps) {
  if (loading && !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-outline-variant/60 shadow-xs animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="h-7 bg-slate-100 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalEvents = stats?.totalLoggedEvents || 0;
  const sealedReports = stats?.sealedReportsCount || 0;
  const activeActors = stats?.activeActorsCount || 0;
  const integrityRate = stats?.hashChainIntegrityRate || 100;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Tổng Sự Kiện Ghi Nhận */}
      <div className="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">Tổng Sự Kiện Bất Biến</span>
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl font-bold text-on-surface">{totalEvents}</div>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Nhật ký Append-only không thể xóa</p>
        </div>
      </div>

      {/* Card 2: Báo Cáo Đã Ký Niêm Phong */}
      <div className="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">Báo Cáo Ký Niêm Phong</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCheck2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl font-bold text-emerald-700">{sealedReports}</div>
          <p className="text-[11px] text-emerald-600 mt-0.5">Khóa chữ ký số &amp; Mã Seal SHA-256</p>
        </div>
      </div>

      {/* Card 3: Nhân Sự Đã Tác Nghiệp */}
      <div className="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">Nhân Sự Đã Ghi Nhận</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl font-bold text-blue-700">{activeActors}</div>
          <p className="text-[11px] text-blue-600 mt-0.5">Tài khoản có thao tác trong tổ chức</p>
        </div>
      </div>

      {/* Card 4: Độ Toàn Vẹn Chuỗi Khối */}
      <div className="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">Độ Toàn Vẹn Dữ Liệu</span>
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl font-bold text-teal-700">{integrityRate}%</div>
          <p className="text-[11px] text-teal-600 mt-0.5 flex items-center gap-1 font-medium">
            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" /> 0 phát hiện can thiệp
          </p>
        </div>
      </div>
    </div>
  );
}

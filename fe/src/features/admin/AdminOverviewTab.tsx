"use client";

import React from "react";
import {
  Building2,
  Users,
  FileCheck2,
  BookOpen,
  Globe2,
  ShieldCheck,
  Activity,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { AdminOverviewSkeleton } from "./AdminSkeletons";
import type { AdminOverviewData } from "@/types/api";

interface AdminOverviewTabProps {
  data: AdminOverviewData | null;
  loading: boolean;
  onRefresh: () => void;
  onNavigateTab: (tab: "orgs" | "users" | "legal-sync" | "cifer" | "audit-logs") => void;
}

export function AdminOverviewTab({ data, loading, onRefresh, onNavigateTab }: AdminOverviewTabProps) {
  if (loading || !data) {
    return <AdminOverviewSkeleton />;
  }

  const { kpis, systemStatus, orgsByProduct, recentAuditLogs } = data;

  const statCards = [
    {
      label: "DOANH NGHIỆP XUẤT KHẨU",
      value: kpis.totalOrgs,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      tab: "orgs" as const,
      desc: "Doanh nghiệp đã đăng ký trên nền tảng",
    },
    {
      label: "TÀI KHOẢN NGƯỜI DÙNG",
      value: kpis.totalUsers,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
      tab: "users" as const,
      desc: "Cán bộ XNK, Kiểm định & Quản trị viên",
    },
    {
      label: "THƯ VIỆN QUY ĐỊNH PHÁP LÝ",
      value: kpis.totalRegulations,
      icon: BookOpen,
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-200",
      tab: "legal-sync" as const,
      desc: "Quy chuẩn kỹ thuật, MRL & Kiểm dịch 9 nước",
    },
    {
      label: "BẢN TIN PHÁP LÝ ĐÃ CÀO",
      value: kpis.totalLegalUpdates,
      icon: Globe2,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      tab: "legal-sync" as const,
      desc: "100% văn bản chính phủ đã dịch & tóm tắt AI",
    },
    {
      label: "DOANH NGHIỆP CIFER (GACC)",
      value: kpis.totalCifer,
      icon: ShieldCheck,
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-200",
      tab: "cifer" as const,
      desc: "Mã xuất khẩu chính ngạch sang Trung Quốc",
    },
    {
      label: "LÔ HÀNG THẨM ĐỊNH",
      value: kpis.totalBatches,
      icon: FileCheck2,
      color: "text-teal-600",
      bg: "bg-teal-50 border-teal-200",
      tab: "orgs" as const,
      desc: "Lô hàng nông sản đã tạo hồ sơ 4 Khóa",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#001946] to-[#003380] p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-amber-400" />
            Trung Tâm Điều Hành Toàn Hệ Thống
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Giám sát thời gian thực toàn bộ doanh nghiệp, tài khoản, thư viện pháp lý và công cụ cào tự động Themis LexiGuard.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer text-white"
        >
          <RefreshCw className="w-4 h-4" /> Làm mới dữ liệu
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={() => onNavigateTab(card.tab)}
              className="bg-white border border-outline-variant hover:border-primary/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold tracking-wider text-on-surface-variant">
                    {card.label}
                  </span>
                  <div className="text-3xl font-black text-on-surface group-hover:text-primary transition-colors">
                    {card.value.toLocaleString("vi-VN")}
                  </div>
                </div>
                <div className={`p-3 rounded-xl border ${card.bg}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-outline-variant/50 flex justify-between items-center text-xs text-on-surface-variant">
                <span>{card.desc}</span>
                <span className="text-primary font-bold group-hover:underline">Chi tiết →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Status & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Tình Trạng Vận Hành Hạ Tầng
          </h3>
          <div className="space-y-3">
            {[
              { name: "Cơ sở dữ liệu PostgreSQL / Prisma", status: systemStatus.database, ok: true },
              { name: "Hệ thống Xác thực Supabase Auth & JWT", status: systemStatus.auth, ok: true },
              { name: "AI Thẩm định & Tóm tắt Pháp lý (Gemini 3.5 Flash)", status: systemStatus.aiEngine, ok: true },
              { name: "Legal Crawler 9 Quốc gia & Cổng Chính Phủ", status: systemStatus.crawler, ok: true },
            ].map((srv) => (
              <div key={srv.name} className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <span className="text-xs font-semibold text-on-surface">{srv.name}</span>
                <span className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {srv.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Breakdown */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Phân Bổ Doanh Nghiệp Theo Ngành Hàng
          </h3>
          {orgsByProduct.length === 0 ? (
            <p className="text-xs text-on-surface-variant italic">Chưa có dữ liệu phân loại ngành hàng.</p>
          ) : (
            <div className="space-y-2.5">
              {orgsByProduct.map((item) => (
                <div key={item.product} className="flex justify-between items-center p-2.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-low text-xs">
                  <span className="font-semibold text-on-surface truncate max-w-[200px]" title={item.product}>
                    {item.product}
                  </span>
                  <span className="font-mono font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">
                    {item.count} DN
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Audit Activity */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              Hoạt Động Quản Trị Gần Nhất
            </h3>
            <button
              onClick={() => onNavigateTab("audit-logs")}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>
          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {recentAuditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 rounded-xl border border-outline-variant/50 text-xs space-y-1 bg-surface">
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-primary">{log.action}</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    {new Date(log.createdAt).toLocaleTimeString("vi-VN")}
                  </span>
                </div>
                <p className="text-on-surface-variant truncate">
                  Người thực hiện: <strong className="text-on-surface">{log.profile?.email || "System"}</strong> ({log.entity})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

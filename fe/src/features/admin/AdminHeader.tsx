"use client";

import React from "react";
import { ShieldCheck, LogOut, ArrowLeft, LayoutDashboard, Building2, Users, Globe2, FileSpreadsheet, ShieldAlert } from "lucide-react";

interface AdminHeaderProps {
  activeTab: "overview" | "orgs" | "users" | "legal-sync" | "cifer" | "audit-logs";
  onTabChange: (tab: "overview" | "orgs" | "users" | "legal-sync" | "cifer" | "audit-logs") => void;
  user?: {
    fullName: string;
    email: string;
    platformRole?: string;
  } | null;
  onLogout: () => void;
  counts?: {
    orgs: number;
    users: number;
    regulations: number;
    cifer: number;
  };
}

export function AdminHeader({ activeTab, onTabChange, user, onLogout, counts }: AdminHeaderProps) {
  const tabs = [
    { id: "overview" as const, label: "Tổng Quan", icon: LayoutDashboard },
    { id: "orgs" as const, label: `Doanh Nghiệp ${counts?.orgs ? `(${counts.orgs})` : ""}`, icon: Building2 },
    { id: "users" as const, label: `Người Dùng ${counts?.users ? `(${counts.users})` : ""}`, icon: Users },
    { id: "legal-sync" as const, label: "Đồng Bộ Pháp Lý (9 Nước)", icon: Globe2 },
    { id: "cifer" as const, label: `CIFER Trung Quốc ${counts?.cifer ? `(${counts.cifer})` : ""}`, icon: FileSpreadsheet },
    { id: "audit-logs" as const, label: "Nhật Ký Kiểm Toán", icon: ShieldAlert },
  ];

  return (
    <div className="space-y-4">
      {/* Top Navbar for Platform Admin */}
      <div className="bg-gradient-to-r from-[#001946] to-[#002f6c] text-white p-4 rounded-2xl flex items-center justify-between shadow-lg border border-blue-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400/20 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">Themis LexiGuard</span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-400/30 font-bold">
                {user?.platformRole || "PLATFORM ADMIN"}
              </span>
            </div>
            <p className="text-[11px] text-[#a5bdff]">Trung tâm Quản trị Nền tảng & Thẩm quyền Tối cao</p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Quay lại Workspace Doanh nghiệp"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Vào Workspace</span>
          </a>

          {user && (
            <div className="hidden md:flex items-center gap-2 text-xs border-r border-white/20 pr-4">
              <div className="w-7 h-7 bg-amber-400 text-[#001946] rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
                {user.fullName?.[0] || "A"}
              </div>
              <div className="text-right">
                <p className="font-semibold text-white leading-tight">{user.fullName}</p>
                <p className="text-[10px] text-[#a5bdff] font-mono">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-outline-variant gap-2 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 px-3.5 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer rounded-t-lg ${
                isActive
                  ? "border-primary text-primary bg-primary/5 shadow-xs"
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

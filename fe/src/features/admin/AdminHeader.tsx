"use client";

import React from "react";
import { ShieldCheck, Search, LogOut } from "lucide-react";

interface AdminHeaderProps {
  activeTab: "orgs" | "users";
  search: string;
  onSearchChange: (val: string) => void;
  user?: {
    fullName: string;
    email: string;
    platformRole?: string;
  } | null;
  onLogout: () => void;
}

export function AdminHeader({ activeTab, search, onSearchChange, user, onLogout }: AdminHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Navbar Bar for Admin */}
      <div className="bg-[#001946] text-white p-4 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 border border-purple-400/40 rounded-lg flex items-center justify-center text-purple-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Themis LexiGuard</span>
              <span className="bg-purple-500/30 text-purple-200 text-[10px] font-mono px-2 py-0.5 rounded border border-purple-400/30">
                PLATFORM ADMIN
              </span>
            </div>
            <p className="text-xs text-[#a5bdff]">Trung tâm Quản trị Hệ thống & Cấp quyền</p>
          </div>
        </div>

        {/* User Info & Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
            title="Chuyển tới giao diện Workspace Doanh nghiệp"
          >
            <span>🌱 User Workspace</span>
          </a>

          {user && (
            <div className="hidden sm:flex items-center gap-2 text-xs border-r border-white/20 pr-4">
              <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-xs">
                {user.fullName?.[0] || 'A'}
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{user.fullName}</p>
                <p className="text-[11px] text-[#a5bdff]">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Title & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-serif font-bold text-on-surface">Quản Trị Doanh Nghiệp & Nhân Sự</h1>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Khởi tạo Doanh nghiệp xuất khẩu sầu riêng và cấp quyền thành viên theo mô hình Admin-Provisioned SaaS.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            placeholder={activeTab === 'orgs' ? "Tìm công ty, mã số thuế, sản phẩm..." : "Tìm nhân sự, email, chức danh..."}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs border border-outline-variant rounded-lg bg-white focus:outline-none focus:border-primary shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}

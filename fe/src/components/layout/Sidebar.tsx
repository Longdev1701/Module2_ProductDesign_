"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { AuthMeResponse } from "@/types/api";

const baseNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "Tư vấn AI Tuân thủ", href: "/checks/new", icon: "auto_awesome" },
  { name: "Thư viện Pháp lý GACC", href: "/regulations", icon: "menu_book" },
  { name: "Sản phẩm & Lô hàng", href: "/products", icon: "inventory_2" },
  { name: "Lịch sử Thẩm định", href: "/history", icon: "history" },
  { name: "Giám sát Liêm chính", href: "/integrity", icon: "gavel" },
  { name: "Cài đặt & Phân quyền", href: "/settings", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    let hasRoleFromCache = false;
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("themis:user_cache");
      if (cached) {
        try {
          const u = JSON.parse(cached);
          if (u?.platformRole === "SUPER_ADMIN" || u?.platformRole === "PLATFORM_ADMIN") {
            setIsAdmin(true);
            hasRoleFromCache = true;
          }
        } catch {}
      }
    }

    async function checkRole() {
      try {
        if (!hasRoleFromCache) {
          const res = await api.get<AuthMeResponse>("/auth/me");
          const role = res.data?.user?.platformRole || res.data?.profile?.platformRole;
          if (role === "SUPER_ADMIN" || role === "PLATFORM_ADMIN") {
            setIsAdmin(true);
          }
        }
      } catch {}
    }
    void checkRole();
  }, []);

  const navItems = isAdmin
    ? [...baseNavItems, { name: "Platform Admin", href: "/admin", icon: "admin_panel_settings" }]
    : baseNavItems;

  return (
    <aside className="hidden lg:flex w-[280px] h-screen fixed left-0 top-0 bg-[#001946] border-r border-[#c3c6d5]/30 flex-col py-6 z-50">
      {/* Brand Logo */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00236f] to-[#00143B] border border-[#FFB800]/40 flex items-center justify-center text-[#FFB800] font-bold text-xl shadow-lg shadow-[#00143B]/50 group-hover:border-[#FFB800] transition-colors">
            T
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide leading-none">
              Themis LexiGuard
            </h1>
            <p className="text-[10px] text-[#FFB800] font-semibold tracking-wider uppercase mt-1">
              GACC Compliance Navigator
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#FFB800] to-[#E6A600] text-[#00143B] font-bold shadow-md shadow-[#FFB800]/20"
                  : "text-[#c3c6d5] hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-[#00143B]" : "text-[#c3c6d5]"}`}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Organization Badge Footer */}
      <div className="px-4 pt-4 border-t border-white/10 mx-4">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium truncate">Đã kết nối Hệ thống</span>
          </div>
          <p className="text-[11px] text-[#FFB800] mt-1 font-mono truncate">Mã HS: 0810.60.00</p>
        </div>
      </div>
    </aside>
  );
}

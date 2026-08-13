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

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const cached = localStorage.getItem("themis:user_cache");
    if (!cached) return false;
    try {
      const u = JSON.parse(cached);
      return u?.platformRole === "SUPER_ADMIN" || u?.platformRole === "PLATFORM_ADMIN";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    async function checkRole() {
      try {
        const cached = localStorage.getItem("themis:user_cache");
        if (!cached) {
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
    <aside className="w-[280px] h-screen fixed left-0 top-0 bg-[#001946] border-r border-[#c3c6d5]/30 flex flex-col py-6 z-50">
      {/* Brand Logo */}
      <div className="px-4 mb-6 flex flex-col items-center">
        <Link href="/dashboard" className="w-full flex flex-col items-center group">
          <div className="w-full max-w-[220px] p-2 rounded-2xl bg-gradient-to-b from-amber-400/25 via-amber-400/10 to-transparent border border-amber-400/40 group-hover:border-amber-400/70 transition-all shadow-lg flex justify-center">
            <img
              alt="Themis LexiGuard Logo"
              className="h-28 w-auto object-contain rounded-xl drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
              src="/themis_logo.png"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        </Link>
      </div>

      {/* Action Button: Tạo Kiểm Tra Tuân Thủ AI Mới */}
      <div className="px-4 mb-6">
        <button
          onClick={() => router.push("/checks/new")}
          className="w-full bg-amber-400 hover:bg-amber-300 text-[#001946] font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">auto_awesome</span>
          Tạo Kiểm Tra AI GACC
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#0047ab] text-white border-l-4 border-amber-400 rounded-r-lg shadow-xs"
                  : "text-[#a5bdff] hover:text-white hover:bg-white/10 rounded-lg"
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="px-4 pt-4 border-t border-white/10 text-center">
        <p className="text-[11px] text-[#a5bdff]/70">Themis LexiGuard v0.1.0</p>
        <p className="text-[10px] text-[#a5bdff]/50">Sầu riêng × Trung Quốc (GACC)</p>
      </div>
    </aside>
  );
}

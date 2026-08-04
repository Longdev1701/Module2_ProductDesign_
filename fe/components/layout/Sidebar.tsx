"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "Tư vấn AI", href: "/checks/new", icon: "qr_code_2" },
  { name: "Giám sát liêm chính", href: "/integrity", icon: "gavel" },
  { name: "Thư viện Pháp lý", href: "/regulations", icon: "book_5" },
  { name: "Sản phẩm & Lô hàng", href: "/products", icon: "inventory_2" },
  { name: "Lịch sử Thẩm định", href: "/history", icon: "history" },
  { name: "Settings", href: "/settings", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-[280px] h-screen fixed left-0 top-0 bg-[#001946] border-r border-[#c3c6d5]/30 flex flex-col py-6 z-50">
      {/* Brand Logo */}
      <div className="px-4 mb-6 flex flex-col items-center">
        <Link href="/dashboard" className="w-full flex flex-col items-center group">
          <div className="w-full max-w-[220px] p-1.5 rounded-2xl bg-gradient-to-b from-amber-400/25 via-amber-400/10 to-transparent border border-amber-400/40 group-hover:border-amber-400/70 transition-all shadow-lg flex justify-center">
            <img
              alt="Themis LexiGuard Logo"
              className="h-32 w-auto object-contain rounded-xl drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
              src="/themis_logo.png"
            />
          </div>
        </Link>
      </div>

      {/* Action Button */}
      <div className="px-4 mb-6">
        <button
          onClick={() => router.push('/checks/new')}
          className="w-full bg-white text-[#00327d] font-semibold text-sm py-3 px-4 rounded shadow-sm hover:bg-[#eceef0] transition-colors flex justify-center items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add</span> New Analysis
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#0047ab] text-[#a5bdff] border-l-4 border-[#b1c5ff] rounded-r"
                  : "text-white/70 hover:text-white hover:bg-white/10 rounded"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Help Center */}
      <div className="px-2 mt-auto">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded text-sm font-semibold"
        >
          <span className="material-symbols-outlined">help</span>
          <span>Help Center</span>
        </a>
      </div>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="h-16 fixed top-0 right-0 w-[calc(100%-280px)] bg-[#f7f9fb]/80 backdrop-blur-md border-b border-[#c3c6d5] flex justify-between items-center px-6 z-40">
      <div className="flex-1 max-w-2xl flex items-center">
        <div className="relative w-full focus-within:ring-2 focus-within:ring-[#00327d] rounded-lg transition-all">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#434653]">
            search
          </span>
          <input
            className="w-full pl-10 pr-10 py-2 bg-white border border-[#737784]/40 rounded-lg text-sm focus:outline-none focus:border-[#00327d] text-[#191c1e] placeholder:text-[#434653]"
            placeholder="Tìm kiếm pháp lý, quy định..."
            type="text"
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#00327d]">
            auto_awesome
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <button className="p-2 text-[#434653] hover:bg-[#e6e8ea] rounded-full transition-all relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </button>
        <button className="flex items-center gap-2 p-1 hover:bg-[#e6e8ea] rounded-full transition-all">
          <div className="w-8 h-8 rounded-full bg-[#0047ab] flex items-center justify-center text-white text-sm font-semibold">
            TL
          </div>
        </button>
      </div>
    </header>
  );
}

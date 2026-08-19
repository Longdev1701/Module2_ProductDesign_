"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, RefreshCw } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { NotificationsDropdown } from "./NotificationsDropdown";

export function Topbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/regulations?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleGlobalRefresh = () => {
    setIsRefreshing(true);
    // Phát sự kiện toàn cục để Dashboard, Widgets, Notifications cùng làm mới dữ liệu tức thì
    window.dispatchEvent(new CustomEvent("themis:refresh-all"));
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <header className="h-16 fixed top-0 right-0 w-[calc(100%-280px)] bg-surface/85 backdrop-blur-md border-b border-outline-variant/60 flex justify-between items-center px-6 z-40">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl flex items-center gap-4">
        <div className="relative w-full focus-within:ring-2 focus-within:ring-primary/40 rounded-xl transition-all">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-primary text-on-surface placeholder:text-on-surface-variant/70 shadow-2xs"
            placeholder="Tìm kiếm pháp lý, quy định GACC, mã HS 0810.60.00..."
            type="text"
          />
          <button
            type="submit"
            title="AI Search Tra cứu"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-4">
        {/* Nút Làm Mới Toàn Cục */}
        <button
          onClick={handleGlobalRefresh}
          disabled={isRefreshing}
          className="px-3 py-1.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          title="Làm mới toàn bộ dữ liệu & thông báo hệ thống"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-primary ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Làm mới</span>
        </button>

        {/* Realtime Notifications Dropdown Center */}
        <NotificationsDropdown />

        {/* User Session Dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
}

export default Topbar;

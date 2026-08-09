"use client";

import React from "react";
import { UserDropdown } from "./UserDropdown";

export function Topbar() {
  return (
    <header className="h-16 fixed top-0 right-0 w-[calc(100%-280px)] bg-[#f7f9fb]/80 backdrop-blur-md border-b border-[#c3c6d5] flex justify-between items-center px-6 z-40">
      {/* Search Input Bar */}
      <div className="flex-1 max-w-xl flex items-center gap-4">
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

      {/* Right Controls */}
      <div className="flex items-center gap-4 ml-4">
        <button className="p-2 text-[#434653] hover:bg-[#e6e8ea] rounded-full transition-all relative cursor-pointer">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </button>

        {/* User Session Dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
}

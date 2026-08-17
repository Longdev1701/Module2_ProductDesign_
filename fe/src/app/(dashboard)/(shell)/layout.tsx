"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f7f9fb]">
      {/* Left Sidebar Navigation (Auto-collapsed on Mobile) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-[280px] ml-0 min-w-0">
        {/* Top Navigation Bar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 mt-16 lg:p-6 p-3 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

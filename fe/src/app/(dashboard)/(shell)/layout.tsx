"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f7f9fb]">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[280px]">
        {/* Top Navigation Bar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 mt-16 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

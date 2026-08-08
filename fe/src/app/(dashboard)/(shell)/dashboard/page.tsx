"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import LegalTrackingWidget from "@/components/LegalTrackingWidget";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("access_token");
      if (!token) { router.replace("/login"); return; }
      try {
        const res = await api.get<any>("/auth/me");
        const userData = res.data?.user;
        const orgs = res.data?.organizations;
        if (!userData) { router.replace("/login"); return; }
        if (userData.platformRole === "SUPER_ADMIN" || userData.platformRole === "PLATFORM_ADMIN") {
          router.replace("/admin"); return;
        }
        if (!orgs || orgs.length === 0) { router.replace("/pending-access"); return; }
        setUser(userData);
        setOrg(orgs[0]);
        localStorage.setItem("active_org_id", orgs[0].id);
      } catch { router.replace("/login"); }
      finally { setLoading(false); }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#00327d] border-t-transparent" />
          <p className="text-sm text-[#434653]">Đang tải Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold text-[#191c1e] mb-2">Tổng quan tuân thủ</h2>
        <p className="text-[#434653] text-base font-sans">
          Xin chào, <strong>{user?.fullName}</strong> — {org?.name} ({org?.role})
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#00327d]/5 rounded-bl-full -mr-4 -mt-4" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#0047ab]/20 rounded-lg text-[#00327d]">
              <span className="material-symbols-outlined">fact_check</span>
            </div>
            <h3 className="font-semibold text-sm text-[#434653]">Tổng kiểm tra</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-4xl font-bold text-[#191c1e]">128</span>
            <span className="text-emerald-700 font-semibold text-sm flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-sm">trending_up</span> 12% tháng này
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#205833]/20 rounded-lg text-[#01401e]">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <h3 className="font-semibold text-sm text-[#434653]">Đạt yêu cầu</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-4xl font-bold text-[#191c1e]">97</span>
            <span className="text-[#434653] text-sm mb-2">/ 75.8% Tỷ lệ</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border-l-4 border-l-[#ba1a1a] border-y border-r border-[#c3c6d5]/60 shadow-[0_4px_20px_-10px_rgba(186,26,26,0.1)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#ffdad6] text-[#93000a] rounded-lg">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <h3 className="font-semibold text-sm text-[#93000a]">Cảnh báo</h3>
          </div>
          <div className="flex items-end gap-3 justify-between">
            <span className="font-serif text-4xl font-bold text-[#ba1a1a]">22</span>
            <Link href="/integrity" className="text-[#434653] text-sm mb-2 hover:text-[#00327d] transition-colors flex items-center gap-1 font-semibold">
              Xem hồ sơ <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#d2e0fe]/50 text-[#55637d] rounded-lg">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <h3 className="font-semibold text-sm text-[#434653]">Nghiêm trọng</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-4xl font-bold text-[#191c1e]">09</span>
            <span className="text-[#434653] text-sm mb-2">Yêu cầu xử lý</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 h-[380px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl font-semibold text-[#191c1e]">Phân tích rủi ro thị trường</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-[#c3c6d5] rounded-full text-[#434653] hover:bg-[#eceef0] transition-colors">US</button>
                <button className="px-3 py-1 text-sm bg-[#00327d] text-white rounded-full shadow-sm font-semibold">CN</button>
              </div>
            </div>
            <div className="flex-1 bg-[#f2f4f6] rounded-lg border border-[#c3c6d5]/50 flex flex-col items-center justify-center relative overflow-hidden p-6">
              <div className="w-full flex justify-between items-end h-40 gap-4 px-4 border-b border-[#c3c6d5]/40 pb-2">
                {[
                  { h: "65%", val: "65%", c: "bg-[#00327d]/30 hover:bg-[#00327d]/50" },
                  { h: "82%", val: "82%", c: "bg-[#00327d]/50 hover:bg-[#00327d]/70" },
                  { h: "94%", val: "94%", c: "bg-[#01401e]/60 hover:bg-[#01401e]/80" },
                  { h: "45%", val: "45%", c: "bg-[#ba1a1a]/40 hover:bg-[#ba1a1a]/60" },
                  { h: "88%", val: "88%", c: "bg-[#00327d]/80 hover:bg-[#00327d]" },
                  { h: "96%", val: "96%", c: "bg-[#01401e]/80 hover:bg-[#01401e]" },
                ].map((bar, i) => (
                  <div key={i} className={`flex-1 ${bar.c} rounded-t relative transition-all`} style={{ height: bar.h }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#434653]">{bar.val}</div>
                  </div>
                ))}
              </div>
              <div className="w-full flex justify-between text-[11px] text-[#434653] mt-2 px-2">
                <span>T5/2025</span><span>T6/2025</span><span>T7/2025</span><span>T8/2025</span><span>T9/2025</span><span>T10/2025</span>
              </div>
            </div>
          </div>

          {/* Recent Checks */}
          <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl font-semibold text-[#191c1e]">Kiểm tra tuân thủ gần đây</h3>
              <Link href="/history" className="text-[#00327d] font-semibold text-sm hover:underline">Xem tất cả</Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#f7f9fb] rounded-lg border border-[#c3c6d5]/60 hover:border-[#00327d]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#e6e8ea] rounded flex items-center justify-center text-[#434653]">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#191c1e]">Lô sầu riêng SR-2025-07</h4>
                    <p className="text-xs text-[#434653]">Thị trường: Trung Quốc (GACC)</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-[#434653]">25/07/2025</span>
                  <span className="px-3 py-1 bg-[#205833]/20 text-[#01401e] rounded-full text-xs font-bold border border-[#01401e]/20">TUÂN THỦ</span>
                  <button className="text-[#434653] hover:text-[#00327d] transition-colors opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#f7f9fb] rounded-lg border border-l-4 border-l-[#ba1a1a] border-[#c3c6d5]/60 hover:border-[#ba1a1a]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#e6e8ea] rounded flex items-center justify-center text-[#434653]">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#191c1e]">Lô sầu riêng SR-2025-06</h4>
                    <p className="text-xs text-[#434653]">Thị trường: Trung Quốc (GACC)</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-[#434653]">20/06/2025</span>
                  <span className="px-3 py-1 bg-[#ffdad6] text-[#93000a] rounded-full text-xs font-bold border border-[#ba1a1a]/20">KHÔNG ĐẠT</span>
                  <button className="text-[#434653] hover:text-[#00327d] transition-colors opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <LegalTrackingWidget />

          <div className="bg-[#dae2ff] p-6 rounded-xl border border-[#b1c5ff]">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#00327d]">policy</span>
              <h3 className="font-serif text-lg font-semibold text-[#191c1e]">Tài liệu GACC mới</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg flex items-center justify-between shadow-xs">
                <span className="text-xs font-semibold text-[#191c1e]">Nghị định thư sầu riêng GACC 2024.pdf</span>
                <span className="material-symbols-outlined text-sm text-[#00327d]">download</span>
              </div>
              <div className="p-3 bg-white rounded-lg flex items-center justify-between shadow-xs">
                <span className="text-xs font-semibold text-[#191c1e]">Hướng dẫn đăng ký GACC vườn trồng.pdf</span>
                <span className="material-symbols-outlined text-sm text-[#00327d]">download</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

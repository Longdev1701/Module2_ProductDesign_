"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { AuthMeResponse, OrganizationSummary, UserProfile } from "@/types/api";

export function UserDropdown() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeOrg, setActiveOrg] = useState<OrganizationSummary | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await api.get<AuthMeResponse>('/auth/me');
        if (res.data) {
          setUser(res.data.user || res.data.profile || null);
          if (res.data.organizations && res.data.organizations.length > 0) {
            const org = res.data.organizations[0];
            setActiveOrg(org);
            localStorage.setItem('active_org_id', org.id);
          }
        }
      } catch (err) {
        console.error('Failed to load user session', err);
      }
    }
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('active_org_id');
    router.push('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'TL';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const roleColors: Record<string, string> = {
    OWNER: 'bg-amber-100 text-amber-800 border-amber-300',
    MANAGER: 'bg-blue-100 text-blue-800 border-blue-300',
    COMPLIANCE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    VIEWER: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  const isAdmin = user?.platformRole === 'SUPER_ADMIN' || user?.platformRole === 'PLATFORM_ADMIN';

  return (
    <div className="flex items-center gap-4">
      {/* Quick Dashboard Return Button */}
      <Link
        href="/dashboard"
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#00327d] text-white hover:bg-[#0047ab] rounded-lg text-xs font-semibold transition-all shadow-sm"
      >
        <span>Quay về Dashboard</span>
      </Link>

      {/* Active Organization Badge */}
      {activeOrg && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-[#c3c6d5] rounded-lg text-xs">
          <span className="font-semibold text-primary truncate max-w-[180px]">
            {activeOrg.name}
          </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${activeOrg.role ? roleColors[activeOrg.role] : 'bg-gray-100'}`}>
            {activeOrg.role || 'VIEWER'}
          </span>
        </div>
      )}

      {/* Profile & Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 p-1.5 hover:bg-[#e6e8ea] rounded-lg transition-all cursor-pointer border border-[#c3c6d5]/40"
        >
          <div className="w-8 h-8 rounded-full bg-[#0047ab] flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user?.fullName)}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-on-surface leading-tight">
              {user?.fullName || 'Người dùng'}
            </span>
            <span className="text-[10px] text-on-surface-variant leading-tight">
              {user?.jobTitle || (isAdmin ? 'Platform Admin' : 'Thành viên Doanh nghiệp')}
            </span>
          </div>
          <span className="material-symbols-outlined text-sm text-[#434653]">expand_more</span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-60 bg-white border border-outline-variant rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
            <div className="px-4 py-2 border-b border-outline-variant/50">
              <p className="text-xs font-bold text-on-surface">{user?.fullName}</p>
              <p className="text-[11px] text-on-surface-variant truncate">{user?.email}</p>
            </div>

            <Link 
              href="/dashboard" 
              onClick={() => setShowDropdown(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-sm text-primary">dashboard</span>
              Trang chủ Dashboard
            </Link>

            {isAdmin && (
              <Link 
                href="/admin" 
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
              >
                <span className="material-symbols-outlined text-sm text-purple-700">admin_panel_settings</span>
                Platform Admin Portal
              </Link>
            )}

            <Link 
              href="/settings" 
              onClick={() => setShowDropdown(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-sm text-primary">settings</span>
              Cài đặt & Phân quyền
            </Link>

            <div className="border-t border-outline-variant/50 my-1"></div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-red-600">logout</span>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

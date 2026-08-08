"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, LogOut, Building2, Mail, UserCheck, RefreshCw } from "lucide-react";
import { Button } from "../../components/Button";
import { api } from "../../lib/api";

export function PendingAccessView() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await api.get<any>('/auth/me');
        if (res.data) {
          // BE /auth/me trả về { user: {...}, organizations: [...] }
          setUser(res.data.user);
          if (res.data.organizations && res.data.organizations.length > 0) {
            router.push('/dashboard');
          }
        }
      } catch (err) {
        console.error('Failed to load user profile', err);
      }
    }
    loadMe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('active_org_id');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white border border-outline-variant rounded-xl p-8 shadow-lg text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500"></div>

        <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-600 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-800 rounded-full text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
            CHỜ QUẢN TRỊ VIÊN CẤP QUYỀN (PENDING PROVISIONING)
          </span>
          <h1 className="text-2xl font-serif font-bold text-on-surface">Tài Khoản Đang Chờ Cấp Quyền</h1>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-lg border border-outline-variant/40">
          Tài khoản cá nhân của bạn đã được khởi tạo thành công trên hệ thống <strong>Themis LexiGuard</strong>. Theo quy định bảo mật doanh nghiệp, tài khoản cần được <strong>Quản trị viên Hệ thống (Platform Admin)</strong> tạo hồ sơ Doanh nghiệp và phân bổ vai trò trước khi truy cập dữ liệu tuân thủ.
        </p>

        {user && (
          <div className="text-left text-xs bg-white border border-outline-variant rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-primary" /> Họ và tên:
              </span>
              <strong className="text-on-surface">{user.fullName}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-primary" /> Email tài khoản:
              </span>
              <span className="font-mono text-on-surface">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-primary" /> Doanh nghiệp:
              </span>
              <span className="font-semibold text-amber-700 italic">Chưa được gán Doanh nghiệp</span>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button fullWidth variant="outline" onClick={() => window.location.reload()} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Tải lại trang kiểm tra
          </Button>
          <Button fullWidth variant="outline" onClick={handleLogout} className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
}

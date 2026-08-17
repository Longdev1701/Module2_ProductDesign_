"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthBrandingPanel } from '../../../features/auth/AuthBrandingPanel';
import { api } from '../../../lib/api';
import type { MessageResponse } from "@/types/api";
import { getErrorMessage } from "@/types/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Mật khẩu mới cần tối thiểu 8 ký tự.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post<MessageResponse>('/auth/reset-password', {
        email,
        newPassword,
      });

      setSuccessMsg(res.data?.message || 'Đặt lại mật khẩu mới thành công! Đang chuyển hướng về trang đăng nhập...');
      setTimeout(() => {
        router.push('/login');
      }, 1800);
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, 'Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AuthBrandingPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 overflow-y-auto">
        <div className="w-full max-w-md bg-white border border-outline-variant/70 rounded-3xl p-7 sm:p-9 shadow-xl space-y-6 relative overflow-hidden">
          {/* Top Gold Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-primary to-emerald-500" />

          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
          </button>

          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-primary/10 text-primary text-[10px] font-mono font-bold uppercase">
                BẢO MẬT TÀI KHOẢN
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-on-surface font-bold tracking-tight">
              Đặt Lại Mật Khẩu
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Nhập email và tạo mật khẩu mới an toàn cho tài khoản doanh nghiệp của bạn.
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2 font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 font-medium animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleResetSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Email Doanh Nghiệp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="nhanvien.kcs@themisexport.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-outline-variant/60 rounded-xl text-xs sm:text-sm text-on-surface focus:outline-hidden focus:border-primary focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Mật Khẩu Mới
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-outline-variant/60 rounded-xl text-xs sm:text-sm text-on-surface focus:outline-hidden focus:border-primary focus:bg-white transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Xác Nhận Mật Khẩu Mới
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-outline-variant/60 rounded-xl text-xs sm:text-sm text-on-surface focus:outline-hidden focus:border-primary focus:bg-white transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !newPassword || !confirmPassword}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang cập nhật...</span>
                </div>
              ) : (
                <>
                  <span>Xác Nhận Đổi Mật Khẩu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

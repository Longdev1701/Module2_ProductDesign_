"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, EyeOff, Eye, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import type { LoginResponse } from "@/types/api";
import { getErrorMessage } from "@/types/api";

interface LoginViewProps {
  onSwitchView: () => void;
  onSwitchToForgot?: () => void;
}

export function LoginView({ onSwitchView, onSwitchToForgot }: LoginViewProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fixSuggestion, setFixSuggestion] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setFixSuggestion(null);

    try {
      const res = await api.post<LoginResponse>('/auth/login', { email, password });
      
      if (res.data?.session?.accessToken) {
        localStorage.setItem('access_token', res.data.session.accessToken);

        const userData = res.data.user;
        const platformRole = userData?.platformRole;
        const orgs = res.data.organizations || [];

        if (orgs.length > 0) {
          localStorage.setItem('active_org_id', orgs[0].id);
        }

        if (platformRole === 'SUPER_ADMIN' || platformRole === 'PLATFORM_ADMIN') {
          router.push('/admin');
        } else if (orgs.length > 0) {
          router.push('/dashboard');
        } else {
          router.push('/pending-access');
        }
      }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Đăng nhập thất bại.');
      setErrorMsg(msg);
      if (msg.toLowerCase().includes('invalid login credentials') || msg.toLowerCase().includes('sai')) {
        setFixSuggestion('Email hoặc mật khẩu không chính xác. Bạn có thể bấm nút "Quên mật khẩu?" để khôi phục.');
      } else if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('nhiều lần')) {
        setFixSuggestion('Bạn đã nhập sai quá nhiều lần. Vui lòng chờ 1 phút trước khi thử lại.');
      } else {
        setFixSuggestion('Vui lòng kiểm tra lại Email và Mật khẩu của bạn.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-outline-variant/70 rounded-3xl p-7 sm:p-9 shadow-xl space-y-6 relative overflow-hidden">
      {/* Top Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-primary to-emerald-500" />

      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-mono font-bold uppercase">
            DOANH NGHIỆP XUẤT KHẨU
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-on-surface font-bold tracking-tight">
          Đăng Nhập
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Không gian làm việc tuân thủ pháp lý &amp; điều hành hồ sơ xuất khẩu
        </p>
      </div>

      {/* Error / Suggestion Alert */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-rose-900">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          {fixSuggestion && (
            <div className="pt-1.5 border-t border-rose-200/70 flex items-start gap-1.5 text-rose-900 font-medium text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong className="text-amber-800">Gợi ý:</strong> {fixSuggestion}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form className="space-y-4" onSubmit={handleLoginSubmit}>
        {/* Email */}
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

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Mật Khẩu
            </label>
            {onSwitchToForgot && (
              <button
                type="button"
                onClick={onSwitchToForgot}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-11 py-2.5 bg-slate-50/50 border border-outline-variant/60 rounded-xl text-xs sm:text-sm text-on-surface focus:outline-hidden focus:border-primary focus:bg-white transition-colors font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang xác thực...</span>
            </div>
          ) : (
            <>
              <span>Đăng Nhập Vào Hệ Thống</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-2 border-t border-outline-variant/40">
        <p className="text-xs text-on-surface-variant">
          Doanh nghiệp của bạn chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={onSwitchView}
            className="font-bold text-primary hover:underline cursor-pointer ml-1"
          >
            Đăng Ký Ngay
          </button>
        </p>
      </div>
    </div>
  );
}

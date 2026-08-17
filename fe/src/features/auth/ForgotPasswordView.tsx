"use client";

import React, { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';
import { api } from '../../lib/api';
import type { MessageResponse } from "@/types/api";
import { getErrorMessage } from "@/types/api";

interface ForgotPasswordViewProps {
  onSwitchView: (view: 'login' | 'register') => void;
}

export function ForgotPasswordView({ onSwitchView }: ForgotPasswordViewProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.post<MessageResponse>('/auth/forgot-password', { email });
      setSuccessMsg(res.data?.message || 'Yêu cầu khôi phục mật khẩu đã được xử lý. Vui lòng kiểm tra hộp thư email của bạn.');
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, 'Gửi yêu cầu thất bại. Vui lòng kiểm tra lại địa chỉ email.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-outline-variant/70 rounded-3xl p-7 sm:p-9 shadow-xl space-y-6 relative overflow-hidden">
      {/* Top Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-primary to-emerald-500" />

      {/* Back Button */}
      <button
        type="button"
        onClick={() => onSwitchView('login')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
      </button>

      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <KeyRound className="w-3 h-3" /> KHÔI PHỤC MẬT KHẨU
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-on-surface font-bold tracking-tight">
          Quên Mật Khẩu?
        </h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Nhập địa chỉ email đăng ký tài khoản của bạn để nhận liên kết khôi phục mật khẩu an toàn.
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

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Email Đăng Ký Tài Khoản
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

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang gửi yêu cầu...</span>
            </div>
          ) : (
            <>
              <span>Gửi Yêu Cầu Khôi Phục</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-2 border-t border-outline-variant/40">
        <p className="text-xs text-on-surface-variant">
          Đã nhớ lại mật khẩu?{' '}
          <button
            type="button"
            onClick={() => onSwitchView('login')}
            className="font-bold text-primary hover:underline cursor-pointer ml-1"
          >
            Đăng Nhập Ngay
          </button>
        </p>
      </div>
    </div>
  );
}

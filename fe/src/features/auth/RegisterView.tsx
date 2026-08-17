"use client";

import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, EyeOff, Eye, AlertCircle, CheckCircle2, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import type { ApiError, RegisterResponse } from "@/types/api";
import { getErrorMessage } from "@/types/api";

interface RegisterViewProps {
  onSwitchView: () => void;
}

export function RegisterView({ onSwitchView }: RegisterViewProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [fixSuggestion, setFixSuggestion] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password validation helpers
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordStrong = hasMinLength && hasUppercase && hasNumber;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setErrorDetails([]);
    setFixSuggestion(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      setFixSuggestion('Vui lòng nhập ô "Xác nhận mật khẩu" giống hệt ô "Mật khẩu".');
      setLoading(false);
      return;
    }

    if (!isPasswordStrong) {
      setErrorMsg('Mật khẩu chưa đáp ứng tiêu chuẩn an toàn.');
      setFixSuggestion('Mật khẩu cần tối thiểu 8 ký tự, có ít nhất 1 chữ hoa [A-Z] và 1 chữ số [0-9] (Ví dụ: Themis2026!).');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post<RegisterResponse>('/auth/register', {
        fullName,
        jobTitle: jobTitle || undefined,
        email,
        password,
      });

      if (res.data?.user) {
        setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng về trang đăng nhập...');
        setTimeout(() => {
          onSwitchView();
        }, 1500);
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      if (apiError.details && typeof apiError.details === 'object') {
        const detailsArray: string[] = [];
        let hasPwdError = false;

        Object.entries(apiError.details).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            if (field === 'password') hasPwdError = true;
            const fieldName =
              field === 'password' ? 'Mật khẩu' : field === 'email' ? 'Email' : field === 'fullName' ? 'Họ và tên' : field;
            detailsArray.push(`${fieldName}: ${messages.map(String).join(', ')}`);
          }
        });

        if (detailsArray.length > 0) {
          setErrorDetails(detailsArray);
          setErrorMsg('Dữ liệu nhập vào chưa đúng định dạng:');
          if (hasPwdError) {
            setFixSuggestion('Mật khẩu cần tối thiểu 8 ký tự, có ít nhất 1 chữ hoa [A-Z] và 1 chữ số [0-9].');
          } else {
            setFixSuggestion('Vui lòng kiểm tra lại thông tin bị lỗi ở trên và nhập lại.');
          }
        } else {
          setErrorMsg(getErrorMessage(err, 'Đăng ký tài khoản thất bại.'));
        }
      } else {
        const errMsg = getErrorMessage(err, 'Đăng ký tài khoản thất bại.');
        setErrorMsg(errMsg);
        if (errMsg.toLowerCase().includes('already registered') || errMsg.toLowerCase().includes('đã tồn tại')) {
          setFixSuggestion('Email này đã có tài khoản. Bạn vui lòng bấm nút "Đăng nhập" bên dưới hoặc dùng tính năng "Quên mật khẩu?".');
        } else {
          setFixSuggestion('Vui lòng thử lại với email và mật khẩu hợp lệ (Ví dụ mật khẩu: Themis2026!).');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-outline-variant/70 rounded-3xl p-7 sm:p-9 shadow-xl space-y-5 relative overflow-hidden">
      {/* Top Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-primary to-emerald-500" />

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold uppercase">
            KHỞI TẠO TÀI KHOẢN MỚI
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-on-surface font-bold tracking-tight">
          Đăng Ký Thành Viên
        </h2>
        <p className="text-xs text-on-surface-variant">
          Tham gia hệ thống thẩm định tuân thủ xuất khẩu Nông sản Themis LexiGuard
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-rose-900">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>

          {errorDetails.length > 0 && (
            <ul className="list-disc pl-6 space-y-0.5 text-rose-700 text-[11px]">
              {errorDetails.map((detail, idx) => (
                <li key={idx} className="font-semibold">
                  {detail}
                </li>
              ))}
            </ul>
          )}

          {fixSuggestion && (
            <div className="pt-1.5 border-t border-rose-200/70 flex items-start gap-1.5 text-rose-900 font-medium text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong className="text-amber-800">Khắc phục:</strong> {fixSuggestion}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Success Alert */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form className="space-y-3.5" onSubmit={handleRegisterSubmit}>
        {/* Full Name & Job Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Họ và Tên *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-outline-variant/60 rounded-xl text-xs text-on-surface focus:outline-hidden focus:border-primary focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Chức Danh / Vị Trí
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Trưởng phòng XNK / KCS"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-outline-variant/60 rounded-xl text-xs text-on-surface focus:outline-hidden focus:border-primary focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Email Doanh Nghiệp *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              placeholder="nhanvien.kcs@themisexport.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-outline-variant/60 rounded-xl text-xs text-on-surface focus:outline-hidden focus:border-primary focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Mật Khẩu *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-slate-50/50 border border-outline-variant/60 rounded-xl text-xs text-on-surface focus:outline-hidden focus:border-primary focus:bg-white transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Xác Nhận Mật Khẩu *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-outline-variant/60 rounded-xl text-xs text-on-surface focus:outline-hidden focus:border-primary focus:bg-white transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Password Strength Checklist */}
        {password.length > 0 && (
          <div className="p-2.5 bg-slate-50 rounded-xl border border-outline-variant/40 space-y-1 text-[11px]">
            <div className="font-semibold text-slate-700">Yêu cầu bảo mật mật khẩu:</div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                {hasMinLength ? '✓' : '○'} Tối thiểu 8 ký tự
              </span>
              <span className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                {hasUppercase ? '✓' : '○'} Có chữ hoa [A-Z]
              </span>
              <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                {hasNumber ? '✓' : '○'} Có chữ số [0-9]
              </span>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !fullName || !email || !password || !confirmPassword}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang tạo tài khoản...</span>
            </div>
          ) : (
            <>
              <span>Hoàn Tất Đăng Ký</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-2 border-t border-outline-variant/40">
        <p className="text-xs text-on-surface-variant">
          Đã có tài khoản trên hệ thống?{' '}
          <button
            type="button"
            onClick={onSwitchView}
            className="font-bold text-primary hover:underline cursor-pointer ml-1"
          >
            Đăng Nhập Ngay
          </button>
        </p>
      </div>
    </div>
  );
}

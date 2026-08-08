"use client";

import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ShieldCheck, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { api } from '../../lib/api';

interface RegisterViewProps {
  onSwitchView: () => void;
}

export function RegisterView({ onSwitchView }: RegisterViewProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [fixSuggestion, setFixSuggestion] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

    try {
      const res = await api.post<any>('/auth/register', {
        fullName,
        email,
        password,
      });

      if (res.data?.user) {
        setSuccessMsg('Đăng ký thành công! Đã tự động kích hoạt tài khoản.');
        setTimeout(() => {
          onSwitchView();
        }, 1500);
      }
    } catch (err: any) {
      if (err.details && typeof err.details === 'object') {
        const detailsArray: string[] = [];
        let hasPasswordError = false;

        Object.entries(err.details).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            if (field === 'password') hasPasswordError = true;
            const fieldName = field === 'password' ? 'Mật khẩu' : field === 'email' ? 'Email' : field === 'fullName' ? 'Họ và tên' : field;
            detailsArray.push(`${fieldName}: ${messages.join(', ')}`);
          }
        });

        if (detailsArray.length > 0) {
          setErrorDetails(detailsArray);
          setErrorMsg('Dữ liệu nhập vào chưa đúng định dạng:');
          if (hasPasswordError) {
            setFixSuggestion('Mật khẩu cần tối thiểu 8 ký tự, có ít nhất 1 chữ hoa [A-Z] và 1 chữ số [0-9] (Ví dụ: Themis2026!).');
          } else {
            setFixSuggestion('Vui lòng kiểm tra lại thông tin bị lỗi ở trên và nhập lại.');
          }
        } else {
          setErrorMsg(err.message || 'Đăng ký tài khoản thất bại.');
        }
      } else {
        const errMsg = err.message || 'Đăng ký tài khoản thất bại.';
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
    <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
      
      <div className="p-6 sm:p-8">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-serif text-primary font-bold mb-1">Tạo tài khoản mới</h2>
          <p className="text-on-surface-variant text-xs">Đăng ký hệ thống quản lý tuân thủ pháp lý</p>
        </div>

        {/* Detailed Error Box */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg space-y-1 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-red-900">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>

            {errorDetails.length > 0 && (
              <ul className="list-disc pl-6 space-y-0.5 text-red-700">
                {errorDetails.map((detail, idx) => (
                  <li key={idx} className="font-semibold">{detail}</li>
                ))}
              </ul>
            )}

            {fixSuggestion && (
              <div className="mt-1.5 pt-1.5 border-t border-red-200/80 flex items-start gap-1 text-red-900 font-medium">
                <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 mt-0.5" />
                <span><strong className="text-amber-800">Khắc phục:</strong> {fixSuggestion}</span>
              </div>
            )}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-semibold shadow-sm">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegisterSubmit}>
          {/* Personal Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input 
              label="Họ và tên" 
              placeholder="Nhập họ và tên" 
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />
            <Input 
              label="Số điện thoại" 
              placeholder="Số điện thoại" 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4" />}
            />
          </div>

          {/* Email */}
          <Input 
            label="Email công việc" 
            placeholder="ten@congty.com" 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />

          {/* Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Input 
                label="Mật khẩu" 
                placeholder="Tạo mật khẩu" 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
              />
            </div>
            <Input 
              label="Xác nhận mật khẩu" 
              placeholder="Nhập lại mật khẩu" 
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<ShieldCheck className="w-4 h-4" />}
            />
          </div>

          <p className="text-[11px] text-on-surface-variant/80 -mt-1 leading-tight">
            💡 <em>Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa [A-Z] & chữ số [0-9] (Ví dụ: <span className="font-mono font-bold text-primary">Themis2026!</span>)</em>
          </p>

          <div className="pt-2">
            <Button fullWidth type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
            </Button>
          </div>

          <div className="text-center text-xs text-on-surface-variant pt-1">
            Đã có tài khoản?{' '}
            <button 
              type="button" 
              onClick={onSwitchView}
              className="font-semibold text-primary hover:underline focus:outline-none cursor-pointer"
            >
              Đăng nhập ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

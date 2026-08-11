"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, EyeOff, Eye, AlertCircle, HelpCircle } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
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
        if (res.data.session.refreshToken) {
          localStorage.setItem('refresh_token', res.data.session.refreshToken);
        }

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
        setFixSuggestion('Email hoặc mật khẩu không chính xác. Nếu bạn quên mật khẩu, bấm nút "Quên mật khẩu?" phía trên.');
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
    <div className="bg-white border border-outline-variant rounded-lg p-8 shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-primary font-bold mb-2">Đăng nhập</h2>
        <p className="text-on-surface-variant text-sm">Truy cập hệ thống quản lý tuân thủ</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg space-y-2 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-red-900 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
          {fixSuggestion && (
            <div className="mt-2 pt-2 border-t border-red-200/80 flex items-start gap-1.5 text-red-900 font-medium">
              <HelpCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
              <span><strong className="text-amber-800">Cách khắc phục:</strong> {fixSuggestion}</span>
            </div>
          )}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleLoginSubmit}>
        <Input 
          label="EMAIL" 
          placeholder="Nhập địa chỉ email" 
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
        />
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono font-medium text-on-surface-variant uppercase tracking-wider">
              MẬT KHẨU
            </label>
            <button 
              type="button" 
              onClick={onSwitchToForgot}
              className="text-xs font-mono text-on-surface-variant hover:text-primary transition-colors cursor-pointer focus:outline-none"
            >
              Quên mật khẩu?
            </button>
          </div>
          <Input 
            placeholder="Nhập mật khẩu" 
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none text-outline hover:text-primary cursor-pointer"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <Button fullWidth type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>

        <div className="text-center text-sm text-on-surface-variant pt-2">
          Nếu chưa có tài khoản?{' '}
          <button 
            type="button" 
            onClick={onSwitchView}
            className="font-medium text-primary hover:underline focus:outline-none cursor-pointer"
          >
            Đăng Ký
          </button>
        </div>
      </form>
    </div>
  );
}

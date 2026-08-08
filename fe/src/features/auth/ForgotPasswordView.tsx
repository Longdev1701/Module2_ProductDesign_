"use client";

import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { api } from '../../lib/api';

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
      const res = await api.post<any>('/auth/forgot-password', { email });
      setSuccessMsg(res.data?.message || 'Yêu cầu khôi phục mật khẩu đã được gửi đến email của bạn.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gửi yêu cầu thất bại. Vui lòng kiểm tra lại email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-outline-variant rounded-lg p-8 shadow-sm">
      <button 
        type="button" 
        onClick={() => onSwitchView('login')}
        className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
      </button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-primary font-bold mb-2">Quên mật khẩu?</h2>
        <p className="text-on-surface-variant text-xs leading-relaxed">
          Nhập địa chỉ email đăng ký tài khoản của bạn để nhận hướng dẫn khôi phục mật khẩu.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-md">
          {successMsg}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input 
          label="EMAIL ĐÃ ĐĂNG KÝ" 
          placeholder="Nhập địa chỉ email của bạn" 
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
        />

        <Button fullWidth type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi yêu cầu khôi phục'}
        </Button>

        <div className="text-center text-xs text-on-surface-variant pt-2">
          Đã nhớ lại mật khẩu?{' '}
          <button 
            type="button" 
            onClick={() => onSwitchView('login')}
            className="font-medium text-primary hover:underline focus:outline-none cursor-pointer"
          >
            Đăng nhập ngay
          </button>
        </div>
      </form>
    </div>
  );
}

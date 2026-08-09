"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
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

    try {
      const res = await api.post<MessageResponse>('/auth/reset-password', {
        email,
        newPassword,
      });

      setSuccessMsg(res.data?.message || 'Đặt lại mật khẩu mới thành công!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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
        <div className="w-full max-w-md bg-white border border-outline-variant rounded-lg p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif text-primary font-bold mb-2">Đặt lại mật khẩu mới</h2>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Nhập email và tạo mật khẩu mới cho tài khoản của bạn.
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

          <form className="space-y-6" onSubmit={handleResetSubmit}>
            <Input 
              label="EMAIL XÁC NHẬN" 
              placeholder="Nhập lại email của bạn" 
              type="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />

            <Input 
              label="MẬT KHẨU MỚI" 
              placeholder="Tạo mật khẩu mới (tối thiểu 8 ký tự, có chữ hoa & số)" 
              type="password"
              required
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
            />

            <Input 
              label="XÁC NHẬN MẬT KHẨU MỚI" 
              placeholder="Nhập lại mật khẩu mới" 
              type="password"
              required
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              icon={<ShieldCheck className="w-4 h-4" />}
            />

            <Button fullWidth type="submit" disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Xác nhận đổi mật khẩu'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

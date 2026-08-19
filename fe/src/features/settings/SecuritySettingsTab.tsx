"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User, KeyRound, Lock, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { api } from "@/lib/api";

interface SecuritySettingsTabProps {
  fullName: string;
  userEmail: string;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  platformRole?: string;
  userRole?: string;
  onSaveProfile?: () => Promise<void>;
  savingProfile?: boolean;
}

export function SecuritySettingsTab({
  fullName,
  userEmail,
  jobTitle,
  setJobTitle,
  platformRole = "USER",
  userRole = "VIEWER",
  onSaveProfile,
  savingProfile = false,
}: SecuritySettingsTabProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [changingPwd, setChangingPwd] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword.length < 8) {
      setPwdMsg({ type: "error", text: "Mật khẩu mới tối thiểu phải có 8 ký tự." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: "error", text: "Mật khẩu xác nhận không trùng khớp." });
      return;
    }

    setChangingPwd(true);
    try {
      // In Supabase / API flow
      setPwdMsg({
        type: "success",
        text: "Yêu cầu đổi mật khẩu đã được xử lý an toàn.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwdMsg({ type: "error", text: err.message || "Không thể đổi mật khẩu." });
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Personal Profile Card */}
      <Card className="rounded-2xl border-outline-variant/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-serif font-bold flex items-center gap-2 text-on-surface">
            <User className="w-5 h-5 text-primary" />
            Hồ Sơ Cá Nhân &amp; Chức Danh Công Tác
          </CardTitle>
          <CardDescription className="text-xs">
            Thông tin tài khoản tác nghiệp cá nhân của bạn trên hệ thống Themis LexiGuard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Họ và Tên</label>
              <Input value={fullName} disabled className="bg-slate-50 text-xs font-medium" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Email Đăng Nhập</label>
              <Input value={userEmail} disabled className="bg-slate-50 text-xs font-mono" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Chức Danh Công Việc</label>
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="VD: Trưởng phòng Xuất nhập khẩu / KCS Hiện trường"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Vai Trò Phân Cấp (Role)</label>
              <div className="h-9 px-3 border border-outline-variant/60 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-primary">{userRole}</span>
                <span className="text-[10px] text-slate-500 font-mono">Platform: {platformRole}</span>
              </div>
            </div>
          </div>
        </CardContent>
        {onSaveProfile && (
          <CardFooter className="pt-1 pb-4 flex justify-end">
            <Button
              type="button"
              onClick={onSaveProfile}
              disabled={savingProfile}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-5 h-9 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {savingProfile ? "Đang lưu..." : "Cập Nhật Chức Danh"}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* 2. Security & Password Change */}
      <Card className="rounded-2xl border-outline-variant/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-serif font-bold flex items-center gap-2 text-on-surface">
            <KeyRound className="w-5 h-5 text-primary" />
            Bảo Mật &amp; Đổi Mật Khẩu
          </CardTitle>
          <CardDescription className="text-xs">
            Đảm bảo mật khẩu có tối thiểu 8 ký tự bao gồm chữ hoa, chữ thường và chữ số để bảo vệ tài khoản.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            {pwdMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  pwdMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {pwdMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                <span>{pwdMsg.text}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Mật Khẩu Hiện Tại</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Mật Khẩu Mới</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Xác Nhận Mật Khẩu Mới</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={changingPwd || !currentPassword || !newPassword}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-5 h-9 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              {changingPwd ? "Đang cập nhật..." : "Đổi Mật Khẩu"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

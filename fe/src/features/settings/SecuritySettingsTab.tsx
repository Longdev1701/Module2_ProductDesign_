"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

interface SecuritySettingsTabProps {
  platformRole?: string;
  userRole?: string;
}

export function SecuritySettingsTab({ platformRole = "USER", userRole = "VIEWER" }: SecuritySettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Kiến trúc Phân quyền 2 Tầng (Two-Tier Authorization)
        </CardTitle>
        <CardDescription>Bảo mật Zero-Trust giữa Tầng Nền tảng (Platform) và Tầng Doanh nghiệp (Tenant).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/60 space-y-2">
            <h4 className="font-mono font-bold text-xs uppercase text-primary">TẦNG HỆ THỐNG (PLATFORM LEVEL)</h4>
            <p className="text-xs text-on-surface-variant">Quyền quản trị hạ tầng nền tảng Themis LexiGuard.</p>
            <div className="pt-2">
              <span className="text-xs font-semibold">Role hiện tại: </span>
              <Badge className="font-mono font-bold">{platformRole}</Badge>
            </div>
          </div>
          <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/60 space-y-2">
            <h4 className="font-mono font-bold text-xs uppercase text-primary">TẦNG DOANH NGHIỆP (TENANT LEVEL)</h4>
            <p className="text-xs text-on-surface-variant">Quyền thao tác dữ liệu nghiệp vụ của Doanh nghiệp hiện tại.</p>
            <div className="pt-2">
              <span className="text-xs font-semibold">Role hiện tại: </span>
              <Badge className="font-mono font-bold" variant="secondary">{userRole}</Badge>
            </div>
          </div>
        </div>

        <div className="border border-outline-variant rounded-lg p-4 space-y-3 bg-white">
          <h4 className="font-bold text-sm text-on-surface">Ma trận Phân quyền Doanh nghiệp (Tenant RBAC Matrix)</h4>
          <ul className="text-xs space-y-2 text-on-surface-variant">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <strong>OWNER:</strong> Toàn quyền quản trị Doanh nghiệp, mời/đổi quyền nhân sự, duyệt báo cáo chính thức.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <strong>MANAGER:</strong> Quản lý lô hàng, chứng từ, chạy kiểm tra AI và duyệt báo cáo chính thức.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <strong>COMPLIANCE:</strong> Upload chứng từ, chạy kiểm tra AI, xử lý lỗi finding và lập dự thảo báo cáo.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              <strong>VIEWER:</strong> Xem thông tin lô hàng, kết quả kiểm tra và báo cáo (Chỉ đọc).
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

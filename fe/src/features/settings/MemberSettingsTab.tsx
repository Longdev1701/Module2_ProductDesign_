"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus } from "lucide-react";

interface MemberSettingsTabProps {
  members: any[];
  inviteEmail: string;
  setInviteEmail: (val: string) => void;
  inviteRole: string;
  setInviteRole: (val: string) => void;
  inviting: boolean;
  onInvite: (e: React.FormEvent) => void;
  isOwnerOrManager: boolean;
}

export function MemberSettingsTab({
  members,
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  inviting,
  onInvite,
  isOwnerOrManager,
}: MemberSettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Member Invite Form */}
      {isOwnerOrManager && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Mời Cán bộ / Nhân sự mới vào Doanh nghiệp
            </CardTitle>
            <CardDescription>Gửi lời mời và gán quyền phân cấp quản lý dữ liệu xuất khẩu.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onInvite} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Email Nhân sự mới</label>
                <Input
                  placeholder="nhansu@congty.com"
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48 space-y-2">
                <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Phân quyền</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full h-10 px-3 border border-outline-variant rounded bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="MANAGER">MANAGER (Quản lý XNK)</option>
                  <option value="COMPLIANCE">COMPLIANCE (Chuyên viên Tuân thủ)</option>
                  <option value="VIEWER">VIEWER (Chỉ xem)</option>
                </select>
              </div>
              <Button type="submit" disabled={inviting} className="w-full sm:w-auto gap-2">
                <UserPlus className="w-4 h-4" />
                {inviting ? 'Đang gửi...' : 'Gửi lời mời'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Members List Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Danh sách Nhân sự Doanh nghiệp ({members?.length || 0})
          </CardTitle>
          <CardDescription>Tất cả cán bộ đang có quyền truy cập thông tin lô hàng và báo cáo tuân thủ.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-outline-variant rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-xs font-mono uppercase text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3 font-semibold">HỌ VÀ TÊN / EMAIL</th>
                  <th className="px-4 py-3 font-semibold">CHỨC DANH</th>
                  <th className="px-4 py-3 font-semibold">VAITRÒ (ROLE)</th>
                  <th className="px-4 py-3 font-semibold">TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {members?.map((m: any) => (
                  <tr key={m.id} className="hover:bg-surface-container-lowest">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-on-surface">{m.profile?.fullName || "Chưa cập nhật"}</p>
                      <p className="text-xs text-on-surface-variant">{m.profile?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">
                      {m.profile?.jobTitle || "Nhân viên"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={m.role === 'OWNER' ? 'default' : 'secondary'} className="font-mono text-[11px] font-bold">
                        {m.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

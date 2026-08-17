"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Edit2,
  AlertCircle,
  X,
  Check,
  Crown,
  ShieldCheck,
  FolderLock,
  Eye,
} from "lucide-react";
import type { OrganizationMember, OrganizationRole } from "@/types/api";

interface MemberSettingsTabProps {
  members: OrganizationMember[];
  inviteEmail: string;
  setInviteEmail: (val: string) => void;
  inviteRole: string;
  setInviteRole: (val: string) => void;
  inviting: boolean;
  onInvite: (e: React.FormEvent) => void;
  isOwnerOrManager: boolean;
  onUpdateRole?: (memberId: string, newRole: OrganizationRole) => Promise<void>;
  onRemoveMember?: (memberId: string) => Promise<void>;
}

const ROLE_DEFINITIONS: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; desc: string }
> = {
  OWNER: {
    label: "👑 Giám Đốc / Chủ Xưởng (OWNER)",
    icon: <Crown className="w-3.5 h-3.5 text-amber-600" />,
    color: "bg-amber-100 text-amber-900 border-amber-300",
    desc: "Toàn quyền tối cao, Ký duyệt con dấu Seal container, Quản trị thành viên & Tài chính.",
  },
  MANAGER: {
    label: "📋 Trưởng Phòng XNK (MANAGER)",
    icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />,
    color: "bg-blue-100 text-blue-900 border-blue-300",
    desc: "Điều hành chứng từ, Quản lý lô hàng & sản phẩm, Chạy quét AI và Duyệt báo cáo.",
  },
  COMPLIANCE: {
    label: "📂 KCS / Nhân Viên Chứng Từ (COMPLIANCE)",
    icon: <FolderLock className="w-3.5 h-3.5 text-emerald-600" />,
    color: "bg-emerald-100 text-emerald-900 border-emerald-300",
    desc: "Kéo thả nạp 4 Khóa chứng thư (Phyto, Lab, C/O, Packing list), Chạy thẩm định AI (Không được ký seal).",
  },
  VIEWER: {
    label: "🛡️ Thanh Tra / Khách Mua (VIEWER)",
    icon: <Eye className="w-3.5 h-3.5 text-slate-600" />,
    color: "bg-slate-100 text-slate-800 border-slate-300",
    desc: "Chỉ xem dữ liệu, Xem báo cáo song ngữ và Tra cứu tính toàn vẹn mã băm SHA-256 (Read-only).",
  },
};

export function MemberSettingsTab({
  members,
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  inviting,
  onInvite,
  isOwnerOrManager,
  onUpdateRole,
  onRemoveMember,
}: MemberSettingsTabProps) {
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<OrganizationRole>("COMPLIANCE");
  const [updating, setUpdating] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<OrganizationMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleStartEdit = (member: OrganizationMember) => {
    setEditingMemberId(member.id);
    setSelectedRole(member.role);
  };

  const handleConfirmRoleChange = async (memberId: string) => {
    if (!onUpdateRole) return;
    setUpdating(true);
    try {
      await onUpdateRole(memberId, selectedRole);
      setEditingMemberId(null);
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmRemove = async () => {
    if (!deleteTarget || !onRemoveMember) return;
    setDeleting(true);
    try {
      await onRemoveMember(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Role Definitions Explainer Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(ROLE_DEFINITIONS).map(([key, item]) => (
          <div
            key={key}
            className="p-3.5 bg-white rounded-xl border border-outline-variant/60 shadow-2xs space-y-1.5"
          >
            <div className="flex items-center gap-1.5">
              {item.icon}
              <span className="font-bold text-xs text-on-surface">{key}</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* 2. Member Invite Form */}
      {isOwnerOrManager && (
        <Card className="rounded-2xl border-outline-variant/60 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-serif font-bold flex items-center gap-2 text-on-surface">
              <UserPlus className="w-5 h-5 text-primary" />
              Mời Cán Bộ / Nhân Sự Mới Vào Doanh Nghiệp
            </CardTitle>
            <CardDescription className="text-xs">
              Gửi lời mời tham gia qua Email và gán phân quyền trách nhiệm pháp lý rõ ràng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onInvite} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 space-y-1.5 w-full">
                <label className="text-xs font-semibold text-on-surface-variant">Email Nhân Sự Mới</label>
                <Input
                  placeholder="nhanvien.kcs@themisexport.vn"
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="w-full sm:w-64 space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Phân Quyền Trách Nhiệm</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full h-9 px-3 border border-outline-variant/60 rounded-xl bg-white text-xs text-on-surface focus:outline-hidden focus:border-primary cursor-pointer"
                >
                  <option value="MANAGER">MANAGER (Trưởng phòng XNK)</option>
                  <option value="COMPLIANCE">COMPLIANCE (KCS / Chứng từ)</option>
                  <option value="VIEWER">VIEWER (Thanh tra / Chỉ xem)</option>
                </select>
              </div>
              <Button
                type="submit"
                disabled={inviting || !inviteEmail.trim()}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-xs font-bold px-5 h-9 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                {inviting ? "Đang gửi..." : "Gửi Lời Mời"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 3. Members List Table */}
      <Card className="rounded-2xl border-outline-variant/60 shadow-xs overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-serif font-bold flex items-center gap-2 text-on-surface">
                <Users className="w-5 h-5 text-primary" />
                Danh Sách Đội Ngũ Tác Nghiệp ({members.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Toàn bộ tài khoản có quyền truy cập và thao tác trên cơ sở dữ liệu của tổ chức.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-outline-variant/60 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Thành Viên</th>
                  <th className="py-3 px-4">Chức Danh</th>
                  <th className="py-3 px-4">Vai Trò (RBAC)</th>
                  <th className="py-3 px-4">Ngày Tham Gia</th>
                  {isOwnerOrManager && <th className="py-3 px-4 text-right">Thao Tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {members.map((m) => {
                  const isOwner = m.role === "OWNER";
                  const isEditing = editingMemberId === m.id;
                  const roleMeta = ROLE_DEFINITIONS[m.role] || ROLE_DEFINITIONS.VIEWER;

                  const userObj = m.profile || m.user;
                  const fullNameStr = userObj?.fullName;
                  const emailStr = userObj?.email || 'Thành viên';
                  const jobTitleStr = userObj?.jobTitle || 'Cán bộ xuất nhập khẩu';

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {fullNameStr
                              ? fullNameStr.charAt(0).toUpperCase()
                              : emailStr.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-on-surface">
                              {fullNameStr || emailStr}
                            </div>
                            <div className="text-[10px] text-on-surface-variant font-mono">
                              {emailStr}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant">
                        {jobTitleStr}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value as OrganizationRole)}
                              className="h-8 px-2 border border-primary rounded-lg text-xs font-semibold focus:outline-hidden"
                            >
                              <option value="MANAGER">MANAGER</option>
                              <option value="COMPLIANCE">COMPLIANCE</option>
                              <option value="VIEWER">VIEWER</option>
                            </select>
                            <button
                              onClick={() => handleConfirmRoleChange(m.id)}
                              disabled={updating}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                              title="Lưu vai trò"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingMemberId(null)}
                              className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer"
                              title="Hủy"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleMeta.color}`}
                          >
                            {roleMeta.icon}
                            {m.role}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString("vi-VN") : "Hôm nay"}
                      </td>

                      {isOwnerOrManager && (
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          {!isOwner && (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleStartEdit(m)}
                                className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                                title="Đổi phân quyền"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(m)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Thu hồi quyền thành viên"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-outline-variant space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface">Thu Hồi Quyền Thành Viên</h4>
                <p className="text-[11px] text-on-surface-variant">Xác nhận xóa tài khoản khỏi tổ chức</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn thu hồi quyền của{" "}
              <b>
                {deleteTarget.profile?.fullName ||
                  deleteTarget.user?.fullName ||
                  deleteTarget.profile?.email ||
                  deleteTarget.user?.email ||
                  "thành viên này"}
              </b>
              ? Người này sẽ không còn quyền truy cập dữ liệu nữa.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmRemove}
                disabled={deleting}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Đang xóa..." : "Xác Nhận Thu Hồi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

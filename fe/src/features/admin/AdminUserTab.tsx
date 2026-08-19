"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Building2,
  Trash2,
  Edit2,
  Search,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "./AdminPagination";
import { AdminTableSkeleton } from "./AdminSkeletons";
import type { AdminUser, OrganizationRole, OrganizationSummary, PlatformRole } from "@/types/api";

interface AdminUserTabProps {
  users: AdminUser[];
  orgs: OrganizationSummary[];
  total: number;
  loading: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  roleFilter: string;
  onRoleFilterChange: (val: string) => void;
  onAssignMember: (userId: string, orgId: string, role: OrganizationRole) => Promise<void>;
  onChangePlatformRole: (userId: string, newRole: PlatformRole) => Promise<void>;
  onRemoveMember: (orgId: string, userId: string) => Promise<void>;
  selectedUser: AdminUser | null;
  setSelectedUser: (user: AdminUser | null) => void;
  targetOrgId: string;
  setTargetOrgId: (orgId: string) => void;
}

export function AdminUserTab({
  users,
  orgs,
  total,
  loading,
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  onAssignMember,
  onChangePlatformRole,
  onRemoveMember,
  selectedUser,
  setSelectedUser,
  targetOrgId,
  setTargetOrgId,
}: AdminUserTabProps) {
  const [assignedRole, setAssignedRole] = useState<OrganizationRole>("COMPLIANCE");
  const [assigning, setAssigning] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Platform Role Change Modal
  const [roleChangeUser, setRoleChangeUser] = useState<AdminUser | null>(null);
  const [newPlatformRole, setNewPlatformRole] = useState<PlatformRole>("USER");
  const [changingRole, setChangingRole] = useState(false);

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !targetOrgId) return;
    setAssigning(true);
    try {
      await onAssignMember(selectedUser.id, targetOrgId, assignedRole);
      setSelectedUser(null);
    } finally {
      setAssigning(false);
    }
  };

  const handleOpenRoleChange = (u: AdminUser) => {
    setRoleChangeUser(u);
    setNewPlatformRole(u.platformRole || "USER");
  };

  const handleRoleChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleChangeUser) return;
    setChangingRole(true);
    try {
      await onChangePlatformRole(roleChangeUser.id, newPlatformRole);
      setRoleChangeUser(null);
    } finally {
      setChangingRole(false);
    }
  };

  const handleRemoveMemberClick = async (orgId: string, userId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa thành viên khỏi doanh nghiệp này?")) {
      await onRemoveMember(orgId, userId);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search.trim() ||
      (u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase())) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "ALL" ||
      u.platformRole === roleFilter ||
      (roleFilter === "ORG_OWNER" && u.organizations?.some((o) => o.role === "OWNER")) ||
      (roleFilter === "ORG_MANAGER" && u.organizations?.some((o) => o.role === "MANAGER")) ||
      (roleFilter === "ORG_COMPLIANCE" && u.organizations?.some((o) => o.role === "COMPLIANCE"));

    return matchesSearch && matchesRole;
  });

  const totalFiltered = filteredUsers.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const displayedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-on-surface flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            Quản Trị Người Dùng & Phân Quyền Toàn Hệ Thống ({totalFiltered})
          </h2>
          <p className="text-xs text-on-surface-variant">
            Quản lý tài khoản, nâng/hạ quyền Platform Role (Super Admin / Admin / User) và gán nhân sự vào các doanh nghiệp.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96">
          <Input
            placeholder="Tìm theo Họ tên, Email, Chức danh..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full md:w-auto">
          <Filter className="w-4 h-4 text-on-surface-variant" />
          <span className="text-on-surface-variant font-semibold">Platform Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => {
              onRoleFilterChange(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 border border-outline-variant rounded-lg bg-surface text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN (Toàn quyền)</option>
            <option value="PLATFORM_ADMIN">PLATFORM_ADMIN</option>
            <option value="SUPPORT">SUPPORT (Hỗ trợ)</option>
            <option value="USER">USER (Doanh nghiệp)</option>
          </select>
        </div>
      </div>

      {/* Assign Modal / Banner */}
      {selectedUser && (
        <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-emerald-200 pb-2 flex justify-between items-start">
            <div>
              <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-700" />
                Gán Nhân Sự Vào Doanh Nghiệp: <span className="underline">{selectedUser.fullName}</span> ({selectedUser.email})
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Chọn doanh nghiệp và thiết lập vai trò nội bộ (Tenant Role) cho nhân sự.
              </p>
            </div>
            <button onClick={() => setSelectedUser(null)} className="text-emerald-900 font-bold p-1 cursor-pointer">
              ✕
            </button>
          </div>

          <form onSubmit={handleAssignSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1 w-full">
              <label className="text-xs font-mono font-semibold uppercase text-emerald-900">Chọn Doanh nghiệp</label>
              <select
                value={targetOrgId}
                onChange={(e) => setTargetOrgId(e.target.value)}
                className="w-full h-10 px-3 border border-emerald-300 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {orgs.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.primaryProduct || "Sầu riêng"})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-64 space-y-1">
              <label className="text-xs font-mono font-semibold uppercase text-emerald-900">Vai Trò Doanh Nghiệp</label>
              <select
                value={assignedRole}
                onChange={(e) => setAssignedRole(e.target.value as OrganizationRole)}
                className="w-full h-10 px-3 border border-emerald-300 rounded-xl bg-white text-xs font-mono font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="OWNER">OWNER (Chủ doanh nghiệp / CEO)</option>
                <option value="MANAGER">MANAGER (Trưởng phòng XNK)</option>
                <option value="COMPLIANCE">COMPLIANCE (Chuyên viên tuân thủ)</option>
                <option value="VIEWER">VIEWER (Nhân sự chỉ xem)</option>
              </select>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={() => setSelectedUser(null)}>
                Hủy
              </Button>
              <Button type="submit" disabled={assigning} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                {assigning ? "Đang gán..." : "Xác nhận Gán Quyền"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Users Data Table */}
      <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
        {loading ? (
          <AdminTableSkeleton rows={pageSize} cols={4} />
        ) : displayedUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-sm font-semibold text-on-surface">Không tìm thấy tài khoản phù hợp</p>
            <p className="text-xs text-on-surface-variant">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc vai trò</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-outline-variant rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low font-mono uppercase text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3 font-semibold">NGƯỜI DÙNG / EMAIL</th>
                    <th className="px-4 py-3 font-semibold">PLATFORM ROLE</th>
                    <th className="px-4 py-3 font-semibold">DOANH NGHIỆP ĐÃ GÁN</th>
                    <th className="px-4 py-3 font-semibold text-right">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60">
                  {displayedUsers.map((u) => {
                    const isSuperAdmin = u.platformRole === "SUPER_ADMIN";
                    const isPlatformAdmin = u.platformRole === "PLATFORM_ADMIN";

                    return (
                      <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-on-surface text-sm">{u.fullName || "Chưa đặt tên"}</div>
                          <div className="text-on-surface-variant font-mono text-[11px]">{u.email}</div>
                          {u.jobTitle && (
                            <div className="text-on-surface-variant text-[10px] italic mt-0.5">{u.jobTitle}</div>
                          )}
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full font-mono font-bold text-[10px] border ${
                              isSuperAdmin
                                ? "bg-purple-100 text-purple-800 border-purple-300"
                                : isPlatformAdmin
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : u.platformRole === "SUPPORT"
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : "bg-surface-container text-on-surface-variant border-outline-variant"
                            }`}
                          >
                            {u.platformRole || "USER"}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 max-w-[280px]">
                          {!u.organizations || u.organizations.length === 0 ? (
                            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                              Chưa thuộc doanh nghiệp nào
                            </span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {u.organizations.map((org) => (
                                <div
                                  key={org.orgId}
                                  className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-surface border border-outline-variant/50 text-[11px]"
                                >
                                  <span className="font-semibold text-on-surface truncate" title={org.orgName}>
                                    {org.orgName}
                                  </span>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-primary/10 text-primary">
                                      {org.role}
                                    </span>
                                    <button
                                      onClick={() => handleRemoveMemberClick(org.orgId, u.id)}
                                      title="Gỡ khỏi doanh nghiệp này"
                                      className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(u)}
                            className="text-[11px] h-7 px-2.5 gap-1 cursor-pointer"
                          >
                            <Building2 className="w-3 h-3 text-primary" /> Gán DN
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRoleChange(u)}
                            className="text-[11px] h-7 px-2.5 gap-1 cursor-pointer"
                          >
                            <Shield className="w-3 h-3 text-amber-600" /> Đổi Role
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <AdminPagination
              page={page}
              pageSize={pageSize}
              total={totalFiltered}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* Platform Role Change Modal */}
      {roleChangeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant space-y-4">
            <div className="border-b border-outline-variant pb-3 flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-amber-700 uppercase">Phân Quyền Toàn Hệ Thống</span>
                <h3 className="text-base font-bold text-on-surface">{roleChangeUser.fullName}</h3>
                <p className="text-xs text-on-surface-variant font-mono">{roleChangeUser.email}</p>
              </div>
              <button onClick={() => setRoleChangeUser(null)} className="text-on-surface-variant hover:text-on-surface text-lg cursor-pointer p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleRoleChangeSubmit} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-on-surface">Chọn Platform Role Mới:</label>
                <div className="space-y-2">
                  {[
                    { role: "USER", label: "USER (Người dùng doanh nghiệp)", desc: "Quyền bình thường theo doanh nghiệp được gán" },
                    { role: "SUPPORT", label: "SUPPORT (Hỗ trợ khách hàng)", desc: "Xem dữ liệu để hỗ trợ kỹ thuật" },
                    { role: "PLATFORM_ADMIN", label: "PLATFORM_ADMIN (Quản trị viên)", desc: "Quản lý doanh nghiệp, cào dữ liệu, tra cứu CIFER" },
                    { role: "SUPER_ADMIN", label: "SUPER_ADMIN (Toàn quyền tối cao)", desc: "Toàn quyền quản trị hệ thống và phân quyền" },
                  ].map((item) => (
                    <label
                      key={item.role}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        newPlatformRole === item.role
                          ? "border-primary bg-primary/5 text-primary shadow-xs"
                          : "border-outline-variant hover:bg-surface-container-low text-on-surface"
                      }`}
                    >
                      <input
                        type="radio"
                        name="platformRole"
                        value={item.role}
                        checked={newPlatformRole === item.role}
                        onChange={() => setNewPlatformRole(item.role as PlatformRole)}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="font-bold">{item.label}</div>
                        <div className="text-[11px] text-on-surface-variant">{item.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setRoleChangeUser(null)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={changingRole}>
                  {changingRole ? "Đang lưu..." : "Cập nhật Quyền"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

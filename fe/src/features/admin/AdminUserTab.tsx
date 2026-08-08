"use client";

import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "../../components/Button";

interface AdminUserTabProps {
  users: any[];
  orgs: any[];
  onAssignMember: (userId: string, orgId: string, role: string) => Promise<void>;
  selectedUser: any;
  setSelectedUser: (user: any) => void;
  targetOrgId: string;
  setTargetOrgId: (orgId: string) => void;
}

export function AdminUserTab({
  users,
  orgs,
  onAssignMember,
  selectedUser,
  setSelectedUser,
  targetOrgId,
  setTargetOrgId,
}: AdminUserTabProps) {
  const [assignedRole, setAssignedRole] = useState<string>("OWNER");
  const [assigning, setAssigning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="space-y-6">
      {selectedUser && (
        <div className="bg-amber-50/50 border border-amber-300 rounded-xl p-6 shadow-md space-y-4">
          <div className="border-b border-amber-200 pb-2">
            <h3 className="text-base font-bold text-amber-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-600" />
              Cấp Quyền Doanh Nghiệp Cho: <span className="underline">{selectedUser.fullName}</span> ({selectedUser.email})
            </h3>
            <p className="text-xs text-amber-800">Gán nhân sự vào Doanh nghiệp và chọn vai trò tương ứng.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1 w-full">
              <label className="text-xs font-mono font-semibold uppercase text-amber-900">Chọn Doanh nghiệp</label>
              <select
                value={targetOrgId}
                onChange={(e) => setTargetOrgId(e.target.value)}
                className="w-full h-10 px-3 border border-amber-300 rounded bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {orgs.map((o) => (
                  <option key={o.id} value={o.id}>{o.name} ({o.primaryProduct})</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-56 space-y-1">
              <label className="text-xs font-mono font-semibold uppercase text-amber-900">Chọn Vai Trò (Tenant Role)</label>
              <select
                value={assignedRole}
                onChange={(e) => setAssignedRole(e.target.value)}
                className="w-full h-10 px-3 border border-amber-300 rounded bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none font-mono font-bold text-primary"
              >
                <option value="OWNER">OWNER (Chủ doanh nghiệp / CEO)</option>
                <option value="MANAGER">MANAGER (Trưởng phòng XNK)</option>
                <option value="COMPLIANCE">COMPLIANCE (Chuyên viên tuân thủ)</option>
                <option value="VIEWER">VIEWER (Nhân sự chỉ xem)</option>
              </select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={() => setSelectedUser(null)}>Hủy</Button>
              <Button type="submit" disabled={assigning}>{assigning ? 'Đang cấp...' : 'Xác nhận Cấp Quyền'}</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-on-surface mb-4">Danh sách Tất cả Tài khoản ({users.length})</h3>
        <div className="border border-outline-variant rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low text-xs font-mono uppercase text-on-surface-variant">
              <tr>
                <th className="px-4 py-3 font-semibold">HỌ VÀ TÊN / EMAIL</th>
                <th className="px-4 py-3 font-semibold">PLATFORM ROLE</th>
                <th className="px-4 py-3 font-semibold">DOANH NGHIỆP ĐÃ GÁN</th>
                <th className="px-4 py-3 font-semibold text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-lowest">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-on-surface">{u.fullName || "Chưa cập nhật"}</p>
                    <p className="text-xs text-on-surface-variant font-mono">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-300 font-mono text-[10px] rounded">
                      {u.platformRole}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {u.organizations && u.organizations.length > 0 ? (
                      <div className="space-y-1">
                        {u.organizations.map((mo: any) => (
                          <div key={mo.id} className="flex items-center gap-2">
                            <span className="font-semibold text-on-surface">{mo.name}</span>
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300">
                              {mo.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-100 text-amber-800">
                        PENDING_PROVISIONING
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" onClick={() => setSelectedUser(u)}>
                      + Cấp / Sửa Quyền
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

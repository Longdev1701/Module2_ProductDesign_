"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../../lib/api";
import { AdminHeader } from "./AdminHeader";
import { AdminOrgTab } from "./AdminOrgTab";
import { AdminUserTab } from "./AdminUserTab";
import type { AdminOrganizationInput, AdminUser, AuthMeResponse, OrganizationRole, OrganizationSummary, UserProfile } from "@/types/api";
import { getErrorMessage } from "@/types/api";

export function AdminPortalFeature() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orgs" | "users">("orgs");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [orgs, setOrgs] = useState<OrganizationSummary[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [targetOrgId, setTargetOrgId] = useState("");

  const [adminUser, setAdminUser] = useState<UserProfile | null>(null);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const meRes = await api.get<AuthMeResponse>('/auth/me');
      // BE /auth/me trả về { user: { platformRole, ... }, organizations: [...] }
      const userData = meRes.data?.user;
      const platformRole = userData?.platformRole;

      if (platformRole !== 'SUPER_ADMIN' && platformRole !== 'PLATFORM_ADMIN') {
        router.push('/pending-access');
        return;
      }

      setAdminUser(userData || null);

      const orgsRes = await api.get<OrganizationSummary[]>('/admin/organizations');
      const usersRes = await api.get<AdminUser[]>('/admin/users');

      setOrgs(orgsRes.data || []);
      setUsers(usersRes.data || []);
      if (orgsRes.data && orgsRes.data.length > 0) {
        setTargetOrgId(orgsRes.data[0].id);
      }
    } catch (err: unknown) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Từ chối truy cập Admin Portal.') });
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void Promise.resolve().then(fetchAdminData);
  }, [fetchAdminData]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('active_org_id');
    router.push('/login');
  };

  const handleCreateOrg = async (orgData: AdminOrganizationInput) => {
    setMsg(null);
    try {
      await api.post('/admin/organizations', orgData);
      setMsg({ type: 'success', text: `Khởi tạo Doanh nghiệp "${orgData.name}" thành công!` });
      await fetchAdminData();
    } catch (err: unknown) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Khởi tạo Doanh nghiệp thất bại.') });
      throw err;
    }
  };

  const handleAssignMember = async (userId: string, orgId: string, role: OrganizationRole) => {
    setMsg(null);
    try {
      await api.post(`/admin/organizations/${orgId}/assign-member`, {
        userId,
        role,
      });
      setMsg({ type: 'success', text: `Đã cấp quyền ${role} thành công!` });
      await fetchAdminData();
    } catch (err: unknown) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Cấp quyền thành viên thất bại.') });
      throw err;
    }
  };

  const filteredUsers = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrgs = orgs.filter((o) =>
    o.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.primaryProduct?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-sm text-on-surface-variant">Đang nạp dữ liệu Platform Admin Portal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <AdminHeader
        activeTab={activeTab}
        search={search}
        onSearchChange={setSearch}
        user={adminUser}
        onLogout={handleLogout}
      />

      {msg && (
        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${
          msg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-outline-variant gap-4">
        <button
          onClick={() => { setActiveTab("orgs"); setMsg(null); }}
          className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "orgs" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Building className="w-4 h-4" /> Quản lý Doanh nghiệp ({orgs.length})
        </button>
        <button
          onClick={() => { setActiveTab("users"); setMsg(null); }}
          className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "users" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Users className="w-4 h-4" /> Quản lý User & Cấp quyền ({users.length})
        </button>
      </div>

      {activeTab === "orgs" ? (
        <AdminOrgTab
          orgs={filteredOrgs}
          onCreateOrg={handleCreateOrg}
          onSelectOrgForUser={(orgId) => {
            setTargetOrgId(orgId);
            setActiveTab("users");
          }}
        />
      ) : (
        <AdminUserTab
          users={filteredUsers}
          orgs={orgs}
          onAssignMember={handleAssignMember}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          targetOrgId={targetOrgId}
          setTargetOrgId={setTargetOrgId}
        />
      )}
    </div>
  );
}

export default AdminPortalFeature;

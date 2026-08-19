"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../../lib/api";
import { AdminHeader } from "./AdminHeader";
import { AdminOverviewTab } from "./AdminOverviewTab";
import { AdminOrgTab } from "./AdminOrgTab";
import { AdminUserTab } from "./AdminUserTab";
import { AdminLegalSyncTab } from "./AdminLegalSyncTab";
import { AdminCiferTab } from "./AdminCiferTab";
import { AdminAuditLogsTab } from "./AdminAuditLogsTab";
import { AdminOverviewSkeleton } from "./AdminSkeletons";
import type {
  AdminOrganizationInput,
  AdminUser,
  AuthMeResponse,
  OrganizationRole,
  OrganizationSummary,
  UserProfile,
  PlatformRole,
  AdminOverviewData,
  AdminLegalSyncStats,
  AdminCiferRecord,
  AdminAuditLog,
} from "@/types/api";
import { getErrorMessage } from "@/types/api";

type AdminTab = "overview" | "orgs" | "users" | "legal-sync" | "cifer" | "audit-logs";

export function AdminPortalFeature() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Admin user
  const [adminUser, setAdminUser] = useState<UserProfile | null>(null);

  // Overview Data
  const [overviewData, setOverviewData] = useState<AdminOverviewData | null>(null);

  // Orgs Data
  const [orgs, setOrgs] = useState<OrganizationSummary[]>([]);
  const [orgsTotal, setOrgsTotal] = useState(0);
  const [orgSearch, setOrgSearch] = useState("");

  // Users Data
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [targetOrgId, setTargetOrgId] = useState("");

  // Legal Sync Stats
  const [legalStats, setLegalStats] = useState<AdminLegalSyncStats | null>(null);

  // CIFER Data
  const [ciferRecords, setCiferRecords] = useState<AdminCiferRecord[]>([]);
  const [ciferTotal, setCiferTotal] = useState(0);
  const [ciferSearch, setCiferSearch] = useState("");
  const [ciferCategoryFilter, setCiferCategoryFilter] = useState("ALL");
  const [ciferStateFilter, setCiferStateFilter] = useState("ALL");

  // Audit Logs Data
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditSearch, setAuditSearch] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("ALL");
  const [auditEntityFilter, setAuditEntityFilter] = useState("ALL");

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const meRes = await api.get<AuthMeResponse>("/auth/me");
      const userData = meRes.data?.user || meRes.data?.profile;
      const platformRole = userData?.platformRole;

      if (platformRole !== "SUPER_ADMIN" && platformRole !== "PLATFORM_ADMIN") {
        router.push("/pending-access");
        return;
      }

      setAdminUser(userData || null);

      // Load overview & basic lists in parallel
      const [overviewRes, orgsRes, usersRes, legalRes, ciferRes, auditRes] = await Promise.all([
        api.get<AdminOverviewData>("/admin/overview").catch(() => ({ data: null })),
        api.get<OrganizationSummary[]>("/admin/organizations?pageSize=50").catch(() => ({ data: [], meta: { total: 0 } })),
        api.get<AdminUser[]>("/admin/users?pageSize=50").catch(() => ({ data: [], meta: { total: 0 } })),
        api.get<AdminLegalSyncStats>("/admin/legal-sync/stats").catch(() => ({ data: null })),
        api.get<AdminCiferRecord[]>("/admin/cifer?pageSize=50").catch(() => ({ data: [], meta: { total: 0 } })),
        api.get<AdminAuditLog[]>("/admin/audit-logs?pageSize=50").catch(() => ({ data: [], meta: { total: 0 } })),
      ]);

      if (overviewRes.data) setOverviewData(overviewRes.data);
      if (orgsRes.data) {
        setOrgs(orgsRes.data);
        setOrgsTotal(orgsRes.meta?.total || orgsRes.data.length);
        if (orgsRes.data.length > 0 && !targetOrgId) {
          setTargetOrgId(orgsRes.data[0].id);
        }
      }
      if (usersRes.data) {
        setUsers(usersRes.data);
        setUsersTotal(usersRes.meta?.total || usersRes.data.length);
      }
      if (legalRes.data) setLegalStats(legalRes.data);
      if (ciferRes.data) {
        setCiferRecords(ciferRes.data);
        setCiferTotal(ciferRes.meta?.total || ciferRes.data.length);
      }
      if (auditRes.data) {
        setAuditLogs(auditRes.data);
        setAuditTotal(auditRes.meta?.total || auditRes.data.length);
      }
    } catch (err: unknown) {
      setMsg({ type: "error", text: getErrorMessage(err, "Từ chối truy cập Admin Portal.") });
    } finally {
      setLoading(false);
    }
  }, [router, targetOrgId]);

  useEffect(() => {
    void Promise.resolve().then(fetchAdminData);
  }, [fetchAdminData]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("access_token");
    localStorage.removeItem("active_org_id");
    localStorage.removeItem("themis:user_cache");
    router.push("/login");
  };

  // --- Handlers for Organizations ---
  const handleCreateOrg = async (orgData: AdminOrganizationInput) => {
    setMsg(null);
    try {
      await api.post("/admin/organizations", orgData);
      setMsg({ type: "success", text: `Khởi tạo Doanh nghiệp "${orgData.name}" thành công!` });
      await fetchAdminData();
    } catch (err: unknown) {
      setMsg({ type: "error", text: getErrorMessage(err, "Khởi tạo Doanh nghiệp thất bại.") });
      throw err;
    }
  };

  const handleUpdateOrg = async (orgId: string, orgData: Partial<AdminOrganizationInput>) => {
    setMsg(null);
    try {
      await api.patch(`/admin/organizations/${orgId}`, orgData);
      setMsg({ type: "success", text: `Cập nhật thông tin Doanh nghiệp thành công!` });
      await fetchAdminData();
    } catch (err: unknown) {
      setMsg({ type: "error", text: getErrorMessage(err, "Cập nhật Doanh nghiệp thất bại.") });
      throw err;
    }
  };

  const handleDeleteOrg = async (orgId: string) => {
    setMsg(null);
    try {
      await api.delete(`/admin/organizations/${orgId}`);
      setMsg({ type: "success", text: `Đã xóa Doanh nghiệp thành công!` });
      await fetchAdminData();
    } catch (err: unknown) {
      setMsg({ type: "error", text: getErrorMessage(err, "Xóa Doanh nghiệp thất bại.") });
      throw err;
    }
  };

  // --- Handlers for Users & Roles ---
  const handleAssignMember = async (userId: string, orgId: string, role: OrganizationRole) => {
    setMsg(null);
    try {
      await api.post(`/admin/organizations/${orgId}/assign-member`, { userId, role });
      setMsg({ type: "success", text: `Đã cấp quyền ${role} thành công!` });
      await fetchAdminData();
    } catch (err: unknown) {
      setMsg({ type: "error", text: getErrorMessage(err, "Cấp quyền thành viên thất bại.") });
      throw err;
    }
  };

  const handleChangePlatformRole = async (userId: string, newRole: PlatformRole) => {
    setMsg(null);
    try {
      await api.patch(`/admin/users/${userId}/platform-role`, { platformRole: newRole });
      setMsg({ type: "success", text: `Đã cập nhật vai trò hệ thống thành ${newRole}!` });
      await fetchAdminData();
    } catch (err: unknown) {
      setMsg({ type: "error", text: getErrorMessage(err, "Đổi vai trò hệ thống thất bại.") });
      throw err;
    }
  };

  const handleRemoveMember = async (orgId: string, userId: string) => {
    setMsg(null);
    try {
      await api.delete(`/admin/organizations/${orgId}/members/${userId}`);
      setMsg({ type: "success", text: `Đã thu hồi quyền thành viên khỏi doanh nghiệp!` });
      await fetchAdminData();
    } catch (err: unknown) {
      setMsg({ type: "error", text: getErrorMessage(err, "Thu hồi quyền thất bại.") });
      throw err;
    }
  };

  // --- Handlers for Legal Sync ---
  const handleTriggerLegalSync = async () => {
    await api.post("/admin/legal-sync/trigger");
  };

  const handleRefreshLegalStats = async () => {
    const res = await api.get<AdminLegalSyncStats>("/admin/legal-sync/stats");
    if (res.data) setLegalStats(res.data);
  };

  // Filtered lists for client-side search responsiveness
  const filteredOrgs = orgs.filter(
    (o) =>
      o.name?.toLowerCase().includes(orgSearch.toLowerCase()) ||
      o.taxCode?.toLowerCase().includes(orgSearch.toLowerCase()) ||
      o.primaryProduct?.toLowerCase().includes(orgSearch.toLowerCase()) ||
      o.contactEmail?.toLowerCase().includes(orgSearch.toLowerCase())
  );

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.jobTitle?.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === "ALL" || u.platformRole === userRoleFilter;
    return matchSearch && matchRole;
  });

  const filteredCifer = ciferRecords.filter((r) => {
    const matchSearch =
      r.name?.toLowerCase().includes(ciferSearch.toLowerCase()) ||
      r.chinaRegNo?.toLowerCase().includes(ciferSearch.toLowerCase()) ||
      r.overseasRegNo?.toLowerCase().includes(ciferSearch.toLowerCase()) ||
      r.address?.toLowerCase().includes(ciferSearch.toLowerCase());
    const matchCategory = ciferCategoryFilter === "ALL" || r.category?.toLowerCase().includes(ciferCategoryFilter.toLowerCase());
    const matchState = ciferStateFilter === "ALL" || (ciferStateFilter === "Valid" ? r.state?.toLowerCase() === "valid" || !r.state : r.state?.toLowerCase() !== "valid");
    return matchSearch && matchCategory && matchState;
  });

  const filteredAuditLogs = auditLogs.filter((l) => {
    const matchSearch =
      l.action?.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.entity?.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.profile?.email?.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.ipAddress?.toLowerCase().includes(auditSearch.toLowerCase());
    const matchAction = auditActionFilter === "ALL" || l.action === auditActionFilter;
    const matchEntity = auditEntityFilter === "ALL" || l.entity === auditEntityFilter;
    return matchSearch && matchAction && matchEntity;
  });

  if (loading && !overviewData) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
        <div className="h-16 bg-white rounded-2xl border border-outline-variant animate-pulse" />
        <AdminOverviewSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setMsg(null);
        }}
        user={adminUser}
        onLogout={handleLogout}
        counts={{
          orgs: orgsTotal,
          users: usersTotal,
          regulations: overviewData?.kpis.totalRegulations || 0,
          cifer: overviewData?.kpis.totalCifer || ciferTotal,
        }}
      />

      {msg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold shadow-xs ${
            msg.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Render Active Tab */}
      {activeTab === "overview" && (
        <AdminOverviewTab
          data={overviewData}
          loading={loading}
          onRefresh={fetchAdminData}
          onNavigateTab={(t) => setActiveTab(t)}
        />
      )}

      {activeTab === "orgs" && (
        <AdminOrgTab
          orgs={filteredOrgs}
          total={orgsTotal}
          loading={loading}
          search={orgSearch}
          onSearchChange={setOrgSearch}
          onCreateOrg={handleCreateOrg}
          onUpdateOrg={handleUpdateOrg}
          onDeleteOrg={handleDeleteOrg}
          onSelectOrgForUser={(orgId) => {
            setTargetOrgId(orgId);
            setActiveTab("users");
          }}
        />
      )}

      {activeTab === "users" && (
        <AdminUserTab
          users={filteredUsers}
          orgs={orgs}
          total={usersTotal}
          loading={loading}
          search={userSearch}
          onSearchChange={setUserSearch}
          roleFilter={userRoleFilter}
          onRoleFilterChange={setUserRoleFilter}
          onAssignMember={handleAssignMember}
          onChangePlatformRole={handleChangePlatformRole}
          onRemoveMember={handleRemoveMember}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          targetOrgId={targetOrgId}
          setTargetOrgId={setTargetOrgId}
        />
      )}

      {activeTab === "legal-sync" && (
        <AdminLegalSyncTab
          stats={legalStats}
          loading={loading}
          onRefreshStats={handleRefreshLegalStats}
          onTriggerSync={handleTriggerLegalSync}
        />
      )}

      {activeTab === "cifer" && (
        <AdminCiferTab
          records={filteredCifer}
          total={ciferTotal}
          loading={loading}
          search={ciferSearch}
          onSearchChange={setCiferSearch}
          categoryFilter={ciferCategoryFilter}
          onCategoryFilterChange={setCiferCategoryFilter}
          stateFilter={ciferStateFilter}
          onStateFilterChange={setCiferStateFilter}
        />
      )}

      {activeTab === "audit-logs" && (
        <AdminAuditLogsTab
          logs={filteredAuditLogs}
          total={auditTotal}
          loading={loading}
          search={auditSearch}
          onSearchChange={setAuditSearch}
          actionFilter={auditActionFilter}
          onActionFilterChange={setAuditActionFilter}
          entityFilter={auditEntityFilter}
          onEntityFilterChange={setAuditEntityFilter}
        />
      )}
    </div>
  );
}

export default AdminPortalFeature;

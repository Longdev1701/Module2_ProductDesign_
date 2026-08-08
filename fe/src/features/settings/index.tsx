"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Building, Users, ShieldCheck, Bell, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { ProfileSettingsTab } from "./ProfileSettingsTab";
import { MemberSettingsTab } from "./MemberSettingsTab";
import { SecuritySettingsTab } from "./SecuritySettingsTab";
import { NotificationSettingsTab } from "./NotificationSettingsTab";
import type { AuthMeResponse, OrganizationRole, OrganizationSummary, UserProfile } from "@/types/api";
import { getErrorMessage } from "@/types/api";

export default function SettingsFeature() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  // Organization State
  const [org, setOrg] = useState<OrganizationSummary | null>(null);
  const [orgName, setOrgName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [address, setAddress] = useState("");
  const [legalRepresentative, setLegalRepresentative] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [primaryProduct, setPrimaryProduct] = useState("");
  const [userRole, setUserRole] = useState<OrganizationRole>("VIEWER");

  // Invite Member State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("COMPLIANCE");
  const [inviting, setInviting] = useState(false);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const meRes = await api.get<AuthMeResponse>('/auth/me');
      if (meRes.data) {
        const profile = meRes.data.user || meRes.data.profile;
        if (!profile) return;
        setUserProfile(profile);
        setFullName(profile.fullName || "");
        setJobTitle(profile.jobTitle || "");

        if (meRes.data.organizations && meRes.data.organizations.length > 0) {
          const userOrg = meRes.data.organizations[0];
          setUserRole(userOrg.role || "VIEWER");

          const orgRes = await api.get<OrganizationSummary>(`/organizations/${userOrg.id}`);
          if (orgRes.data) {
            const o = orgRes.data;
            setOrg(o);
            setOrgName(o.name || "");
            setTaxCode(o.taxCode || "");
            setAddress(o.address || "");
            setLegalRepresentative(o.legalRepresentative || "");
            setContactEmail(o.contactEmail || "");
            setContactPhone(o.contactPhone || "");
            setPrimaryProduct(o.primaryProduct || "");
          }
        }
      }
    } catch (err: unknown) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Không thể tải thông tin hệ thống.') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchInitialData);
  }, [fetchInitialData]);

  const handleSaveOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org?.id) return;
    setSaving(true);
    setMsg(null);

    try {
      await api.patch(`/organizations/${org.id}`, {
        name: orgName,
        taxCode,
        address,
        legalRepresentative,
        contactEmail,
        contactPhone,
        primaryProduct,
      });

      setMsg({ type: 'success', text: 'Cập nhật thông tin Doanh nghiệp xuất khẩu thành công!' });
      await fetchInitialData();
    } catch (err: unknown) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Cập nhật thông tin doanh nghiệp thất bại.') });
    } finally {
      setSaving(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org?.id || !inviteEmail) return;
    setInviting(true);
    setMsg(null);

    try {
      await api.post(`/organizations/${org.id}/invitations`, {
        email: inviteEmail,
        role: inviteRole,
      });

      setMsg({ type: 'success', text: `Đã gửi lời mời tới ${inviteEmail} thành công!` });
      setInviteEmail("");
      await fetchInitialData();
    } catch (err: unknown) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Mời thành viên thất bại.') });
    } finally {
      setInviting(false);
    }
  };

  const tabs = [
    { id: "profile", name: "Cá nhân & Doanh nghiệp", icon: Building },
    { id: "members", name: "Thành viên & Phân quyền", icon: Users },
    { id: "security", name: "Phân quyền 2 Tầng", icon: ShieldCheck },
    { id: "notifications", name: "Thông báo", icon: Bell },
  ];

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-sm text-on-surface-variant">Đang tải dữ liệu cài đặt & phân quyền...</p>
      </div>
    );
  }

  const isOwnerOrManager = userRole === 'OWNER' || userRole === 'MANAGER';

  return (
    <div className="space-y-6">
      {/* Top Navbar Header */}
      <div className="bg-[#001946] text-white p-4 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center font-bold text-[#001946] text-sm">
            T
          </div>
          <div>
            <p className="text-xs text-[#a5bdff]">Themis LexiGuard</p>
            <p className="text-sm font-semibold">{org?.name || 'Cài đặt Doanh nghiệp'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>🏠 Quay về Dashboard</span>
          </a>

          {(userProfile?.platformRole === 'SUPER_ADMIN' || userProfile?.platformRole === 'PLATFORM_ADMIN') && (
            <a
              href="/admin"
              className="text-xs bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>🏛️ Admin Portal</span>
            </a>
          )}

          <button
            onClick={async () => {
              try { await api.post('/auth/logout'); } catch {}
              localStorage.removeItem("access_token");
              localStorage.removeItem("active_org_id");
              window.location.href = "/login";
            }}
            className="text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-on-surface mb-2">Cài đặt & Phân quyền</h1>
          <p className="text-on-surface-variant text-sm">
            Quản lý hồ sơ doanh nghiệp xuất khẩu, danh sách nhân sự và ma trận phân quyền RBAC.
          </p>
        </div>
        {userRole && (
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-outline-variant shadow-sm">
            <span className="text-xs font-medium text-on-surface-variant">Quyền hạn của bạn:</span>
            <Badge variant={userRole === 'OWNER' ? 'default' : 'secondary'} className="font-mono text-xs font-bold">
              {userRole}
            </Badge>
          </div>
        )}
      </div>

      {msg && (
        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${
          msg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMsg(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-on-primary font-bold shadow-sm"
                  : "text-on-surface hover:bg-surface-container-low"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === "profile" && (
            <ProfileSettingsTab
              fullName={fullName}
              userEmail={userProfile?.email || ""}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              platformRole={userProfile?.platformRole || "USER"}
              orgName={orgName}
              setOrgName={setOrgName}
              taxCode={taxCode}
              setTaxCode={setTaxCode}
              address={address}
              setAddress={setAddress}
              legalRepresentative={legalRepresentative}
              setLegalRepresentative={setLegalRepresentative}
              contactEmail={contactEmail}
              setContactEmail={setContactEmail}
              primaryProduct={primaryProduct}
              setPrimaryProduct={setPrimaryProduct}
              isOwnerOrManager={isOwnerOrManager}
              saving={saving}
              onSave={handleSaveOrganization}
            />
          )}

          {activeTab === "members" && (
            <MemberSettingsTab
              members={org?.members || []}
              inviteEmail={inviteEmail}
              setInviteEmail={setInviteEmail}
              inviteRole={inviteRole}
              setInviteRole={setInviteRole}
              inviting={inviting}
              onInvite={handleInviteMember}
              isOwnerOrManager={isOwnerOrManager}
            />
          )}

          {activeTab === "security" && (
            <SecuritySettingsTab
              platformRole={userProfile?.platformRole}
              userRole={userRole}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationSettingsTab />
          )}
        </div>
      </div>
    </div>
  );
}

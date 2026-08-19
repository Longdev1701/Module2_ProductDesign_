"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Building, Sliders, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { ProfileSettingsTab } from "./ProfileSettingsTab";
import { SecuritySettingsTab } from "./SecuritySettingsTab";
import { NotificationSettingsTab } from "./NotificationSettingsTab";
import type { AuthMeResponse, OrganizationRole, OrganizationSummary, UserProfile } from "@/types/api";
import { getErrorMessage } from "@/types/api";

export default function SettingsFeature() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
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
  const [primaryProduct, setPrimaryProduct] = useState("Sầu riêng tươi (Monthong & Ri6)");
  const [userRole, setUserRole] = useState<OrganizationRole>("VIEWER");

  // GACC CIFER Profile State
  const [ciferCode, setCiferCode] = useState("CVNM2401240001");
  const [defaultPhcCode, setDefaultPhcCode] = useState("VN-TGPH-0012");
  const [defaultPucCode, setDefaultPucCode] = useState("VN-TGOR-0095");
  const [defaultExportPort, setDefaultExportPort] = useState("Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)");

  // Compliance Thresholds State
  const [cadmiumThreshold, setCadmiumThreshold] = useState(0.040);
  const [phytoBufferDays, setPhytoBufferDays] = useState(3);
  const [urgentGaccAlerts, setUrgentGaccAlerts] = useState(true);
  const [cadmiumAlerts, setCadmiumAlerts] = useState(true);
  const [phytoAlerts, setPhytoAlerts] = useState(true);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const meRes = await api.get<AuthMeResponse>('/api/auth/me');
      if (meRes.data) {
        const profile = meRes.data.user || meRes.data.profile;
        if (!profile) return;
        setUserProfile(profile);
        setFullName(profile.fullName || "");
        setJobTitle(profile.jobTitle || "");

        if (meRes.data.organizations && meRes.data.organizations.length > 0) {
          const userOrg = meRes.data.organizations[0];
          setUserRole(userOrg.role || "VIEWER");

          const orgRes = await api.get<OrganizationSummary>(`/api/organizations/${userOrg.id}`);
          if (orgRes.data) {
            const o = orgRes.data;
            setOrg(o);
            setOrgName(o.name || "");
            setTaxCode(o.taxCode || "");
            setAddress(o.address || "");
            setLegalRepresentative(o.legalRepresentative || "");
            setContactEmail(o.contactEmail || "");
            setContactPhone(o.contactPhone || "");
            setPrimaryProduct(o.primaryProduct || "Sầu riêng tươi (Monthong & Ri6)");

            // Nạp cấu hình GACC CIFER & Ngưỡng từ JSON exportMarkets nếu có
            const exportConfig = typeof o.exportMarkets === 'object' && o.exportMarkets !== null && !Array.isArray(o.exportMarkets)
              ? (o.exportMarkets as any)
              : {};

            if (exportConfig.ciferCode) setCiferCode(exportConfig.ciferCode);
            if (exportConfig.defaultPhcCode) setDefaultPhcCode(exportConfig.defaultPhcCode);
            if (exportConfig.defaultPucCode) setDefaultPucCode(exportConfig.defaultPucCode);
            if (exportConfig.defaultExportPort) setDefaultExportPort(exportConfig.defaultExportPort);
            if (exportConfig.cadmiumThreshold !== undefined) setCadmiumThreshold(exportConfig.cadmiumThreshold);
            if (exportConfig.phytoBufferDays !== undefined) setPhytoBufferDays(exportConfig.phytoBufferDays);
            if (exportConfig.urgentGaccAlerts !== undefined) setUrgentGaccAlerts(exportConfig.urgentGaccAlerts);
            if (exportConfig.cadmiumAlerts !== undefined) setCadmiumAlerts(exportConfig.cadmiumAlerts);
            if (exportConfig.phytoAlerts !== undefined) setPhytoAlerts(exportConfig.phytoAlerts);
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

  // 1. Lưu Hồ sơ Doanh nghiệp & GACC CIFER
  const handleSaveOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org?.id) return;
    setSaving(true);
    setMsg(null);

    try {
      const currentConfig = typeof org.exportMarkets === 'object' && org.exportMarkets !== null && !Array.isArray(org.exportMarkets)
        ? (org.exportMarkets as any)
        : {};

      const updatedExportMarkets = {
        ...currentConfig,
        markets: ['CHINA'],
        ciferCode,
        defaultPhcCode,
        defaultPucCode,
        defaultExportPort,
      };

      await api.patch(`/api/organizations/${org.id}`, {
        name: orgName,
        taxCode,
        address,
        legalRepresentative,
        contactEmail,
        contactPhone,
        primaryProduct,
        exportMarkets: updatedExportMarkets,
      });

      setMsg({ type: 'success', text: 'Cập nhật Hồ sơ Doanh nghiệp & Mã Pháp lý GACC CIFER thành công!' });
      await fetchInitialData();
    } catch (err: unknown) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Cập nhật thông tin doanh nghiệp thất bại.') });
    } finally {
      setSaving(false);
    }
  };

  // 2. Lưu Cấu hình Ngưỡng An toàn & Cảnh báo
  const handleSaveThresholds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org?.id) return;
    setSaving(true);
    setMsg(null);

    try {
      const currentConfig = typeof org.exportMarkets === 'object' && org.exportMarkets !== null && !Array.isArray(org.exportMarkets)
        ? (org.exportMarkets as any)
        : {};

      const updatedExportMarkets = {
        ...currentConfig,
        cadmiumThreshold,
        phytoBufferDays,
        urgentGaccAlerts,
        cadmiumAlerts,
        phytoAlerts,
      };

      await api.patch(`/api/organizations/${org.id}`, {
        exportMarkets: updatedExportMarkets,
      });

      setMsg({ type: 'success', text: 'Cập nhật Cấu hình Ngưỡng An Toàn & Kênh Cảnh Báo thành công!' });
      await fetchInitialData();
    } catch (err: unknown) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Lưu cấu hình ngưỡng thất bại.') });
    } finally {
      setSaving(false);
    }
  };

  // 3. Cập nhật Chức danh cá nhân
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setMsg(null);
    try {
      await api.patch('/api/auth/profile', {
        jobTitle,
      });
      setMsg({ type: 'success', text: 'Cập nhật chức danh cá nhân thành công!' });
      await fetchInitialData();
    } catch (err: unknown) {
      setMsg({ type: 'error', text: getErrorMessage(err, 'Cập nhật chức danh thất bại.') });
    } finally {
      setSavingProfile(false);
    }
  };

  const tabs = [
    { id: "profile", name: "Hồ sơ Doanh nghiệp & GACC CIFER", icon: Building },
    { id: "thresholds", name: "Ngưỡng An Toàn & Cảnh Báo", icon: Sliders },
    { id: "security", name: "Bảo mật & Tài khoản Cá nhân", icon: ShieldCheck },
  ];

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-xs text-on-surface-variant">Đang tải dữ liệu cấu hình doanh nghiệp...</p>
      </div>
    );
  }

  const isOwnerOrManager = userRole === 'OWNER' || userRole === 'MANAGER';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              CẤU HÌNH TỔ CHỨC
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Cài Đặt Doanh Nghiệp
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Quản lý hồ sơ pháp lý GACC CIFER, tài khoản cá nhân và cấu hình ngưỡng an toàn độc tố
          </p>
        </div>

        {userRole && (
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-outline-variant/60 shadow-2xs self-start sm:self-auto">
            <span className="text-xs text-on-surface-variant font-medium">Quyền hạn của bạn:</span>
            <Badge className="font-mono text-xs font-bold bg-primary text-white">
              {userRole}
            </Badge>
          </div>
        )}
      </div>

      {/* Message Toast / Alert */}
      {msg && (
        <div
          className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-fadeIn ${
            msg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-1.5 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMsg(null);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-xs font-bold"
                  : "text-on-surface hover:bg-slate-100/80 bg-white border border-outline-variant/60"
              }`}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <ProfileSettingsTab
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
              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
              primaryProduct={primaryProduct}
              setPrimaryProduct={setPrimaryProduct}
              ciferCode={ciferCode}
              setCiferCode={setCiferCode}
              defaultPhcCode={defaultPhcCode}
              setDefaultPhcCode={setDefaultPhcCode}
              defaultPucCode={defaultPucCode}
              setDefaultPucCode={setDefaultPucCode}
              defaultExportPort={defaultExportPort}
              setDefaultExportPort={setDefaultExportPort}
              isOwnerOrManager={isOwnerOrManager}
              saving={saving}
              onSave={handleSaveOrganization}
            />
          )}

          {activeTab === "thresholds" && (
            <NotificationSettingsTab
              cadmiumThreshold={cadmiumThreshold}
              setCadmiumThreshold={setCadmiumThreshold}
              phytoBufferDays={phytoBufferDays}
              setPhytoBufferDays={setPhytoBufferDays}
              urgentGaccAlerts={urgentGaccAlerts}
              setUrgentGaccAlerts={setUrgentGaccAlerts}
              cadmiumAlerts={cadmiumAlerts}
              setCadmiumAlerts={setCadmiumAlerts}
              phytoAlerts={phytoAlerts}
              setPhytoAlerts={setPhytoAlerts}
              isOwnerOrManager={isOwnerOrManager}
              saving={saving}
              onSave={handleSaveThresholds}
            />
          )}

          {activeTab === "security" && (
            <SecuritySettingsTab
              fullName={fullName}
              userEmail={userProfile?.email || ""}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              platformRole={userProfile?.platformRole}
              userRole={userRole}
              onSaveProfile={handleSaveProfile}
              savingProfile={savingProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
}

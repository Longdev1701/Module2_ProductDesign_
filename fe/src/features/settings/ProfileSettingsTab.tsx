"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Building, Save } from "lucide-react";

interface ProfileSettingsTabProps {
  fullName: string;
  userEmail: string;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  platformRole: string;
  orgName: string;
  setOrgName: (val: string) => void;
  taxCode: string;
  setTaxCode: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  legalRepresentative: string;
  setLegalRepresentative: (val: string) => void;
  contactEmail: string;
  setContactEmail: (val: string) => void;
  primaryProduct: string;
  setPrimaryProduct: (val: string) => void;
  isOwnerOrManager: boolean;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
}

export function ProfileSettingsTab({
  fullName,
  userEmail,
  jobTitle,
  setJobTitle,
  platformRole,
  orgName,
  setOrgName,
  taxCode,
  setTaxCode,
  address,
  setAddress,
  legalRepresentative,
  setLegalRepresentative,
  contactEmail,
  setContactEmail,
  primaryProduct,
  setPrimaryProduct,
  isOwnerOrManager,
  saving,
  onSave,
}: ProfileSettingsTabProps) {
  return (
    <form onSubmit={onSave} className="space-y-6">
      {/* Personal Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Hồ sơ Cá nhân & Chức danh
          </CardTitle>
          <CardDescription>Thông tin tài khoản đăng nhập của bạn trong hệ thống.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Họ và tên</label>
            <Input value={fullName} disabled className="bg-surface-container-low" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Email</label>
            <Input value={userEmail} disabled className="bg-surface-container-low" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Chức danh công việc</label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} disabled={!isOwnerOrManager} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Vai trò Hệ thống (Platform Role)</label>
            <Input value={platformRole} disabled className="bg-surface-container-low" />
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            Thông tin Doanh nghiệp Xuất khẩu
          </CardTitle>
          <CardDescription>Cấu hình hồ sơ năng lực nông sản xuất khẩu phục vụ đối soát quy định pháp lý.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Tên Doanh nghiệp</label>
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={!isOwnerOrManager} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Mã số thuế</label>
              <Input value={taxCode} onChange={(e) => setTaxCode(e.target.value)} disabled={!isOwnerOrManager} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Địa chỉ trụ sở / Kho xưởng</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} disabled={!isOwnerOrManager} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Người đại diện pháp luật</label>
              <Input value={legalRepresentative} onChange={(e) => setLegalRepresentative(e.target.value)} disabled={!isOwnerOrManager} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Email liên hệ XNK</label>
              <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} disabled={!isOwnerOrManager} type="email" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">Sản phẩm chiến lược</label>
              <Input value={primaryProduct} onChange={(e) => setPrimaryProduct(e.target.value)} disabled={!isOwnerOrManager} required />
            </div>
          </div>
        </CardContent>
        {isOwnerOrManager && (
          <CardFooter className="justify-end border-t border-outline-variant pt-4">
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu thông tin Doanh nghiệp'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  );
}

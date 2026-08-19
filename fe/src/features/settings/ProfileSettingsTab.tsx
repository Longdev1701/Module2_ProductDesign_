"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building, Save, ShieldCheck, FileCheck2, Globe2, AlertCircle } from "lucide-react";

interface ProfileSettingsTabProps {
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
  contactPhone: string;
  setContactPhone: (val: string) => void;
  primaryProduct: string;
  setPrimaryProduct: (val: string) => void;
  // GACC CIFER Profile
  ciferCode: string;
  setCiferCode: (val: string) => void;
  defaultPhcCode: string;
  setDefaultPhcCode: (val: string) => void;
  defaultPucCode: string;
  setDefaultPucCode: (val: string) => void;
  defaultExportPort: string;
  setDefaultExportPort: (val: string) => void;
  isOwnerOrManager: boolean;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
}

export function ProfileSettingsTab({
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
  contactPhone,
  setContactPhone,
  primaryProduct,
  setPrimaryProduct,
  ciferCode,
  setCiferCode,
  defaultPhcCode,
  setDefaultPhcCode,
  defaultPucCode,
  setDefaultPucCode,
  defaultExportPort,
  setDefaultExportPort,
  isOwnerOrManager,
  saving,
  onSave,
}: ProfileSettingsTabProps) {
  return (
    <form onSubmit={onSave} className="space-y-6">
      {/* RBAC Notice if viewer/analyst */}
      {!isOwnerOrManager && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            Bạn đang ở chế độ xem. Chỉ Giám đốc (Owner) hoặc Quản lý (Manager) mới có quyền chỉnh sửa Hồ sơ Doanh nghiệp &amp; Mã Pháp lý GACC.
          </span>
        </div>
      )}

      {/* 1. Legal Enterprise Profile */}
      <Card className="rounded-2xl border-outline-variant/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-serif font-bold flex items-center gap-2 text-on-surface">
            <Building className="w-5 h-5 text-primary" />
            Thông Tin Pháp Nhân Doanh Nghiệp Xuất Khẩu
          </CardTitle>
          <CardDescription className="text-xs">
            Hồ sơ pháp lý của Doanh nghiệp dùng để tự động đối chiếu trong mọi Báo cáo thông quan và Tờ khai kiểm dịch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Tên Doanh Nghiệp (Pháp Nhân)</label>
              <Input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                disabled={!isOwnerOrManager}
                required
                placeholder="VD: Công ty Cổ phần Nông sản Xuất khẩu Themis"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Mã Số Thuế (Doanh nghiệp)</label>
              <Input
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
                disabled={!isOwnerOrManager}
                placeholder="VD: 0318899221"
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Người Đại Diện Pháp Luật</label>
              <Input
                value={legalRepresentative}
                onChange={(e) => setLegalRepresentative(e.target.value)}
                disabled={!isOwnerOrManager}
                placeholder="VD: Nguyễn Văn Giám Đốc"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Sản Phẩm Chiến Lược Chính</label>
              <Input
                value={primaryProduct}
                onChange={(e) => setPrimaryProduct(e.target.value)}
                disabled={!isOwnerOrManager}
                placeholder="VD: Sầu riêng tươi (Monthong & Ri6)"
                className="text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Email Liên Hệ Phòng XNK</label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                disabled={!isOwnerOrManager}
                placeholder="xnk@themisexport.vn"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Hotline Điều Phối Container</label>
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                disabled={!isOwnerOrManager}
                placeholder="VD: 0908 123 456"
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Địa Chỉ Nhà Máy / Trụ Sở Xưởng Đóng Gói</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isOwnerOrManager}
              placeholder="VD: Km 12, Quốc lộ 1A, Huyện Cai Lậy, Tỉnh Tiền Giang"
              className="text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. GACC / CIFER Export Profile (Zero-Typo Shield) */}
      <Card className="rounded-2xl border-outline-variant/60 shadow-xs bg-slate-50/50">
        <CardHeader>
          <CardTitle className="text-base font-serif font-bold flex items-center gap-2 text-on-surface">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Hồ Sơ Pháp Lý Hải Quan Trung Quốc (GACC &amp; CIFER Profile)
          </CardTitle>
          <CardDescription className="text-xs">
            Cấu hình cố định các mã số xuất khẩu đã được GACC phê duyệt để tự động điền (Auto-fill) vào mọi Lô hàng &amp; Báo cáo kẹp chì, chống sai lệch 1 ký tự.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                Mã Đăng Ký CIFER Doanh Nghiệp (Lệnh 248 GACC)
              </label>
              <Input
                value={ciferCode}
                onChange={(e) => setCiferCode(e.target.value)}
                disabled={!isOwnerOrManager}
                placeholder="VD: CVNM2401240001"
                className="text-xs font-mono font-bold text-emerald-700 bg-white"
              />
              <p className="text-[10px] text-slate-500">Mã cơ sở sản xuất chế biến thực phẩm đăng ký trên hệ thống CIFER của Hải quan TQ.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-primary" />
                Mã Cơ Sở Đóng Gói Mặc Định (Mã PHC)
              </label>
              <Input
                value={defaultPhcCode}
                onChange={(e) => setDefaultPhcCode(e.target.value)}
                disabled={!isOwnerOrManager}
                placeholder="VD: VN-TGPH-0012"
                className="text-xs font-mono font-bold text-primary bg-white"
              />
              <p className="text-[10px] text-slate-500">Mã xưởng đóng gói sầu riêng được Cục BVTV cấp và GACC chấp thuận.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Mã Vùng Trồng Mặc Định (Mã PUC Liên Kết)</label>
              <Input
                value={defaultPucCode}
                onChange={(e) => setDefaultPucCode(e.target.value)}
                disabled={!isOwnerOrManager}
                placeholder="VD: VN-TGOR-0095"
                className="text-xs font-mono bg-white"
              />
              <p className="text-[10px] text-slate-500">Mã vùng trồng sầu riêng chủ lực của hợp tác xã liên kết.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Cửa Khẩu / Cảng Thông Quan Ưu Tiên</label>
              <Input
                value={defaultExportPort}
                onChange={(e) => setDefaultExportPort(e.target.value)}
                disabled={!isOwnerOrManager}
                placeholder="VD: Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)"
                className="text-xs bg-white"
              />
              <p className="text-[10px] text-slate-500">Cửa khẩu thường xuyên mở tờ khai xuất khẩu chính ngạch sang Trung Quốc.</p>
            </div>
          </div>
        </CardContent>
        {isOwnerOrManager && (
          <CardFooter className="pt-2 pb-4 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu cấu hình...' : 'Lưu Hồ Sơ Doanh Nghiệp & Pháp Lý GACC'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  );
}

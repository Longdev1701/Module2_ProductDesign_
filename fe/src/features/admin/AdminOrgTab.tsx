"use client";

import React, { useState } from "react";
import { Building, Plus } from "lucide-react";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

interface AdminOrgTabProps {
  orgs: any[];
  onCreateOrg: (orgData: any) => Promise<void>;
  onSelectOrgForUser: (orgId: string) => void;
}

export function AdminOrgTab({ orgs, onCreateOrg, onSelectOrgForUser }: AdminOrgTabProps) {
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [address, setAddress] = useState("");
  const [legalRepresentative, setLegalRepresentative] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [primaryProduct, setPrimaryProduct] = useState("");
  const [creatingOrg, setCreatingOrg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingOrg(true);
    try {
      await onCreateOrg({
        name: orgName,
        taxCode,
        address,
        legalRepresentative,
        contactEmail,
        contactPhone,
        primaryProduct,
        exportMarkets: ['CHINA'],
      });
      setOrgName("");
      setTaxCode("");
      setAddress("");
      setLegalRepresentative("");
      setContactEmail("");
      setContactPhone("");
      setPrimaryProduct("");
      setShowCreateOrg(false);
    } finally {
      setCreatingOrg(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateOrg(!showCreateOrg)} className="gap-2">
          <Plus className="w-4 h-4" /> Khởi tạo Doanh nghiệp Mới
        </Button>
      </div>

      {showCreateOrg && (
        <div className="bg-white border border-primary/40 rounded-xl p-6 shadow-md space-y-4">
          <div className="border-b border-outline-variant pb-3">
            <h3 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
              <Building className="w-5 h-5" /> Khởi tạo Hồ sơ Doanh nghiệp Xuất khẩu Mới
            </h3>
            <p className="text-xs text-on-surface-variant">Thiết lập thông tin Doanh nghiệp xuất khẩu Sầu riêng sang Trung Quốc (GACC Protocol).</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="TÊN DOANH NGHIỆP *" placeholder="Công ty TNHH Xuất Nhập Khẩu Nông Sản..." value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
              <Input label="MÃ SỐ THUẾ" placeholder="0312345678" value={taxCode} onChange={(e) => setTaxCode(e.target.value)} />
              <div className="md:col-span-2">
                <Input label="ĐỊA CHỈ TRỤ SỞ / VÙNG TRỒNG" placeholder="Đắk Lắk / Tiền Giang / Lâm Đồng..." value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <Input label="NGƯỜI ĐẠI DIỆN PHÁP LUẬT" placeholder="Nguyễn Văn A" value={legalRepresentative} onChange={(e) => setLegalRepresentative(e.target.value)} />
              <Input label="EMAIL LIÊN HỆ XNK" placeholder="contact@congty.com" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              <div className="md:col-span-2">
                <Input label="SẢN PHẨM XUẤT KHẨU CHÍNH *" placeholder="Sầu riêng Tươi Ri6 / Dona & Cấp đông (Mã HS: 0810.60.00)" value={primaryProduct} onChange={(e) => setPrimaryProduct(e.target.value)} required />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateOrg(false)}>Hủy</Button>
              <Button type="submit" disabled={creatingOrg}>{creatingOrg ? 'Đang tạo...' : 'Tạo Doanh nghiệp'}</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orgs.map((o) => (
          <div key={o.id} className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="text-base font-bold text-on-surface">{o.name}</h4>
              <span className="px-2 py-0.5 bg-surface-container-low text-on-surface-variant font-mono text-[10px] rounded border border-outline-variant">
                MST: {o.taxCode || 'N/A'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">Sản phẩm: <strong className="text-primary">{o.primaryProduct}</strong></p>
            <div className="space-y-1 text-xs border-t border-outline-variant/60 pt-3 text-on-surface-variant">
              <p className="truncate">📍 {o.address || 'Chưa cập nhật địa chỉ'}</p>
              <p>👤 Đại diện: {o.legalRepresentative || 'Chưa có'}</p>
              <div className="pt-2 flex justify-between items-center">
                <span className="font-semibold text-primary">Thành viên: {o.members?.length || 0} nhân sự</span>
                <Button variant="outline" onClick={() => onSelectOrgForUser(o.id)}>
                  + Cấp quyền User
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

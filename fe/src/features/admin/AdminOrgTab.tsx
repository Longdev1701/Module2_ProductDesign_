"use client";

import React, { useState } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Globe2,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "./AdminPagination";
import { AdminGridCardSkeleton } from "./AdminSkeletons";
import type { AdminOrganizationInput, OrganizationSummary } from "@/types/api";

interface AdminOrgTabProps {
  orgs: OrganizationSummary[];
  total: number;
  loading: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  onCreateOrg: (orgData: AdminOrganizationInput) => Promise<void>;
  onUpdateOrg: (orgId: string, orgData: Partial<AdminOrganizationInput>) => Promise<void>;
  onDeleteOrg: (orgId: string) => Promise<void>;
  onSelectOrgForUser: (orgId: string) => void;
}

export function AdminOrgTab({
  orgs,
  total,
  loading,
  search,
  onSearchChange,
  onCreateOrg,
  onUpdateOrg,
  onDeleteOrg,
  onSelectOrgForUser,
}: AdminOrgTabProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationSummary | null>(null);
  const [deletingOrg, setDeletingOrg] = useState<OrganizationSummary | null>(null);
  const [viewMembersOrg, setViewMembersOrg] = useState<OrganizationSummary | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Form State
  const [formData, setFormData] = useState<AdminOrganizationInput>({
    name: "",
    taxCode: "",
    address: "",
    legalRepresentative: "",
    contactEmail: "",
    contactPhone: "",
    primaryProduct: "Sầu riêng tươi Ri6 & Dona (Mã HS: 0810.60.00)",
    exportMarkets: ["CHINA"],
  });

  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      taxCode: "",
      address: "",
      legalRepresentative: "",
      contactEmail: "",
      contactPhone: "",
      primaryProduct: "Sầu riêng tươi Ri6 & Dona (Mã HS: 0810.60.00)",
      exportMarkets: ["CHINA"],
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleOpenEdit = (org: OrganizationSummary) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      taxCode: org.taxCode || "",
      address: org.address || "",
      legalRepresentative: org.legalRepresentative || "",
      contactEmail: org.contactEmail || "",
      contactPhone: org.contactPhone || "",
      primaryProduct: org.primaryProduct || "",
      exportMarkets: (org.exportMarkets as string[]) || ["CHINA"],
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateOrg(formData);
      setShowCreateModal(false);
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;
    setSubmitting(true);
    try {
      await onUpdateOrg(editingOrg.id, formData);
      setEditingOrg(null);
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingOrg) return;
    setSubmitting(true);
    try {
      await onDeleteOrg(deletingOrg.id);
      setDeletingOrg(null);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOrgs = orgs.filter((org) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      org.name.toLowerCase().includes(s) ||
      (org.taxCode && org.taxCode.toLowerCase().includes(s)) ||
      (org.legalRepresentative && org.legalRepresentative.toLowerCase().includes(s))
    );
  });

  const totalFiltered = filteredOrgs.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const displayedOrgs = filteredOrgs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-on-surface flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Quản Lý Hồ Sơ Doanh Nghiệp Xuất Khẩu ({totalFiltered})
          </h2>
          <p className="text-xs text-on-surface-variant">
            Khởi tạo, cấu hình ngành hàng, thị trường xuất khẩu mục tiêu và quản trị nhân sự của từng doanh nghiệp.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="gap-2 shrink-0 cursor-pointer shadow-md">
          <Plus className="w-4 h-4" /> Khởi tạo Doanh nghiệp Mới
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-on-surface-variant shrink-0" />
        <input
          type="text"
          placeholder="Tìm kiếm doanh nghiệp theo tên công ty, mã số thuế (MST), người đại diện..."
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setPage(1);
          }}
          className="w-full text-xs bg-transparent focus:outline-none text-on-surface placeholder:text-on-surface-variant/60"
        />
      </div>

      {/* Organization Grid Cards */}
      {loading ? (
        <AdminGridCardSkeleton count={pageSize} />
      ) : displayedOrgs.length === 0 ? (
        <div className="p-12 text-center bg-white border border-outline-variant rounded-2xl space-y-2">
          <Building2 className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
          <p className="text-sm font-semibold text-on-surface">Không tìm thấy doanh nghiệp phù hợp</p>
          <p className="text-xs text-on-surface-variant">Thử nhập từ khóa khác hoặc bấm nút tạo doanh nghiệp mới</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedOrgs.map((org) => {
              const memberCount = org._count?.members || org.members?.length || 0;

              return (
                <div
                  key={org.id}
                  className="bg-white border border-outline-variant hover:border-primary/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-base text-on-surface leading-tight" title={org.name}>
                        {org.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-container-high text-on-surface-variant shrink-0 border border-outline-variant">
                        MST: {org.taxCode || "Chưa có"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-1.5 text-primary font-semibold">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="truncate">{org.primaryProduct || "Sầu riêng tươi"}</span>
                      </div>

                      {org.address && (
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-on-surface-variant/70" />
                          <span className="truncate">{org.address}</span>
                        </div>
                      )}

                      {org.legalRepresentative && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 shrink-0 text-on-surface-variant/70" />
                          <span>Đại diện: <strong>{org.legalRepresentative}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Market Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {org.exportMarkets && org.exportMarkets.length > 0 ? (
                        org.exportMarkets.map((m) => (
                          <span
                            key={m}
                            className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200"
                          >
                            {m}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-surface-container text-on-surface-variant">
                          CHINA
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer stats & actions */}
                  <div className="pt-3 border-t border-outline-variant/60 flex justify-between items-center text-xs">
                    <button
                      onClick={() => setViewMembersOrg(org)}
                      className="flex items-center gap-1 font-semibold text-on-surface hover:text-primary cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-primary" />
                      <span>{memberCount} thành viên</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(org)}
                        className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" /> Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingOrg(org)}
                        className="h-7 px-2 text-[11px] text-red-600 hover:bg-red-50 hover:border-red-200 gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Bar */}
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
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
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-outline-variant space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-outline-variant pb-3 flex justify-between items-center">
              <h3 className="text-lg font-bold font-serif text-primary flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Khởi tạo Doanh nghiệp Mới
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-on-surface text-lg cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="TÊN DOANH NGHIỆP *"
                    placeholder="Công ty TNHH Xuất Nhập Khẩu Nông Sản..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="MÃ SỐ THUẾ"
                  placeholder="0312345678"
                  value={formData.taxCode || ""}
                  onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                />
                <Input
                  label="NGƯỜI ĐẠI DIỆN PHÁP LUẬT"
                  placeholder="Nguyễn Văn A"
                  value={formData.legalRepresentative || ""}
                  onChange={(e) => setFormData({ ...formData, legalRepresentative: e.target.value })}
                />
                <div className="md:col-span-2">
                  <Input
                    label="ĐỊA CHỈ TRỤ SỞ / VÙNG TRỒNG"
                    placeholder="Đắk Lắk / Tiền Giang / Lâm Đồng..."
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <Input
                  label="EMAIL LIÊN HỆ XNK"
                  type="email"
                  placeholder="contact@doanhnghiep.com"
                  value={formData.contactEmail || ""}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
                <Input
                  label="SỐ ĐIỆN THOẠI"
                  placeholder="0912345678"
                  value={formData.contactPhone || ""}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
                <div className="md:col-span-2">
                  <Input
                    label="SẢN PHẨM XUẤT KHẨU CHÍNH *"
                    placeholder="Sầu riêng tươi Ri6 & Dona (Mã HS: 0810.60.00)"
                    value={formData.primaryProduct}
                    onChange={(e) => setFormData({ ...formData, primaryProduct: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Hủy</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Đang tạo..." : "Tạo Doanh nghiệp"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-outline-variant space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-outline-variant pb-3 flex justify-between items-center">
              <h3 className="text-lg font-bold font-serif text-primary flex items-center gap-2">
                <Edit2 className="w-5 h-5" /> Chỉnh sửa Doanh nghiệp
              </h3>
              <button onClick={() => setEditingOrg(null)} className="text-on-surface-variant hover:text-on-surface text-lg cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="TÊN DOANH NGHIỆP *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="MÃ SỐ THUẾ"
                  value={formData.taxCode || ""}
                  onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                />
                <Input
                  label="NGƯỜI ĐẠI DIỆN PHÁP LUẬT"
                  value={formData.legalRepresentative || ""}
                  onChange={(e) => setFormData({ ...formData, legalRepresentative: e.target.value })}
                />
                <div className="md:col-span-2">
                  <Input
                    label="ĐỊA CHỈ TRỤ SỞ / VÙNG TRỒNG"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <Input
                  label="EMAIL LIÊN HỆ XNK"
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
                <Input
                  label="SỐ ĐIỆN THOẠI"
                  value={formData.contactPhone || ""}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
                <div className="md:col-span-2">
                  <Input
                    label="SẢN PHẨM XUẤT KHẨU CHÍNH *"
                    value={formData.primaryProduct}
                    onChange={(e) => setFormData({ ...formData, primaryProduct: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setEditingOrg(null)}>Hủy</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold">Xác nhận xóa Doanh nghiệp</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Bạn có chắc chắn muốn xóa doanh nghiệp <strong>{deletingOrg.name}</strong>? Tất cả dữ liệu lô hàng, sản phẩm và phân quyền thành viên liên quan sẽ bị xóa khỏi hệ thống.
            </p>
            <div className="pt-2 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeletingOrg(null)}>Hủy</Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {submitting ? "Đang xóa..." : "Xác nhận Xóa"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {viewMembersOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-outline-variant space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="border-b border-outline-variant pb-3 flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-primary uppercase">Danh Sách Thành Viên</span>
                <h3 className="text-base font-bold text-on-surface">{viewMembersOrg.name}</h3>
              </div>
              <button onClick={() => setViewMembersOrg(null)} className="text-on-surface-variant hover:text-on-surface text-lg cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {!viewMembersOrg.members || viewMembersOrg.members.length === 0 ? (
                <p className="text-xs text-on-surface-variant italic p-4 text-center">Chưa có thành viên nào được gán vào doanh nghiệp này.</p>
              ) : (
                viewMembersOrg.members.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl border border-outline-variant/60 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-on-surface">{m.profile?.fullName || m.profile?.email}</p>
                      <p className="text-on-surface-variant text-[11px]">{m.profile?.email} • {m.profile?.jobTitle || "Cán bộ"}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[11px] bg-primary/10 text-primary border border-primary/20">
                      {m.role}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-outline-variant flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onSelectOrgForUser(viewMembersOrg.id);
                  setViewMembersOrg(null);
                }}
                className="text-xs text-primary"
              >
                + Gán thêm nhân sự
              </Button>
              <Button onClick={() => setViewMembersOrg(null)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

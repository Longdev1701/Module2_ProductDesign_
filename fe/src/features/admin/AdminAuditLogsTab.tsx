"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Code,
  Clock,
  User,
  Activity,
  FileJson,
} from "lucide-react";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "./AdminPagination";
import { AdminTableSkeleton } from "./AdminSkeletons";
import type { AdminAuditLog } from "@/types/api";

interface AdminAuditLogsTabProps {
  logs: AdminAuditLog[];
  total: number;
  loading: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  actionFilter: string;
  onActionFilterChange: (val: string) => void;
  entityFilter: string;
  onEntityFilterChange: (val: string) => void;
}

export function AdminAuditLogsTab({
  logs,
  total,
  loading,
  search,
  onSearchChange,
  actionFilter,
  onActionFilterChange,
  entityFilter,
  onEntityFilterChange,
}: AdminAuditLogsTabProps) {
  const [selectedMetadata, setSelectedMetadata] = useState<{ action: string; metadata: any } | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      !search.trim() ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entity.toLowerCase().includes(search.toLowerCase()) ||
      (l.entityId && l.entityId.toLowerCase().includes(search.toLowerCase())) ||
      (l.profile?.email && l.profile.email.toLowerCase().includes(search.toLowerCase())) ||
      (l.ipAddress && l.ipAddress.toLowerCase().includes(search.toLowerCase()));

    const matchesAction = actionFilter === "ALL" || l.action === actionFilter;
    const matchesEntity = entityFilter === "ALL" || l.entity === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const totalFiltered = filteredLogs.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const displayedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
              Security & Compliance
            </span>
            <span className="text-xs text-on-surface-variant font-mono">
              Tổng số bản ghi: <strong>{totalFiltered}</strong> sự kiện
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-on-surface flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            Nhật Ký Kiểm Toán Toàn Hệ Thống (System Audit Logs)
          </h2>
          <p className="text-xs text-on-surface-variant">
            Ghi nhận bất biến toàn bộ hoạt động thay đổi cấu hình, tạo mới lô hàng, phân quyền và kiểm soát pháp lý.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex-1 w-full flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/60">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            type="text"
            placeholder="Tìm theo Hành động, Người thực hiện, IP, ID đối tượng..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setPage(1);
            }}
            className="w-full text-xs bg-transparent focus:outline-none text-on-surface"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => {
              onActionFilterChange(e.target.value);
              setPage(1);
            }}
            className="text-xs px-3 py-2 rounded-lg border border-outline-variant bg-white text-on-surface focus:outline-none cursor-pointer"
          >
            <option value="ALL">Tất cả hành động</option>
            <option value="user.login_success">user.login_success</option>
            <option value="batch.created">batch.created</option>
            <option value="document.uploaded">document.uploaded</option>
            <option value="report.approved">report.approved</option>
            <option value="admin.org_created">admin.org_created</option>
            <option value="admin.member_assigned">admin.member_assigned</option>
            <option value="admin.platform_role_changed">admin.platform_role_changed</option>
          </select>

          {/* Entity Filter */}
          <select
            value={entityFilter}
            onChange={(e) => {
              onEntityFilterChange(e.target.value);
              setPage(1);
            }}
            className="text-xs px-3 py-2 rounded-lg border border-outline-variant bg-white text-on-surface focus:outline-none cursor-pointer"
          >
            <option value="ALL">Tất cả đối tượng</option>
            <option value="User">User (Người dùng)</option>
            <option value="Organization">Organization (Doanh nghiệp)</option>
            <option value="Batch">Batch (Lô hàng)</option>
            <option value="Document">Document (Tài liệu)</option>
            <option value="Report">Report (Báo cáo)</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
        {loading ? (
          <AdminTableSkeleton rows={pageSize} cols={6} />
        ) : displayedLogs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-sm font-semibold text-on-surface">Không có nhật ký phù hợp</p>
            <p className="text-xs text-on-surface-variant">Thử thay đổi từ khóa hoặc bộ lọc hành động</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-outline-variant rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low font-mono uppercase text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3 font-semibold">THỜI GIAN</th>
                    <th className="px-4 py-3 font-semibold">HÀNH ĐỘNG</th>
                    <th className="px-4 py-3 font-semibold">NGƯỜI THỰC HIỆN</th>
                    <th className="px-4 py-3 font-semibold">ĐỐI TƯỢNG (ENTITY)</th>
                    <th className="px-4 py-3 font-semibold">ĐỊA CHỈ IP</th>
                    <th className="px-4 py-3 font-semibold text-right">METADATA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60">
                  {displayedLogs.map((l) => (
                    <tr key={l.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3.5 font-mono text-on-surface-variant whitespace-nowrap">
                        {new Date(l.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-primary">
                        {l.action}
                      </td>
                      <td className="px-4 py-3.5 text-on-surface font-semibold max-w-[200px] truncate" title={l.profile?.email || l.userId}>
                        {l.profile?.email || l.userId}
                        {l.profile?.platformRole && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-mono bg-surface-container text-on-surface-variant">
                            {l.profile.platformRole}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-on-surface">
                        <span className="px-2 py-0.5 bg-surface-container-low rounded border border-outline-variant text-[11px]">
                          {l.entity} {l.entityId ? `(#${l.entityId.slice(0, 8)})` : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-on-surface-variant text-[11px]">
                        {l.ipAddress || "::1"}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {l.metadata ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMetadata({ action: l.action, metadata: l.metadata })}
                            className="text-[11px] h-7 px-2.5 gap-1 cursor-pointer font-mono"
                          >
                            <Code className="w-3 h-3" /> JSON
                          </Button>
                        ) : (
                          <span className="text-on-surface-variant/40 italic text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
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

      {/* JSON Metadata Viewer Modal */}
      {selectedMetadata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant space-y-4">
            <div className="border-b border-outline-variant pb-3 flex justify-between items-start">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold font-mono text-on-surface">{selectedMetadata.action}</h3>
              </div>
              <button
                onClick={() => setSelectedMetadata(null)}
                className="text-on-surface-variant hover:text-on-surface font-bold text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#001946] text-amber-300 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[300px]">
              <pre>{JSON.stringify(selectedMetadata.metadata, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedMetadata(null)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

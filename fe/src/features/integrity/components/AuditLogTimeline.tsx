"use client";

import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Clock,
  User,
  Globe,
  FileCode,
} from 'lucide-react';
import { AuditLogItem } from '../types';

interface AuditLogTimelineProps {
  logs: AuditLogItem[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  selectedAction: string;
  onActionChange: (action: string) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
}

const ACTION_FILTER_OPTIONS = [
  { value: 'ALL', label: 'Tất cả sự kiện' },
  { value: 'report.approved', label: 'Phê duyệt Báo cáo' },
  { value: 'document.uploaded', label: 'Nạp Chứng thư' },
  { value: 'batch.created', label: 'Tạo Lô hàng' },
  { value: 'product.created', label: 'Khai báo Sản phẩm' },
  { value: 'user.login_success', label: 'Đăng nhập' },
];

export function AuditLogTimeline({
  logs,
  loading,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  selectedAction,
  onActionChange,
  searchTerm,
  onSearchChange,
}: AuditLogTimelineProps) {
  const [inspectLog, setInspectLog] = useState<AuditLogItem | null>(null);

  const getActionBadgeColor = (action: string) => {
    if (action.includes('approved')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (action.includes('uploaded') || action.includes('created'))
      return 'bg-blue-100 text-blue-800 border-blue-300';
    if (action.includes('deleted') || action.includes('removed'))
      return 'bg-rose-100 text-rose-800 border-rose-300';
    if (action.includes('login')) return 'bg-slate-100 text-slate-700 border-slate-300';
    return 'bg-amber-100 text-amber-800 border-amber-300';
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-on-surface">
              Nhật Ký Hộp Đen Kiểm Toán Bất Biến (Audit Trail)
            </h3>
            <p className="text-xs text-on-surface-variant">
              Ghi vết mọi thao tác thay đổi dữ liệu theo thời gian thực (Append-Only Invariant)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm theo email, mã lô..."
              className="w-full bg-slate-50 border border-outline-variant/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-on-surface focus:outline-hidden focus:border-primary transition-all"
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-outline-variant/60">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <select
              value={selectedAction}
              onChange={(e) => onActionChange(e.target.value)}
              className="bg-transparent text-xs text-on-surface font-medium border-0 focus:outline-hidden pr-2 cursor-pointer"
            >
              {ACTION_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-outline-variant/60 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Thời Gian</th>
              <th className="py-3 px-4">Người Thực Hiện</th>
              <th className="py-3 px-4">Hành Động</th>
              <th className="py-3 px-4">Thực Thể</th>
              <th className="py-3 px-4">Địa Chỉ IP</th>
              <th className="py-3 px-4 text-right">Chi Tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40 font-normal text-on-surface">
            {loading && logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Đang truy xuất nhật ký từ Hộp đen...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  Không tìm thấy sự kiện nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Timestamp */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </td>

                  {/* Actor */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                        {log.actor.fullName
                          ? log.actor.fullName.charAt(0).toUpperCase()
                          : log.actor.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-on-surface">
                          {log.actor.fullName || log.actor.email}
                        </div>
                        <div className="text-[10px] text-on-surface-variant font-mono">
                          {log.actor.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getActionBadgeColor(
                        log.action
                      )}`}
                    >
                      {log.actionLabelVi}
                    </span>
                  </td>

                  {/* Entity */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                      {log.entity}
                    </span>
                  </td>

                  {/* IP Address */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {log.ipAddress || 'Internal'}
                    </div>
                  </td>

                  {/* Inspect CTA */}
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => setInspectLog(log)}
                      className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                      title="Xem chi tiết dữ liệu"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-on-surface-variant">
        <div>
          Hiển thị <b>{logs.length}</b> trên tổng số <b>{total}</b> sự kiện bất biến
        </div>

        <div className="flex items-center gap-2 self-center sm:self-auto">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="px-3 py-1.5 rounded-lg border border-outline-variant/60 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Trước
          </button>

          <span className="font-mono px-2">
            Trang <b>{page}</b> / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="px-3 py-1.5 rounded-lg border border-outline-variant/60 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-all"
          >
            Sau <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* JSON Metadata Inspection Modal */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-outline-variant overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Chi Tiết Bản Ghi Hộp Đen</h4>
                  <p className="text-[10px] text-on-surface-variant font-mono">ID: {inspectLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectLog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">Hành Động:</span>
                  <b className="font-mono text-primary">{inspectLog.action}</b>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Thời Gian:</span>
                  <b className="font-mono">{new Date(inspectLog.createdAt).toLocaleString('vi-VN')}</b>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Người Thực Hiện:</span>
                  <b>{inspectLog.actor.fullName || inspectLog.actor.email}</b>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Địa Chỉ IP:</span>
                  <b className="font-mono">{inspectLog.ipAddress || 'Internal'}</b>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-on-surface block mb-1">
                  Metadata JSON Payload:
                </span>
                <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-60">
                  {JSON.stringify(inspectLog.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-3 border-t border-outline-variant bg-slate-50 flex justify-end">
              <button
                onClick={() => setInspectLog(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

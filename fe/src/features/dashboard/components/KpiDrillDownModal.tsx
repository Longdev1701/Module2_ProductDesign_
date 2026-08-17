"use client";

import React from 'react';
import Link from 'next/link';
import {
  X,
  Package,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DashboardSummary, DashboardRecentBatch } from '@/types/api';

export type KpiDrillDownType = 'TOTAL_BATCHES' | 'COMPLIANCE_RATE' | 'ACTION_REQUIRED' | 'LEGAL_ALERTS';

interface KpiDrillDownModalProps {
  type: KpiDrillDownType;
  summary: DashboardSummary | null;
  batches: DashboardRecentBatch[];
  onClose: () => void;
  onOpenVault?: (batchId: string, batchCode: string) => void;
  onOpenUpload?: (batchId: string, batchCode: string, docType?: string) => void;
}

export function KpiDrillDownModal({
  type,
  summary,
  batches,
  onClose,
  onOpenVault,
  onOpenUpload,
}: KpiDrillDownModalProps) {
  const getModalConfig = () => {
    switch (type) {
      case 'TOTAL_BATCHES':
        return {
          title: 'Chi tiết Toàn bộ Lô hàng trong Vụ',
          subtitle: `Tổng sản lượng xuất khẩu: ${summary?.totalExportVolumeTons || 0} tấn (${summary?.totalBatches || 0} lô hàng)`,
          icon: <Package className="w-6 h-6 text-primary" />,
          bgColor: 'bg-primary/10',
          badgeText: `${summary?.totalBatches || 0} LÔ`,
        };
      case 'COMPLIANCE_RATE':
        return {
          title: 'Phân tích Tỷ lệ Hồ sơ Hợp lệ',
          subtitle: `Tỷ lệ đạt chuẩn 4 Khóa GACC: ${summary?.complianceRate || 0}% (${summary?.readyForCheckBatches || 0} lô sẵn sàng / ${summary?.totalBatches || 0} lô)`,
          icon: <ShieldCheck className="w-6 h-6 text-emerald-700" />,
          bgColor: 'bg-emerald-100',
          badgeText: `${summary?.complianceRate || 0}% ĐẠT`,
        };
      case 'ACTION_REQUIRED':
        return {
          title: 'Danh sách Lô hàng Cần xử lý Gấp',
          subtitle: 'Các lô hàng đang bị nghẽn do thiếu 1 hoặc nhiều chứng thư sống còn trước khi đóng hàng',
          icon: <AlertTriangle className="w-6 h-6 text-amber-700" />,
          bgColor: 'bg-amber-100',
          badgeText: `${summary?.actionRequiredBatches || 0} LÔ NGHẼN`,
        };
      case 'LEGAL_ALERTS':
        return {
          title: 'Cảnh báo Pháp lý Khẩn cấp GACC & BVTV',
          subtitle: 'Quy định mới nhất về kiểm soát Cadmium, rầy phấn trắng và giám sát mã số vùng trồng PUC',
          icon: <Flame className="w-6 h-6 text-rose-600" />,
          bgColor: 'bg-rose-100',
          badgeText: `${summary?.criticalLegalAlerts || 0} CẢNH BÁO`,
        };
    }
  };

  const config = getModalConfig();

  // Lọc danh sách theo loại KPI
  const filteredBatches = batches.filter((b) => {
    if (type === 'TOTAL_BATCHES') return true;
    if (type === 'COMPLIANCE_RATE') return b.isReadyForCheck || b.status === 'COMPLIANT';
    if (type === 'ACTION_REQUIRED') return !b.isReadyForCheck || b.status === 'ACTION_REQUIRED' || b.status === 'NON_COMPLIANT';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${config.bgColor}`}>
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-on-surface">{config.title}</h3>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface">
                  {config.badgeText}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">{config.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {type === 'LEGAL_ALERTS' ? (
            /* Nội dung cảnh báo pháp lý */
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 uppercase font-mono">
                    HẢI QUAN TRUNG QUỐC (GACC) — NGHỊ ĐỊNH THƯ 2024
                  </span>
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Bắt buộc
                  </span>
                </div>
                <h4 className="font-bold text-sm text-on-surface">
                  Kiểm soát nghiêm ngặt ngưỡng kim loại nặng Cadmium (GB 2762-2022)
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  GACC áp dụng mức dư lượng Cadmium tối đa cho sầu riêng tươi là <strong>0.05 mg/kg</strong>. 
                  Mọi lô hàng xuất khẩu sang Trung Quốc phải kèm theo Phiếu kết quả thử nghiệm từ phòng Lab đạt chuẩn ISO/IEC 17025.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-rose-200/60">
                  <span className="text-[11px] text-on-surface-variant">Áp dụng: Toàn bộ cửa khẩu đường bộ &amp; đường biển</span>
                  <Link
                    href="/regulations"
                    className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1"
                  >
                    Xem văn bản pháp lý <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase font-mono">
                    CỤC BẢO VỆ THỰC VẬT (BỘ NN&amp;PTNT)
                  </span>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Khẩn cấp
                  </span>
                </div>
                <h4 className="font-bold text-sm text-on-surface">
                  Tăng cường rà soát mã số vùng trồng (PUC) &amp; mã đóng gói (PHC)
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Đình chỉ xuất khẩu đối với các lô hàng mượn danh mã số vùng trồng hoặc cơ sở đóng gói chưa được Tổng cục Hải quan Trung Quốc phê duyệt trên hệ thống CIFER.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-amber-200/60">
                  <span className="text-[11px] text-on-surface-variant">Cập nhật: Danh mục mã PUC hợp lệ 2026</span>
                  <Link
                    href="/regulations"
                    className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                  >
                    Tra cứu mã PUC <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Danh sách lô hàng chi tiết */
            <div className="space-y-3">
              {filteredBatches.length === 0 ? (
                <div className="p-8 text-center bg-surface-container-low rounded-xl border border-outline-variant/60">
                  <p className="text-sm font-semibold text-on-surface">Không có lô hàng nào trong danh mục này</p>
                  <p className="text-xs text-on-surface-variant mt-1">Trạng thái dữ liệu đang ở mức an toàn tối đa.</p>
                </div>
              ) : (
                filteredBatches.map((b) => {
                  const missingCount = 4 - (Number(b.hasPhyto) + Number(b.hasLabReport) + Number(b.hasCO) + Number(b.hasPackingList));

                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl bg-white border border-outline-variant/60 hover:border-primary/40 transition-all hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary text-sm">{b.batchCode}</span>
                          <span className="text-xs font-semibold text-on-surface">({b.productName})</span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">
                            {b.quantity} {b.unit}
                          </span>
                        </div>

                        {/* Trạng thái 4 khóa */}
                        <div className="flex items-center gap-2 pt-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                              b.hasPhyto ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {b.hasPhyto ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            Phyto
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                              b.hasLabReport ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {b.hasLabReport ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            Lab
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                              b.hasCO ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {b.hasCO ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            C/O
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                              b.hasPackingList ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {b.hasPackingList ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            Pack
                          </span>
                        </div>
                      </div>

                      {/* Nút hành động */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenVault?.(b.id, b.batchCode);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 transition-colors cursor-pointer"
                        >
                          Mở Hộp hồ sơ
                        </button>

                        {!b.isReadyForCheck ? (
                          <button
                            onClick={() => {
                              onClose();
                              // Chọn loại giấy tờ đầu tiên còn thiếu
                              const targetType = !b.hasPhyto ? 'PHYTO' : !b.hasLabReport ? 'LAB_REPORT' : !b.hasCO ? 'CO' : 'PACKING_LIST';
                              onOpenUpload?.(b.id, b.batchCode, targetType);
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            Nạp thiếu ({missingCount})
                          </button>
                        ) : (
                          <Link
                            href={`/checks/new?batch=${encodeURIComponent(b.batchCode)}`}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Quét AI
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant bg-surface-container-low flex justify-between items-center text-xs text-on-surface-variant">
          <span>Tiêu chuẩn Hải quan GACC — Mã HS 0810.60.00</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-outline-variant font-semibold rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-on-surface"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

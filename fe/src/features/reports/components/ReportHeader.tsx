"use client";

import { ReportDetail } from '../types';
import { ShieldCheck, ShieldAlert, FileText, Printer, QrCode, RefreshCw, KeyRound } from 'lucide-react';

interface ReportHeaderProps {
  report: ReportDetail;
  onPrint: () => void;
  onRefetch: () => void;
}

export function ReportHeader({ report, onPrint, onRefetch }: ReportHeaderProps) {
  const isApproved = report.status === 'APPROVED' || report.status === 'FINAL';
  const isCompliant = report.check.result === 'COMPLIANT';

  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left column: Title & Badges */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
              {report.reportCode}
            </span>

            {isApproved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                ĐÃ PHÊ DUYỆT & KẸP CHÌ XUẤT CẢNG
              </span>
            ) : isCompliant ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                ĐỦ 4 KHÓA — SẴN SÀNG THÔNG QUAN
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                <ShieldAlert className="w-3.5 h-3.5" />
                CẦN BỔ SUNG CHỨNG TỪ (ĐIỂM NGHẼN)
              </span>
            )}

            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-surface-container-high text-on-surface-variant">
              Phiên bản v{report.version}.0
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
            {report.title}
          </h1>

          <p className="text-sm text-on-surface-variant leading-relaxed">
            {report.check.summary}
          </p>

          {/* Product & Origin Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40">
              <span className="text-[11px] font-medium text-on-surface-variant block">Sản phẩm xuất khẩu</span>
              <span className="text-xs font-bold text-on-surface truncate block">{report.check.productName}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40">
              <span className="text-[11px] font-medium text-on-surface-variant block">Mã HS / Thị trường</span>
              <span className="text-xs font-bold text-on-surface block font-mono">{report.check.hsCode} (GACC)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40">
              <span className="text-[11px] font-medium text-on-surface-variant block">Khối lượng Lô hàng</span>
              <span className="text-xs font-bold text-primary block">{report.check.quantity} {report.check.unit} (~{(report.check.quantity / 20).toFixed(1)} cont 40ft)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40">
              <span className="text-[11px] font-medium text-on-surface-variant block">Vùng trồng (PUC)</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate block font-mono">
                {report.blindSpots.pucPhc.pucCode}
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Actions & SHA-256 Seal */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onRefetch}
              className="p-2 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors text-on-surface-variant"
              title="Làm mới báo cáo"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onPrint}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow hover:bg-primary/90 transition-colors"
            >
              <Printer className="w-4 h-4" />
              In / Xuất PDF Hồ sơ Hải quan
            </button>
          </div>

          {/* Cryptographic SHA-256 Tamper-Proof Seal */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-1.5 w-full lg:max-w-[280px]">
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <KeyRound className="w-3 h-3" />
                Con dấu Số Bất biến
              </span>
              <span className="font-mono text-[10px] uppercase">{isApproved ? 'Đã Khóa' : 'Bản Thẩm Định'}</span>
            </div>
            <div className="p-1.5 rounded bg-surface-container-high font-mono text-[10px] text-on-surface truncate">
              {report.integrityHash || 'Chưa khóa sau phê duyệt'}
            </div>
            <div className="flex items-center justify-between text-[10px] text-on-surface-variant/80">
              <span className="flex items-center gap-1">
                <QrCode className="w-3 h-3" />
                Mã xác thực GACC
              </span>
              <span>{report.approvedAt ? new Date(report.approvedAt).toLocaleDateString('vi-VN') : 'Đang xử lý'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

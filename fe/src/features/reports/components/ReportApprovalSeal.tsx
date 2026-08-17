"use client";

import { useState } from 'react';
import { ReportDetail, ApproveReportPayload } from '../types';
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, FileCheck, X } from 'lucide-react';

interface ReportApprovalSealProps {
  report: ReportDetail;
  onApprove: (payload: ApproveReportPayload) => Promise<boolean>;
  approving: boolean;
}

export function ReportApprovalSeal({ report, onApprove, approving }: ReportApprovalSealProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sealNumber, setSealNumber] = useState('SEAL-GACC-' + Math.floor(100000 + Math.random() * 900000));
  const [exportPort, setExportPort] = useState('Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)');
  const [notes, setNotes] = useState(
    'Đã rà soát đủ 5 Điểm mù pháp lý: Cadmium ≤ 0.05 mg/kg, Mã PUC/PHC khớp CIFER, đủ 4 Khóa chứng từ sẵn sàng xuất cảng.'
  );

  const isApproved = report.status === 'APPROVED' || report.status === 'FINAL';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onApprove({
      containerSealNumber: sealNumber,
      exportPort,
      notes,
    });
    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isApproved ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
              {isApproved ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">
                {isApproved ? 'Con Dấu Số & Trách Nhiệm Pháp Lý Đã Khóa' : 'Ký Duyệt & Niêm Phong Hồ Sơ Xuất Cont'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {isApproved
                  ? 'Hồ sơ đã được phê duyệt chính thức bởi Chủ cơ sở / Quản trị xưởng và tạo bản snapshot bất biến.'
                  : 'Xác nhận toàn bộ kết quả kiểm định để kẹp chì cont và lưu trữ chuỗi hash chống làm giả.'}
              </p>
            </div>
          </div>

          {!isApproved && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors shrink-0"
            >
              <FileCheck className="w-4 h-4" />
              Phê Duyệt & Khóa Hồ Sơ
            </button>
          )}
        </div>

        {/* If approved, show the official digital sign-off certificate */}
        {isApproved && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="text-[11px] font-medium text-on-surface-variant block">Người ký phê duyệt</span>
              <span className="text-xs font-bold text-on-surface block truncate">
                {report.approverName || report.approverEmail || 'Quản trị viên xưởng'}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block font-mono">
                {report.approverRole || 'OWNER / QUẢN LÝ XUẤT KHẨU'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="text-[11px] font-medium text-on-surface-variant block">Thời điểm ký duyệt</span>
              <span className="text-xs font-bold text-on-surface block">
                {report.approvedAt ? new Date(report.approvedAt).toLocaleString('vi-VN') : 'Đang xử lý'}
              </span>
              <span className="text-[10px] text-on-surface-variant/80 block">Trạng thái: Bất biến (Locked)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="text-[11px] font-medium text-on-surface-variant block">Mã băm toàn vẹn (SHA-256)</span>
              <span className="text-xs font-mono font-bold text-primary block truncate">
                {report.integrityHash || 'N/A'}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Đã ghi Audit Trail
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal Dialog for Approval */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/80 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">
                    Phê Duyệt Hồ Sơ & Kẹp Chì Xuất Cảng
                  </h3>
                  <p className="text-xs text-on-surface-variant">Lô: {report.check.batchCode}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Số Kẹp Chì Container (Seal Number)
                </label>
                <input
                  type="text"
                  required
                  value={sealNumber}
                  onChange={(e) => setSealNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-xs font-mono font-bold text-on-surface focus:outline-hidden focus:border-primary"
                  placeholder="VD: SEAL-GACC-889922"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Cửa Khẩu Xuất Khẩu (Border Gate)
                </label>
                <input
                  type="text"
                  required
                  value={exportPort}
                  onChange={(e) => setExportPort(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-xs text-on-surface focus:outline-hidden focus:border-primary"
                  placeholder="VD: Cửa khẩu Quốc tế Hữu Nghị"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Ghi Chú Kiểm Soát Cuối Cùng
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-xs text-on-surface focus:outline-hidden focus:border-primary"
                />
              </div>

              {/* Immutable Warning Notice */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <b>Lưu ý pháp lý:</b> Sau khi bạn ký duyệt, báo cáo này sẽ được khóa bất biến và băm mã SHA-256 lưu vào Audit Log hệ thống. Trạng thái lô hàng sẽ chuyển sang <b>COMPLIANT</b>.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={approving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-colors disabled:opacity-50"
                >
                  {approving ? (
                    'Đang ký duyệt & tạo hash...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Xác Nhận & Kẹp Chì Cont
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

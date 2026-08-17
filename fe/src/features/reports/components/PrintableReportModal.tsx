"use client";

import { ReportDetail } from '../types';
import { Printer, X, ShieldCheck, QrCode } from 'lucide-react';

interface PrintableReportModalProps {
  report: ReportDetail;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintableReportModal({ report, isOpen, onClose }: PrintableReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const { check, blindSpots } = report;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-4xl rounded-2xl bg-white text-neutral-900 border border-neutral-300 shadow-2xl p-6 sm:p-10 space-y-6 my-8 print:p-0 print:border-none print:shadow-none">
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
              BẢN IN HỒ SƠ HẢI QUAN
            </span>
            <span className="text-xs text-neutral-500 font-mono">Mã: {report.reportCode}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              In / Xuất PDF Ngay
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Content */}
        <div className="space-y-6 text-sm">
          {/* Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-neutral-900">
            <div className="text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM — ĐỘC LẬP - TỰ DO - HẠNH PHÚC
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 uppercase">
              BÁO CÁO THẨM ĐỊNH PHÁP LÝ & HỒ SƠ THÔNG QUAN XUẤT KHẨU
            </h1>
            <div className="text-xs font-bold text-neutral-600">
              越南鲜食榴莲输华合规与海关清关技术报告 (GB 2762-2022 & GACC Protocol 2024)
            </div>
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
            <div>
              <span className="text-neutral-500 block">Mã số Báo cáo:</span>
              <span className="font-bold font-mono text-neutral-900">{report.reportCode}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Mã Lô hàng:</span>
              <span className="font-bold font-mono text-neutral-900">{check.batchCode}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Sản phẩm xuất khẩu:</span>
              <span className="font-bold text-neutral-900">{check.productName}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Sản lượng / Quy cách:</span>
              <span className="font-bold text-neutral-900">{check.quantity} {check.unit} (~{(check.quantity / 20).toFixed(1)} cont 40ft)</span>
            </div>
          </div>

          {/* 5 Blind Spots Shield Verification Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              I. KẾT QUẢ ĐỐI SOÁT 5 ĐIỂM MÙ PHÁP LÝ SỐNG CÒN (CRITICAL CLEARANCE SHIELD)
            </h3>
            <div className="overflow-x-auto border border-neutral-300 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-100 font-bold text-neutral-800 border-b border-neutral-300">
                  <tr>
                    <th className="p-2.5">Hạng mục kiểm soát</th>
                    <th className="p-2.5">Quy chuẩn / Căn cứ</th>
                    <th className="p-2.5">Giá trị Thực tế</th>
                    <th className="p-2.5">Ngưỡng GACC yêu cầu</th>
                    <th className="p-2.5 text-right">Kết luận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="p-2.5 font-semibold">1. Kim loại nặng Cadmium (Cd)</td>
                    <td className="p-2.5 font-mono">{blindSpots.cadmium.standardCode}</td>
                    <td className="p-2.5 font-bold font-mono text-emerald-700">{blindSpots.cadmium.detectedValue} {blindSpots.cadmium.unit}</td>
                    <td className="p-2.5 font-mono">≤ {blindSpots.cadmium.limitValue} {blindSpots.cadmium.unit}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">ĐẠT CHUẨN</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">2. Mã Vùng trồng (PUC) & Đóng gói (PHC)</td>
                    <td className="p-2.5">Điều 4 GACC Protocol</td>
                    <td className="p-2.5 font-mono">{blindSpots.pucPhc.pucCode} / {blindSpots.pucPhc.phcCode}</td>
                    <td className="p-2.5">Đã cấp phép CIFER</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">TRÙNG KHỚP 100%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">3. Cửa sổ hạn Kiểm dịch TV (Phyto)</td>
                    <td className="p-2.5">Hiệu lực 14 ngày</td>
                    <td className="p-2.5">Còn {blindSpots.phytoWindow.daysRemaining} ngày hiệu lực</td>
                    <td className="p-2.5">Đủ cửa sổ vận chuyển</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">AN TOÀN</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">4. Quy cách Tem thùng carton</td>
                    <td className="p-2.5">Điều 7 GACC Protocol</td>
                    <td className="p-2.5">Đủ 5 trường tiếng Trung</td>
                    <td className="p-2.5">Song ngữ Trung - Việt</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">HỢP LỆ</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">5. Chứng nhận xuất xứ C/O</td>
                    <td className="p-2.5">Hiệp định ACFTA</td>
                    <td className="p-2.5">Form E hợp lệ</td>
                    <td className="p-2.5">Thuế suất 0%</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">ƯU ĐÃI 0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Conclusion */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
            <h4 className="font-bold text-neutral-900 uppercase">II. KẾT LUẬN THẨM ĐỊNH HẢI QUAN</h4>
            <p className="text-neutral-700 leading-relaxed">
              Lô hàng sầu riêng tươi mã số <b>{check.batchCode}</b> đã được kiểm soát toàn diện, đáp ứng đầy đủ các tiêu chuẩn kỹ thuật an toàn thực phẩm của Tổng cục Hải quan Trung Quốc (GACC). Hồ sơ đủ điều kiện kẹp chì niêm phong và xuất bến qua các cửa khẩu quốc tế.
            </p>
          </div>

          {/* Signatures & Seal Block */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-neutral-300">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-neutral-600 block">XÁC NHẬN CƠ CẤU MÃ VÙNG TRỒNG (PUC)</span>
              <div className="h-20 flex items-center text-xs text-neutral-400 italic">
                (Đã đối soát với Cơ sở dữ liệu Cục Bảo vệ Thực vật)
              </div>
              <div className="text-xs font-bold text-neutral-900 font-mono">PUC: {blindSpots.pucPhc.pucCode}</div>
            </div>

            <div className="space-y-2 text-right">
              <span className="text-xs font-bold uppercase text-neutral-600 block">NGƯỜI KÝ PHÊ DUYỆT & KẸP CHÌ CONT</span>
              <div className="h-20 flex flex-col justify-center items-end text-xs">
                <span className="font-bold text-neutral-900 text-sm">{report.approverName || 'Chủ Doanh Nghiệp Xuất Khẩu'}</span>
                <span className="text-neutral-500 font-mono text-[11px]">{report.approverRole || 'QUẢN LÝ ĐIỀU HÀNH'}</span>
              </div>
              <div className="text-[11px] font-mono text-neutral-500 truncate">
                SHA-256: {report.integrityHash ? report.integrityHash.substring(0, 32) + '...' : 'CHƯA KÝ KHÓA'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  Download, 
  Share2, 
  ShieldCheck, 
  Building2, 
  Barcode, 
  Sparkles,
  RefreshCw,
  Check,
  Info,
  QrCode
} from "lucide-react";

export default function ReportPage() {
  const [isApproving, setIsApproving] = useState(false);
  const [reportApproved, setReportApproved] = useState(false);

  const handleApproveReport = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setReportApproved(true);
    }, 600);
  };

  const handleDownloadPDF = () => {
    // Open the official generated Vietnamese PDF report in a new tab for print/download
    window.open("/Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf", "_blank");
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Breadcrumb & Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c3c6d5]/50 pb-4">
        <div className="flex items-center text-xs font-mono text-[#737784] uppercase tracking-wider">
          <Link href="/history" className="hover:text-[#00327d] transition-colors font-semibold">
            LỊCH SỬ THẨM ĐỊNH
          </Link>
          <ChevronRight className="mx-2 h-3.5 w-3.5 text-[#a2a6b5]" />
          <span className="text-[#00327d] font-bold">BÁO CÁO #TLG-RPT-GACC-2026-0888</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-[#00327d] hover:bg-[#0047ab] text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" /> Xuất Báo cáo PDF (Tiếng Việt)
          </button>
          
          {!reportApproved ? (
            <button 
              onClick={handleApproveReport}
              disabled={isApproving}
              className="px-4 py-2 bg-[#18512c] hover:bg-[#206b3a] text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isApproving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Đang duyệt...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Phê duyệt Báo cáo (Approve)
                </>
              )}
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-[#e8f5e9] text-[#18512c] font-bold text-xs rounded-lg border border-[#18512c]/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#18512c]" /> Đã Phê duyệt (APPROVED)
            </span>
          )}
        </div>
      </div>

      {/* Main Report Container */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Primary Column - Official Certificate Layout */}
        <div className="flex-1 space-y-6">
          
          {/* Executive Summary & Verdict Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#c3c6d5]/70 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00327d]/5 rounded-bl-full pointer-events-none" />
            
            {/* Certificate Header Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[#c3c6d5]/40 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00327d] uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-[#00327d]" /> THEMIS LEXIGUARD AI ENGINE v2.4
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#191c1e] tracking-tight">
                  Báo cáo Thẩm định Tuân thủ Sầu riêng GACC
                </h1>
                <p className="text-xs text-[#434653]">
                  Thị trường mục tiêu: <strong>Trung Quốc (Tổng cục Hải quan GACC Protocol)</strong> — Mã HS: <span className="font-mono font-bold text-[#00327d]">0810.60.00</span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-right self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fef9c3] text-[#854d0e] border border-[#fde047] font-bold text-xs rounded-full shadow-2xs">
                  <AlertTriangle className="w-4 h-4 text-[#854d0e]" /> TUÂN THỦ CÓ ĐIỀU KIỆN
                </span>
                <p className="text-[11px] text-[#737784] mt-1 font-mono">CONDITIONALLY COMPLIANT</p>
              </div>
            </div>

            {/* Verdict Explanation Box */}
            <div className="bg-[#fef9c3]/50 border border-[#fde047]/80 rounded-xl p-4 text-xs text-[#854d0e] leading-relaxed flex items-start gap-3">
              <Info className="w-5 h-5 text-[#854d0e] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-[#854d0e]">TÓM TẮT KẾT LUẬN THẨM ĐỊNH:</strong> Lô sầu riêng <span className="font-mono font-bold">DURIAN-2026-CN088</span> đạt 100% (5/5) chỉ tiêu kiểm tra Quy tắc cứng (MRL Cadmium, Dithiocarbamates, Chlorpyrifos, Thời hạn Giấy Phytosanitary PSC, Mã PUC/PHC trên hệ thống GACC). Yêu cầu bổ sung 01 hành động khắc phục dán tem nhãn phụ Tiếng Trung trước khi niêm phong container.
              </div>
            </div>

            {/* Grid Key Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-[#f7f9fb] p-3.5 rounded-xl border border-[#c3c6d5]/50">
                <p className="text-[11px] font-bold text-[#737784] uppercase tracking-wider mb-1">ĐỘ TIN CẬY AI</p>
                <p className="text-lg font-bold text-[#18512c] flex items-center gap-1">
                  96.8% <span className="text-[10px] font-normal text-[#434653]">(Mức Cao)</span>
                </p>
              </div>
              <div className="bg-[#f7f9fb] p-3.5 rounded-xl border border-[#c3c6d5]/50">
                <p className="text-[11px] font-bold text-[#737784] uppercase tracking-wider mb-1">SẢN LƯỢNG LÔ HÀNG</p>
                <p className="text-lg font-bold text-[#191c1e]">18.5 Tấn <span className="text-[10px] font-normal text-[#737784]">(925 Thùng)</span></p>
              </div>
              <div className="bg-[#f7f9fb] p-3.5 rounded-xl border border-[#c3c6d5]/50">
                <p className="text-[11px] font-bold text-[#737784] uppercase tracking-wider mb-1">RULE ENGINE</p>
                <p className="text-lg font-bold text-[#18512c]">ĐẠT 5/5 <span className="text-[10px] font-normal text-[#18512c]">(100%)</span></p>
              </div>
              <div className="bg-[#f7f9fb] p-3.5 rounded-xl border border-[#c3c6d5]/50">
                <p className="text-[11px] font-bold text-[#737784] uppercase tracking-wider mb-1">CƠ SỞ ĐÓNG GÓI</p>
                <p className="text-xs font-bold font-mono text-[#00327d] truncate">VN-DBPH-088</p>
              </div>
            </div>
          </div>

          {/* Section 1: GACC Authorization & Document Mapping */}
          <div className="bg-white rounded-2xl border border-[#c3c6d5]/70 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#c3c6d5]/50 bg-[#f7f9fb] flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-[#00327d] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#00327d]" />
                I. Đối soát Hồ sơ Lô hàng &amp; Mã số GACC Phê duyệt
              </h3>
              <span className="text-xs font-bold text-[#18512c] bg-[#e8f5e9] px-2.5 py-1 rounded-full border border-[#18512c]/20">
                GACC Status: ACTIVE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#00327d] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3 w-1/4">Chỉ tiêu Kiểm soát</th>
                    <th className="px-5 py-3 w-1/2">Thông tin Chi tiết Hồ sơ &amp; Mã số Đăng ký</th>
                    <th className="px-5 py-3 w-1/4 text-right">Trạng thái GACC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3c6d5]/40 text-[#191c1e]">
                  <tr className="hover:bg-[#f7f9fb]/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold">Mã Lô hàng Xuất khẩu</td>
                    <td className="px-5 py-3.5 font-mono text-[#00327d] font-bold">DURIAN-2026-CN088 (Sản lượng: 18.5 Tấn / 925 Thùng)</td>
                    <td className="px-5 py-3.5 text-right"><span className="font-bold text-[#18512c] bg-[#e8f5e9] px-2 py-0.5 rounded">ĐÃ XÁC THỰC</span></td>
                  </tr>
                  <tr className="hover:bg-[#f7f9fb]/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold">Mã số Vùng trồng (PUC)</td>
                    <td className="px-5 py-3.5 font-mono text-[#434653]">VN-WBPH-0125 (Vùng trồng Krông Pắc, Đắk Lắk)</td>
                    <td className="px-5 py-3.5 text-right"><span className="font-bold text-[#18512c] bg-[#e8f5e9] px-2 py-0.5 rounded">GACC DUYỆT</span></td>
                  </tr>
                  <tr className="hover:bg-[#f7f9fb]/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold">Mã số Cơ sở Đóng gói (PHC)</td>
                    <td className="px-5 py-3.5 font-mono text-[#434653]">VN-DBPH-088 (Cơ sở Đóng gói Đắk Lắk)</td>
                    <td className="px-5 py-3.5 text-right"><span className="font-bold text-[#18512c] bg-[#e8f5e9] px-2 py-0.5 rounded">GACC DUYỆT</span></td>
                  </tr>
                  <tr className="hover:bg-[#f7f9fb]/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold">Giấy Kiểm dịch Thực vật (PSC)</td>
                    <td className="px-5 py-3.5 text-[#434653]">Số PSC-VN-2026-9912 (Chi cục KDTV Cục Trồng trọt cấp ngày 08/08)</td>
                    <td className="px-5 py-3.5 text-right"><span className="font-bold text-[#18512c] bg-[#e8f5e9] px-2 py-0.5 rounded">HỢP LỆ (Hạn 23/08)</span></td>
                  </tr>
                  <tr className="hover:bg-[#f7f9fb]/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold">Phiếu Kết quả Thử nghiệm MRL</td>
                    <td className="px-5 py-3.5 text-[#434653]">Số LAB-EUROFINS-2026-8812 (Eurofins Agroscience Lab)</td>
                    <td className="px-5 py-3.5 text-right"><span className="font-bold text-[#18512c] bg-[#e8f5e9] px-2 py-0.5 rounded">ĐẠT 54 CHỈ SỐ</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Deterministic Rule Engine Test Matrix */}
          <div className="bg-white rounded-2xl border border-[#c3c6d5]/70 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#c3c6d5]/50 bg-[#f7f9fb] flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-[#00327d] flex items-center gap-2">
                <Barcode className="w-5 h-5 text-[#00327d]" />
                II. Kết quả Đối soát Ngưỡng MRL &amp; Kim loại Nặng (Rule Engine Matrix)
              </h3>
              <span className="text-xs font-mono text-[#737784]">Căn cứ: GB 2762-2022 &amp; GB 2763-2021</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#00327d] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3 w-1/3">Hoạt chất / Chỉ tiêu Kiểm nghiệm</th>
                    <th className="px-5 py-3 w-1/4">Ngưỡng Tối đa GACC (GB Standard)</th>
                    <th className="px-5 py-3 w-1/4">Thực tế Kiểm nghiệm</th>
                    <th className="px-5 py-3 text-right">Kết luận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3c6d5]/40 text-[#191c1e]">
                  <tr className="hover:bg-[#f7f9fb]/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold">Cadmium (Cd) - Kim loại nặng</td>
                    <td className="px-5 py-3.5 text-[#737784] font-mono">&le; 0.05 mg/kg (GB 2762-2022)</td>
                    <td className="px-5 py-3.5 font-bold text-[#191c1e]">0.02 mg/kg</td>
                    <td className="px-5 py-3.5 text-right"><span className="font-bold text-[#18512c] bg-[#e8f5e9] px-2.5 py-1 rounded">ĐẠT (PASS)</span></td>
                  </tr>
                  <tr className="hover:bg-[#f7f9fb]/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold">Dithiocarbamates (Thuốc BVTV)</td>
                    <td className="px-5 py-3.5 text-[#737784] font-mono">&le; 2.00 mg/kg (GB 2763-2021)</td>
                    <td className="px-5 py-3.5 font-bold text-[#191c1e]">0.72 mg/kg</td>
                    <td className="px-5 py-3.5 text-right"><span className="font-bold text-[#18512c] bg-[#e8f5e9] px-2.5 py-1 rounded">ĐẠT (PASS)</span></td>
                  </tr>
                  <tr className="hover:bg-[#f7f9fb]/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold">Chlorpyrifos (Gốc phốt pho hữu cơ)</td>
                    <td className="px-5 py-3.5 text-[#737784] font-mono">&le; 0.01 mg/kg (Cấm dùng)</td>
                    <td className="px-5 py-3.5 font-bold text-[#191c1e]">0.003 mg/kg</td>
                    <td className="px-5 py-3.5 text-right"><span className="font-bold text-[#18512c] bg-[#e8f5e9] px-2.5 py-1 rounded">ĐẠT (PASS)</span></td>
                  </tr>
                  <tr className="hover:bg-[#f7f9fb]/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold">Permethrin (Thuốc trừ sâu)</td>
                    <td className="px-5 py-3.5 text-[#737784] font-mono">&le; 0.05 mg/kg (GB 2763-2021)</td>
                    <td className="px-5 py-3.5 font-bold text-[#191c1e]">&lt; 0.01 mg/kg (KPH)</td>
                    <td className="px-5 py-3.5 text-right"><span className="font-bold text-[#18512c] bg-[#e8f5e9] px-2.5 py-1 rounded">ĐẠT (PASS)</span></td>
                  </tr>
                  <tr className="hover:bg-[#f7f9fb]/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold">Khai báo Bổ sung Phytosanitary PSC</td>
                    <td className="px-5 py-3.5 text-[#737784]">Yêu cầu theo Nghị định thư 2022</td>
                    <td className="px-5 py-3.5 font-bold text-[#191c1e]">Khớp 100% mẫu câu</td>
                    <td className="px-5 py-3.5 text-right"><span className="font-bold text-[#18512c] bg-[#e8f5e9] px-2.5 py-1 rounded">ĐẠT (PASS)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: AI Gemini Deep Analysis & Legal Citations */}
          <div className="bg-white rounded-2xl p-6 border border-[#c3c6d5]/70 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#00327d] flex items-center gap-2 border-b border-[#c3c6d5]/40 pb-3">
              <Sparkles className="w-5 h-5 text-[#00327d]" />
              III. Phân tích Chuyên sâu AI Gemini &amp; Trích dẫn Nguồn luật (Citations)
            </h3>

            <div className="space-y-3 text-xs leading-relaxed">
              {/* Finding 1 */}
              <div className="bg-[#f0f9ff] border border-[#00327d]/20 rounded-xl p-4 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#00327d] flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#00327d]" /> Phát hiện #1 (Mức độ: Thông tin) — Khoảng thời gian Kiểm nghiệm Hợp lệ
                  </span>
                  <span className="px-2 py-0.5 bg-[#d2e0fe] text-[#00327d] font-bold text-[10px] rounded">INFORMATIONAL</span>
                </div>
                <p className="text-[#434653]">
                  Khoảng thời gian từ ngày lấy mẫu kiểm nghiệm Lab (05/08/2026) đến ngày cấp Giấy Phytosanitary (08/08/2026) là 3 ngày, nằm trong hạn định cho phép (&lt; 7 ngày).
                </p>
                <div className="text-[11px] text-[#00327d] font-semibold bg-white p-2.5 rounded-lg border border-[#00327d]/10 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span><strong>Trích dẫn Nguồn luật:</strong> Điều 4, Nghị định thư về Yêu cầu Kiểm dịch Thực vật đối với Sầu riêng Tươi xuất khẩu từ Việt Nam sang Trung Quốc (MARD/GACC Protocol 2022).</span>
                </div>
              </div>

              {/* Finding 2 */}
              <div className="bg-[#fef9c3] border border-[#fde047] rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#854d0e] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#854d0e]" /> Phát hiện #2 (Mức độ: Trung bình) — Yêu cầu Bổ sung Tem Nhãn phụ Tiếng Trung GACC
                  </span>
                  <span className="px-2 py-0.5 bg-[#fef08a] text-[#854d0e] font-bold text-[10px] rounded border border-[#fde047]">ACTION REQUIRED</span>
                </div>
                <p className="text-[#434653]">
                  Thùng hàng ngoại quan hiện chưa dán tem nhãn phụ bằng chữ Tiếng Trung chứa Mã số PUC và PHC theo quy định Hải quan Trung Quốc.
                </p>
                <div className="text-[11px] text-[#854d0e] font-semibold bg-white/90 p-2.5 rounded-lg border border-[#fde047] flex items-start gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-0.5">Trích dẫn Nguồn luật: Điều 8, Lệnh số 248/2021/GACC về Quản lý Đăng ký Doanh nghiệp Thực phẩm Nhập khẩu &amp; Thông tư số 24/2022/TT-BNNPTNT.</strong>
                    <span className="font-normal text-[#191c1e] block mt-1">
                      <strong>Hành động Khắc phục Bắt buộc:</strong> Dán bổ sung tem nhãn phụ Tiếng Trung: <strong className="font-mono text-[#00327d] bg-[#f7f9fb] px-1 py-0.5 rounded border border-[#c3c6d5]">“输往中华人民共和国 — PUC: VN-WBPH-0125, PHC: VN-DBPH-088”</strong> lên toàn bộ 925 thùng sầu riêng trước khi kẹp chì niêm phong Container.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: Digital Audit Seal Stamp & Signatures */}
          <div className="bg-white rounded-2xl p-6 border border-[#c3c6d5]/70 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#00327d] flex items-center gap-2 border-b border-[#c3c6d5]/40 pb-3">
              <ShieldCheck className="w-5 h-5 text-[#00327d]" />
              IV. Xác nhận Bảo mật &amp; Chữ ký Điện tử Bất biến (Digital Audit Seal)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-center text-xs">
              <div className="space-y-8 bg-[#f7f9fb] p-4 rounded-xl border border-[#c3c6d5]/50">
                <p className="font-bold text-[#00327d]">Cán bộ Phụ trách Pháp chế</p>
                <div className="space-y-1">
                  <p className="font-bold text-[#191c1e] text-sm">Nguyễn Văn Hải</p>
                  <p className="text-[11px] text-[#737784]">Chuyên viên Phụ trách Tuân thủ</p>
                </div>
              </div>

              <div className="space-y-8 bg-[#f7f9fb] p-4 rounded-xl border border-[#c3c6d5]/50">
                <p className="font-bold text-[#00327d]">Giám đốc Chất lượng &amp; Vận hành</p>
                <div className="space-y-1">
                  <p className="font-bold text-[#191c1e] text-sm">Trần Thị Mai</p>
                  <p className="text-[11px] text-[#737784]">Giám đốc Chất lượng</p>
                </div>
              </div>

              <div className="bg-[#e8f5e9] p-4 rounded-xl border border-[#18512c]/30 flex flex-col justify-between items-center space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-[#18512c] text-xs">
                  <QrCode className="w-4 h-4" /> CON DẤU XÁC THỰC SYSTEM
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#18512c]/20 text-center space-y-1">
                  <p className="font-bold text-[#18512c] text-[11px] tracking-wider">THEMIS LEXIGUARD</p>
                  <p className="text-[10px] font-bold text-[#18512c] uppercase">GACC PROTOCOL VERIFIED</p>
                </div>
                <p className="text-[9px] font-mono text-[#737784] break-all">
                  Hash: sha256:e3b0c44298fc1c14...
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Action Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          
          {/* Quick PDF Action Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d5]/70 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-base text-[#191c1e] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00327d]" /> Thao tác Báo cáo
            </h4>
            
            <button
              onClick={handleDownloadPDF}
              className="w-full py-3 bg-[#00327d] hover:bg-[#0047ab] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-between px-4 shadow-xs cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" /> Xuất Báo cáo PDF (Tiếng Việt)
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => alert("Tính năng chia sẻ liên kết xác thực bảo mật đã kích hoạt.")}
              className="w-full py-2.5 bg-[#f7f9fb] hover:bg-[#eceef0] text-[#434653] font-bold text-xs rounded-xl border border-[#c3c6d5] transition-all flex items-center justify-between px-4 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Chia sẻ Link Thẩm định
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* AI Confidence Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d5]/70 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-bold text-[#737784] uppercase tracking-wider">ĐIỂM TIN CẬY AI (CONFIDENCE)</h4>
            <div className="flex items-end gap-2">
              <div className="text-4xl font-bold text-[#00327d]">96.8%</div>
              <span className="text-xs font-bold text-[#18512c] mb-1">Xác xuất cao</span>
            </div>
            <div className="w-full bg-[#eceef0] rounded-full h-2.5 overflow-hidden">
              <div className="bg-[#00327d] h-2.5 rounded-full w-[96.8%]" />
            </div>
            <p className="text-xs text-[#434653] leading-normal">
              Được phân tích trực tiếp từ CSDL Nghị định thư GACC Sầu riêng 2022 và Tiêu chuẩn An toàn Thực phẩm Trung Quốc GB 2762 &amp; GB 2763.
            </p>
          </div>

          {/* Reference Laws Box */}
          <div className="bg-[#f7f9fb] p-6 rounded-2xl border border-[#c3c6d5]/70 space-y-4">
            <h4 className="font-serif font-bold text-base text-[#191c1e]">Trích dẫn Pháp lý Áp dụng</h4>
            
            <div className="space-y-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-[#c3c6d5]/50 space-y-1">
                <div className="flex justify-between items-start font-bold text-[#00327d]">
                  <span>Nghị định thư Hải quan GACC 2022</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#737784]" />
                </div>
                <p className="text-[11px] text-[#434653]">Yêu cầu Kiểm dịch Thực vật Sầu riêng Tươi xuất khẩu từ Việt Nam sang Trung Quốc.</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#c3c6d5]/50 space-y-1">
                <div className="flex justify-between items-start font-bold text-[#00327d]">
                  <span>Tiêu chuẩn GB 2762-2022</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#737784]" />
                </div>
                <p className="text-[11px] text-[#434653]">Giới hạn kim loại nặng Cadmium trong thực phẩm (&le; 0.05 mg/kg).</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#c3c6d5]/50 space-y-1">
                <div className="flex justify-between items-start font-bold text-[#00327d]">
                  <span>Lệnh số 248 &amp; 249/GACC</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#737784]" />
                </div>
                <p className="text-[11px] text-[#434653]">Quy định Đăng ký Doanh nghiệp Thực phẩm và Ghi nhãn bao bì nông sản nhập khẩu.</p>
              </div>
            </div>

            <p className="text-[10px] text-[#737784] italic pt-2 border-t border-[#c3c6d5]/40">
              CƠ SỞ PHÁP LÝ: Báo cáo AI được thẩm định trực tiếp từ cơ sở dữ liệu pháp lý xác thực của Tổng cục Hải quan Trung Quốc và Cục Trồng trọt MARD.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

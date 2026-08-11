"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [selectedProductFilter, setSelectedProductFilter] = useState("all");

  const handleDownloadPDF = () => {
    window.open("/Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf", "_blank");
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#131b2e] pb-12">
      {/* Top Header / Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c5c5d3]/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00236f] uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-base text-[#00236f]">shield_lock</span>
            THEMIS LEXIGUARD — GACC COMPLIANCE COMMAND CENTER
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#131b2e]">
            👋 Chào mừng, Phạm Thành Long
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#444651] mt-1 font-mono">
            <span className="font-bold text-[#00236f]">Công ty CP XNK Nông Sản Tây Nguyên</span>
            <span className="text-[#757682]">|</span>
            <span className="bg-[#e2e7ff] text-[#00236f] px-2 py-0.5 rounded font-bold">PUC: VN-WBPH-0125 / PHC: VN-DBPH-088</span>
            <span className="text-[#757682]">|</span>
            <span className="text-[#15803d] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></span> GACC Active Enterprise
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/checks/new">
            <button className="px-4 py-2.5 bg-[#00236f] hover:bg-[#1e3a8a] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-sm">add_task</span> Khởi tạo Phiên Quét GACC Mới
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-xl border border-[#c5c5d3]/60 shadow-2xs text-xs">
        <span className="font-bold text-[#444651] uppercase tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-[#00236f]">filter_list</span> Bộ lọc nhanh:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setSelectedProductFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedProductFilter === 'all' 
                ? 'bg-[#00236f] text-white shadow-2xs' 
                : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] border border-[#c5c5d3]'
            }`}
          >
            Tất cả sản phẩm (Sầu riêng)
          </button>
          <button 
            onClick={() => setSelectedProductFilter("ri6")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedProductFilter === 'ri6' 
                ? 'bg-[#00236f] text-white shadow-2xs' 
                : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] border border-[#c5c5d3]'
            }`}
          >
            Sầu riêng Tươi Ri6 (0810.60.00)
          </button>
          <button 
            onClick={() => setSelectedProductFilter("dona")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedProductFilter === 'dona' 
                ? 'bg-[#00236f] text-white shadow-2xs' 
                : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] border border-[#c5c5d3]'
            }`}
          >
            Sầu riêng Tươi Dona (Monthong)
          </button>
          <button 
            onClick={() => setSelectedProductFilter("frozen")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedProductFilter === 'frozen' 
                ? 'bg-[#00236f] text-white shadow-2xs' 
                : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] border border-[#c5c5d3]'
            }`}
          >
            Sầu riêng Cấp đông (0811.90.00)
          </button>
        </div>

        <div className="h-4 w-px bg-[#c5c5d3] mx-1 hidden sm:block" />

        <span className="px-3 py-1.5 bg-[#f2f3ff] text-[#00236f] font-bold rounded-full border border-[#c5c5d3] flex items-center gap-1">
          Thị trường: Trung Quốc (GACC Protocol)
        </span>
      </div>

      {/* Grid KPI & Smart Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Card 1: Market Risk Map */}
        <div className="bg-white border border-[#c5c5d3]/60 p-5 rounded-2xl flex flex-col justify-between shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#c5c5d3]/40 pb-3">
            <h4 className="font-serif font-bold text-base text-[#131b2e]">Bản đồ rủi ro thị trường</h4>
            <Link href="/regulations" className="text-xs font-bold text-[#00236f] hover:underline">Chi tiết</Link>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative py-2">
            <svg className="w-full h-24 text-[#e2e7ff]" viewBox="0 0 800 400" fill="currentColor">
              <path d="M150,100 C180,80 220,90 250,120 C280,150 260,200 230,250 C200,300 150,350 100,300 C50,250 80,150 120,130 Z" opacity="0.3" />
              <path d="M400,50 C450,40 500,60 550,100 C600,140 580,200 530,220 C480,240 420,200 380,150 C340,100 360,60 400,50 Z" opacity="0.3" />
              <path d="M650,150 C680,140 720,160 750,200 C780,240 760,280 720,300 C680,320 620,280 600,240 C580,200 620,160 650,150 Z" opacity="0.3" />
              <circle cx="620" cy="160" fill="#15803d" r="16" className="animate-pulse" />
              <circle cx="450" cy="120" fill="#ba1a1a" r="10" />
              <circle cx="180" cy="150" fill="#b45309" r="8" />
            </svg>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between p-1.5 bg-[#e8f5e9] rounded-lg border border-[#15803d]/20">
              <span className="font-bold text-[#15803d] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#15803d]"></span> An toàn (Trung Quốc GACC)
              </span>
              <span className="font-bold text-[#15803d]">96.8%</span>
            </div>
            <div className="flex items-center justify-between p-1.5 bg-[#fef9c3] rounded-lg border border-[#b45309]/20">
              <span className="font-bold text-[#b45309] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#b45309]"></span> Cảnh báo (MRL Cadmium)
              </span>
              <span className="font-bold text-[#b45309]">2 Lô</span>
            </div>
          </div>
        </div>

        {/* Stat Card 2: Compliance Rate */}
        <div className="bg-white border border-[#c5c5d3]/60 p-5 rounded-2xl flex flex-col justify-between shadow-2xs space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-[#757682] uppercase tracking-widest mb-1">TỶ LỆ ĐẠT CHUẨN GACC</p>
              <h3 className="text-3xl font-bold text-[#15803d] font-serif flex items-end gap-2">
                97.2%
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e8f5e9] flex items-center justify-center text-[#15803d]">
              <span className="material-symbols-outlined">verified</span>
            </div>
          </div>

          <div className="w-full bg-[#eaedff] rounded-full h-2 overflow-hidden">
            <div className="bg-[#15803d] h-2 rounded-full w-[97.2%]" />
          </div>

          <div className="flex items-center justify-between text-xs text-[#444651]">
            <span>Thời gian xử lý AI TB:</span>
            <span className="font-bold font-mono text-[#00236f]">2.4 phút/lô</span>
          </div>
        </div>

        {/* Smart Alerts Panel (Takes 2 columns) */}
        <div className="col-span-1 md:col-span-2 bg-[#ffdad6]/40 border border-[#ba1a1a]/30 p-5 rounded-2xl flex flex-col justify-between shadow-2xs space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-[#ba1a1a]/20 pb-2.5">
            <h3 className="font-serif text-base font-bold text-[#93000a] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#93000a]">notifications_active</span> Smart Alerts Panel GACC
            </h3>
            <span className="px-2.5 py-0.5 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full">3 Cảnh báo Ưu tiên</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-white/90 p-2.5 rounded-xl border border-[#ba1a1a]/20 gap-3">
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-[#131b2e]">Cảnh báo dán tem nhãn phụ Tiếng Trung (Lệnh 248)</p>
                  <p className="text-[11px] text-[#444651]">Lô #DURIAN-2026-CN088 cần in mã PUC VN-WBPH-0125 &amp; PHC VN-DBPH-088 lên 925 thùng.</p>
                </div>
              </div>
              <Link href="/reports/1">
                <button className="px-3 py-1 bg-[#ba1a1a] hover:bg-[#93000a] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0">
                  Xử lý ngay
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-between bg-white/90 p-2.5 rounded-xl border border-[#b45309]/20 gap-3">
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b45309] shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-[#131b2e]">Rà soát thời hạn Giấy Phytosanitary PSC</p>
                  <p className="text-[11px] text-[#444651]">Giấy PSC-VN-2026-9912 còn hiệu lực 5 ngày đến 23/08/2026.</p>
                </div>
              </div>
              <Link href="/reports/1">
                <button className="px-3 py-1 bg-[#b45309] hover:bg-[#854d0e] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0">
                  Kiểm tra
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Main Table: Recent Compliance Checks */}
      <div className="bg-white rounded-2xl border border-[#c5c5d3]/60 overflow-hidden shadow-2xs space-y-0">
        <div className="p-5 border-b border-[#c5c5d3]/50 bg-[#f2f3ff] flex justify-between items-center">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#00236f]">Kiểm tra tuân thủ Lô Sầu Riêng gần đây</h3>
            <p className="text-xs text-[#757682]">Đối soát 100% Nghị định thư GACC Trung Quốc, Cadmium &amp; Tem nhãn phụ</p>
          </div>
          <Link href="/reports/1" className="text-xs font-bold text-[#00236f] hover:underline flex items-center gap-1">
            Xem tất cả phiên <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#00236f] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">MÃ LÔ HÀNG &amp; SẢN PHẨM</th>
                <th className="px-5 py-3.5">THỊ TRƯỜNG &amp; MÃ GACC</th>
                <th className="px-5 py-3.5 w-1/3">TIẾN ĐỘ THẨM ĐỊNH AI STEPPER</th>
                <th className="px-5 py-3.5">TRẠNG THÁI</th>
                <th className="px-5 py-3.5 text-right">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c5c5d3]/40 text-[#131b2e]">
              
              {/* Row 1 */}
              <tr className="hover:bg-[#f2f3ff]/70 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-bold text-[#00236f] font-mono">DURIAN-2026-CN088</p>
                  <p className="text-xs text-[#444651]">Sầu riêng Tươi Ri6 (Loại 1 - 18.5 Tấn)</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-bold text-[#131b2e]">Trung Quốc (GACC Protocol)</p>
                  <p className="text-[11px] text-[#757682] font-mono">PUC: VN-WBPH-0125 | PHC: VN-DBPH-088</p>
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#15803d]">
                      <span>1. OCR Chứng từ</span>
                      <span>2. Rule Engine MRL</span>
                      <span>3. Gemini AI Approved</span>
                    </div>
                    <div className="w-full bg-[#eaedff] rounded-full h-2 overflow-hidden flex">
                      <div className="bg-[#15803d] h-2 w-full" />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 bg-[#fef9c3] text-[#854d0e] font-bold text-[10px] rounded-full border border-[#fde047]">
                    TUÂN THỦ CÓ ĐIỀU KIỆN
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href="/reports/1">
                    <button className="px-3 py-1.5 bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">
                      Xem Báo cáo PDF
                    </button>
                  </Link>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-[#f2f3ff]/70 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-bold text-[#00236f] font-mono">DURIAN-2026-CN092</p>
                  <p className="text-xs text-[#444651]">Sầu riêng Tươi Dona Monthong (22 Tấn)</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-bold text-[#131b2e]">Trung Quốc (GACC Protocol)</p>
                  <p className="text-[11px] text-[#757682] font-mono">PUC: VN-WBPH-0128 | PHC: VN-DBPH-088</p>
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#15803d]">
                      <span>1. OCR Chứng từ</span>
                      <span>2. Rule Engine MRL</span>
                      <span>3. Gemini AI Approved</span>
                    </div>
                    <div className="w-full bg-[#eaedff] rounded-full h-2 overflow-hidden flex">
                      <div className="bg-[#15803d] h-2 w-full" />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 bg-[#e8f5e9] text-[#15803d] font-bold text-[10px] rounded-full border border-[#15803d]/30">
                    SẴN SÀNG XUẤT KHẨU
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href="/reports/1">
                    <button className="px-3 py-1.5 bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">
                      Xem Báo cáo PDF
                    </button>
                  </Link>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-[#f2f3ff]/70 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-bold text-[#00236f] font-mono">DURIAN-2026-CN104</p>
                  <p className="text-xs text-[#444651]">Sầu riêng Cấp đông Nguyên quả (15 Tấn)</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-bold text-[#131b2e]">Trung Quốc (GACC Protocol 2024)</p>
                  <p className="text-[11px] text-[#757682] font-mono">Mã HS: 0811.90.00</p>
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#ba1a1a]">
                      <span>1. OCR Chứng từ</span>
                      <span className="font-bold">2. Cadmium Warning</span>
                      <span className="text-[#757682]">3. Pending</span>
                    </div>
                    <div className="w-full bg-[#eaedff] rounded-full h-2 overflow-hidden flex">
                      <div className="bg-[#ba1a1a] h-2 w-[65%]" />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 bg-[#ffdad6] text-[#93000a] font-bold text-[10px] rounded-full border border-[#ba1a1a]/30">
                    CẦN RÀ SOÁT MRL CADMIUM
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href="/reports/1">
                    <button className="px-3 py-1.5 bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">
                      Xem Báo cáo PDF
                    </button>
                  </Link>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Grid News & Policy Updates & Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Regulations & AI Policy Updates */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#c5c5d3]/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c5c5d3]/40 pb-3">
            <h3 className="font-serif text-lg font-bold text-[#00236f] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00236f]">gavel</span> Cập nhật Quy định Hải quan GACC mới nhất
            </h3>
            <span className="text-xs font-bold text-[#15803d] bg-[#e8f5e9] px-2.5 py-0.5 rounded-full">AI Sync 100%</span>
          </div>

          {/* Pinned Policy */}
          <div className="p-4 bg-[#f2f3ff] border border-[#00236f]/20 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00236f] uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm text-[#00236f]">push_pin</span> QUY ĐỊNH TRỌNG ĐIỂM (PINNED)
            </div>
            <h4 className="font-bold text-sm text-[#131b2e]">Lệnh số 248 &amp; 249/GACC về Đăng ký Doanh nghiệp &amp; Tem nhãn bao bì</h4>
            <p className="text-xs text-[#444651]">
              Yêu cầu bắt buộc in bổ sung dòng chữ tiếng Trung <strong className="font-mono text-[#00236f]">“输往中华人民共和国”</strong> cùng mã số PUC và PHC trên 100% thùng sầu riêng.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#c5c5d3]/50 flex items-start justify-between gap-3">
              <div>
                <span className="px-2 py-0.5 bg-[#00236f] text-white font-bold text-[9px] rounded uppercase">Nghị định thư 2022</span>
                <p className="font-bold text-[#131b2e] mt-1">Yêu cầu Kiểm dịch Thực vật 05 loài sinh vật gây hại (Rệp sáp &amp; Ruồi đục quả)</p>
                <p className="text-[11px] text-[#444651] mt-0.5">Yêu cầu kiểm tra xử lý sục khí nén / xịt rửa áp lực cao tại cơ sở đóng gói trước khi niêm phong.</p>
              </div>
              <span className="text-[10px] font-bold text-[#15803d] bg-[#e8f5e9] px-2 py-0.5 rounded shrink-0">Confidence: 99%</span>
            </div>

            <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#c5c5d3]/50 flex items-start justify-between gap-3">
              <div>
                <span className="px-2 py-0.5 bg-[#b45309] text-white font-bold text-[9px] rounded uppercase">GB 2762-2022</span>
                <p className="font-bold text-[#131b2e] mt-1">Tăng tần suất lấy mẫu kiểm nghiệm chỉ tiêu Kim loại nặng Cadmium tại cửa khẩu</p>
                <p className="text-[11px] text-[#444651] mt-0.5">Hải quan Trung Quốc tăng tỷ lệ kiểm tra ngẫu nhiên Cadmium lên 30% đối với các lô sầu riêng tươi.</p>
              </div>
              <span className="text-[10px] font-bold text-[#15803d] bg-[#e8f5e9] px-2 py-0.5 rounded shrink-0">Confidence: 96%</span>
            </div>
          </div>
        </div>

        {/* Right Column: PDF Download Center */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#c5c5d3]/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c5c5d3]/40 pb-3">
            <h3 className="font-serif text-lg font-bold text-[#131b2e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00236f]">picture_as_pdf</span> Tải Báo cáo PDF Thẩm định
            </h3>
            <span className="text-xs font-mono text-[#757682]">Vietnamese Official PDF</span>
          </div>

          <div className="space-y-3 text-xs">
            <div 
              onClick={handleDownloadPDF}
              className="p-3.5 bg-[#f2f3ff] hover:bg-[#e2e7ff] rounded-xl border border-[#00236f]/30 flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 truncate">
                <span className="material-symbols-outlined text-2xl text-[#00236f]">description</span>
                <div className="truncate">
                  <p className="font-bold text-[#131b2e] truncate group-hover:text-[#00236f]">Bao_Cao_Tham_Dinh_GACC_Sau_Rieng.pdf</p>
                  <p className="text-[10px] font-mono text-[#757682]">100% Tiếng Việt • 6 Mục đối soát GACC</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-[#00236f] text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">download</span> Tải xuống
              </button>
            </div>

            <div 
              onClick={handleDownloadPDF}
              className="p-3.5 bg-[#f2f3ff] hover:bg-[#e2e7ff] rounded-xl border border-[#00236f]/30 flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 truncate">
                <span className="material-symbols-outlined text-2xl text-[#00236f]">picture_as_pdf</span>
                <div className="truncate">
                  <p className="font-bold text-[#131b2e] truncate group-hover:text-[#00236f]">Nghi_Dinh_Thu_GACC_Sau_Rieng_2022.pdf</p>
                  <p className="text-[10px] font-mono text-[#757682]">Văn bản quy định gốc MARD &amp; GACC</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-[#00236f] text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">download</span> Tải xuống
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

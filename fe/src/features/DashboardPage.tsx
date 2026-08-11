"use client";

import Link from 'next/link';
import LegalTrackingWidget from '@/components/LegalTrackingWidget';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#00327d] uppercase tracking-widest mb-1">
          <span className="material-symbols-outlined text-sm">auto_awesome</span> HỆ THỐNG GIÁM SÁT TUÂN THỦ HẢI QUAN TRUNG QUỐC (GACC)
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#191c1e] mb-2">Tổng quan Tuân thủ Sầu riêng GACC</h2>
        <p className="text-[#434653] text-sm font-sans">Theo dõi chỉ số tuân thủ MRL Cadmium, đối soát mã PUC/PHC và cảnh báo rủi ro Hải quan Trung Quốc (Mã HS: 0810.60.00 / 0811.90.00).</p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#00327d]/5 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#0047ab]/20 rounded-lg text-[#00327d]">
              <span className="material-symbols-outlined fill">fact_check</span>
            </div>
            <h3 className="font-semibold text-sm text-[#434653]">Tổng Lô kiểm tra GACC</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-4xl font-bold text-[#191c1e]">128</span>
            <span className="text-emerald-700 font-semibold text-sm flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-sm">trending_up</span> 18% tháng này
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#205833]/20 rounded-lg text-[#01401e]">
              <span className="material-symbols-outlined fill">verified</span>
            </div>
            <h3 className="font-semibold text-sm text-[#434653]">Sẵn sàng Xuất khẩu</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-4xl font-bold text-[#18512c]">97</span>
            <span className="text-[#434653] text-sm mb-2">/ 75.8% Đạt GACC</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border-l-4 border-l-[#854d0e] border-y border-r border-[#c3c6d5]/60 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#fef9c3] text-[#854d0e] rounded-lg border border-[#fde047]">
              <span className="material-symbols-outlined fill">warning</span>
            </div>
            <h3 className="font-semibold text-sm text-[#854d0e]">Cần Khắc phục Tem nhãn</h3>
          </div>
          <div className="flex items-end gap-3 justify-between">
            <span className="font-serif text-4xl font-bold text-[#854d0e]">22</span>
            <Link href="/reports/1" className="text-[#434653] text-xs mb-2 hover:text-[#00327d] transition-colors flex items-center gap-1 font-bold">
              Xem báo cáo <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#ffdad6] text-[#93000a] rounded-lg">
              <span className="material-symbols-outlined fill">schedule</span>
            </div>
            <h3 className="font-semibold text-sm text-[#93000a]">Vi phạm Ngưỡng Cadmium</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-4xl font-bold text-[#93000a]">09</span>
            <span className="text-[#434653] text-xs mb-2">Yêu cầu xử lý nguồn nguồn</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 h-[380px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#191c1e]">Phân tích Tỷ lệ Đạt Tiêu chuẩn GACC Sầu riêng</h3>
                <p className="text-xs text-[#737784]">Tỷ lệ kiểm tra MRL Cadmium &amp; Kiểm dịch Phytosanitary thành công 6 tháng gần nhất</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-[#00327d] text-white rounded-full shadow-sm font-semibold">Trung Quốc (GACC Protocol)</button>
              </div>
            </div>
            <div className="flex-1 bg-[#f2f4f6] rounded-lg border border-[#c3c6d5]/50 flex flex-col items-center justify-center relative overflow-hidden p-6">
              {/* Data Graphic Visualization */}
              <div className="w-full flex justify-between items-end h-40 gap-4 px-4 border-b border-[#c3c6d5]/40 pb-2">
                <div className="flex-1 bg-[#00327d]/40 rounded-t h-[75%] relative group hover:bg-[#00327d] transition-all">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#00327d]">75%</div>
                </div>
                <div className="flex-1 bg-[#00327d]/60 rounded-t h-[82%] relative group hover:bg-[#00327d] transition-all">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#00327d]">82%</div>
                </div>
                <div className="flex-1 bg-[#01401e]/70 rounded-t h-[91%] relative group hover:bg-[#01401e] transition-all">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#01401e]">91%</div>
                </div>
                <div className="flex-1 bg-[#854d0e]/60 rounded-t h-[68%] relative group hover:bg-[#854d0e] transition-all">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#854d0e]">68%</div>
                </div>
                <div className="flex-1 bg-[#00327d]/80 rounded-t h-[88%] relative group hover:bg-[#00327d] transition-all">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#00327d]">88%</div>
                </div>
                <div className="flex-1 bg-[#01401e]/90 rounded-t h-[96%] relative group hover:bg-[#01401e] transition-all">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#01401e]">96.8%</div>
                </div>
              </div>
              <div className="w-full flex justify-between text-[11px] font-bold text-[#434653] mt-2 px-2">
                <span>T3/2026</span>
                <span>T4/2026</span>
                <span>T5/2026</span>
                <span>T6/2026</span>
                <span>T7/2026</span>
                <span>T8/2026</span>
              </div>
            </div>
          </div>

          {/* Recent Checks */}
          <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl font-semibold text-[#191c1e]">Phiên Thẩm định Sầu riêng gần đây</h3>
              <Link href="/reports/1" className="text-[#00327d] font-semibold text-sm hover:underline">Xem Báo cáo PDF</Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#f7f9fb] rounded-lg border border-l-4 border-l-[#854d0e] border-[#c3c6d5]/60 hover:border-[#00327d]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#00327d]/10 rounded-lg flex items-center justify-center text-[#00327d]">
                    <span className="material-symbols-outlined">eco</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#191c1e]">Sầu riêng Tươi Ri6 — Lô DURIAN-2026-CN088</h4>
                    <p className="text-xs text-[#434653]">Thị trường: Trung Quốc GACC (Mã PUC: VN-WBPH-0125)</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-mono text-[#434653]">11/08/2026</span>
                  <span className="px-3 py-1 bg-[#fef9c3] text-[#854d0e] rounded-full text-xs font-bold border border-[#fde047]">CẦN TEM NHÃN</span>
                  <Link href="/reports/1" className="text-[#00327d] hover:underline text-xs font-bold">
                    Chi tiết
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#f7f9fb] rounded-lg border border-l-4 border-l-[#18512c] border-[#c3c6d5]/60 hover:border-[#18512c]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#18512c]/10 rounded-lg flex items-center justify-center text-[#18512c]">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#191c1e]">Sầu riêng Tươi Dona — Lô DURIAN-2026-CN092</h4>
                    <p className="text-xs text-[#434653]">Thị trường: Trung Quốc GACC (Mã PHC: VN-DBPH-088)</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-mono text-[#434653]">10/08/2026</span>
                  <span className="px-3 py-1 bg-[#b5f1bf] text-[#18512c] rounded-full text-xs font-bold border border-[#18512c]/20">ĐẠT (PASS)</span>
                  <Link href="/reports/1" className="text-[#00327d] hover:underline text-xs font-bold">
                    Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <LegalTrackingWidget />

          <div className="bg-[#dae2ff] p-6 rounded-xl border border-[#b1c5ff]">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#00327d]">policy</span>
              <h3 className="font-serif text-lg font-semibold text-[#191c1e]">Văn bản &amp; Mẫu Báo cáo PDF</h3>
            </div>
            <div className="space-y-3">
              <a 
                href="/Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf" 
                target="_blank"
                className="p-3 bg-white hover:bg-[#f7f9fb] rounded-lg flex items-center justify-between shadow-xs transition-colors cursor-pointer border border-[#b1c5ff]/50"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-[#00327d] text-base">picture_as_pdf</span>
                  <span className="text-xs font-bold text-[#191c1e] truncate">Bao_Cao_Tham_Dinh_GACC_Sau_Rieng.pdf</span>
                </div>
                <span className="material-symbols-outlined text-sm text-[#00327d]">download</span>
              </a>
              <a 
                href="/Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf" 
                target="_blank"
                className="p-3 bg-white hover:bg-[#f7f9fb] rounded-lg flex items-center justify-between shadow-xs transition-colors cursor-pointer border border-[#b1c5ff]/50"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-[#00327d] text-base">description</span>
                  <span className="text-xs font-bold text-[#191c1e] truncate">Nghi_Dinh_Thu_GACC_Sau_Rieng_2022.pdf</span>
                </div>
                <span className="material-symbols-outlined text-sm text-[#00327d]">download</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

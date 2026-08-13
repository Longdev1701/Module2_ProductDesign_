"use client";

import React, { useState } from 'react';
import { LegalRiskAlertsWidget } from "@/components/LegalRiskAlertsWidget";

export default function IntegrityPage() {
  const [activeRegion, setActiveRegion] = useState<'EUDR' | 'US MRL' | 'Nội địa'>('EUDR');
  const [searchTerm, setSearchTerm] = useState('');

  const audits = [
    {
      id: 1,
      name: "CP Robusta Export - Q3 (Đắc Lắk)",
      type: "Thẩm định Nguồn gốc EUDR",
      date: "28/10/2024",
      status: "PASS",
      statusText: "ĐẠT CHUẨN",
      icon: "domain",
      iconColor: "text-[#00327d]"
    },
    {
      id: 2,
      name: "Arabica Premium Supply Chain (Lâm Đồng)",
      type: "Rủi ro Lao động & Minh bạch",
      date: "26/10/2024",
      status: "WARNING",
      statusText: "CẢNH BÁO",
      icon: "warning",
      iconColor: "text-[#ba1a1a]"
    },
    {
      id: 3,
      name: "Hồ sơ Vật tư Nông nghiệp Xanh",
      type: "Kiểm tra Chứng nhận MRL",
      date: "25/10/2024",
      status: "PASS",
      statusText: "ĐẠT CHUẨN",
      icon: "inventory_2",
      iconColor: "text-[#00327d]"
    },
    {
      id: 4,
      name: "Dự án Nông nghiệp ESG Chư Sê",
      type: "Đánh giá Liêm chính Môi trường",
      date: "24/10/2024",
      status: "PENDING",
      statusText: "ĐANG THẨM ĐỊNH",
      icon: "eco",
      iconColor: "text-[#515f78]"
    }
  ];

  const filteredAudits = audits.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header Title & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#191c1e] mb-2">Hệ thống Giám sát Liêm chính</h2>
          <p className="text-[#434653] text-sm font-sans">
            Theo dõi trạng thái liêm chính doanh nghiệp và đánh giá rủi ro pháp lý theo thời gian thực.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-[#737784] text-[#191c1e] font-semibold text-sm rounded hover:bg-[#eceef0] transition-colors flex items-center gap-2 shadow-xs cursor-pointer">
            <span className="material-symbols-outlined text-sm">download</span> Xuất báo cáo
          </button>
          <button className="px-4 py-2 bg-[#00327d] text-white font-semibold text-sm rounded hover:bg-[#0047ab] transition-colors flex items-center gap-2 shadow-xs cursor-pointer">
            <span className="material-symbols-outlined text-sm">verified_user</span> Đánh giá liêm chính
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#00327d]/5 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#0047ab]/20 rounded-lg text-[#00327d]">
              <span className="material-symbols-outlined fill">gavel</span>
            </div>
            <h3 className="text-sm font-semibold text-[#434653]">Tổng kiểm tra liêm chính</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-4xl font-bold text-[#191c1e]">156</span>
            <span className="text-[#205833] font-semibold text-xs flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-xs">trending_up</span> +14% tháng này
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#b5f1bf] text-[#01401e] rounded-lg">
              <span className="material-symbols-outlined fill">verified</span>
            </div>
            <h3 className="text-sm font-semibold text-[#434653]">Đạt chuẩn tuân thủ</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-4xl font-bold text-[#191c1e]">144</span>
            <span className="text-[#434653] text-xs mb-2">/ 92.3% Tỷ lệ thành công</span>
          </div>
        </div>

        {/* Card 3: Risk Alert */}
        <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 border-l-4 border-l-[#ba1a1a] shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#ffdad6] text-[#ba1a1a] rounded-lg">
              <span className="material-symbols-outlined fill">warning</span>
            </div>
            <h3 className="text-sm font-semibold text-[#ba1a1a]">Cảnh báo rủi ro</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-serif text-4xl font-bold text-[#ba1a1a]">08</span>
            <a href="#" className="text-[#ba1a1a] font-semibold text-xs hover:underline flex items-center gap-1 mb-2">
              Xem hồ sơ <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#d2e0fe] text-[#515f78] rounded-lg">
              <span className="material-symbols-outlined fill">pending_actions</span>
            </div>
            <h3 className="text-sm font-semibold text-[#434653]">Nghiêm trọng / Cần duyệt</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-4xl font-bold text-[#191c1e]">04</span>
            <span className="text-[#434653] text-xs mb-2">Yêu cầu thẩm định</span>
          </div>
        </div>
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Risk Analytics Chart Box */}
          <div className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#191c1e]">Phân tích Rủi ro Liêm chính Chuỗi cung ứng</h3>
                <p className="text-[#434653] text-xs mt-1">Đánh giá theo vùng thị trường và mức độ tuân thủ tiêu chuẩn ESG / EUDR</p>
              </div>
              <div className="flex bg-[#eceef0] rounded-lg p-1 text-xs font-semibold self-start sm:self-auto">
                {(['EUDR', 'US MRL', 'Nội địa'] as const).map(region => (
                  <button
                    key={region}
                    onClick={() => setActiveRegion(region)}
                    className={`px-3 py-1 rounded transition-all cursor-pointer ${activeRegion === region ? 'bg-white text-[#191c1e] shadow-xs' : 'text-[#434653] hover:text-[#191c1e]'}`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="bg-[#f2f4f6] p-6 rounded-xl border border-[#c3c6d5]/50 space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold text-[#434653] pb-2 border-b border-[#c3c6d5]/40">
                <span>Chỉ số tuân thủ nhóm ngành</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00327d] inline-block"></span> Liêm chính nguồn gốc</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#01401e] inline-block"></span> Tuân thủ ESG</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] inline-block"></span> Cảnh báo rủi ro</span>
                </div>
              </div>

              <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                {[
                  { label: "T5/2024", val: 65, color: "bg-[#00327d]/40", text: "65%" },
                  { label: "T6/2024", val: 82, color: "bg-[#00327d]/70", text: "82%" },
                  { label: "T7/2024", val: 94, color: "bg-[#01401e]/80", text: "94%" },
                  { label: "T8/2024", val: 45, color: "bg-[#ba1a1a]/50", text: "45%" },
                  { label: "T9/2024", val: 88, color: "bg-[#00327d]", text: "88%" },
                  { label: "T10/2024", val: 96, color: "bg-[#01401e]", text: "96%" },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[11px] font-semibold text-[#434653] opacity-80 group-hover:opacity-100">{bar.text}</div>
                    <div 
                      className={`w-full rounded-t ${bar.color} transition-all duration-300 group-hover:brightness-110`} 
                      style={{ height: `${bar.val}%` }}
                    ></div>
                    <span className="text-[11px] text-[#434653] font-medium">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-xl border border-[#c3c6d5]/60 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#c3c6d5]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#191c1e]">Nhật ký Thẩm định & Giám sát Liêm chính</h3>
                <p className="text-[#434653] text-xs mt-1">Hồ sơ thẩm định nguồn gốc và tuân thủ pháp lý mới nhất</p>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined text-[#434653] text-base absolute left-3 top-1/2 -translate-y-1/2">search</span>
                <input 
                  type="text" 
                  placeholder="Tìm dự án, loại thẩm định..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs bg-[#f7f9fb] border border-[#c3c6d5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00327d] w-full sm:w-56"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f2f4f6] text-[#434653] font-semibold text-xs border-b border-[#c3c6d5]/50">
                  <tr>
                    <th className="py-3 px-6">Dự án / Doanh nghiệp</th>
                    <th className="py-3 px-4">Loại thẩm định</th>
                    <th className="py-3 px-4">Ngày kiểm tra</th>
                    <th className="py-3 px-4">Trạng thái liêm chính</th>
                    <th className="py-3 px-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3c6d5]/30 text-[#191c1e] font-sans">
                  {filteredAudits.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f7f9fb] transition-colors">
                      <td className="py-4 px-6 font-semibold flex items-center gap-3 text-[#191c1e]">
                        <span className={`material-symbols-outlined text-base ${item.iconColor}`}>{item.icon}</span>
                        {item.name}
                      </td>
                      <td className="py-4 px-4 text-xs text-[#434653]">{item.type}</td>
                      <td className="py-4 px-4 text-xs text-[#434653]">{item.date}</td>
                      <td className="py-4 px-4">
                        {item.status === 'PASS' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#b5f1bf] text-[#18512c] text-xs font-semibold rounded-full">
                            <span className="material-symbols-outlined text-xs">check_circle</span> {item.statusText}
                          </span>
                        )}
                        {item.status === 'WARNING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ffdad6] text-[#93000a] text-xs font-semibold rounded-full border border-[#ba1a1a]/20">
                            <span className="material-symbols-outlined text-xs">error</span> {item.statusText}
                          </span>
                        )}
                        {item.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#d2e0fe] text-[#55637d] text-xs font-semibold rounded-full">
                            <span className="material-symbols-outlined text-xs">hourglass_top</span> {item.statusText}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-[#00327d] hover:bg-[#00327d]/10 p-1.5 rounded-lg transition-colors cursor-pointer">
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Column */}
        <div className="space-y-8">
          
          {/* Real-time Dynamic Risk Alerts Widget (Executive List View) */}
          <LegalRiskAlertsWidget title="Cảnh báo Rủi ro Pháp lý" />

          {/* PDF Audit Reports Download Widget */}
          <div className="bg-[#d2e0fe]/30 p-6 rounded-xl border border-[#d2e0fe] shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-[#00327d]">
              <span className="material-symbols-outlined fill">verified_user</span>
              <h3 className="font-serif text-base font-semibold text-[#191c1e]">Báo cáo Liêm chính & Tài liệu mới</h3>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-white rounded-lg border border-[#c3c6d5]/50 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold rounded">PDF</span>
                  <span className="text-xs font-semibold text-[#191c1e]">Báo cáo Liêm chính EUDR Q3_2024.pdf</span>
                </div>
                <button className="text-[#00327d] hover:text-[#0047ab] p-1 cursor-pointer">
                  <span className="material-symbols-outlined text-sm">download</span>
                </button>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#c3c6d5]/50 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold rounded">PDF</span>
                  <span className="text-xs font-semibold text-[#191c1e]">Bộ tiêu chuẩn Giám sát Tuân thủ US.pdf</span>
                </div>
                <button className="text-[#00327d] hover:text-[#0047ab] p-1 cursor-pointer">
                  <span className="material-symbols-outlined text-sm">download</span>
                </button>
              </div>
            </div>

            <a href="#" className="text-[#00327d] font-semibold text-xs hover:underline flex justify-center items-center gap-1 pt-1">
              Xem tất cả tài liệu liêm chính <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, ShieldCheck, Sparkles, AlertTriangle, ExternalLink, Download } from "lucide-react";

export default function RegulationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const documents = [
    {
      id: "REG-GACC-01",
      category: "NGHỊ ĐỊNH THƯ GACC",
      badgeVariant: "destructive",
      date: "11/08/2026",
      title: "Nghị định thư Kiểm dịch Thực vật Sầu riêng Tươi (MARD/GACC Protocol 2022)",
      desc: "Quy định mã số Vùng trồng (PUC), Mã số Cơ sở Đóng gói (PHC), kiểm soát 05 loài sinh vật kiểm dịch (Rệp sáp & Ruồi đục quả) và dòng khai báo Phytosanitary bắt buộc.",
      authority: "Tổng cục Hải quan Trung Quốc (GACC) & MARD",
      impact: "Trọng điểm Xuất khẩu Sầu riêng Tươi (Mã HS: 0810.60.00)"
    },
    {
      id: "REG-GACC-02",
      category: "KIM LOẠI NẶNG GB 2762",
      badgeVariant: "destructive",
      date: "01/08/2026",
      title: "Tiêu chuẩn Quốc gia Trung Quốc GB 2762-2022: Giới hạn Kim loại Nặng Cadmium (Cd)",
      desc: "Quy định ngưỡng tối đa cho phép Cadmium trong sầu riêng tươi <= 0.05 mg/kg. Đây là tiêu chí kiểm tra tần suất cao nhất của GACC tại các cửa khẩu Hữu Nghị, Tân Thanh.",
      authority: "Ủy ban An toàn Thực phẩm Quốc gia Trung Quốc",
      impact: "MRL Cadmium ≤ 0.05 mg/kg"
    },
    {
      id: "REG-GACC-03",
      category: "MRL BẢO VỆ THỰC VẬT",
      badgeVariant: "default",
      date: "28/07/2026",
      title: "Tiêu chuẩn GB 2763-2021: Ngưỡng MRL Dithiocarbamates & Chlorpyrifos",
      desc: "Ngưỡng Dithiocarbamates <= 2.0 mg/kg, Chlorpyrifos <= 0.01 mg/kg (nghiêm cấm sử dụng). Áp dụng trực tiếp cho nông sản xuất khẩu sang Trung Quốc.",
      authority: "Bộ Nông nghiệp Trung Quốc (MARA)",
      impact: "Giới hạn Dư lượng Thuốc BVTV"
    },
    {
      id: "REG-GACC-04",
      category: "LỆNH GACC 248 & 249",
      badgeVariant: "secondary",
      date: "15/07/2026",
      title: "Quản lý Đăng ký Doanh nghiệp & Ghi nhãn phụ Tiếng Trung (Decree 248/249)",
      desc: "Yêu cầu bắt buộc in dán nhãn phụ tiếng Trung chứa thông tin PUC, PHC và dòng chữ '输往中华人民共和国' trên 100% thùng sầu riêng trước khi kẹp chì.",
      authority: "Cục An toàn Thực phẩm Nhập khẩu GACC",
      impact: "Quy định Ghi nhãn & Bao bì"
    }
  ];

  const handleDownloadPDF = () => {
    window.open("/Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf", "_blank");
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#131b2e] pb-12">
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c5c5d3]/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00236f] uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-[#00236f]" /> THƯ VIỆN PHÁP LÝ HẢI QUAN TRUNG QUỐC (GACC COMPLIANCE HUB)
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131b2e]">Thư viện Quy định Sầu riêng Xuất khẩu</h1>
          <p className="text-xs sm:text-sm text-[#444651] max-w-3xl mt-1">
            Trung tâm tình báo pháp lý: Tra cứu Nghị định thư GACC, Tiêu chuẩn MRL GB 2762/2763 và Lệnh 248/249 áp dụng cho Sầu riêng Tươi &amp; Cấp đông (Mã HS: 0810.60.00 / 0811.90.00).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 bg-[#00236f] hover:bg-[#1e3a8a] text-white font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Xuất Báo cáo PDF (Tiếng Việt)
          </button>
        </div>
      </div>

      {/* 1. Smart Market Hub Cards Grid */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#131b2e] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#00236f]" /> Smart Market Hub (Sức khỏe Tuân thủ các Thị trường)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: China GACC */}
          <div className="p-4 bg-[#f2f3ff] border-2 border-[#00236f] rounded-2xl relative overflow-hidden shadow-2xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#00236f] bg-[#e2e7ff] px-2 py-0.5 rounded">🇨🇳 TRUNG QUỐC (GACC)</span>
              <span className="text-[10px] font-bold text-[#15803d] bg-[#e8f5e9] px-2 py-0.5 rounded">ACTIVE (MVP)</span>
            </div>
            <div className="flex items-end justify-between pt-1">
              <div>
                <p className="font-serif text-2xl font-bold text-[#00236f]">96.8%</p>
                <p className="text-[10px] font-bold text-[#757682]">Sức khỏe tuân thủ GACC</p>
              </div>
              <span className="text-xs font-bold text-[#15803d]">An toàn</span>
            </div>
          </div>

          {/* Card 2: EU */}
          <div className="p-4 bg-white border border-[#c5c5d3]/60 rounded-2xl relative overflow-hidden shadow-2xs space-y-2 opacity-80">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#444651] bg-[#f2f3ff] px-2 py-0.5 rounded">🇪🇺 CHÂU ÂU (EUDR)</span>
              <span className="text-[10px] font-bold text-[#757682] bg-gray-100 px-2 py-0.5 rounded">Sau MVP</span>
            </div>
            <div className="flex items-end justify-between pt-1">
              <div>
                <p className="font-serif text-2xl font-bold text-[#131b2e]">88.5%</p>
                <p className="text-[10px] font-bold text-[#757682]">Sức khỏe tuân thủ EU</p>
              </div>
              <span className="text-xs font-bold text-[#b45309]">Cảnh báo</span>
            </div>
          </div>

          {/* Card 3: USA */}
          <div className="p-4 bg-white border border-[#c5c5d3]/60 rounded-2xl relative overflow-hidden shadow-2xs space-y-2 opacity-80">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#444651] bg-[#f2f3ff] px-2 py-0.5 rounded">🇺🇸 HOA KỲ (FDA)</span>
              <span className="text-[10px] font-bold text-[#757682] bg-gray-100 px-2 py-0.5 rounded">Sau MVP</span>
            </div>
            <div className="flex items-end justify-between pt-1">
              <div>
                <p className="font-serif text-2xl font-bold text-[#131b2e]">85.0%</p>
                <p className="text-[10px] font-bold text-[#757682]">Sức khỏe tuân thủ FDA</p>
              </div>
              <span className="text-xs font-bold text-[#b45309]">Cảnh báo</span>
            </div>
          </div>

          {/* Card 4: Japan */}
          <div className="p-4 bg-white border border-[#c5c5d3]/60 rounded-2xl relative overflow-hidden shadow-2xs space-y-2 opacity-80">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#444651] bg-[#f2f3ff] px-2 py-0.5 rounded">🇯🇵 NHẬT BẢN (JFS)</span>
              <span className="text-[10px] font-bold text-[#757682] bg-gray-100 px-2 py-0.5 rounded">Sau MVP</span>
            </div>
            <div className="flex items-end justify-between pt-1">
              <div>
                <p className="font-serif text-2xl font-bold text-[#131b2e]">91.2%</p>
                <p className="text-[10px] font-bold text-[#757682]">Sức khỏe tuân thủ JFS</p>
              </div>
              <span className="text-xs font-bold text-[#15803d]">An toàn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Regulations List & Right AI Tracker Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Documents List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#c5c5d3]/60 shadow-2xs">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757682] text-base">search</span>
              <input 
                type="text" 
                placeholder="Tìm kiếm điều khoản GACC, Cadmium, MRL GB 2762, Lệnh 248..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#faf8ff] border border-[#c5c5d3] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#00236f] text-[#131b2e]"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-[#00236f] text-white rounded-xl text-xs font-bold shadow-2xs">
                🇨🇳 GACC Trung Quốc
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <Card key={doc.id} className="flex flex-col h-full hover:shadow-md transition-all cursor-pointer border-[#c5c5d3]/70 rounded-2xl">
                <CardContent className="p-6 flex-1 flex flex-col space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 bg-[#e2e7ff] text-[#00236f] font-bold text-[10px] rounded-md">
                      {doc.category}
                    </span>
                    <span className="text-[11px] text-[#757682] font-mono">{doc.date}</span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#131b2e] leading-snug">{doc.title}</h3>
                  <p className="text-xs text-[#444651] leading-relaxed flex-1">{doc.desc}</p>
                  
                  <div className="pt-3 border-t border-[#c5c5d3]/40 space-y-1 text-[11px]">
                    <p className="text-[#757682]">Cơ quan ban hành: <strong className="text-[#131b2e]">{doc.authority}</strong></p>
                    <p className="text-[#00236f] font-bold">Phạm vi: {doc.impact}</p>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs font-bold text-[#00236f]">
                    <span>Xem chi tiết nguồn luật</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar: AI Policy Tracker */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-[#c5c5d3]/60 shadow-2xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#131b2e] flex items-center gap-2 border-b border-[#c5c5d3]/40 pb-3">
              <AlertTriangle className="w-4 h-4 text-[#b45309]" /> AI Policy Updates Tracker
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#00236f]/20 space-y-1">
                <span className="text-[10px] font-bold text-[#00236f] uppercase">MỚI CẬP NHẬT GACC</span>
                <h4 className="font-bold text-[#131b2e]">Tăng tần suất kiểm tra Cadmium tại cửa khẩu</h4>
                <p className="text-[11px] text-[#444651]">Hải quan Lạng Sơn &amp; Quảng Tây áp dụng tỷ lệ lấy mẫu 30% đối với sầu riêng tươi.</p>
                <Link href="/reports/1" className="text-xs font-bold text-[#00236f] hover:underline block pt-1">
                  Xem hướng dẫn tự rà soát
                </Link>
              </div>

              <div className="p-3 bg-[#fef9c3] rounded-xl border border-[#fde047] space-y-1">
                <span className="text-[10px] font-bold text-[#854d0e] uppercase">LỆNH 248/249</span>
                <h4 className="font-bold text-[#131b2e]">Kiểm tra tem nhãn Tiếng Trung 100% thùng</h4>
                <p className="text-[11px] text-[#444651]">Yêu cầu ghi rõ mã số Vùng trồng PUC &amp; PHC tiếng Trung trước khi kẹp chì.</p>
              </div>
            </div>
          </div>

          {/* AI Comply Widget Banner */}
          <div className="bg-[#00236f] rounded-2xl p-6 text-white relative overflow-hidden space-y-3 shadow-2xs">
            <div className="relative z-10 text-center flex flex-col items-center space-y-2">
              <Settings className="w-8 h-8 text-white/90 animate-spin" />
              <h3 className="font-serif text-base font-bold">ĐỘNG CƠ AI GACC COMPLY</h3>
              <p className="text-xs text-white/80 leading-relaxed">Tự động phân tích tác động của văn bản luật GACC mới đến danh mục lô sầu riêng của doanh nghiệp.</p>
              <Link href="/checks/new">
                <button className="w-full mt-2 px-4 py-2.5 bg-white hover:bg-[#f2f3ff] text-[#00236f] font-bold text-xs rounded-xl transition-all cursor-pointer">
                  Khởi chạy Phân tích AI ngay
                </button>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

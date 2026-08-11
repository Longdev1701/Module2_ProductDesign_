"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [selectedProductFilter, setSelectedProductFilter] = useState("all");

  const handleDownloadPDF = () => {
    window.open("/Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf", "_blank");
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#131b2e] pb-12 relative">
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
              <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></span> Premium Subscription
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
          <span className="material-symbols-outlined text-sm text-[#00236f]">filter_list</span> BỘ LỌC NHANH:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setSelectedProductFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedProductFilter === 'all' 
                ? 'bg-[#00236f] text-white shadow-2xs' 
                : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] border border-[#c5c5d3]'
            }`}
          >
            Tất cả sản phẩm
          </button>
          <button 
            onClick={() => setSelectedProductFilter("ri6")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedProductFilter === 'ri6' 
                ? 'bg-[#00236f] text-white shadow-2xs' 
                : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] border border-[#c5c5d3]'
            }`}
          >
            Sầu riêng
          </button>
          <button 
            onClick={() => setSelectedProductFilter("dona")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedProductFilter === 'dona' 
                ? 'bg-[#00236f] text-white shadow-2xs' 
                : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] border border-[#c5c5d3]'
            }`}
          >
            Thanh long
          </button>
          <button 
            onClick={() => setSelectedProductFilter("frozen")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedProductFilter === 'frozen' 
                ? 'bg-[#00236f] text-white shadow-2xs' 
                : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] border border-[#c5c5d3]'
            }`}
          >
            Xoài
          </button>
        </div>

        <div className="h-4 w-px bg-[#c5c5d3] mx-1 hidden sm:block" />

        <span className="px-4 py-1.5 bg-[#f2f3ff] text-[#00236f] font-medium rounded-full border border-[#c5c5d3] flex items-center gap-1">
          Thị trường: Trung Quốc <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
        </span>
      </div>

      {/* Grid KPI Cards & Smart Alerts (Lovable 1:1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Card 1: Compliance Rate (TỶ LỆ ĐẠT 97%) */}
        <div className="bg-white border border-[#c5c5d3]/60 p-6 rounded-xl flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-[#444651] uppercase tracking-widest mb-1">TỶ LỆ ĐẠT</p>
              <h3 className="text-3xl font-bold text-[#15803d] font-serif flex items-end">
                97%
                <svg className="w-16 h-8 ml-3 text-[#15803d] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 50 20">
                  <path d="M0,10 L10,12 L20,8 L30,5 L40,6 L50,2" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                </svg>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#15803d]/10 flex items-center justify-center text-[#15803d]">
              <span className="material-symbols-outlined">verified</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs mt-auto">
            <span className="text-[#444651]">Tg. xử lý TB:</span>
            <span className="text-[#131b2e] font-medium">2.4 ngày</span>
          </div>
        </div>

        {/* Stat Card 2: HỒ SƠ ĐANG XỬ LÝ (18) */}
        <div className="bg-white border border-[#c5c5d3]/60 p-6 rounded-xl flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-[#444651] uppercase tracking-widest mb-1">HỒ SƠ ĐANG XỬ LÝ</p>
              <h3 className="text-3xl font-bold text-[#00236f] font-serif">
                18
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#00236f]/10 flex items-center justify-center text-[#00236f]">
              <span className="material-symbols-outlined">fact_check</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs mt-auto">
            <span className="text-[#444651]">Chờ phê duyệt:</span>
            <span className="text-[#131b2e] font-medium">5 hồ sơ</span>
          </div>
        </div>

        {/* Smart Alerts Panel (Takes 2 columns) */}
        <div className="col-span-1 md:col-span-2 bg-[#ffdad6] border border-[#ba1a1a]/20 p-6 rounded-xl flex flex-col justify-between shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-9xl text-[#ba1a1a]">warning</span>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4 border-b border-[#ba1a1a]/20 pb-2">
              <h3 className="text-lg font-bold text-[#93000a] font-serif flex items-center">
                <span className="material-symbols-outlined mr-2">notifications_active</span> Smart Alerts Panel
              </h3>
              <span className="px-2.5 py-1 bg-[#ba1a1a] text-white text-xs font-bold rounded-full">3 Ưu tiên</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/70 p-2.5 rounded border border-[#ba1a1a]/10">
                <div className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] mr-3 shrink-0"></span>
                  <div>
                    <p className="text-sm font-bold text-[#131b2e]">Chưa gia hạn mã vùng trồng (GACC)</p>
                    <p className="text-[10px] text-[#444651]">Sắp hết hạn đăng ký xuất khẩu sầu riêng sang Trung Quốc</p>
                  </div>
                </div>
                <Link href="/reports/1">
                  <button className="px-3 py-1 bg-[#ba1a1a] text-white text-xs font-bold rounded hover:bg-[#ba1a1a]/90 transition-colors cursor-pointer shrink-0">
                    Xử lý ngay
                  </button>
                </Link>
              </div>

              <div className="flex justify-between items-center bg-white/70 p-2.5 rounded border border-[#ba1a1a]/10">
                <div className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b45309] mr-3 shrink-0"></span>
                  <div>
                    <p className="text-sm font-bold text-[#131b2e]">Cảnh báo rệp sáp lô #SR-CN</p>
                    <p className="text-[10px] text-[#444651]">Phát hiện sinh vật gây hại thuộc danh mục kiểm dịch</p>
                  </div>
                </div>
                <Link href="/reports/1">
                  <button className="px-3 py-1 bg-[#b45309] text-white text-xs font-bold rounded hover:bg-[#b45309]/90 transition-colors cursor-pointer shrink-0">
                    Kiểm tra
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Market Risk Map & News Section (Lovable 1:1) */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* Left Market Risk Map Section */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-[#c5c5d3]/60 p-6 rounded-xl shadow-2xs flex flex-col">
          <h4 className="font-bold text-lg text-[#131b2e] mb-4 font-serif">Bản đồ rủi ro thị trường</h4>
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[180px]">
            <svg className="w-full h-auto text-[#e2e7ff]" fill="currentColor" viewBox="0 0 800 400">
              <path d="M150,100 C180,80 220,90 250,120 C280,150 260,200 230,250 C200,300 150,350 100,300 C50,250 80,150 120,130 Z" opacity="0.5"></path>
              <path d="M400,50 C450,40 500,60 550,100 C600,140 580,200 530,220 C480,240 420,200 380,150 C340,100 360,60 400,50 Z" opacity="0.5"></path>
              <path d="M650,150 C680,140 720,160 750,200 C780,240 760,280 720,300 C680,320 620,280 600,240 C580,200 620,160 650,150 Z" opacity="0.5"></path>
              <circle cx="180" cy="150" fill="#b45309" r="12" />
              <circle cx="450" cy="120" fill="#ba1a1a" r="14" />
              <circle cx="700" cy="180" fill="#15803d" r="10" />
              <circle cx="620" cy="160" fill="#15803d" r="16" className="animate-pulse" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[10px] uppercase font-bold text-[#444651] bg-white/80 p-2 rounded backdrop-blur border border-[#c5c5d3]/40">
              <span className="flex items-center"><span className="w-2 h-2 bg-[#15803d] rounded-full mr-1"></span> An toàn (CN, JP)</span>
              <span className="flex items-center"><span className="w-2 h-2 bg-[#b45309] rounded-full mr-1"></span> Cảnh báo (USA)</span>
              <span className="flex items-center"><span className="w-2 h-2 bg-[#ba1a1a] rounded-full mr-1"></span> Nguy cơ (EU)</span>
            </div>
          </div>
        </div>

        {/* Right Export News Section */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-[#c5c5d3]/60 rounded-xl shadow-2xs p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl text-[#131b2e] font-bold">Tin tức xuất khẩu &amp; Thị trường</h3>
            <button className="text-[#00236f] font-bold text-sm hover:underline cursor-pointer">Xem tất cả</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex space-x-4 group cursor-pointer">
              <div className="w-24 h-24 bg-[#e2e7ff] rounded-lg flex-shrink-0 flex items-center justify-center text-[#757682]/50 relative">
                <span className="material-symbols-outlined text-3xl">image</span>
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#00236f] text-white text-[8px] font-bold rounded">Giá cả</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#131b2e] group-hover:text-[#00236f] transition-colors line-clamp-2">Giá sầu riêng Monthong tăng vọt tại chợ sỉ Quảng Châu</h4>
                <p className="text-xs text-[#444651] mt-1 line-clamp-2">Nhu cầu tăng mạnh từ các thị trường nội địa đẩy giá lên mức kỷ lục...</p>
                <p className="text-[10px] text-[#757682] mt-2 uppercase font-medium">1 giờ trước</p>
              </div>
            </div>

            <div className="flex space-x-4 group cursor-pointer">
              <div className="w-24 h-24 bg-[#e2e7ff] rounded-lg flex-shrink-0 flex items-center justify-center text-[#757682]/50 relative">
                <span className="material-symbols-outlined text-3xl">image</span>
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#904d00] text-white text-[8px] font-bold rounded">Thị trường</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#131b2e] group-hover:text-[#00236f] transition-colors line-clamp-2">Trung Quốc siết chặt kiểm tra rệp sáp trên sầu riêng nhập khẩu</h4>
                <p className="text-xs text-[#444651] mt-1 line-clamp-2">Các quy định mới về dư lượng và dịch hại sẽ áp dụng từ đầu năm sau...</p>
                <p className="text-[10px] text-[#757682] mt-2 uppercase font-medium">3 giờ trước</p>
              </div>
            </div>

            <div className="flex space-x-4 group cursor-pointer">
              <div className="w-24 h-24 bg-[#e2e7ff] rounded-lg flex-shrink-0 flex items-center justify-center text-[#757682]/50 relative">
                <span className="material-symbols-outlined text-3xl">image</span>
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#15803d] text-white text-[8px] font-bold rounded">Logistics</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#131b2e] group-hover:text-[#00236f] transition-colors line-clamp-2">Ùn ứ xe nông sản tại cửa khẩu Hữu Nghị được giải tỏa</h4>
                <p className="text-xs text-[#444651] mt-1 line-clamp-2">Tình trạng thông quan chậm đã được cải thiện đáng kể trong tuần qua...</p>
                <p className="text-[10px] text-[#757682] mt-2 uppercase font-medium">5 giờ trước</p>
              </div>
            </div>

            <div className="flex space-x-4 group cursor-pointer">
              <div className="w-24 h-24 bg-[#e2e7ff] rounded-lg flex-shrink-0 flex items-center justify-center text-[#757682]/50 relative">
                <span className="material-symbols-outlined text-3xl">image</span>
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#b45309] text-white text-[8px] font-bold rounded">Thị trường</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#131b2e] group-hover:text-[#00236f] transition-colors line-clamp-2">Cơ hội xuất khẩu sầu riêng đông lạnh sang thị trường tỷ dân</h4>
                <p className="text-xs text-[#444651] mt-1 line-clamp-2">Nhu cầu tiêu thụ các sản phẩm chế biến từ sầu riêng tăng mạnh...</p>
                <p className="text-[10px] text-[#757682] mt-2 uppercase font-medium">8 giờ trước</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Table: Recent Compliance Checks (Lovable Stepper 1:1) */}
      <div className="bg-white border border-[#c5c5d3]/60 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-[#c5c5d3]/40 flex justify-between items-center bg-white">
          <h3 className="font-serif text-xl font-bold text-[#131b2e]">Kiểm tra tuân thủ gần đây</h3>
          <button className="text-[#00236f] font-bold text-sm hover:underline cursor-pointer">Xem tất cả</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f3ff] text-[#444651] uppercase text-[11px] font-bold tracking-widest border-b border-[#c5c5d3]/40">
                <th className="px-6 py-4">SẢN PHẨM</th>
                <th className="px-6 py-4">THỊ TRƯỜNG</th>
                <th className="px-6 py-4">TIẾN ĐỘ PHÂN TÍCH</th>
                <th className="px-6 py-4">TRẠNG THÁI</th>
                <th className="px-6 py-4 text-right">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#c5c5d3]/30 text-[#131b2e]">
              
              {/* Row 1 */}
              <tr className="hover:bg-[#00236f]/5 transition-colors">
                <td className="px-6 py-4 font-bold">Sầu riêng Ri6</td>
                <td className="px-6 py-4">Trung Quốc (GACC)</td>
                <td className="px-6 py-4 min-w-[220px]">
                  <div className="relative flex justify-between items-center w-full my-1">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#15803d] -translate-y-1/2 z-0"></div>
                    <div className="relative z-10 w-4 h-4 bg-[#15803d] rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px]">check</span></div>
                    <div className="relative z-10 w-4 h-4 bg-[#15803d] rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px]">check</span></div>
                    <div className="relative z-10 w-4 h-4 bg-[#15803d] rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px]">check</span></div>
                  </div>
                  <div className="flex justify-between text-[9px] uppercase font-bold text-[#444651] mt-1">
                    <span>OCR</span><span>AI Analysis</span><span>Approval</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-[#15803d]/10 text-[#15803d] text-[10px] font-bold rounded">
                    ĐẠT (PASS)
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href="/reports/1" className="text-[#00236f] font-bold hover:underline">Chi tiết</Link>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-[#00236f]/5 transition-colors">
                <td className="px-6 py-4 font-bold">Thanh long - China</td>
                <td className="px-6 py-4">Quảng Tây (Trung Quốc)</td>
                <td className="px-6 py-4 min-w-[220px]">
                  <div className="relative flex justify-between items-center w-full my-1">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#c5c5d3] -translate-y-1/2 z-0"></div>
                    <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-[#b45309] -translate-y-1/2 z-0"></div>
                    <div className="relative z-10 w-4 h-4 bg-[#15803d] rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px]">check</span></div>
                    <div className="relative z-10 w-4 h-4 bg-[#b45309] rounded-full flex items-center justify-center text-white animate-pulse"><span className="material-symbols-outlined text-[10px]">sync</span></div>
                    <div className="relative z-10 w-4 h-4 bg-[#e2e7ff] border border-[#c5c5d3] rounded-full flex items-center justify-center"></div>
                  </div>
                  <div className="flex justify-between text-[9px] uppercase font-bold text-[#444651] mt-1">
                    <span>OCR</span><span className="text-[#b45309]">AI Analysis</span><span>Approval</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-[#b45309]/10 text-[#b45309] text-[10px] font-bold rounded">
                    CẢNH BÁO
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href="/reports/1" className="text-[#00236f] font-bold hover:underline">Chi tiết</Link>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-[#00236f]/5 transition-colors">
                <td className="px-6 py-4 font-bold">Sầu riêng Monthong</td>
                <td className="px-6 py-4">Vân Nam (Trung Quốc)</td>
                <td className="px-6 py-4 min-w-[220px]">
                  <div className="relative flex justify-between items-center w-full my-1">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#c5c5d3] -translate-y-1/2 z-0"></div>
                    <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-[#ba1a1a] -translate-y-1/2 z-0"></div>
                    <div className="relative z-10 w-4 h-4 bg-[#15803d] rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px]">check</span></div>
                    <div className="relative z-10 w-4 h-4 bg-[#ba1a1a] rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px]">close</span></div>
                    <div className="relative z-10 w-4 h-4 bg-[#e2e7ff] border border-[#c5c5d3] rounded-full flex items-center justify-center"></div>
                  </div>
                  <div className="flex justify-between text-[9px] uppercase font-bold text-[#444651] mt-1">
                    <span>OCR</span><span className="text-[#ba1a1a]">AI Analysis</span><span>Approval</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-[#ba1a1a]/10 text-[#ba1a1a] text-[10px] font-bold rounded">
                    NGUY CƠ
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href="/reports/1" className="text-[#00236f] font-bold hover:underline">Chi tiết</Link>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-[#00236f]/5 transition-colors">
                <td className="px-6 py-4 font-bold">Xoài Cát Chu</td>
                <td className="px-6 py-4">Trung Quốc (GACC)</td>
                <td className="px-6 py-4 min-w-[220px]">
                  <div className="relative flex justify-between items-center w-full my-1">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#15803d] -translate-y-1/2 z-0"></div>
                    <div className="relative z-10 w-4 h-4 bg-[#15803d] rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px]">check</span></div>
                    <div className="relative z-10 w-4 h-4 bg-[#15803d] rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px]">check</span></div>
                    <div className="relative z-10 w-4 h-4 bg-[#15803d] rounded-full flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px]">check</span></div>
                  </div>
                  <div className="flex justify-between text-[9px] uppercase font-bold text-[#444651] mt-1">
                    <span>OCR</span><span>AI Analysis</span><span>Approval</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-[#15803d]/10 text-[#15803d] text-[10px] font-bold rounded">
                    ĐẠT (PASS)
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href="/reports/1" className="text-[#00236f] font-bold hover:underline">Chi tiết</Link>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Policy Updates & Reports Section (Lovable 1:1) */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Regulations & AI Policy Updates */}
        <div className="col-span-12 lg:col-span-7 bg-white border border-[#c5c5d3]/60 p-6 rounded-xl shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c5c5d3]/40 pb-3">
            <h3 className="font-serif text-xl font-bold text-[#131b2e]">Cập nhật chính sách &amp; Pháp lý</h3>
            <span className="material-symbols-outlined text-[#00236f]">gavel</span>
          </div>

          {/* Pinned Regulations */}
          <div className="p-4 bg-[#00236f]/5 border border-[#00236f]/20 rounded-lg">
            <h4 className="text-xs font-bold text-[#00236f] uppercase tracking-widest flex items-center mb-3">
              <span className="material-symbols-outlined text-sm mr-1">push_pin</span> QUY ĐỊNH TRỌNG ĐIỂM (PINNED)
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="px-2 py-0.5 bg-[#00236f] text-white text-[9px] font-bold rounded uppercase mt-0.5">GACC</span>
                <div>
                  <p className="text-sm font-bold text-[#131b2e]">Lệnh 248 &amp; 249 (GACC)</p>
                  <p className="text-xs text-[#444651] mt-0.5">Quy định quản lý đăng ký doanh nghiệp sản xuất thực phẩm xuất khẩu vào Trung Quốc.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4 pb-4 border-b border-[#c5c5d3]/30">
              <span className="px-2 py-0.5 bg-[#00236f] text-white text-[9px] font-bold rounded uppercase mt-1">NEW</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#131b2e]">Yêu cầu kiểm dịch thực vật Sầu Riêng</p>
                <p className="text-xs text-[#444651] mt-1">Cập nhật danh mục sinh vật gây hại từ Tổng cục Hải quan Trung Quốc (GACC).</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-[10px] text-[#757682] uppercase font-medium">Hiệu lực: 30/12/2026</p>
                  <span className="text-[10px] bg-[#15803d]/10 text-[#15803d] font-bold px-1.5 py-0.5 rounded flex items-center">
                    <span className="material-symbols-outlined text-[10px] mr-0.5">psychology</span> AI Confidence: 99%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4 pb-4 border-b border-[#c5c5d3]/30">
              <span className="px-2 py-0.5 bg-[#904d00] text-white text-[9px] font-bold rounded uppercase mt-1">UPDATED</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#131b2e]">Tiêu chuẩn đóng gói sầu riêng xuất khẩu</p>
                <p className="text-xs text-[#444651] mt-1">Mã số vùng trồng và cơ sở đóng gói phải in rõ trên bao bì bằng tiếng Trung hoặc tiếng Anh.</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-[10px] text-[#757682] uppercase font-medium">Cập nhật hôm qua</p>
                  <span className="text-[10px] bg-[#15803d]/10 text-[#15803d] font-bold px-1.5 py-0.5 rounded flex items-center">
                    <span className="material-symbols-outlined text-[10px] mr-0.5">psychology</span> AI Confidence: 95%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 py-2.5 bg-[#f2f3ff] text-[#00236f] font-bold text-xs rounded border border-[#00236f]/20 hover:bg-[#00236f]/5 transition-all cursor-pointer">
            XEM TẤT CẢ CẬP NHẬT
          </button>
        </div>

        {/* Right Column: PDF Download Center */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-[#c5c5d3]/60 p-6 rounded-xl shadow-2xs space-y-4">
          <h4 className="font-bold text-lg text-[#131b2e] font-serif">Hoạt động xuất khẩu &amp; Báo cáo</h4>
          <p className="text-xs text-[#444651]">Các báo cáo tuân thủ (PDF) được tạo gần đây nhất.</p>
          
          <div className="space-y-3">
            <div 
              onClick={handleDownloadPDF}
              className="flex items-center p-3 bg-[#f2f3ff] rounded border border-[#c5c5d3]/30 hover:border-[#00236f] transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[#00236f] mr-4 text-2xl">picture_as_pdf</span>
              <div className="flex-1 truncate">
                <p className="text-sm font-bold truncate text-[#131b2e] group-hover:text-[#00236f]">Compliance_Report_GACC_Durian.pdf</p>
                <p className="text-[10px] text-[#444651] uppercase font-medium">3.2 MB • Cập nhật hôm qua</p>
              </div>
              <button className="text-[#00236f] bg-[#00236f]/10 px-2.5 py-1 rounded text-xs font-bold hover:bg-[#00236f]/20 transition-colors flex items-center shrink-0">
                <span className="material-symbols-outlined text-sm mr-1">download</span> Tải xuống
              </button>
            </div>

            <div 
              onClick={handleDownloadPDF}
              className="flex items-center p-3 bg-[#f2f3ff] rounded border border-[#c5c5d3]/30 hover:border-[#00236f] transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[#00236f] mr-4 text-2xl">picture_as_pdf</span>
              <div className="flex-1 truncate">
                <p className="text-sm font-bold truncate text-[#131b2e] group-hover:text-[#00236f]">Batch_Check_DURIAN_CN088.pdf</p>
                <p className="text-[10px] text-[#444651] uppercase font-medium">1.8 MB • 2 ngày trước</p>
              </div>
              <button className="text-[#00236f] bg-[#00236f]/10 px-2.5 py-1 rounded text-xs font-bold hover:bg-[#00236f]/20 transition-colors flex items-center shrink-0">
                <span className="material-symbols-outlined text-sm mr-1">download</span> Tải xuống
              </button>
            </div>

            <div 
              onClick={handleDownloadPDF}
              className="flex items-center p-3 bg-[#f2f3ff] rounded border border-[#c5c5d3]/30 hover:border-[#00236f] transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[#00236f] mr-4 text-2xl">picture_as_pdf</span>
              <div className="flex-1 truncate">
                <p className="text-sm font-bold truncate text-[#131b2e] group-hover:text-[#00236f]">Risk_Assessment_GACC_Update.pdf</p>
                <p className="text-[10px] text-[#444651] uppercase font-medium">2.5 MB • 4 ngày trước</p>
              </div>
              <button className="text-[#00236f] bg-[#00236f]/10 px-2.5 py-1 rounded text-xs font-bold hover:bg-[#00236f]/20 transition-colors flex items-center shrink-0">
                <span className="material-symbols-outlined text-sm mr-1">download</span> Tải xuống
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button (+) */}
      <Link href="/checks/new">
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#00236f] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 ring-4 ring-[#00236f]/20 group cursor-pointer">
          <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">add</span>
        </button>
      </Link>
    </div>
  );
}

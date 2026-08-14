"use client";

import React, { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    { 
      id: "PRD-001", 
      batchId: "DURIAN-2024-889",
      name: "Sầu riêng Ri6 Tươi (Loại A)", 
      category: "Sầu riêng tươi (HS 0810.60.00)", 
      origin: "Đắk Lắk (Mã PUC: VN-DLOR-0128)",
      markets: ["Trung Quốc (GACC)"], 
      lastChecked: "28/10/2024", 
      status: "Sẵn sàng xuất khẩu",
      statusType: "success" 
    },
    { 
      id: "PRD-002", 
      batchId: "DURIAN-2024-912",
      name: "Sầu riêng Monthong Dona (Cơm vàng)", 
      category: "Sầu riêng tươi (HS 0810.60.00)", 
      origin: "Tiền Giang (Mã PUC: VN-TGOR-0095)",
      markets: ["Trung Quốc (GACC)"], 
      lastChecked: "26/10/2024", 
      status: "Cần rà soát Cadmium",
      statusType: "error" 
    },
    { 
      id: "PRD-003", 
      batchId: "DURIAN-2024-301",
      name: "Sầu riêng Ri6 Cắt Già", 
      category: "Sầu riêng tươi (HS 0810.60.00)", 
      origin: "Bến Tre (Mã PUC: VN-BTOR-0042)",
      markets: ["Trung Quốc (GACC)"], 
      lastChecked: "25/10/2024", 
      status: "Sẵn sàng xuất khẩu",
      statusType: "success" 
    },
    { 
      id: "PRD-004", 
      batchId: "DURIAN-2024-104",
      name: "Sầu riêng Musang King Việt Nam", 
      category: "Sầu riêng đặc sản", 
      origin: "Lâm Đồng (Mã PUC: VN-LDOR-0019)",
      markets: ["Trung Quốc (GACC)"], 
      lastChecked: "20/10/2024", 
      status: "Đang thẩm định AI",
      statusType: "warning" 
    },
  ];

  const handleAskAIAboutProduct = (product: typeof products[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to AI consultation page with product context in state/query
    router.push(`/checks/new?product=${encodeURIComponent(product.name)}&batch=${encodeURIComponent(product.batchId)}`);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.batchId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#191c1e] mb-2">Danh mục Sản phẩm &amp; Lô hàng</h2>
          <p className="text-[#434653] text-sm">Quản lý hồ sơ sản phẩm, mã lô hàng xuất khẩu và kết nối thẩm định tuân thủ AI.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/new">
            <button className="px-4 py-2 bg-[#00327d] text-white font-semibold text-sm rounded-lg hover:bg-[#0047ab] transition-colors flex items-center gap-2 shadow-xs cursor-pointer">
              <span className="material-symbols-outlined text-sm">auto_awesome</span> Quét tuân thủ Lô hàng mới
            </button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-[#c3c6d5]/60 shadow-xs">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#434653] text-base">search</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm, mã Lô hàng (vd: DURIAN-2024-889)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f7f9fb] border border-[#c3c6d5] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00327d] text-[#191c1e]"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-[#f7f9fb] text-[#434653] border border-[#c3c6d5] rounded-lg text-xs font-semibold hover:bg-[#eceef0] transition-colors flex items-center gap-1.5 cursor-pointer">
            <span className="material-symbols-outlined text-sm">filter_alt</span> Bộ lọc thị trường
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            onClick={() => router.push(`/products/${product.id.toLowerCase()}`)}
            className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 hover:border-[#00327d]/60 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Left Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0047ab]/10 border border-[#0047ab]/20 flex items-center justify-center text-[#00327d] flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-2xl">inventory_2</span>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-sans text-lg font-bold text-[#191c1e] group-hover:text-[#00327d] transition-colors">
                      {product.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-[#eceef0] text-[#434653] text-[11px] font-bold rounded">
                      {product.id}
                    </span>
                    <span className="px-2 py-0.5 bg-[#d2e0fe]/60 text-[#00327d] text-[11px] font-bold rounded border border-[#00327d]/20">
                      Lô: {product.batchId}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#434653]">
                    <span>Nguồn gốc: <strong>{product.origin}</strong></span>
                    <span>•</span>
                    <span>Thị trường: <strong>{product.markets.join(", ")}</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Actions & AI Link */}
              <div className="flex items-center gap-6 self-end lg:self-center">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[#737784] uppercase tracking-wider mb-1">Kiểm tra lần cuối</p>
                  <p className="text-xs font-semibold text-[#191c1e]">{product.lastChecked}</p>
                </div>

                <div className="text-right w-36">
                  {product.statusType === 'success' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#b5f1bf] text-[#18512c] text-xs font-semibold rounded-full w-full justify-center">
                      <span className="material-symbols-outlined text-xs">check_circle</span> {product.status}
                    </span>
                  )}
                  {product.statusType === 'error' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#ffdad6] text-[#93000a] text-xs font-semibold rounded-full border border-[#ba1a1a]/20 w-full justify-center">
                      <span className="material-symbols-outlined text-xs">error</span> {product.status}
                    </span>
                  )}
                  {product.statusType === 'warning' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#d2e0fe] text-[#55637d] text-xs font-semibold rounded-full w-full justify-center">
                      <span className="material-symbols-outlined text-xs">hourglass_top</span> {product.status}
                    </span>
                  )}
                </div>

                {/* Direct AI Consultation Button linked to this Product & Batch */}
                <button
                  onClick={(e) => handleAskAIAboutProduct(product, e)}
                  className="px-3 py-2 bg-[#00327d]/10 hover:bg-[#00327d] text-[#00327d] hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-[#00327d]/30"
                  title="Hỏi AI về lô hàng này"
                >
                  <span className="material-symbols-outlined text-sm">smart_toy</span> Hỏi AI
                </button>

                <span className="material-symbols-outlined text-[#737784] group-hover:text-[#00327d] group-hover:translate-x-1 transition-all">
                  chevron_right
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

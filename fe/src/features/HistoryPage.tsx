"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronRight, FileText, Filter, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  type BadgeVariant = "default" | "destructive" | "secondary";

  const tableData = [
    { id: "#DURIAN-2026-CN088", product: "Sầu riêng Tươi Ri6 (Loại 1)", market: "Trung Quốc (GACC)", date: "11/08/2026 10:30", status: "TUÂN THỦ CÓ ĐIỀU KIỆN", statusType: "secondary", iconColor: "bg-[#00327d]" },
    { id: "#DURIAN-2026-CN092", product: "Sầu riêng Tươi Dona (Monthong)", market: "Trung Quốc (GACC)", date: "10/08/2026 14:20", status: "SẴN SÀNG XUẤT KHẨU", statusType: "default", iconColor: "bg-[#18512c]" },
    { id: "#DURIAN-2026-CN104", product: "Sầu riêng Cấp đông Nguyên quả", market: "Trung Quốc (GACC)", date: "09/08/2026 11:30", status: "CẦN RÀ SOÁT MRL", statusType: "destructive", iconColor: "bg-[#93000a]" },
    { id: "#DURIAN-2026-CN112", product: "Sầu riêng Cấp đông Múi khay", market: "Trung Quốc (GACC)", date: "08/08/2026 16:05", status: "SẴN SÀNG XUẤT KHẨU", statusType: "default", iconColor: "bg-[#18512c]" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center text-xs font-mono text-outline uppercase tracking-wider">
        <Link href="/dashboard" className="hover:text-primary transition-colors">DASHBOARD</Link>
        <ChevronRight className="mx-2 h-3 w-3 text-outline" />
        <span className="text-[#00327d] font-bold">LỊCH SỬ THẨM ĐỊNH SẦU RIÊNG GACC</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-on-surface mb-1">Lịch sử Thẩm định Tuân thủ Sầu riêng</h1>
          <p className="text-xs text-on-surface-variant">Lưu trữ toàn bộ phiên kiểm tra quy tắc MRL Cadmium, Phytosanitary PSC và mã số GACC của Lô sầu riêng.</p>
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-mono text-outline uppercase mb-1">SẮP XẾP THEO</span>
            <select className="h-9 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-xs font-bold text-[#00327d] focus:border-[#00327d] focus:outline-none">
                <option>Phiên mới nhất</option>
            </select>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-[#c3c6d5]/60 shadow-xs">
        <div className="flex-1 max-w-xs">
          <label className="block text-[10px] font-mono text-outline uppercase mb-1 font-bold">KHOẢNG THỜI GIAN</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-outline" />
            <Input type="text" placeholder="11/08/2026" className="pl-9 h-9 text-xs" />
          </div>
        </div>
        <div className="flex-1 max-w-xs">
          <label className="block text-[10px] font-mono text-outline uppercase mb-1 font-bold">DÒNG SẦU RIÊNG</label>
          <select className="block h-9 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-xs font-sans text-on-surface">
            <option>Tất cả sản phẩm Sầu riêng</option>
            <option>Sầu riêng Tươi Ri6 (0810.60.00)</option>
            <option>Sầu riêng Tươi Dona (0810.60.00)</option>
            <option>Sầu riêng Cấp đông (0811.90.00)</option>
          </select>
        </div>
        <div className="flex-1 max-w-xs">
          <label className="block text-[10px] font-mono text-outline uppercase mb-1 font-bold">THỊ TRƯỜNG MỤC TIÊU</label>
          <select className="block h-9 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-xs font-sans text-on-surface">
            <option>Trung Quốc (GACC Protocol)</option>
          </select>
        </div>
        <Button variant="default" className="flex-shrink-0 h-9 px-5 bg-[#00327d] hover:bg-[#0047ab] text-white text-xs font-bold rounded-lg">
          <Filter className="mr-2 h-3.5 w-3.5" /> Áp dụng bộ lọc
        </Button>
      </div>

      {/* Main Table */}
      <Card className="border-[#c3c6d5]/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#00327d] text-white uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3.5">MÃ LÔ HÀNG SẦU RIÊNG</th>
                <th className="px-6 py-3.5">SẢN PHẨM &amp; DÒNG NÔNG SẢN</th>
                <th className="px-6 py-3.5">THỊ TRƯỜNG</th>
                <th className="px-6 py-3.5">THỜI GIAN QUÉT AI</th>
                <th className="px-6 py-3.5">TRẠNG THÁI GACC</th>
                <th className="px-6 py-3.5 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c6d5]/40 text-[#191c1e]">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#00327d]">{row.id}</td>
                  <td className="px-6 py-4 font-bold">{row.product}</td>
                  <td className="px-6 py-4 text-[#434653] font-semibold">{row.market}</td>
                  <td className="px-6 py-4 text-[#737784] font-mono">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                      row.statusType === 'default' 
                        ? 'bg-[#e8f5e9] text-[#18512c] border-[#18512c]/30'
                        : row.statusType === 'destructive'
                        ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/30'
                        : 'bg-[#fef9c3] text-[#854d0e] border-[#fde047]'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href="/reports/1">
                      <Button variant="ghost" className="h-8 px-3 text-[#00327d] hover:bg-[#00327d]/10 font-bold text-xs">
                        <FileText className="mr-1.5 h-3.5 w-3.5" /> Xem Báo cáo
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

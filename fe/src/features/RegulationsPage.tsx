"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, ShieldCheck, Sparkles, AlertTriangle, ExternalLink } from "lucide-react";

export default function RegulationsPage() {
  type BadgeVariant = "default" | "destructive" | "secondary";

  const documents = [
    {
      type: "NGHỊ ĐỊNH THƯ GACC",
      typeVariant: "destructive",
      date: "Cập nhật: 11/08/2026",
      title: "Nghị định thư Kiểm dịch Thực vật Sầu riêng Tươi (GACC & MARD 2022)",
      desc: "Quy định mã số Vùng trồng (PUC), Mã số Cơ sở Đóng gói (PHC), kiểm soát 05 loài sinh vật kiểm dịch và dòng khai báo Phytosanitary bắt buộc."
    },
    {
      type: "KIM LOẠI NẶNG GB 2762",
      typeVariant: "destructive",
      date: "Cập nhật: 01/08/2026",
      title: "Tiêu chuẩn Quốc gia Trung Quốc GB 2762-2022: Giới hạn Cadmium (Cd)",
      desc: "Quy định ngưỡng tối đa cho phép Cadmium trong sầu riêng tươi <= 0.05 mg/kg. Đây là tiêu chí kiểm tra tần suất cao nhất của GACC tại cửa khẩu."
    },
    {
      type: "MRL BẢO VỆ THỰC VẬT",
      typeVariant: "default",
      date: "Cập nhật: 28/07/2026",
      title: "Tiêu chuẩn GB 2763-2021: Ngưỡng MRL Dithiocarbamates & Chlorpyrifos",
      desc: "Ngưỡng Dithiocarbamates <= 2.0 mg/kg, Chlorpyrifos <= 0.01 mg/kg (nghiêm cấm sử dụng). Áp dụng cho nông sản xuất khẩu sang Trung Quốc."
    },
    {
      type: "LỆNH GACC 248 & 249",
      typeVariant: "secondary",
      date: "Cập nhật: 15/07/2026",
      title: "Quản lý Đăng ký Doanh nghiệp & Ghi nhãn phụ Tiếng Trung (Decree 248/249)",
      desc: "Yêu cầu bắt buộc in dán nhãn phụ tiếng Trung chứa thông tin PUC, PHC và dòng chữ '输往中华人民共和国' trên 100% thùng sầu riêng."
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00327d] uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-[#00327d]" /> THƯ VIỆN PHÁP LÝ HẢI QUAN TRUNG QUỐC (GACC)
          </div>
          <h1 className="text-3xl font-serif font-bold text-on-surface mb-2">Thư viện Quy định Sầu riêng Xuất khẩu Trung Quốc</h1>
          <p className="text-sm text-on-surface-variant max-w-3xl">Tra cứu Nghị định thư Hải quan GACC, Tiêu chuẩn MRL GB 2762/2763 và Lệnh 248/249 áp dụng cho Sầu riêng Tươi &amp; Cấp đông (Mã HS: 0810.60.00 / 0811.90.00).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2 text-[#00327d]">
               <span className="w-6 h-6 rounded-full bg-[#00327d] flex items-center justify-center text-white text-xs font-bold">🇨🇳</span> Thị trường Xuất khẩu Trọng điểm
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-between p-3.5 rounded-xl border-2 border-[#00327d] bg-[#f7f9fb] text-[#00327d] gap-2 transition-all cursor-pointer font-bold">
                <span className="text-sm">Trung Quốc (GACC)</span>
                <span className="text-xs bg-[#00327d] text-white px-2 py-0.5 rounded">ƯU TIÊN MVP</span>
              </button>
              <button className="flex items-center justify-between p-3.5 rounded-xl border border-outline-variant hover:border-outline gap-2 transition-all text-on-surface-variant cursor-not-allowed opacity-60">
                <span className="text-sm">Châu Âu (EUDR)</span>
                <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">Sau MVP</span>
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2 text-[#00327d]">
               <ShieldCheck className="w-5 h-5 text-[#00327d]" /> Phân loại Tiêu chuẩn GACC
            </h3>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-[#00327d] bg-[#f7f9fb] cursor-pointer">
                <div className="w-4 h-4 rounded border border-[#00327d] bg-[#00327d] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="font-bold text-[#00327d] text-xs">MRL Dư lượng &amp; Cadmium (GB 2762 / 2763)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant cursor-pointer hover:bg-surface-container-lowest">
                <div className="w-4 h-4 rounded border border-outline-variant flex items-center justify-center"></div>
                <span className="text-on-surface text-xs font-medium">Mã PUC Vùng trồng &amp; Mã PHC Cơ sở đóng gói</span>
              </label>
            </div>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold">Văn bản Pháp lý GACC Sầu riêng (4 Văn bản cốt lõi)</h2>
            <div className="flex items-center gap-2">
                <span className="text-xs text-outline">Sắp xếp:</span>
                <select className="bg-transparent font-bold text-xs text-[#00327d] outline-none cursor-pointer">
                    <option>Ưu tiên Nóng nhất</option>
                </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc, idx) => (
              <Card key={idx} className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer border-[#c3c6d5]/70">
                <CardContent className="p-6 flex-1 flex flex-col space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={doc.typeVariant as BadgeVariant} className="text-[10px] py-1 font-bold">{doc.type}</Badge>
                    <span className="text-xs text-outline text-right font-mono">{doc.date}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#191c1e] leading-snug">{doc.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed flex-1">{doc.desc}</p>
                  <div className="pt-2 border-t border-outline-variant flex justify-between items-center text-xs font-bold text-[#00327d]">
                    <span>Xem chi tiết điều khoản</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        <div>
          <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#854d0e]" /> Theo dõi Pháp lý GACC
          </h2>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
            
            <div className="relative pl-6">
               <div className="absolute left-0 top-1 w-3 h-3 bg-[#00327d] rounded-full ring-4 ring-surface"></div>
               <span className="text-[10px] font-mono font-bold text-[#00327d] tracking-wider uppercase block mb-1">MỚI CẬP NHẬT</span>
               <h4 className="font-bold text-on-surface text-xs mb-1">GACC: Tăng tần suất kiểm tra Cadmium</h4>
               <p className="text-xs text-on-surface-variant mb-2">Hải quan Trung Quốc tăng tỷ lệ lấy mẫu Cadmium lên 30% tại cửa khẩu.</p>
               <a href="#" className="text-xs font-bold text-[#00327d] hover:underline">Xem hướng dẫn rà soát</a>
            </div>

            <div className="relative pl-6">
               <div className="absolute left-0 top-1 w-3 h-3 bg-[#854d0e] rounded-full ring-4 ring-surface"></div>
               <span className="text-[10px] font-mono font-bold text-[#854d0e] tracking-wider uppercase block mb-1">YÊU CẦU NHÃN PHỤ</span>
               <h4 className="font-bold text-on-surface text-xs mb-1">Lệnh 248/249: Kiểm tra tem tiếng Trung</h4>
               <p className="text-xs text-on-surface-variant mb-2">Bắt buộc in bổ sung mã PUC &amp; PHC tiếng Trung trên 100% thùng hàng.</p>
            </div>

          </div>
        </div>

        <div className="bg-[#00327d] rounded-2xl p-6 text-white relative overflow-hidden space-y-4 shadow-sm">
            <div className="relative z-10 text-center flex flex-col items-center space-y-2">
                <Settings className="w-8 h-8 text-white/90" />
                <h3 className="font-serif text-base font-bold">ĐỘNG CƠ AI GACC COMPLY</h3>
                <p className="text-xs text-white/80 leading-relaxed">Tự động đối soát hồ sơ sầu riêng của bạn với Nghị định thư Hải quan GACC mới nhất.</p>
                <Button className="w-full bg-white text-[#00327d] hover:bg-[#f7f9fb] font-bold text-xs mt-2">Phân tích hồ sơ ngay</Button>
            </div>
        </div>

      </div>
    </div>
  );
}

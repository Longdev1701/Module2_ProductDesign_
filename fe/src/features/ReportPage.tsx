"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, ChevronRight, AlertTriangle, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-xs font-mono text-outline uppercase tracking-wider mb-6">
        <Link href="/history" className="hover:text-primary transition-colors">LỊCH SỬ KIỂM TRA</Link>
        <ChevronRight className="mx-2 h-3 w-3" />
        <span className="text-primary font-semibold">BÁO CÁO #LOT-2024-001</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-serif font-bold text-on-surface mb-4">Phân tích xuất khẩu cà phê</h1>
              <div className="flex items-center gap-6 text-sm text-on-surface-variant font-mono">
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-outline flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-outline"></div></span> Điểm đến: EU (Liên minh Châu Âu)</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 border border-outline rounded-sm flex items-center justify-center text-[10px]">24</span> 24 tháng 10, 2023</div>
              </div>
            </div>
            <Badge variant="destructive" className="text-sm px-3 py-1">KHÔNG TUÂN THỦ</Badge>
          </div>

          <div className="text-sm text-error bg-error-container p-3 rounded text-right ml-auto max-w-xs mb-8">
             Phát hiện các sai lệch nghiêm trọng về mức MRL và yêu cầu nhãn mác bắt buộc theo EU 1169/2011.
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-container-low p-4 rounded border-l-4 border-error">
                <p className="text-xs font-mono text-outline uppercase mb-1">TUÂN THỦ MRL</p>
                <p className="text-xl font-bold text-error">Không đạt (1/8)</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded border-l-4 border-secondary-container">
                <p className="text-xs font-mono text-outline uppercase mb-1">TÍNH TOÀN VẸN NHÃN MÁC</p>
                <p className="text-xl font-bold text-secondary">Cảnh báo (2)</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded border-l-4 border-primary">
                <p className="text-xs font-mono text-outline uppercase mb-1">TÀI LIỆU</p>
                <p className="text-xl font-bold text-primary">Đã xác minh</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                Phân tích sai lệch quy định
            </h3>
            <span className="text-xs border border-outline rounded px-2 py-1">Tìm thấy 4 vấn đề</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-surface-container-low text-xs font-mono uppercase text-outline">
                <tr>
                  <th className="px-6 py-4 font-semibold w-1/4">YÊU CẦU</th>
                  <th className="px-6 py-4 font-semibold w-1/6">TRẠNG THÁI</th>
                  <th className="px-6 py-4 font-semibold w-1/3">SAI LỆCH</th>
                  <th className="px-6 py-4 font-semibold">CÁCH KHẮC PHỤC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                <tr>
                  <td className="px-6 py-4 font-medium">Giới hạn dư lượng thuốc BVTV</td>
                  <td className="px-6 py-4"><span className="text-error flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Nghiêm trọng</span></td>
                  <td className="px-6 py-4">Chlorpyrifos vượt ngưỡng cho phép của EU.</td>
                  <td className="px-6 py-4 text-primary font-medium">Cần phân loại lại lô hàng; điều chỉnh nguồn cung ứng.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Bản địa hóa ngôn ngữ</td>
                  <td className="px-6 py-4"><span className="text-secondary flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Cảnh báo</span></td>
                  <td className="px-6 py-4">Thiếu bản dịch tiếng Pháp/Đức cho thành phần.</td>
                  <td className="px-6 py-4 text-primary font-medium">Cập nhật mẫu nhãn mác với khối đa ngôn ngữ.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Công bố dinh dưỡng</td>
                  <td className="px-6 py-4"><span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Đạt</span></td>
                  <td className="px-6 py-4">Định dạng tuân thủ Quy định 1169/2011.</td>
                  <td className="px-6 py-4 text-outline">Không cần thao tác.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Hiển thị khối lượng tịnh</td>
                  <td className="px-6 py-4"><span className="text-secondary flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Cảnh báo</span></td>
                  <td className="px-6 py-4">Chiều cao phông chữ (2.8mm) dưới mức tối thiểu EU (3.0mm).</td>
                  <td className="px-6 py-4 text-primary font-medium">Tăng cỡ chữ cho trường "Khối lượng tịnh".</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-surface-container-low text-xs text-outline italic border-t border-outline-variant flex items-center gap-2">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
             Cập nhật lần cuối với Công báo EU L 327/1 (Tháng 10/2023)
          </div>
        </Card>

        <Card className="p-6">
           <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Phân tích thị giác nhãn mác
           </h3>
           <div className="bg-surface-container rounded-lg p-4 relative overflow-hidden border border-outline-variant">
              {/* Fake image representation with bounding boxes */}
              <div className="w-full h-64 bg-white relative rounded flex items-center justify-center border border-outline-variant overflow-hidden">
                 <div className="w-48 h-56 bg-stone-800 rounded relative shadow-xl transform -rotate-2 flex flex-col items-center pt-8">
                    <div className="w-16 h-16 rounded-full border-2 border-red-500 absolute top-4 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="text-white font-serif text-xl mt-12 tracking-widest uppercase">Aurora</div>
                    <div className="text-xs text-stone-400 mt-1 uppercase tracking-widest">Coffee Co.</div>
                    
                    <div className="mt-8 border border-red-500 w-32 h-12 absolute bottom-12 right-2 bg-red-500/20"></div>
                 </div>
                 
                 <div className="absolute top-4 right-4 w-64 bg-error-container border border-red-200 rounded p-2 text-xs shadow-lg">
                    <p className="font-bold text-error mb-1">COMPLIANCE FLAG:</p>
                    <p className="text-on-error-container">Missing conversion to metric/imperial. Required by EU/FDA.</p>
                 </div>
                 <div className="absolute bottom-4 right-4 w-64 bg-secondary-container border border-orange-200 rounded p-2 text-xs shadow-lg">
                    <p className="font-bold text-secondary mb-1">COMPLIANCE FLAG:</p>
                    <p className="text-on-secondary-container">Missing allergen statement or warning regulation required.</p>
                 </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-primary text-white text-xs px-3 py-1.5 rounded flex items-center gap-2 shadow-md">
                 <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                 Đã kích hoạt nhận diện AI Vision
              </div>
           </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        <Button className="w-full justify-between bg-primary hover:bg-primary-container text-white h-12">
           <div className="flex items-center gap-2"><FileText className="w-4 h-4"/> Xuất phân tích PDF</div>
           <ChevronRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" className="w-full justify-between h-12">
           <div className="flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
               Tạo SOP cho nhà máy
           </div>
           <ChevronRight className="w-4 h-4" />
        </Button>

        <Card className="p-6">
           <h4 className="text-xs font-mono text-outline uppercase mb-4 tracking-wider">ĐIỂM TIN CẬY CỦA AI</h4>
           <div className="flex items-end gap-2 mb-2">
               <div className="text-4xl font-bold text-primary">94%</div>
           </div>
           <div className="w-full bg-surface-container rounded-full h-2 mb-4">
              <div className="bg-primary h-2 rounded-full w-[94%]"></div>
           </div>
           <p className="text-xs text-on-surface-variant">94% xác suất chính xác dựa trên CSDL Thuốc bảo vệ thực vật EU (v2.4) và các quy định chính thức.</p>
        </Card>

        <Card className="p-6">
           <h4 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              Kết quả Lab MRL
           </h4>
           <div className="space-y-4">
              <div className="pb-4 border-b border-outline-variant">
                 <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm">Chlorpyrifos</span>
                    <span className="text-xs font-bold text-error">KHÔNG ĐẠT</span>
                 </div>
                 <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Giới hạn EU: <strong className="text-on-surface">0.01 mg/kg</strong></span>
                    <span>Phát hiện: <strong className="text-error">0.035 mg/kg</strong></span>
                 </div>
              </div>
              <div className="pb-4 border-b border-outline-variant">
                 <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm">Glyphosate</span>
                    <span className="text-xs font-bold text-green-600">ĐẠT</span>
                 </div>
                 <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Giới hạn EU: <strong className="text-on-surface">0.1 mg/kg</strong></span>
                    <span>Phát hiện: <strong className="text-on-surface">0.02 mg/kg</strong></span>
                 </div>
              </div>
              <div className="pb-4 border-b border-outline-variant">
                 <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm">Deltamethrin</span>
                    <span className="text-xs font-bold text-green-600">ĐẠT</span>
                 </div>
                 <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Giới hạn EU: <strong className="text-on-surface">2.0 mg/kg</strong></span>
                    <span>Phát hiện: <strong className="text-on-surface">0.45 mg/kg</strong></span>
                 </div>
              </div>
           </div>
           <Button variant="ghost" className="w-full mt-2 text-primary text-xs uppercase tracking-wider font-semibold">Xem nhật ký Pesticide đầy đủ</Button>
        </Card>

        <Card className="p-6 bg-surface-container-low border-none">
           <h4 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              Trích dẫn quy định
           </h4>
           <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-outline-variant">
                 <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-primary text-sm hover:underline cursor-pointer">Quy định EU 1169/2011</span>
                    <ExternalLink className="w-3 h-3 text-outline" />
                 </div>
                 <p className="text-xs text-on-surface-variant">Cung cấp thông tin thực phẩm cho người tiêu dùng. Điều 9, 10 và Phụ lục IX (Yêu cầu ghi nhãn).</p>
              </div>
              <div className="bg-white p-4 rounded border border-outline-variant">
                 <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-primary text-sm hover:underline cursor-pointer">Quy định EC 396/2005</span>
                    <ExternalLink className="w-3 h-3 text-outline" />
                 </div>
                 <p className="text-xs text-on-surface-variant">Mức dư lượng thuốc bảo vệ thực vật tối đa trong hoặc trên thực phẩm và thức ăn chăn nuôi có nguồn gốc thực vật và động vật.</p>
              </div>
              <div className="bg-white p-4 rounded border border-outline-variant">
                 <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-primary text-sm hover:underline cursor-pointer">Cơ sở dữ liệu Pesticide EU</span>
                    <ExternalLink className="w-3 h-3 text-outline" />
                 </div>
                 <p className="text-xs text-on-surface-variant">Tra cứu trực tiếp các ngưỡng Chlorpyrifos (ID chất: 154) và các miễn trừ tạm thời.</p>
              </div>
           </div>
           <p className="mt-4 text-[10px] text-outline italic">
              MIỄN TRỪ TRÁCH NHIỆM: Phân tích AI này cung cấp tư vấn tuân thủ xác suất cao dựa trên cơ sở dữ liệu chính thức. Nó không thay thế cho tư vấn pháp lý hoặc chứng nhận chính thức từ cơ quan có thẩm quyền.
           </p>
        </Card>
      </div>
    </div>
    </div>
  );
}

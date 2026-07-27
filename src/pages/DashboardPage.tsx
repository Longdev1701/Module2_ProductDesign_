import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ArrowRight, Globe, Plus, AlertCircle, Info, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const activities = [
    { id: "LOT-2024-001", product: "Cà phê hạt Arabica", market: "EU / Đức", date: "24 Th10, 2024", status: "TUÂN THỦ", statusVariant: "default" },
    { id: "LOT-2024-002", product: "Đậu nành hữu cơ", market: "USA / California", date: "23 Th10, 2024", status: "CHỜ XỬ LÝ", statusVariant: "secondary" },
    { id: "LOT-2024-984", product: "Chuối Cavendish tươi", market: "Nhật Bản / Osaka", date: "22 Th10, 2024", status: "CẢNH BÁO", statusVariant: "warning" },
    { id: "LOT-2024-005", product: "Thức ăn ủ chua bắp", market: "Toàn cầu", date: "20 Th10, 2024", status: "TUÂN THỦ", statusVariant: "default" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">Tổng quan tuân thủ</h1>
              <p className="text-on-surface-variant">Chào mừng trở lại. Danh mục của bạn hiện đang tuân thủ <strong className="text-primary">92%</strong>.</p>
            </div>
            <div className="flex gap-4">
               <Button variant="outline" className="h-10 text-primary border-primary">Lọc theo thị trường</Button>
               <Button className="h-10 gap-2"><Plus className="w-4 h-4" /> Kiểm tra tuân thủ mới</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <h3 className="text-lg font-serif font-bold absolute top-6 left-6 text-on-surface flex items-center gap-2">Sức khỏe toàn cầu <FileText className="w-4 h-4 text-outline" /></h3>
              
              <div className="relative w-48 h-48 mt-8 mb-6">
                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#eaedff" strokeWidth="12" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00236f" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="20.096" className="transition-all duration-1000 ease-out" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-primary">92%</span>
                    <span className="text-xs font-mono font-bold text-outline mt-1">TỐI ƯU</span>
                 </div>
              </div>

              <div className="w-full space-y-3">
                 <div className="flex justify-between items-center text-sm font-semibold">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span> Tuân thủ</div>
                    <span>142</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-semibold">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary-container"></span> Đang xem xét</div>
                    <span>12</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-semibold">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-error"></span> Rủi ro cao</div>
                    <span className="text-error">2</span>
                 </div>
              </div>
           </Card>

           <Card className="md:col-span-2 p-6 flex flex-col">
              <h3 className="text-xl font-serif font-bold mb-4">Bản đồ tuân thủ thị trường</h3>
              <p className="text-sm text-on-surface-variant mb-4">Hồ sơ rủi ro các kênh xuất khẩu hoạt động</p>
              
              <div className="flex-1 bg-surface-container rounded-lg relative overflow-hidden flex items-center justify-center border border-outline-variant">
                 {/* Map Placeholder */}
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#00236f 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                 <Globe className="w-32 h-32 text-primary opacity-50 absolute" />
                 
                 <div className="absolute bottom-4 left-4 flex gap-4">
                    <div className="bg-white p-3 rounded shadow-lg border-l-4 border-primary flex flex-col">
                       <span className="text-xs font-mono text-outline uppercase font-bold mb-1">KHU VỰC EU</span>
                       <span className="font-bold text-primary">98% Tuân thủ</span>
                    </div>
                    <div className="bg-white p-3 rounded shadow-lg border-l-4 border-secondary-container flex flex-col">
                       <span className="text-xs font-mono text-outline uppercase font-bold mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 text-secondary"/> THỊ TRƯỜNG NHẬT</span>
                       <span className="font-bold text-on-surface">Theo dõi MRL mới</span>
                    </div>
                 </div>
                 
                 <div className="absolute top-4 right-4 flex gap-2">
                    <Badge variant="default" className="text-[10px]">EU</Badge>
                    <Badge variant="secondary" className="text-[10px]">USA</Badge>
                    <Badge variant="secondary" className="text-[10px]">NHẬT BẢN</Badge>
                 </div>
              </div>
           </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="bg-primary hover:bg-primary-container transition-colors cursor-pointer text-white p-6 flex justify-between items-center group">
              <div>
                 <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5 text-white" />
                 </div>
                 <h3 className="text-xl font-serif font-bold mb-1">Kịch bản A: Trước sản xuất</h3>
                 <p className="text-sm text-primary-fixed-dim">Đánh giá chất lượng đất và hạt giống cho thị trường EU.</p>
              </div>
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
           </Card>

           <Card className="bg-inverse-surface hover:bg-tertiary transition-colors cursor-pointer text-white p-6 flex justify-between items-center group">
              <div>
                 <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center mb-4 text-xs font-mono">
                    B
                 </div>
                 <h3 className="text-xl font-serif font-bold mb-1">Kịch bản B: Sau thu hoạch</h3>
                 <p className="text-sm text-tertiary-fixed-dim">Xác minh lô hàng cuối và chuẩn bị chứng nhận kiểm dịch.</p>
              </div>
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
           </Card>
        </div>

        <Card>
           <div className="flex justify-between items-center p-6 border-b border-outline-variant">
              <h3 className="text-xl font-serif font-bold">Hoạt động gần đây</h3>
              <a href="#" className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">Xem tất cả hồ sơ <ChevronRight className="w-4 h-4"/></a>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans">
                 <thead className="text-xs font-mono uppercase text-outline bg-surface-container-low border-b border-outline-variant">
                    <tr>
                       <th className="px-6 py-4 font-semibold">MÃ LÔ HÀNG</th>
                       <th className="px-6 py-4 font-semibold">SẢN PHẨM</th>
                       <th className="px-6 py-4 font-semibold">THỊ TRƯỜNG</th>
                       <th className="px-6 py-4 font-semibold">NGÀY KIỂM TRA</th>
                       <th className="px-6 py-4 font-semibold">TRẠNG THÁI</th>
                    </tr>
                 </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {activities.map((item, i) => (
                       <tr key={i} className="hover:bg-surface-container-lowest">
                          <td className="px-6 py-4 font-medium text-primary">
                            <Link to="/report/1" className="hover:underline">{item.id}</Link>
                          </td>
                          <td className="px-6 py-4 font-semibold">{item.product}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{item.market}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{item.date}</td>
                          <td className="px-6 py-4">
                             <Badge variant={item.statusVariant as any} className="px-2 py-1 flex items-center gap-1.5 w-max">
                                <div className={`w-1.5 h-1.5 rounded-full ${item.statusVariant === 'default' ? 'bg-white' : (item.statusVariant === 'warning' ? 'bg-error' : 'bg-primary')}`}></div>
                                {item.status}
                             </Badge>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-6 flex flex-col">
         <Card className="flex-1 flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif font-bold">Cảnh báo quan trọng</h3>
                  <Badge variant="destructive" className="rounded-sm px-1 py-0 text-[10px]">3 MỚI</Badge>
               </div>
               
               <div className="space-y-4 flex-1">
                  <div className="border-l-4 border-error bg-error-container p-4 rounded-r relative shadow-sm">
                     <h4 className="font-bold text-error text-sm flex items-start gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        Cập nhật MRL cho Cà phê tại EU
                     </h4>
                     <p className="text-xs text-on-error-container mb-2 ml-6">Quy định (EU) 2024/918 điều chỉnh mức Chlorpyrifos. Cần hành động ngay.</p>
                     <p className="text-[10px] text-error ml-6 font-mono">2 GIỜ TRƯỚC</p>
                  </div>

                  <div className="border-l-4 border-secondary-container bg-[#fff8f2] p-4 rounded-r relative shadow-sm">
                     <h4 className="font-bold text-secondary text-sm flex items-start gap-2 mb-1">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        Nhật Bản: Bổ sung kiểm dịch
                     </h4>
                     <p className="text-xs text-on-secondary-container mb-2 ml-6">Yêu cầu tài liệu mới cho nông sản tươi vào Yokohama từ ngày 1/11.</p>
                     <p className="text-[10px] text-outline ml-6 font-mono">5 GIỜ TRƯỚC</p>
                  </div>

                  <div className="border-l-4 border-primary bg-surface-container-low p-4 rounded-r relative shadow-sm">
                     <h4 className="font-bold text-primary text-sm flex items-start gap-2 mb-1">
                        <Globe className="w-4 h-4 shrink-0 mt-0.5" />
                        Hệ thống: Cập nhật lõi chính sách
                     </h4>
                     <p className="text-xs text-on-surface-variant mb-2 ml-6">Mô hình AI cập nhật lên v4.2.0 (bao phủ thay đổi pháp lý Q4 2024).</p>
                     <p className="text-[10px] text-outline ml-6 font-mono">HÔM QUA</p>
                  </div>
               </div>
               
               <Button variant="outline" className="w-full mt-6 text-primary font-bold uppercase tracking-wider text-xs h-10 border-outline-variant hover:bg-surface-container-low">Xem lịch sử cảnh báo</Button>
            </CardContent>
         </Card>

         <div className="bg-error-container border border-red-200 rounded p-6 flex justify-between items-center shadow-sm">
            <div className="flex gap-4 items-center">
               <div className="w-10 h-10 bg-white rounded text-error flex items-center justify-center font-bold text-xl shadow-sm">!</div>
               <div>
                  <p className="text-xs font-mono text-error uppercase tracking-wider mb-1">RỦI RO CHƯA GIẢI QUYẾT</p>
                  <p className="text-2xl font-serif font-bold text-error">02 Mục</p>
               </div>
            </div>
            <Button variant="default" size="icon" className="h-10 w-10 shrink-0 bg-primary hover:bg-primary-container text-white"><Plus className="w-5 h-5"/></Button>
         </div>
      </div>
    </div>
  );
}

// Re-usable icon component for ChevronRight used here
function ChevronRight(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
    )
}

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Settings } from "lucide-react";

export default function RegulationsPage() {
  const documents = [
    {
      type: "KHẨN CẤP",
      typeVariant: "destructive",
      date: "Cập nhật: 12/05/2024",
      title: "Quy định (EU) 2024/1318: Giới hạn dư lượng tối đa cho Chlorpyrifos",
      desc: "Văn bản mới nhất siết chặt giới hạn MRL đối với Chlorpyrifos..."
    },
    {
      type: "TIÊU CHUẨN",
      typeVariant: "default",
      date: "Cập nhật: 01/05/2024",
      title: "FSMA: Quy tắc Truy xuất nguồn gốc Thực phẩm mục 204 (FDA)",
      desc: "Yêu cầu mới về việc lưu trữ hồ sơ bổ sung đối với các loại thự..."
    },
    {
      type: "BAO BÌ",
      typeVariant: "secondary",
      date: "Cập nhật: 28/04/2024",
      title: "Luật Tái chế Bao bì Nhật Bản (JPRL) - Sửa đổi 2024",
      desc: "Quy định mới về việc sử dụng nhựa tái sinh trong bao bì thực..."
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">Thư viện Quy định Quốc tế</h1>
          <p className="text-lg text-on-surface-variant max-w-3xl">Tra cứu và cập nhật các thay đổi pháp lý mới nhất từ các thị trường trọng điểm.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
               <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px]">E</span> Thị trường mục tiêu
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <button className="flex flex-col items-center justify-center p-3 rounded border-2 border-primary bg-surface-container-low text-primary gap-2 transition-all">
                <span className="text-2xl">€</span>
                <span className="text-xs font-semibold text-center leading-tight">EU (Châu Âu)</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded border border-outline-variant hover:border-outline gap-2 transition-all text-on-surface-variant">
                <span className="text-2xl">⚑</span>
                <span className="text-xs font-semibold text-center leading-tight">USA (Hoa Kỳ)</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded border border-outline-variant hover:border-outline gap-2 transition-all text-on-surface-variant">
                <span className="text-2xl">◎</span>
                <span className="text-xs font-semibold text-center leading-tight">Trung Quốc</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded border border-outline-variant hover:border-outline gap-2 transition-all text-on-surface-variant">
                <span className="text-2xl">❀</span>
                <span className="text-xs font-semibold text-center leading-tight">Nhật Bản</span>
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
               <span className="w-4 h-4 border border-outline flex flex-wrap"><span className="w-1/2 h-1/2 border-r border-b border-outline"></span></span> Loại tiêu chuẩn
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded border border-primary bg-surface-container-low cursor-pointer">
                <div className="w-5 h-5 rounded border border-primary bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="font-semibold text-primary text-sm">MRL (Dư lượng thuốc BVTV)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded border border-outline-variant cursor-pointer hover:bg-surface-container-lowest">
                <div className="w-5 h-5 rounded border border-outline-variant flex items-center justify-center"></div>
                <span className="text-on-surface text-sm">Bao bì & Tiếp xúc thực phẩm</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded border border-outline-variant cursor-pointer hover:bg-surface-container-lowest">
                <div className="w-5 h-5 rounded border border-outline-variant flex items-center justify-center"></div>
                <span className="text-on-surface text-sm">Nhãn mác & Truy xuất nguồn gốc</span>
              </label>
            </div>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold">Kết quả tìm kiếm (128 văn bản)</h2>
            <div className="flex items-center gap-2">
                <span className="text-sm text-outline">Sắp xếp theo:</span>
                <select className="bg-transparent font-semibold text-primary outline-none cursor-pointer">
                    <option>Mới nhất</option>
                </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((doc, idx) => (
              <Card key={idx} className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <Badge variant={doc.typeVariant as any} className="text-[10px] py-1">{doc.type}</Badge>
                    <span className="text-xs text-outline text-right leading-tight">{doc.date}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold mb-3 leading-snug">{doc.title}</h3>
                  <p className="text-sm text-on-surface-variant flex-1">{doc.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-8">
        <div>
          <h2 className="font-serif text-2xl font-bold mb-6">Theo dõi pháp lý</h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
            
            <div className="relative pl-6">
               <div className="absolute left-0 top-1 w-3 h-3 bg-primary rounded-full ring-4 ring-surface"></div>
               <span className="text-[10px] font-mono font-bold text-primary tracking-wider uppercase block mb-1">MỚI NHẤT</span>
               <h4 className="font-bold text-on-surface text-sm mb-1">EU: Thay đổi MRL Trái cây khô</h4>
               <p className="text-xs text-on-surface-variant mb-2">Vừa cập nhật 2 giờ trước. Ảnh hưởng đến 14 sản phẩm của bạn.</p>
               <a href="#" className="text-xs font-semibold text-primary hover:underline">Xem chi tiết</a>
            </div>

            <div className="relative pl-6">
               <div className="absolute left-0 top-1 w-3 h-3 bg-error rounded-full ring-4 ring-surface"></div>
               <span className="text-[10px] font-mono font-bold text-error tracking-wider uppercase block mb-1">CẢNH BÁO</span>
               <h4 className="font-bold text-on-surface text-sm mb-1">FDA: Kiểm tra nhãn mác mới</h4>
               <p className="text-xs text-on-surface-variant mb-2">Quy định có hiệu lực trong 45 ngày tới. Cần rà soát bao bì.</p>
               <a href="#" className="text-xs font-semibold text-primary hover:underline">Bắt đầu rà soát</a>
            </div>

            <div className="relative pl-6">
               <div className="absolute left-0 top-1 w-3 h-3 bg-outline-variant rounded-full ring-4 ring-surface"></div>
               <span className="text-[10px] font-mono font-bold text-outline tracking-wider uppercase block mb-1">DỰ THẢO</span>
               <h4 className="font-bold text-on-surface text-sm mb-1">Trung Quốc: Luật BVTV 2025</h4>
               <p className="text-xs text-on-surface-variant">Đang trong quá trình lấy ý kiến phản hồi công khai.</p>
            </div>

          </div>
        </div>

        <div className="bg-primary-container rounded-lg p-6 text-white relative overflow-hidden">
            <div className="relative z-10 text-center flex flex-col items-center">
                <Settings className="w-8 h-8 text-on-primary-container mb-3" />
                <h3 className="font-serif text-lg font-bold mb-2">CHẾ ĐỘ AI COMPLY</h3>
                <p className="text-sm text-on-primary-container mb-6">Sử dụng AI để tự động phân tích tác động của các luật mới đến danh mục sản phẩm của bạn.</p>
                <Button className="w-full bg-white text-primary hover:bg-surface-container-low">Phân tích ngay</Button>
            </div>
             <div className="absolute -right-4 -top-4 w-24 h-24 text-on-primary-container opacity-10">
                 <Settings className="w-full h-full" />
             </div>
        </div>

      </div>
    </div>
  );
}

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { CheckCircle2, Map, ShieldCheck, UploadCloud, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export default function NewCheckPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Lựa chọn</span>
        </div>
        <div className="w-32 h-px bg-primary mx-4"></div>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-outline flex items-center justify-center font-bold text-sm">2</div>
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Tài liệu</span>
        </div>
        <div className="w-32 h-px bg-outline-variant mx-4"></div>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-outline flex items-center justify-center font-bold text-sm">3</div>
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Phân tích</span>
        </div>
      </div>

      <div className="text-center mb-10">
         <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">Thiết lập kiểm tra mới</h1>
         <p className="text-lg text-secondary">Chọn kịch bản tuân thủ của bạn để bắt đầu quá trình xác minh pháp lý.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-primary relative cursor-pointer hover:shadow-md transition-shadow bg-surface-container-lowest">
          <div className="absolute top-4 right-4 text-primary">
            <CheckCircle2 className="w-6 h-6 fill-current text-white" />
          </div>
          <CardContent className="p-8">
             <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center mb-6">
                <Map className="w-6 h-6 text-on-primary-container" />
             </div>
             <h3 className="text-2xl font-serif font-bold mb-3">Kịch bản A: Lập kế hoạch tiền sản xuất</h3>
             <p className="text-sm text-on-surface-variant mb-6">Xác định các yêu cầu quy định cho một điểm đến và sản phẩm cụ thể trước khi bắt đầu sản xuất.</p>
             <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-on-surface">
                   <CheckCircle2 className="w-4 h-4 text-primary" /> Tra cứu thuế quan & hạn ngạch
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface">
                   <CheckCircle2 className="w-4 h-4 text-primary" /> Giới hạn dư lượng thuốc bảo vệ thực vật
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface">
                   <CheckCircle2 className="w-4 h-4 text-primary" /> Quy định về bao bì
                </li>
             </ul>
          </CardContent>
        </Card>

        <Card className="border border-outline-variant cursor-pointer hover:border-outline hover:shadow-md transition-all bg-surface-container-lowest">
           <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-outline-variant"></div>
           <CardContent className="p-8 opacity-75 hover:opacity-100">
             <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-primary" />
             </div>
             <h3 className="text-2xl font-serif font-bold mb-3">Kịch bản B: Xác minh sau thu hoạch</h3>
             <p className="text-sm text-on-surface-variant mb-6">Tải lên tài liệu hiện có để trích xuất OCR hỗ trợ AI và phân tích tuân thủ ngay lập tức.</p>
             <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-on-surface">
                   <CheckCircle2 className="w-4 h-4 text-primary" /> OCR báo cáo phòng thí nghiệm tự động
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface">
                   <CheckCircle2 className="w-4 h-4 text-primary" /> Xác minh nội dung nhãn
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface">
                   <CheckCircle2 className="w-4 h-4 text-primary" /> Kiểm tra tuân thủ cấp độ lô hàng
                </li>
             </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-surface-container-low border border-outline-variant">
         <CardContent className="p-8">
            <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-6">CHI TIẾT DỮ LIỆU ĐẦU VÀO</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div>
                     <label className="block text-sm font-mono text-on-surface mb-2">Mã lô hàng / Số tham chiếu</label>
                     <Input placeholder="COFFEE-2024-001X" className="h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-mono text-on-surface mb-2">Quốc gia đích</label>
                         <div className="relative">
                            <Map className="absolute left-3 top-3.5 h-5 w-5 text-outline" />
                            <Input placeholder="Tìm kiếm quốc gia (vd: Hà Lan)" className="pl-10 h-12" />
                         </div>
                      </div>
                      <div>
                         <label className="block text-sm font-mono text-on-surface mb-2">Tên sản phẩm</label>
                         <div className="relative">
                            <svg className="absolute left-3 top-3.5 h-5 w-5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            <Input placeholder="Tìm kiếm sản phẩm (vd: Lúa mì)" className="pl-10 h-12" />
                         </div>
                      </div>
                  </div>
                  <div>
                     <label className="block text-sm font-mono text-on-surface mb-2">Danh mục sản phẩm</label>
                     <select className="block w-full h-12 rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm font-sans focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                        <option>Chọn danh mục...</option>
                     </select>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-mono text-on-surface mb-2">Tài liệu đính kèm (PDF/Hình ảnh)</label>
                  <div className="border-2 border-dashed border-outline-variant rounded-lg p-10 flex flex-col items-center justify-center text-center bg-white h-[230px] hover:bg-surface-container-lowest transition-colors cursor-pointer">
                     <UploadCloud className="w-10 h-10 text-outline mb-4" />
                     <p className="font-bold text-primary mb-2">Kéo và thả tệp vào đây</p>
                     <p className="text-xs text-secondary px-8">Tải lên Báo cáo phòng thí nghiệm PDF hoặc ảnh Nhãn đóng gói (tối đa 20MB)</p>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
         <div className="flex items-center gap-4">
             <Button variant="outline" className="h-12 px-8 font-semibold text-secondary border-outline">Lưu bản nháp & Thoát</Button>
             <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                 <ShieldCheck className="w-5 h-5 text-primary" />
                 Công cụ AI đã sẵn sàng để phân tích tài liệu
             </div>
         </div>
         <Link to="/report">
           <Button className="h-14 px-8 text-lg gap-2 shadow-lg hover:shadow-xl transition-all">
               Chạy quét tuân thủ AI <Rocket className="w-5 h-5" />
           </Button>
         </Link>
      </div>
    </div>
  );
}

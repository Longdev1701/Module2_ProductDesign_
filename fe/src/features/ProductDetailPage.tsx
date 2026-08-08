"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, History, Info, Package, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Mock data for the specific product
  const product = {
    id: id?.toUpperCase() || "PRD-001",
    name: "Cà phê Robusta (Sơ chế ướt)",
    category: "Cà phê",
    markets: ["EU", "Nhật Bản", "USA"],
    description: "Cà phê nhân xanh Robusta, chế biến ướt, độ ẩm tối đa 12.5%. Trồng tại Đắk Lắk.",
    status: "Sẵn sàng",
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex items-center text-xs font-mono text-outline uppercase tracking-wider mb-2">
        <Link href="/products" className="hover:text-primary transition-colors">DANH MỤC SẢN PHẨM</Link>
        <span className="mx-2">/</span>
        <span className="text-primary font-semibold">{product.id}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">{product.name}</h1>
          <p className="text-on-surface-variant max-w-2xl">{product.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2"><Edit className="w-4 h-4" /> Chỉnh sửa</Button>
          <Link href="/new">
            <Button className="gap-2"><ShieldCheck className="w-4 h-4" /> Kiểm tra lô hàng mới</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Info & Requirements */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-outline-variant pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" /> Thông tin cơ sở
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-mono text-outline uppercase mb-1">Mã tham chiếu nội bộ</p>
                <p className="font-semibold text-on-surface">{product.id}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-outline uppercase mb-1">Nhóm ngành hàng</p>
                <p className="font-semibold text-on-surface">{product.category}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-outline uppercase mb-1">HS Code (Đề xuất)</p>
                <p className="font-semibold text-on-surface">0901.11.10</p>
              </div>
              <div>
                <p className="text-xs font-mono text-outline uppercase mb-1">Trạng thái hồ sơ</p>
                <Badge variant="success">{product.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-outline-variant pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Tiêu chuẩn thị trường mục tiêu
              </CardTitle>
              <div className="flex gap-2">
                {product.markets.map(m => (
                  <Badge key={m} variant="secondary" className="text-[10px]">{m}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-outline-variant">
                <div className="p-6 flex flex-col md:flex-row gap-6 hover:bg-surface-container-lowest transition-colors">
                  <div className="md:w-1/3">
                    <h4 className="font-bold text-on-surface mb-1">Dư lượng MRL (EU)</h4>
                    <p className="text-xs text-on-surface-variant">Quy định (EC) 396/2005</p>
                  </div>
                  <div className="md:w-2/3 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">Chlorpyrifos</span>
                      <span className="font-mono font-semibold">≤ 0.01 mg/kg</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">Glyphosate</span>
                      <span className="font-mono font-semibold">≤ 0.1 mg/kg</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">Ochratoxin A (OTA)</span>
                      <span className="font-mono font-semibold">≤ 5.0 µg/kg</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col md:flex-row gap-6 hover:bg-surface-container-lowest transition-colors">
                  <div className="md:w-1/3">
                    <h4 className="font-bold text-on-surface mb-1">Bao bì & Nhãn (FDA)</h4>
                    <p className="text-xs text-on-surface-variant">FSMA & 21 CFR 101</p>
                  </div>
                  <div className="md:w-2/3 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">Bảng thông tin dinh dưỡng</span>
                      <Badge variant="outline" className="text-[10px]">Bắt buộc</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">Cảnh báo dị ứng (Allergen)</span>
                      <Badge variant="outline" className="text-[10px]">Bắt buộc</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: History & Stats */}
        <div className="space-y-6">
          <Card className="bg-primary-container text-on-primary-container border-none">
            <CardContent className="p-6">
              <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" /> Đánh giá tuân thủ
              </h3>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-bold font-serif">96%</span>
                <span className="text-sm pb-1 opacity-80">Tỉ lệ đạt</span>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                Sản phẩm này có tỉ lệ tuân thủ rất cao ở thị trường EU. Gần đây cần lưu ý một số cảnh báo về nhãn mác ở thị trường USA.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-outline" /> Lịch sử xuất hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-outline-variant">
                {[
                  { id: "LOT-2024-001", date: "24/10/2024", dest: "EU", status: "ĐẠT", color: "bg-primary" },
                  { id: "LOT-2024-089", date: "12/09/2024", dest: "EU", status: "ĐẠT", color: "bg-primary" },
                  { id: "LOT-2024-112", date: "05/08/2024", dest: "USA", status: "CẢNH BÁO", color: "bg-secondary-container" },
                ].map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between hover:bg-surface-container-lowest cursor-pointer transition-colors">
                    <div>
                      <Link href={`/report/${log.id}`} className="font-semibold text-primary text-sm hover:underline">{log.id}</Link>
                      <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-2">
                        {log.date} <span className="w-1 h-1 bg-outline rounded-full"></span> {log.dest}
                      </div>
                    </div>
                    <Badge variant={log.status === "ĐẠT" ? "default" : "warning"} className="text-[10px]">
                      {log.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full text-xs font-semibold text-primary mt-2 uppercase tracking-wider rounded-t-none">
                Xem tất cả 24 lô hàng
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

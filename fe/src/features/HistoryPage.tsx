"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronLeft, ChevronRight, Eye, FileText, Filter, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  type BadgeVariant = "default" | "destructive" | "secondary";

  const tableData = [
    { id: "#LOT-VN-2023-001", product: "Gạo ST25 (Xuất khẩu)", market: "Liên minh Châu Âu", date: "12/10/2023 09:45", status: "ĐẠT", statusType: "default", iconColor: "bg-primary" },
    { id: "#LOT-VN-2023-004", product: "Cà phê Robusta", market: "Hoa Kỳ (FDA)", date: "11/10/2023 14:20", status: "KHÔNG ĐẠT", statusType: "destructive", iconColor: "bg-secondary-container" },
    { id: "#LOT-VN-2023-009", product: "Thanh Long Ruột Đỏ", market: "Nhật Bản (JAS)", date: "10/10/2023 11:30", status: "ĐANG CHỜ", statusType: "secondary", iconColor: "bg-surface-container-high" },
    { id: "#LOT-VN-2023-012", product: "Gạo Nàng Hoa", market: "Liên minh Châu Âu", date: "09/10/2023 16:05", status: "ĐẠT", statusType: "default", iconColor: "bg-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center text-xs font-mono text-outline uppercase tracking-wider">
        <span>DASHBOARD</span>
        <ChevronRight className="mx-2 h-3 w-3" />
        <span className="text-primary font-semibold">LỊCH SỬ KIỂM TRA</span>
      </div>

      <div className="flex items-end justify-between">
        <h1 className="text-4xl font-serif font-bold text-on-surface">Lịch sử tuân thủ quy định</h1>
        <div className="flex flex-col">
            <span className="text-xs font-mono text-outline uppercase mb-1">SẮP XẾP THEO</span>
            <select className="h-10 rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm font-sans focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Mới nhất</option>
            </select>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-xs">
          <label className="block text-xs font-mono text-outline uppercase mb-1">KHOẢNG THỜI GIAN</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-outline" />
            <Input type="text" placeholder="mm/dd/yyyy" className="pl-10" />
          </div>
        </div>
        <div className="flex-1 max-w-xs">
          <label className="block text-xs font-mono text-outline uppercase mb-1">SẢN PHẨM</label>
          <select className="block h-10 w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm font-sans focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Tất cả sản phẩm</option>
          </select>
        </div>
        <div className="flex-1 max-w-xs">
          <label className="block text-xs font-mono text-outline uppercase mb-1">THỊ TRƯỜNG</label>
          <select className="block h-10 w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm font-sans focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Tất cả thị trường</option>
          </select>
        </div>
        <Button variant="default" className="flex-shrink-0 h-10 px-6">
          <Filter className="mr-2 h-4 w-4" /> Áp dụng bộ lọc
        </Button>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans text-on-surface">
            <thead className="border-b border-outline-variant bg-surface-container-low text-xs font-mono uppercase text-outline">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">MÃ LÔ HÀNG</th>
                <th scope="col" className="px-6 py-4 font-semibold">SẢN PHẨM</th>
                <th scope="col" className="px-6 py-4 font-semibold">THỊ TRƯỜNG</th>
                <th scope="col" className="px-6 py-4 font-semibold">NGÀY THỰC HIỆN</th>
                <th scope="col" className="px-6 py-4 font-semibold">TRẠNG THÁI</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">{row.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded flex items-center justify-center text-white ${row.iconColor}`}>
                         {/* Placeholder icon based on product type roughly */}
                         <div className="w-3 h-3 rounded-full bg-white opacity-50"></div>
                      </div>
                      <span className="font-medium">{row.product}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-full border border-outline flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-outline"></div>
                       </div>
                       {row.market}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{row.date}</td>
                  <td className="px-6 py-4">
                    <Badge variant={row.statusType as BadgeVariant} className="px-2 py-1 flex items-center w-max gap-1.5">
                       <div className={`w-1.5 h-1.5 rounded-full ${row.statusType === 'default' ? 'bg-white' : (row.statusType === 'destructive' ? 'bg-error' : 'bg-outline')}`}></div>
                       {row.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-outline">
                      <Link href="/report/1">
                        <button className="hover:text-primary"><Eye className="h-5 w-5" /></button>
                      </Link>
                      <button className="hover:text-primary"><FileText className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant px-6 py-4">
          <span className="text-sm text-on-surface-variant">Hiển thị 1-10 trên 156 lần kiểm tra</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-outline"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="default" size="icon" className="h-8 w-8 text-sm">1</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-sm">2</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-sm">3</Button>
            <span className="px-2 text-outline">...</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-sm">16</Button>
            <Button variant="ghost" size="icon" className="text-outline"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg bg-primary-container p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">Tóm tắt hiệu suất tuân thủ</h2>
            <p className="text-on-primary-container text-lg max-w-xl mb-12">
              Trong tháng này, tỉ lệ tuân thủ của bạn đã tăng 12% so với tháng trước. 85% lô hàng đạt chuẩn EU và 92% đạt chuẩn FDA Hoa Kỳ.
            </p>
            <div className="flex items-end gap-4">
              <div className="text-6xl font-serif font-bold tracking-tight">94.2%</div>
              <Badge variant="secondary" className="bg-surface text-primary mb-2 px-2 py-1">
                 <ArrowRight className="h-3 w-3 mr-1 -rotate-45" /> +2.4%
              </Badge>
            </div>
          </div>
        </div>

        <Card className="flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-mono uppercase text-outline tracking-wider">CẢNH BÁO GẦN ĐÂY</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="flex gap-4 rounded bg-error-container p-4 border border-red-200">
              <AlertCircle className="h-5 w-5 text-error shrink-0" />
              <div>
                <h4 className="font-semibold text-error mb-1 text-sm">Quy định EU mới</h4>
                <p className="text-sm text-on-error-container">Thay đổi giới hạn thuốc trừ sâu cho Gạo ST25.</p>
              </div>
            </div>
            <div className="flex gap-4 rounded bg-surface-container-high p-4 border border-outline-variant">
              <RefreshCw className="h-5 w-5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold text-primary mb-1 text-sm">Cập nhật hồ sơ</h4>
                <p className="text-sm text-on-surface-variant">Chứng chỉ JAS Nhật Bản sẽ hết hạn sau 15 ngày.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 justify-center pb-6">
            <Button variant="ghost" className="text-primary font-semibold w-full">
              Xem tất cả thông báo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

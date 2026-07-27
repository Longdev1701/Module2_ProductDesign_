import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, PackageOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductsPage() {
  const products = [
    { id: "PRD-001", name: "Cà phê Robusta (Sơ chế ướt)", category: "Cà phê", markets: ["EU", "Nhật Bản"], lastChecked: "12/10/2023", status: "Sẵn sàng" },
    { id: "PRD-002", name: "Cà phê Arabica Cầu Đất", category: "Cà phê", markets: ["USA", "EU"], lastChecked: "24/10/2023", status: "Cần cập nhật" },
    { id: "PRD-003", name: "Gạo ST25 Hữu cơ", category: "Ngũ cốc", markets: ["EU"], lastChecked: "05/11/2023", status: "Sẵn sàng" },
    { id: "PRD-004", name: "Hạt tiêu đen (Chưa xay)", category: "Gia vị", markets: ["Trung Quốc", "USA"], lastChecked: "18/09/2023", status: "Đang rà soát" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">Danh mục sản phẩm</h1>
          <p className="text-on-surface-variant">Quản lý hồ sơ sản phẩm và theo dõi trạng thái tuân thủ của từng mặt hàng.</p>
        </div>
        <Button className="h-10 gap-2">
          <Plus className="w-4 h-4" /> Thêm sản phẩm mới
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-outline" />
          <Input placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2 text-on-surface-variant">
          <Filter className="w-4 h-4" /> Bộ lọc
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <Link to={`/products/${product.id.toLowerCase()}`} key={product.id}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <PackageOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-on-surface">{product.name}</h3>
                    <Badge variant="secondary" className="text-[10px]">{product.id}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                    <span>Danh mục: {product.category}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <span>Thị trường mục tiêu: {product.markets.join(", ")}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs font-mono text-outline uppercase mb-1">KIỂM TRA LẦN CUỐI</p>
                  <p className="text-sm font-semibold text-on-surface">{product.lastChecked}</p>
                </div>
                <div className="text-right w-32">
                  <Badge 
                    variant={product.status === "Sẵn sàng" ? "success" : (product.status === "Cần cập nhật" ? "destructive" : "warning")}
                    className="w-full justify-center"
                  >
                    {product.status}
                  </Badge>
                </div>
                <Link to="/new" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="text-outline hover:text-primary">
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Link>
        ))}
      </div>
    </div>
  );
}

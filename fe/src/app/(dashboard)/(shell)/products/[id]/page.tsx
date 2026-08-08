"use client";

import { Suspense } from "react";
import ProductDetailPage from "@/features/ProductDetailPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Đang tải sản phẩm...</div>}>
      <ProductDetailPage />
    </Suspense>
  );
}

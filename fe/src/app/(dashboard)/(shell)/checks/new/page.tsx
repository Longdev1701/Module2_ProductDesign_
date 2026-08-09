"use client";

import { Suspense } from "react";
import NewCheckPage from "@/features/NewCheckPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Đang tải form kiểm tra...</div>}>
      <NewCheckPage />
    </Suspense>
  );
}

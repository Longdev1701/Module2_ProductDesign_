"use client";

import { Suspense } from "react";
import ReportPage from "@/features/ReportPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Đang tải báo cáo...</div>}>
      <ReportPage />
    </Suspense>
  );
}

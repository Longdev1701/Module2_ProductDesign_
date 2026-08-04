import { Suspense } from "react";
import NewCheckPage from "@/features/NewCheckPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96"><span className="material-symbols-outlined animate-spin text-4xl text-[#00327d]">progress_activity</span></div>}>
      <NewCheckPage />
    </Suspense>
  );
}

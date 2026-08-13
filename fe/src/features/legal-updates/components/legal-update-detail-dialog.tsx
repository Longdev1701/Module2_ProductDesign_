"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { LegalUpdateDetailContent } from "./legal-update-detail-content";
import { useLegalUpdateDetail } from "../use-legal-update-detail";

function DetailLoading() {
  return (
    <div className="space-y-3" aria-label="Đang tải chi tiết cập nhật pháp lý">
      <div className="h-7 w-4/5 animate-pulse rounded bg-surface-container-low" />
      <div className="h-20 animate-pulse rounded bg-surface-container-low" />
      <div className="h-16 animate-pulse rounded bg-surface-container-low" />
    </div>
  );
}

export function LegalUpdateDetailDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { update, isLoading, error, refresh } = useLegalUpdateDetail(id);

  useEffect(() => {
    if (!id) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return event.preventDefault();
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        return last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [id, onClose]);

  if (!id) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-on-surface/40 p-0 sm:items-center sm:justify-center sm:p-6" role="presentation">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="legal-update-detail-title" className="max-h-screen w-full overflow-y-auto rounded-t-2xl bg-surface p-6 shadow-xl sm:max-w-3xl sm:rounded-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Chi tiết cập nhật pháp lý</p>
            <h2 id="legal-update-detail-title" className="mt-1 text-xl font-bold text-on-surface">{update?.titleVi ?? "Chi tiết cập nhật pháp lý"}</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Đóng chi tiết cập nhật pháp lý" className="rounded-lg p-2 text-on-surface hover:bg-surface-container-low">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {isLoading && <DetailLoading />}
        {!isLoading && error && <div className="rounded-lg border border-outline-variant p-4" role="alert"><p className="font-semibold text-on-surface">Không thể tải chi tiết cập nhật pháp lý</p><p className="mt-1 text-sm text-on-surface-variant">{error}</p><button type="button" onClick={() => void refresh()} className="mt-3 font-semibold text-primary hover:underline">Thử lại</button></div>}
        {!isLoading && !error && !update && <div className="rounded-lg border border-outline-variant p-4 text-on-surface-variant">Không có dữ liệu chi tiết cho cập nhật này.</div>}
        {!isLoading && !error && update && <LegalUpdateDetailContent update={update} />}
      </div>
    </div>
  );
}

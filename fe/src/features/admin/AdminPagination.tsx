"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface AdminPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
}

export function AdminPagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: AdminPaginationProps) {
  if (total === 0) return null;

  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, total);

  // Generate page numbers array with sliding window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-surface-container-lowest border-t border-outline-variant/60 text-xs">
      {/* Record info & Page size */}
      <div className="flex items-center gap-3 text-on-surface-variant">
        <span>
          Hiển thị <b className="text-on-surface">{startRecord}</b> - <b className="text-on-surface">{endRecord}</b> trên tổng số <b className="text-on-surface">{total}</b> bản ghi
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-outline-variant/60 pl-3">
            <span className="text-[11px]">Mỗi trang:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-0.5 rounded-lg border border-outline-variant bg-surface-container-low text-xs text-on-surface focus:outline-hidden"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Pagination navigation controls */}
      <div className="flex items-center gap-1 self-center sm:self-auto">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
          title="Trang đầu"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
          title="Trang trước"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={idx}
                onClick={() => onPageChange(p)}
                className={`min-w-7 h-7 px-2 rounded-lg font-mono font-bold text-xs transition-all cursor-pointer ${
                  page === p
                    ? "bg-primary text-white shadow-2xs"
                    : "text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-1 text-on-surface-variant/60 font-mono">
                {p}
              </span>
            )
          )}
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
          title="Trang sau"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
          title="Trang cuối"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default AdminPagination;

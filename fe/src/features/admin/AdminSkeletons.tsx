"use client";

import React from "react";

/**
 * Hiệu ứng Shimmer Skeleton cho các bảng danh sách Admin (CIFER, Người dùng, Audit Logs)
 */
export function AdminTableSkeleton({ rows = 8, cols = 7 }: { rows?: number; cols?: number }) {
  return (
    <div className="border border-outline-variant rounded-xl overflow-hidden animate-pulse bg-white">
      <div className="bg-surface-container-low h-10 border-b border-outline-variant flex items-center px-4 gap-4">
        {Array.from({ length: cols }).map((_, idx) => (
          <div
            key={idx}
            className="h-3.5 bg-surface-container-high rounded"
            style={{ width: idx === 0 ? "140px" : idx === 1 ? "220px" : "120px" }}
          />
        ))}
      </div>
      <div className="divide-y divide-outline-variant/60">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="px-4 py-3.5 flex items-center gap-4">
            {/* Col 1: Code */}
            <div className="w-[140px] shrink-0 space-y-1.5">
              <div className="h-4 w-28 bg-purple-100 dark:bg-purple-950/40 rounded font-mono" />
              <div className="h-2.5 w-16 bg-surface-container-high rounded" />
            </div>

            {/* Col 2: Name / Address */}
            <div className="w-[220px] shrink-0 space-y-1.5">
              <div className="h-4 w-44 bg-surface-container-high rounded" />
              <div className="h-2.5 w-32 bg-surface-container rounded" />
            </div>

            {/* Col 3: Category / Role */}
            <div className="w-[160px] shrink-0 space-y-1.5">
              <div className="h-3.5 w-32 bg-surface-container-high rounded" />
              <div className="h-2.5 w-20 bg-surface-container rounded" />
            </div>

            {/* Col 4: Date / Scale */}
            <div className="w-[120px] shrink-0 space-y-1">
              <div className="h-3.5 w-24 bg-surface-container-high rounded font-mono" />
              <div className="h-2.5 w-16 bg-surface-container rounded" />
            </div>

            {/* Col 5: Status Badge */}
            <div className="w-[110px] shrink-0">
              <div className="h-5 w-20 bg-emerald-100 dark:bg-emerald-950/40 rounded-full" />
            </div>

            {/* Col 6: Link / Tag */}
            <div className="w-[120px] shrink-0">
              <div className="h-4 w-24 bg-blue-100 dark:bg-blue-950/40 rounded" />
            </div>

            {/* Col 7: Action Button */}
            <div className="ml-auto w-16 shrink-0 flex justify-end">
              <div className="h-7 w-14 bg-surface-container-high rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hiệu ứng Shimmer Skeleton cho lưới thẻ Doanh nghiệp (AdminOrgTab)
 */
export function AdminGridCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-outline-variant rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-3">
            {/* Header: Title & MST */}
            <div className="flex justify-between items-start gap-2">
              <div className="h-5 w-44 bg-surface-container-high rounded" />
              <div className="h-4 w-20 bg-surface-container rounded" />
            </div>

            {/* Details */}
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-36 bg-emerald-100 dark:bg-emerald-950/40 rounded" />
              <div className="h-3 w-48 bg-surface-container rounded" />
              <div className="h-3 w-32 bg-surface-container rounded" />
            </div>

            {/* Markets */}
            <div className="flex gap-1.5 pt-1">
              <div className="h-4 w-12 bg-blue-100 rounded-full" />
              <div className="h-4 w-10 bg-blue-100 rounded-full" />
            </div>
          </div>

          {/* Footer stats & actions */}
          <div className="pt-3 border-t border-outline-variant/60 flex justify-between items-center">
            <div className="h-4 w-24 bg-surface-container-high rounded" />
            <div className="flex gap-1.5">
              <div className="h-7 w-12 bg-surface-container-high rounded-lg" />
              <div className="h-7 w-12 bg-surface-container-high rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Hiệu ứng Shimmer Skeleton cho Tab Tổng Quan (AdminOverviewTab)
 */
export function AdminOverviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-outline-variant rounded-2xl p-5 shadow-xs flex items-center justify-between"
          >
            <div className="space-y-2">
              <div className="h-3 w-32 bg-surface-container rounded" />
              <div className="h-7 w-16 bg-surface-container-high rounded font-mono" />
              <div className="h-2.5 w-40 bg-surface-container rounded" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-high" />
          </div>
        ))}
      </div>

      {/* 2 Big Status / Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
          <div className="h-5 w-48 bg-surface-container-high rounded" />
          <div className="space-y-3">
            <div className="h-10 bg-surface-container-low rounded-xl" />
            <div className="h-10 bg-surface-container-low rounded-xl" />
            <div className="h-10 bg-surface-container-low rounded-xl" />
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
          <div className="h-5 w-48 bg-surface-container-high rounded" />
          <div className="space-y-3">
            <div className="h-10 bg-surface-container-low rounded-xl" />
            <div className="h-10 bg-surface-container-low rounded-xl" />
            <div className="h-10 bg-surface-container-low rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTableSkeleton;

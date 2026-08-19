"use client";

import { LegalCitation } from '../types';
import { Scale, ExternalLink, ShieldCheck } from 'lucide-react';

interface LegalCitationsListProps {
  citations: LegalCitation[];
}

export function LegalCitationsList({ citations }: LegalCitationsListProps) {
  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 space-y-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-on-surface">
            Căn Cứ Pháp Lý & Trích Dẫn Nghị Định Thư GACC 2024 ({citations.length})
          </h3>
          <p className="text-xs text-on-surface-variant">
            Các văn bản quy phạm pháp luật và tiêu chuẩn kỹ thuật bắt buộc áp dụng cho lô hàng.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {citations.map((cite) => (
          <div
            key={cite.id}
            className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary font-mono block w-fit">
                {cite.code}
              </span>
              <h4 className="text-xs font-bold text-on-surface line-clamp-2">
                {cite.title}
              </h4>
              <p className="text-[11px] font-semibold text-primary/90">
                {cite.article}
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                {cite.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[10px] text-on-surface-variant/80">
              <span>🏛️ {cite.authority}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                Hiệu lực
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { ReportFinding } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

interface FindingsMatrixProps {
  findings: ReportFinding[];
}

export function FindingsMatrix({ findings }: FindingsMatrixProps) {
  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">
              Chi Tiết Phát Hiện Thẩm Định AI & Căn Cứ Chứng Thư ({findings.length})
            </h3>
            <p className="text-xs text-on-surface-variant">
              Kết quả rà soát tự động kết hợp mô hình AI và quy tắc kiểm soát cứng (Deterministic Rules).
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-outline-variant/40">
        {findings.map((item, index) => {
          const isCompliant = item.status === 'COMPLIANT';
          const isCritical = item.severity === 'CRITICAL';

          return (
            <div key={item.id || index} className="py-4 first:pt-2 last:pb-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  {isCompliant ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-on-surface leading-snug">
                      {item.title}
                    </h4>
                    {item.citationArticle && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                        <BookOpen className="w-3 h-3" />
                        {item.citationArticle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      isCritical
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      isCompliant
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Remediation & notes if any */}
              {item.remediation && (
                <div className="ml-7 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs space-y-1">
                  <span className="font-bold text-on-surface block text-[11px] text-primary">
                    💡 Khuyến nghị kiểm soát & Duy trì:
                  </span>
                  <p className="text-on-surface-variant leading-relaxed">
                    {item.remediation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

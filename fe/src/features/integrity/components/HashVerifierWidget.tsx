"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ArrowRight,
  Fingerprint,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { VerificationResult } from '../types';

interface HashVerifierWidgetProps {
  onVerify: (hash: string) => Promise<VerificationResult | null>;
  verifying: boolean;
  result: VerificationResult | null;
  onClear: () => void;
}

export function HashVerifierWidget({
  onVerify,
  verifying,
  result,
  onClear,
}: HashVerifierWidgetProps) {
  const [hashInput, setHashInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hashInput.trim()) {
      onVerify(hashInput.trim());
    }
  };

  const handlePasteSample = (sample: string) => {
    setHashInput(sample);
    onVerify(sample);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-primary-container to-slate-900 text-white p-6 rounded-2xl border border-primary/20 shadow-md relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 border border-white/10">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Bộ Công Cụ Tra Cứu Xác Thực Mã Băm SHA-256 (Public Hash Verifier)
              </h3>
              <p className="text-xs text-slate-300">
                Dành cho Đoàn Thanh tra GACC, Cục BVTV và Đối tác thu mua kiểm tra tính nguyên bản của Báo cáo xuất khẩu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> CHUỖI TOÀN VẸN 256-BIT
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Dán mã Hash SHA-256, Mã Báo cáo (REP-...), hoặc Mã Lô hàng (DURIAN-...)..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-400 font-mono transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={verifying || !hashInput.trim()}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  Đang đối soát...
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  Đối soát mã băm
                </>
              )}
            </button>

            {result && (
              <button
                type="button"
                onClick={() => {
                  setHashInput('');
                  onClear();
                }}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Làm mới"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Verification Result Card */}
        {result && (
          <div
            className={`p-4 rounded-xl border transition-all animate-fadeIn ${
              result.isValid && result.status === 'AUTHENTIC_VALID'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {result.isValid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                  <h4 className="font-bold text-sm text-white">{result.message}</h4>
                </div>

                {result.report && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Mã Hồ Sơ &amp; Lô Hàng</span>
                      <span className="font-mono font-bold text-white">
                        {result.report.reportCode} ({result.report.batchCode})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Người Ký Phê Duyệt</span>
                      <span className="font-medium text-white">
                        {result.report.approverName} ({result.report.approverRole})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Thời Gian Ký Khóa</span>
                      <span className="font-mono text-white">
                        {result.report.approvedAt
                          ? new Date(result.report.approvedAt).toLocaleString('vi-VN')
                          : 'Chưa khóa'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Mã Chì Niêm Phong Cont</span>
                      <span className="font-mono font-bold text-emerald-300">
                        {result.report.containerSealNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Cửa Khẩu Xuất Khẩu</span>
                      <span className="font-medium text-white">{result.report.exportPort}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Chuỗi Băm SHA-256 Checksum</span>
                      <span className="font-mono text-[10px] text-slate-300 truncate block max-w-[200px]">
                        {result.report.integrityHash}
                      </span>
                    </div>
                  </div>
                )}

                {result.auditRecord && !result.report && (
                  <div className="text-xs pt-1 space-y-1">
                    <p className="text-slate-300">
                      Hành động: <b className="text-white font-mono">{result.auditRecord.action}</b>
                    </p>
                    <p className="text-slate-300">
                      Thực hiện bởi: <b className="text-white">{result.auditRecord.actorEmail}</b> lúc{' '}
                      <span className="font-mono text-emerald-300">
                        {new Date(result.auditRecord.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {result.report && (
                <div className="flex md:flex-col items-center gap-2 self-end md:self-auto">
                  <Link
                    href={`/reports/${result.report.id}`}
                    className="px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 whitespace-nowrap"
                  >
                    Xem Báo cáo gốc <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

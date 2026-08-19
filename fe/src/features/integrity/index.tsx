"use client";

import React from 'react';
import { ShieldCheck, RefreshCw, AlertCircle, Fingerprint } from 'lucide-react';
import { useIntegrityData } from './useIntegrityData';
import { IntegrityStatsBar } from './components/IntegrityStatsBar';
import { HashVerifierWidget } from './components/HashVerifierWidget';
import { AuditLogTimeline } from './components/AuditLogTimeline';

export function IntegrityFeature() {
  const {
    stats,
    logs,
    loading,
    error,
    page,
    setPage,
    pageSize,
    total,
    totalPages,
    searchTerm,
    setSearchTerm,
    selectedAction,
    setSelectedAction,
    refetch,
    verifyHash,
    verifying,
    verificationResult,
    clearVerification,
  } = useIntegrityData();

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> CHỨNG MINH LIÊM CHÍNH BẤT BIẾN
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Liêm Chính &amp; Hộp Đen Pháp Lý (Audit Trail)
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Bằng chứng chống gian lận, truy vết thay đổi dữ liệu và đối soát mã băm SHA-256 cho Hải quan GACC &amp; Kiểm toán viên
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refetch}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white border border-outline-variant/60 hover:bg-slate-50 text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Stats Bar (4 KPIs) */}
      <IntegrityStatsBar stats={stats} loading={loading} />

      {/* 2. Public Hash Verifier Tool */}
      <HashVerifierWidget
        onVerify={verifyHash}
        verifying={verifying}
        result={verificationResult}
        onClear={clearVerification}
      />

      {/* 3. Immutable Audit Trail Timeline Table */}
      <AuditLogTimeline
        logs={logs}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        selectedAction={selectedAction}
        onActionChange={(action) => {
          setSelectedAction(action);
          setPage(1);
        }}
        searchTerm={searchTerm}
        onSearchChange={(search) => {
          setSearchTerm(search);
          setPage(1);
        }}
      />
    </div>
  );
}

export default IntegrityFeature;

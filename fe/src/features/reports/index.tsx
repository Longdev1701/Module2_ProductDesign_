"use client";

import { useState } from 'react';
import { useReportData } from './useReportData';
import { ReportHeader } from './components/ReportHeader';
import { BlindSpotShieldCard } from './components/BlindSpotShieldCard';
import { FindingsMatrix } from './components/FindingsMatrix';
import { LegalCitationsList } from './components/LegalCitationsList';
import { ReportApprovalSeal } from './components/ReportApprovalSeal';
import { PrintableReportModal } from './components/PrintableReportModal';
import { ShieldAlert, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ReportFeatureProps {
  reportIdOrBatchId: string;
}

function ReportSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Đang tải dữ liệu báo cáo thẩm định">
      <div className="h-44 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-4">
        <div className="h-6 w-48 rounded bg-surface-container-high" />
        <div className="h-8 w-96 rounded bg-surface-container-high" />
        <div className="grid grid-cols-4 gap-4 pt-2">
          <div className="h-12 rounded bg-surface-container-low" />
          <div className="h-12 rounded bg-surface-container-low" />
          <div className="h-12 rounded bg-surface-container-low" />
          <div className="h-12 rounded bg-surface-container-low" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-48 rounded-2xl bg-surface-container-lowest border border-outline-variant/60" />
        <div className="h-48 rounded-2xl bg-surface-container-lowest border border-outline-variant/60" />
        <div className="h-48 rounded-2xl bg-surface-container-lowest border border-outline-variant/60" />
      </div>

      <div className="h-64 rounded-2xl bg-surface-container-lowest border border-outline-variant/60" />
    </div>
  );
}

export function ReportFeature({ reportIdOrBatchId }: ReportFeatureProps) {
  const { report, loading, approving, error, refetch, approveReport } = useReportData(reportIdOrBatchId);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  if (loading && !report) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
          <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Quay lại Dashboard
          </Link>
        </div>
        <ReportSkeleton />
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-8 text-center space-y-4 max-w-lg mx-auto my-12">
        <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-on-surface">Không Thể Tải Báo Cáo Thẩm Định</h3>
        <p className="text-xs text-on-surface-variant">{error}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Về Dashboard
          </Link>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Bảng điều khiển
        </Link>
        <span className="text-[11px] font-mono text-on-surface-variant">
          Lô hàng: <b className="text-on-surface">{report.check.batchCode}</b>
        </span>
      </div>

      {/* 1. Header with Metadata & SHA-256 Seal */}
      <ReportHeader
        report={report}
        onPrint={() => setIsPrintModalOpen(true)}
        onRefetch={refetch}
      />

      {/* 2. Five Critical Blind Spots Shield */}
      <BlindSpotShieldCard blindSpots={report.blindSpots} />

      {/* 3. Detailed Findings Matrix */}
      <FindingsMatrix findings={report.findings} />

      {/* 4. Legal Citations from GACC Protocol 2024 */}
      <LegalCitationsList citations={report.citations} />

      {/* 5. Legal Sign-off & Immutable Approval Seal */}
      <ReportApprovalSeal
        report={report}
        onApprove={approveReport}
        approving={approving}
      />

      {/* Printable Modal View */}
      <PrintableReportModal
        report={report}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
}

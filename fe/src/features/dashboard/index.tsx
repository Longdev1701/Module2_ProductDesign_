"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RefreshCw, Plus, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useDashboardData } from './useDashboardData';
import { DashboardKpiGrid } from './components/DashboardKpiGrid';
import { RecentBatchesWidget } from './components/RecentBatchesWidget';
import { ActionItemsWidget } from './components/ActionItemsWidget';
import { ComplianceTrendsWidget } from './components/ComplianceTrendsWidget';
import { ClearanceGaugeWidget } from './components/ClearanceGaugeWidget';
import { KpiDrillDownModal, KpiDrillDownType } from './components/KpiDrillDownModal';
import { DocumentUploadModal } from '@/features/documents/DocumentUploadModal';
import { BatchDocumentVault } from '@/features/documents/BatchDocumentVault';
import LegalTrackingWidget from '@/components/LegalTrackingWidget';
import { api } from '@/lib/api';
import { DocumentType } from '@/types/api';

export function DashboardFeature() {
  const router = useRouter();
  const {
    summary,
    recentBatches,
    actionItems,
    trends,
    loading,
    isRefreshing,
    error,
    refetch,
  } = useDashboardData();

  // State cho Modal Drill-Down từ KPI
  const [drillDownType, setDrillDownType] = useState<KpiDrillDownType | null>(null);

  // State cho Bộ lọc tương tác từ Biểu đồ
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{ status: string; labelVi: string } | null>(null);

  // State cho Modal Nạp chứng từ trực tiếp 1-chạm
  const [directUploadBatch, setDirectUploadBatch] = useState<{
    id: string;
    code: string;
    defaultType?: DocumentType;
  } | null>(null);

  // State cho Modal Hộp hồ sơ 4 Khóa
  const [vaultBatch, setVaultBatch] = useState<{ id: string; code: string } | null>(null);

  // Lọc danh sách lô hàng theo tương tác biểu đồ
  const filteredBatches = recentBatches.filter((b) => {
    if (selectedStatus && b.status !== selectedStatus.status) {
      return false;
    }
    if (selectedMonth) {
      const date = new Date(b.createdAt);
      const monthStr = `T${date.getMonth() + 1}/${date.getFullYear()}`;
      if (monthStr !== selectedMonth) return false;
    }
    return true;
  });

  const activeFilterTitle = selectedMonth
    ? `Tháng ${selectedMonth}`
    : selectedStatus
    ? selectedStatus.labelVi
    : null;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5" /> GACC PROTOCOL 2024
            </span>
            <span className="text-xs text-on-surface-variant font-mono">HS: 0810.60.00</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-on-surface mt-1.5">
            Trung tâm Điều hành Xuất khẩu &amp; Pháp lý
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Bấm trực tiếp vào từng thành phần, huy hiệu 4 Khóa và thẻ KPI để kiểm tra hoặc xử lý nhanh tức thì.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/products"
            className="px-4 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tạo Lô hàng mới
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-rose-900 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => refetch()}
            className="underline font-bold hover:text-rose-950 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* 4 Thẻ KPI Tương tác Sâu (Bấm vào để mở Drill-down Modal) */}
      <DashboardKpiGrid
        summary={summary}
        loading={loading}
        onSelectDrillDown={(type) => setDrillDownType(type)}
      />

      {/* Thước đo Sẵn sàng Thông quan (Container Clearance Gauge) */}
      <ClearanceGaugeWidget
        summary={summary}
        loading={loading}
        onOpenDrillDown={() => setDrillDownType('COMPLIANCE_RATE')}
      />

      {/* Layout Chính 2 Cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Cột Trái (2/3 chiều rộng) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bảng Lô hàng gần nhất + 1-Chạm vào 4 Khóa */}
          <RecentBatchesWidget
            batches={filteredBatches}
            loading={loading}
            onRefresh={refetch}
            filterTitle={activeFilterTitle}
            onClearFilter={() => {
              setSelectedMonth(null);
              setSelectedStatus(null);
            }}
          />

          {/* Biểu đồ Xu hướng & Phân bổ Tương tác */}
          <ComplianceTrendsWidget
            trends={trends}
            loading={loading}
            selectedMonthFilter={selectedMonth}
            onSelectMonth={(m) => {
              setSelectedStatus(null);
              setSelectedMonth(m);
            }}
            selectedStatusFilter={selectedStatus?.status || null}
            onSelectStatus={(s, labelVi) => {
              setSelectedMonth(null);
              setSelectedStatus(s && labelVi ? { status: s, labelVi } : null);
            }}
          />
        </div>

        {/* Cột Phải (1/3 chiều rộng) */}
        <div className="space-y-6">
          {/* Hộp Việc cần làm ngay + Nạp 1-Chạm */}
          <ActionItemsWidget
            actionItems={actionItems}
            loading={loading}
            onOpenUpload={(batchId, batchCode) => {
              setDirectUploadBatch({
                id: batchId,
                code: batchCode,
              });
            }}
          />

          {/* Radar Quy định Nông sản Đa thị trường */}
          <LegalTrackingWidget />
        </div>
      </div>

      {/* 1. Modal Drill-down Phân tích chuyên sâu cho từng thẻ KPI */}
      {drillDownType && (
        <KpiDrillDownModal
          type={drillDownType}
          summary={summary}
          batches={recentBatches}
          onClose={() => setDrillDownType(null)}
          onOpenVault={(batchId, batchCode) => {
            setVaultBatch({ id: batchId, code: batchCode });
          }}
          onOpenUpload={(batchId, batchCode, docType) => {
            setDirectUploadBatch({
              id: batchId,
              code: batchCode,
              defaultType: docType as DocumentType,
            });
          }}
        />
      )}

      {/* 2. Modal Nạp Chứng từ 1-Chạm từ Action Items / KPI Drill-down */}
      {directUploadBatch && (
        <DocumentUploadModal
          isOpen={true}
          batchCode={directUploadBatch.code}
          defaultType={directUploadBatch.defaultType}
          onClose={() => setDirectUploadBatch(null)}
          onUpload={async (payload) => {
            await api.post(`/batches/${directUploadBatch.id}/documents`, payload);
            setDirectUploadBatch(null);
            refetch();
          }}
        />
      )}

      {/* 3. Modal Hộp hồ sơ 4 Khóa từ Drill-down */}
      {vaultBatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <h3 className="font-serif font-bold text-lg text-on-surface">
                Hồ sơ Tuân thủ 4 Khóa — Lô {vaultBatch.code}
              </h3>
              <button
                onClick={() => {
                  setVaultBatch(null);
                  refetch();
                }}
                className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <BatchDocumentVault
                batchId={vaultBatch.id}
                batchCode={vaultBatch.code}
                onNavigateToCheck={() => {
                  const code = vaultBatch.code;
                  setVaultBatch(null);
                  router.push(`/checks/new?batch=${encodeURIComponent(code)}`);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  UploadCloud,
  Eye,
  Trash2,
  CheckCircle2,
  FileText,
  Plus,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBatchDocuments } from "./useBatchDocuments";
import { DocumentUploadModal } from "./DocumentUploadModal";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import type { DocumentItem, DocumentType, GateKeyStatus } from "@/types/api";

interface BatchDocumentVaultProps {
  batchId: string;
  batchCode: string;
  onNavigateToCheck?: (batchId: string) => void;
}

export function BatchDocumentVault({
  batchId,
  batchCode,
  onNavigateToCheck,
}: BatchDocumentVaultProps) {
  const {
    checklist,
    loading,
    uploading,
    deleting,
    error,
    refresh,
    uploadDocument,
    removeDocument,
  } = useBatchDocuments(batchId);

  // Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedUploadType, setSelectedUploadType] = useState<DocumentType>("PHYTO");

  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const [deleteTargetDoc, setDeleteTargetDoc] = useState<DocumentItem | null>(null);

  const handleOpenUpload = (type: DocumentType) => {
    setSelectedUploadType(type);
    setUploadModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetDoc) return;
    try {
      await removeDocument(deleteTargetDoc.id);
      setDeleteTargetDoc(null);
    } catch {
      // Error handled by hook
    }
  };

  if (loading && !checklist) {
    return (
      <div className="p-8 border border-outline-variant rounded-2xl bg-white text-center space-y-3">
        <div className="inline-block animate-spin rounded-full h-7 w-7 border-3 border-primary border-t-transparent" />
        <p className="text-xs text-on-surface-variant">Đang tải hộp hồ sơ tuân thủ 4 khóa của lô hàng...</p>
      </div>
    );
  }

  const keys = checklist?.keys;
  const gates: GateKeyStatus[] = keys
    ? [keys.phyto, keys.labReport, keys.co, keys.packingList]
    : [];

  return (
    <div className="space-y-6">
      {/* Header Box: Compliance Progress */}
      <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-on-surface">
                  Hồ sơ Tuân thủ 4 Khóa (Compliance Gate)
                </h3>
                <Badge
                  variant={checklist?.isReadyForCheck ? "default" : "secondary"}
                  className={`text-[10px] font-mono font-bold ${
                    checklist?.isReadyForCheck
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-amber-100 text-amber-900 border-amber-300"
                  }`}
                >
                  {checklist?.isReadyForCheck ? "ĐỦ ĐIỀU KIỆN QUÉT AI" : "ĐANG THIẾU HỒ SƠ"}
                </Badge>
              </div>
              <p className="text-xs text-on-surface-variant">
                Lô hàng: <span className="font-mono font-semibold text-on-surface">{batchCode}</span> • 4 chứng từ sống còn bắt buộc theo quy định xuất khẩu GACC / EU
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refresh()}
              className="p-2 border border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-xl transition-colors cursor-pointer"
              title="Làm mới hồ sơ"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {checklist?.isReadyForCheck && onNavigateToCheck && (
              <Button
                onClick={() => onNavigateToCheck(batchId)}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Chạy Thẩm định AI
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-on-surface">
              Tiến độ hoàn thiện:{" "}
              <strong className="text-primary font-bold">
                {checklist?.uploadedRequiredCount || 0} / {checklist?.totalRequired || 4} Chứng từ bắt buộc
              </strong>
            </span>
            <span className="font-mono font-bold text-on-surface">
              {checklist?.completionRate || 0}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                checklist?.isReadyForCheck ? "bg-emerald-500" : "bg-primary"
              }`}
              style={{ width: `${checklist?.completionRate || 0}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4-Key Compliance Gate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gates.map((gate, idx) => {
          const isDone = gate.isUploaded && gate.document;
          return (
            <div
              key={gate.type}
              className={`border rounded-2xl p-4 transition-all flex flex-col justify-between ${
                isDone
                  ? "bg-white border-emerald-300 shadow-xs"
                  : "bg-surface-container-lowest border-outline-variant hover:border-primary/50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isDone
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">{gate.shortLabel}</h4>
                      <p className="text-[11px] text-on-surface-variant line-clamp-1">
                        {gate.description}
                      </p>
                    </div>
                  </div>

                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ĐÃ CÓ
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      CHƯA CÓ
                    </span>
                  )}
                </div>

                {/* Uploaded Document Info */}
                {isDone && gate.document && (
                  <div className="bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between gap-2 border border-outline-variant/60">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-on-surface truncate">
                          {gate.document.title}
                        </p>
                        <p className="text-[10px] text-on-surface-variant font-mono">
                          {new Date(gate.document.createdAt).toLocaleDateString("vi-VN")}
                          {gate.document.fileSize
                            ? ` • ${(gate.document.fileSize / 1024 / 1024).toFixed(2)} MB`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setPreviewDoc(gate.document!)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                        title="Xem trước"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetDoc(gate.document!)}
                        className="p-1.5 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa chứng từ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button if Missing */}
              {!isDone && (
                <div className="pt-3">
                  <Button
                    onClick={() => handleOpenUpload(gate.type)}
                    variant="outline"
                    className="w-full text-xs font-semibold rounded-xl border-dashed border-primary text-primary hover:bg-primary/5 gap-1.5 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    + Nạp {gate.shortLabel} ngay
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Extra Documents / Attachments (GPS Map, CQ, Invoice, Other) */}
      <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-on-surface">Chứng từ Bổ trợ & Khác</h4>
            <p className="text-xs text-on-surface-variant">
              Bản đồ định vị GPS vườn sầu riêng (PUC/EUDR), Hợp đồng, Hóa đơn thương mại...
            </p>
          </div>
          <Button
            onClick={() => handleOpenUpload("GPS_MAP")}
            variant="outline"
            className="text-xs font-semibold rounded-xl gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm Chứng từ Phụ
          </Button>
        </div>

        {/* List of other docs if any */}
        {keys?.gpsMap?.isUploaded || (keys?.other && keys.other.length > 0) ? (
          <div className="divide-y divide-outline-variant/60 border border-outline-variant rounded-xl overflow-hidden">
            {keys.gpsMap.isUploaded && keys.gpsMap.document && (
              <div className="p-3 bg-surface-container-lowest flex items-center justify-between hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-semibold text-on-surface">
                      {keys.gpsMap.document.title}
                    </p>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                      ĐỊNH VỊ GPS (EUDR)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewDoc(keys.gpsMap.document!)}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetDoc(keys.gpsMap.document!)}
                    className="p-1.5 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {keys?.other?.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-surface-container-lowest flex items-center justify-between hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-on-surface">{doc.title}</p>
                    <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container px-1.5 py-0.2 rounded font-bold">
                      {doc.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetDoc(doc)}
                    className="p-1.5 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant italic">
            Chưa có chứng từ bổ trợ nào (Bản đồ GPS, Hợp đồng, v.v.).
          </p>
        )}
      </div>

      {/* Modal Upload */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        defaultType={selectedUploadType}
        batchCode={batchCode}
        onUpload={async (payload) => {
          await uploadDocument(payload);
        }}
      />

      {/* Modal Preview */}
      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      {/* Delete Confirmation Dialog */}
      {deleteTargetDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-outline-variant p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-[#191c1e]">Xác nhận Xóa Chứng từ</h3>
              <p className="text-sm text-[#434653]">
                Bạn có chắc chắn muốn gỡ chứng từ <strong>&ldquo;{deleteTargetDoc.title}&rdquo;</strong> khỏi Lô hàng này?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetDoc(null)}
                disabled={deleting}
                className="px-4 py-2 border border-[#c3c6d5] text-[#434653] hover:bg-[#f7f9fb] font-semibold text-sm rounded-xl transition-colors cursor-pointer flex-1"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex-1"
              >
                {deleting ? "Đang xóa..." : "Xác nhận Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  FolderOpen,
  ExternalLink,
  Eye,
  UploadCloud,
  X,
} from 'lucide-react';
import { DashboardRecentBatch, DocumentType } from '@/types/api';
import { BatchDocumentVault } from '@/features/documents/BatchDocumentVault';
import { DocumentPreviewModal } from '@/features/documents/DocumentPreviewModal';
import { DocumentUploadModal } from '@/features/documents/DocumentUploadModal';

interface RecentBatchesWidgetProps {
  batches: DashboardRecentBatch[];
  loading: boolean;
  onRefresh?: () => void;
  filterTitle?: string | null;
  onClearFilter?: () => void;
}

export function RecentBatchesWidget({
  batches,
  loading,
  onRefresh,
  filterTitle,
  onClearFilter,
}: RecentBatchesWidgetProps) {
  const router = useRouter();
  const [selectedBatchVault, setSelectedBatchVault] = useState<{ id: string; code: string } | null>(null);

  // State xem trước tài liệu 1-chạm
  const [previewDoc, setPreviewDoc] = useState<{
    fileUrl: string;
    title: string;
    mimeType?: string;
  } | null>(null);

  // State nạp tài liệu 1-chạm
  const [uploadBatch, setUploadBatch] = useState<{
    id: string;
    code: string;
    defaultType?: DocumentType;
  } | null>(null);

  if (loading && batches.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 shadow-xs animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-48"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const handleBadgeClick = (
    b: DashboardRecentBatch,
    hasDoc: boolean,
    docSummary: { fileUrl: string | null; title: string; mimeType: string | null } | undefined,
    type: DocumentType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (hasDoc && docSummary && docSummary.fileUrl) {
      // 1-Chạm mở trực tiếp Modal Xem trước bản scan PDF/ảnh
      setPreviewDoc({
        fileUrl: docSummary.fileUrl,
        title: `${docSummary.title} — Lô ${b.batchCode}`,
        mimeType: docSummary.mimeType || 'application/pdf',
      });
    } else {
      // 1-Chạm mở trực tiếp Modal Nạp file đúng loại chứng từ đang thiếu
      setUploadBatch({
        id: b.id,
        code: b.batchCode,
        defaultType: type,
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-on-surface flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Lô hàng Xuất khẩu Gần nhất
            </h3>
            {filterTitle && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Lọc: {filterTitle}
                <button onClick={onClearFilter} className="hover:text-rose-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            <span className="text-emerald-700 font-semibold">Bấm vào Khóa Xanh</span> để xem trước bản scan PDF • <span className="text-rose-600 font-semibold">Bấm vào Khóa Đỏ</span> để nạp ngay
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 transition-colors self-start sm:self-auto"
        >
          Quản lý toàn bộ &rarr;
        </Link>
      </div>

      {batches.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
          <Package className="w-10 h-10 text-outline mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-on-surface">Không có lô hàng nào phù hợp bộ lọc</p>
          <p className="text-xs text-on-surface-variant mt-1">Hãy xóa bộ lọc hoặc khởi tạo lô hàng xuất khẩu mới.</p>
          {filterTitle ? (
            <button
              onClick={onClearFilter}
              className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-surface-container text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-colors"
            >
              Xóa bộ lọc
            </button>
          ) : (
            <Link
              href="/products"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-primary/90 transition-colors"
            >
              Tạo Lô hàng mới
            </Link>
          )}
        </div>
      ) : (
        <div className="-mx-3 lg:mx-0 overflow-x-auto">
          <table className="w-full text-left text-sm font-sans min-w-[620px] lg:min-w-0">
            <thead className="bg-surface-container-low text-[11px] font-mono uppercase text-outline rounded-t-lg">
              <tr>
                <th className="px-3.5 py-2.5 font-semibold rounded-l-lg">MÃ LÔ &amp; SẢN PHẨM</th>
                <th className="px-3 py-2.5 font-semibold text-center">SẢN LƯỢNG</th>
                <th className="px-3 py-2.5 font-semibold text-center">4 KHÓA SỐNG CÒN (1-CHẠM)</th>
                <th className="px-3 py-2.5 font-semibold text-center">TRẠNG THÁI</th>
                <th className="px-3.5 py-2.5 font-semibold text-right rounded-r-lg">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-surface-container-lowest/80 transition-colors group">
                  {/* Mã lô & Sản phẩm */}
                  <td className="px-3.5 py-3">
                    <div className="max-w-[190px]">
                      <Link
                        href={`/products/${b.productId}`}
                        className="font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-1.5"
                      >
                        <span className="font-mono text-primary font-semibold text-xs truncate">{b.batchCode}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </Link>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5 truncate">{b.productName}</p>
                    </div>
                  </td>

                  {/* Sản lượng */}
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <span className="font-mono font-bold text-on-surface">{b.quantity}</span>
                    <span className="text-xs text-on-surface-variant ml-1">{b.unit}</span>
                  </td>

                  {/* Trạng thái 4 Khóa Tương tác Sâu */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Phyto Badge */}
                      <button
                        onClick={(e) => handleBadgeClick(b, b.hasPhyto, b.phytoDoc, 'PHYTO', e)}
                        title={
                          b.hasPhyto
                            ? `🌿 Kiểm dịch Thực vật: ĐÃ CÓ (${b.phytoDoc?.title || 'Bấm để xem PDF'})`
                            : '🌿 Kiểm dịch Thực vật: THIẾU (Bấm để nạp ngay)'
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-transform active:scale-95 cursor-pointer ${
                          b.hasPhyto
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-300 hover:bg-rose-100 animate-pulse'
                        }`}
                      >
                        {b.hasPhyto ? <Eye className="w-3 h-3" /> : <UploadCloud className="w-3 h-3" />}
                        Phyto
                      </button>

                      {/* Lab Cadmium Badge */}
                      <button
                        onClick={(e) => handleBadgeClick(b, b.hasLabReport, b.labReportDoc, 'LAB_REPORT', e)}
                        title={
                          b.hasLabReport
                            ? `🧪 Phiếu Lab Cadmium: ĐÃ CÓ (${b.labReportDoc?.title || 'Bấm để xem PDF'})`
                            : '🧪 Phiếu Lab Cadmium: THIẾU (Bấm để nạp ngay)'
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-transform active:scale-95 cursor-pointer ${
                          b.hasLabReport
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-300 hover:bg-rose-100 animate-pulse'
                        }`}
                      >
                        {b.hasLabReport ? <Eye className="w-3 h-3" /> : <UploadCloud className="w-3 h-3" />}
                        Lab
                      </button>

                      {/* CO Badge */}
                      <button
                        onClick={(e) => handleBadgeClick(b, b.hasCO, b.coDoc, 'CO', e)}
                        title={
                          b.hasCO
                            ? `📜 C/O Form E: ĐÃ CÓ (${b.coDoc?.title || 'Bấm để xem PDF'})`
                            : '📜 C/O Form E: THIẾU (Bấm để nạp ngay)'
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-transform active:scale-95 cursor-pointer ${
                          b.hasCO
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-300 hover:bg-rose-100 animate-pulse'
                        }`}
                      >
                        {b.hasCO ? <Eye className="w-3 h-3" /> : <UploadCloud className="w-3 h-3" />}
                        C/O
                      </button>

                      {/* Packing List Badge */}
                      <button
                        onClick={(e) => handleBadgeClick(b, b.hasPackingList, b.packingListDoc, 'PACKING_LIST', e)}
                        title={
                          b.hasPackingList
                            ? `📦 Packing List PHC: ĐÃ CÓ (${b.packingListDoc?.title || 'Bấm để xem PDF'})`
                            : '📦 Packing List PHC: THIẾU (Bấm để nạp ngay)'
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-transform active:scale-95 cursor-pointer ${
                          b.hasPackingList
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-300 hover:bg-rose-100 animate-pulse'
                        }`}
                      >
                        {b.hasPackingList ? <Eye className="w-3 h-3" /> : <UploadCloud className="w-3 h-3" />}
                        Pack
                      </button>
                    </div>
                  </td>

                  {/* Trạng thái Lô */}
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    {b.isReadyForCheck ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3" /> Đủ 4 Khóa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[11px] font-bold border border-amber-300">
                        Thiếu {4 - (Number(b.hasPhyto) + Number(b.hasLabReport) + Number(b.hasCO) + Number(b.hasPackingList))} khóa
                      </span>
                    )}
                  </td>

                  {/* Thao tác */}
                  <td className="px-3.5 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBatchVault({ id: b.id, code: b.batchCode })}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 transition-colors cursor-pointer"
                      >
                        <FolderOpen className="w-3 h-3" /> Hồ sơ
                      </button>

                      <Link
                        href={`/checks/new?batch=${b.batchCode}&product=${encodeURIComponent(b.productName)}`}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg shadow-xs transition-colors ${
                          b.isReadyForCheck
                            ? 'bg-primary text-white hover:bg-primary/90 font-bold'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" /> Quét AI
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Hồ sơ 4 Khóa */}
      {selectedBatchVault && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-on-surface">
                    Hồ sơ Tuân thủ 4 Khóa — Lô {selectedBatchVault.code}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Nạp và đối soát 4 chứng thư pháp lý bắt buộc trước khi đóng container
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedBatchVault(null);
                  onRefresh?.();
                }}
                className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <BatchDocumentVault
                batchId={selectedBatchVault.id}
                batchCode={selectedBatchVault.code}
                onNavigateToCheck={() => {
                  const code = selectedBatchVault.code;
                  setSelectedBatchVault(null);
                  router.push(`/checks/new?batch=${encodeURIComponent(code)}`);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem trước PDF 1-Chạm */}
      {previewDoc && (
        <DocumentPreviewModal
          document={{
            id: 'preview-' + Date.now(),
            title: previewDoc.title,
            type: 'OTHER',
            fileUrl: previewDoc.fileUrl,
            fileSize: null,
            mimeType: previewDoc.mimeType || 'application/pdf',
            organizationId: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {/* Modal Nạp Chứng từ 1-Chạm */}
      {uploadBatch && (
        <DocumentUploadModal
          isOpen={true}
          batchCode={uploadBatch.code}
          defaultType={uploadBatch.defaultType}
          onClose={() => setUploadBatch(null)}
          onUpload={async (payload) => {
            const { api } = await import('@/lib/api');
            await api.post(`/batches/${uploadBatch.id}/documents`, payload);
            setUploadBatch(null);
            onRefresh?.();
          }}
        />
      )}
    </div>
  );
}

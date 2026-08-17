"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Package,
  Edit2,
  Trash2,
  Plus,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  X,
  Weight,
  History,
  Info
} from "lucide-react";
import { api } from "@/lib/api";
import { BatchDocumentVault } from "@/features/documents/BatchDocumentVault";
import type { ProductItem, BatchItem, BatchStatus } from "@/types/api";
import { getErrorMessage } from "@/types/api";

const MARKET_OPTIONS = [
  { code: "CN", name: "Trung Quốc (GACC)" },
  { code: "EU", name: "Liên minh Châu Âu (EUDR)" },
  { code: "US", name: "Hoa Kỳ (FDA / USDA)" },
  { code: "JP", name: "Nhật Bản (MAFF)" },
  { code: "KR", name: "Hàn Quốc (MFDS)" },
];

const BATCH_STATUS_CONFIG: Record<BatchStatus, { label: string; bg: string; text: string; border: string }> = {
  DRAFT: { label: "Nháp", bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
  COLLECTING_DOCUMENTS: { label: "Đang thu thập hồ sơ", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  READY_FOR_CHECK: { label: "Sẵn sàng quét AI", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  CHECKING: { label: "Đang thẩm định AI", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  ACTION_REQUIRED: { label: "Cần khắc phục", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  COMPLIANT: { label: "Đạt chuẩn xuất khẩu", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  NON_COMPLIANT: { label: "Không đạt chuẩn", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  EXPIRED: { label: "Hết hạn", bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params.id as string)?.toLowerCase();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    hsCode: "",
    origin: "",
    description: "",
    selectedMarkets: ["CN"] as string[],
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState<string | null>(null);

  // Create Batch Modal State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchForm, setBatchForm] = useState({
    batchCode: "",
    quantity: "" as string | number,
    unit: "tấn",
    status: "DRAFT" as BatchStatus,
    producedAt: "",
    expiresAt: "",
  });
  const [savingBatch, setSavingBatch] = useState(false);
  const [batchFormError, setBatchFormError] = useState<string | null>(null);

  // Delete Product Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 4-Key Compliance Gate Vault Modal
  const [selectedBatchForVault, setSelectedBatchForVault] = useState<{ id: string; batchCode: string } | null>(null);

  const fetchProductDetail = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ProductItem>(`/products/${productId}`);
      setProduct(res.data);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải thông tin sản phẩm"));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  const handleOpenEdit = () => {
    if (!product) return;
    setProductForm({
      name: product.name,
      category: product.category,
      hsCode: product.hsCode || "",
      origin: product.origin || "",
      description: product.description || "",
      selectedMarkets: product.marketRequirements?.map(m => m.marketCode) || ["CN"],
    });
    setProductFormError(null);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSavingProduct(true);
    setProductFormError(null);

    const payload = {
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      hsCode: productForm.hsCode.trim() || null,
      origin: productForm.origin.trim() || null,
      description: productForm.description.trim() || null,
      markets: productForm.selectedMarkets.map(code => ({
        marketCode: code,
        marketName: MARKET_OPTIONS.find(m => m.code === code)?.name || code,
      })),
    };

    try {
      await api.patch(`/products/${product.id}`, payload);
      setIsEditModalOpen(false);
      await fetchProductDetail();
    } catch (err) {
      setProductFormError(getErrorMessage(err, "Không thể cập nhật sản phẩm"));
    } finally {
      setSavingProduct(false);
    }
  };

  const [userRole, setUserRole] = useState<string>("OWNER");
  const [gaccProfile, setGaccProfile] = useState({
    ciferCode: "CVNM2401240001",
    defaultPhcCode: "VN-TGPH-0012",
    defaultPucCode: "VN-TGOR-0095",
    defaultExportPort: "Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)",
  });

  // Fetch GACC Profile from Organization settings
  useEffect(() => {
    async function loadOrgProfile() {
      try {
        const meRes = await api.get<any>('/api/auth/me');
        if (meRes.data?.organizations?.length > 0) {
          const uOrg = meRes.data.organizations[0];
          setUserRole(uOrg.role || "VIEWER");
          const orgRes = await api.get<any>(`/api/organizations/${uOrg.id}`);
          const o = orgRes.data;
          const config =
            typeof o?.exportMarkets === 'object' && o?.exportMarkets !== null && !Array.isArray(o.exportMarkets)
              ? o.exportMarkets
              : {};
          setGaccProfile({
            ciferCode: config.ciferCode || "CVNM2401240001",
            defaultPhcCode: config.defaultPhcCode || "VN-TGPH-0012",
            defaultPucCode: config.defaultPucCode || "VN-TGOR-0095",
            defaultExportPort: config.defaultExportPort || "Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)",
          });
        }
      } catch {
        // fallback
      }
    }
    loadOrgProfile();
  }, []);

  const handleOpenAddBatch = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const currentYear = new Date().getFullYear();
    setBatchForm({
      batchCode: `SR-${currentYear}-${randomSuffix}`,
      quantity: 20.0,
      unit: "tấn",
      status: "DRAFT",
      producedAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    });
    setBatchFormError(null);
    setIsBatchModalOpen(true);
  };

  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!batchForm.batchCode.trim()) {
      setBatchFormError("Vui lòng nhập mã Lô hàng");
      return;
    }
    setSavingBatch(true);
    setBatchFormError(null);

    const payload = {
      batchCode: batchForm.batchCode.trim(),
      productId: product.id,
      quantity: batchForm.quantity ? Number(batchForm.quantity) : null,
      unit: batchForm.unit.trim(),
      status: batchForm.status,
      producedAt: batchForm.producedAt ? new Date(batchForm.producedAt).toISOString() : null,
      expiresAt: batchForm.expiresAt ? new Date(batchForm.expiresAt).toISOString() : null,
    };

    try {
      await api.post('/batches', payload);
      setIsBatchModalOpen(false);
      await fetchProductDetail();
    } catch (err) {
      setBatchFormError(getErrorMessage(err, "Không thể tạo lô hàng"));
    } finally {
      setSavingBatch(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.delete(`/products/${product.id}`);
      router.push('/products');
    } catch (err) {
      setDeleteError(getErrorMessage(err, "Không thể xóa sản phẩm"));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="h-10 w-96 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl" />
          <div className="h-96 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center space-y-4 max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
        <h3 className="text-lg font-bold text-red-900">Không tìm thấy sản phẩm</h3>
        <p className="text-sm text-red-700">{error || "Sản phẩm không tồn tại hoặc đã bị xóa."}</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00327d] text-white rounded-xl text-sm font-semibold hover:bg-[#0047ab] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Breadcrumb & Top Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#737784] uppercase tracking-wider">
        <Link href="/products" className="hover:text-[#00327d] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Danh mục sản phẩm
        </Link>
        <span>/</span>
        <span className="text-[#00327d] font-bold">{product.name}</span>
      </div>

      {/* Header Info & Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-[#eceef0] text-[#434653] text-xs font-mono font-bold rounded">
              HS {product.hsCode || "0810.60.00"}
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
              {product.category}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#191c1e] mb-2">{product.name}</h1>
          <p className="text-[#434653] text-sm max-w-2xl">{product.description || "Chưa có mô tả chi tiết."}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAddBatch}
            className="px-4 py-2 bg-[#00327d] hover:bg-[#0047ab] text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tạo Lô hàng
          </button>
          <button
            onClick={handleOpenEdit}
            className="px-3.5 py-2 bg-white border border-[#c3c6d5] hover:bg-[#f7f9fb] text-[#191c1e] font-semibold text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Edit2 className="w-4 h-4" /> Sửa
          </button>
          <button
            onClick={() => {
              setIsDeleteDialogOpen(true);
              setDeleteError(null);
            }}
            className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
            title="Xóa sản phẩm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Info & Batches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Base Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d5]/60 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#191c1e] flex items-center gap-2 border-b border-[#c3c6d5]/40 pb-3">
              <Package className="w-5 h-5 text-[#00327d]" /> Thông tin vùng trồng & Quy cách
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
              <div>
                <p className="text-xs font-mono text-[#737784] uppercase font-semibold">Vùng trồng & Mã số PUC</p>
                <p className="text-sm font-semibold text-[#191c1e] mt-1">{product.origin || "Chưa thiết lập"}</p>
              </div>

              <div>
                <p className="text-xs font-mono text-[#737784] uppercase font-semibold">Thị trường xuất khẩu</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {product.marketRequirements && product.marketRequirements.length > 0 ? (
                    product.marketRequirements.map((m) => (
                      <span key={m.marketCode} className="px-2 py-0.5 bg-[#00327d]/10 text-[#00327d] text-xs font-semibold rounded">
                        {m.marketName}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Trung Quốc (GACC)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Batches Table Card */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" /> Danh sách Lô hàng ({product.batches?.length || 0})
              </h3>
              {userRole !== 'VIEWER' && (
                <button
                  onClick={handleOpenAddBatch}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm lô mới
                </button>
              )}
            </div>

            {product.batches && product.batches.length > 0 ? (
              <div className="divide-y divide-outline-variant/40">
                {product.batches.map((b) => {
                  const statusCfg = BATCH_STATUS_CONFIG[b.status] || BATCH_STATUS_CONFIG.DRAFT;
                  const qtyNum = b.quantity || 0;
                  const estValueBillion = (qtyNum * 0.12).toFixed(1);
                  const estContainers = (qtyNum / 20).toFixed(1);

                  return (
                    <div key={b.id} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-on-surface bg-slate-50 px-2.5 py-0.5 rounded-lg border border-outline-variant/60">
                            {b.batchCode}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                          >
                            {statusCfg.label}
                          </span>

                          {qtyNum > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs text-on-surface-variant flex items-center gap-1 font-semibold">
                                <Weight className="w-3.5 h-3.5 text-slate-500" />
                                {qtyNum} {b.unit || 'tấn'}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                💰 ~{estValueBillion} Tỷ VNĐ
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                                🚛 ~{estContainers} Cont 40ft
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-on-surface-variant flex items-center gap-3">
                          {b.producedAt && (
                            <span>
                              Ngày đóng cont: <strong>{new Date(b.producedAt).toLocaleDateString('vi-VN')}</strong>
                            </span>
                          )}
                        </div>

                        {/* Blind Spot Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            🧪 Cadmium GB 2762-2022 (≤ 0.05 mg/kg)
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                            ⏳ Cửa Sổ Hạn KDTV (14 Ngày)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end lg:self-center flex-wrap">
                        <button
                          type="button"
                          onClick={() => setSelectedBatchForVault({ id: b.id, batchCode: b.batchCode })}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Hồ sơ 4 Khóa
                        </button>
                        <Link
                          href={`/checks/new?batch=${encodeURIComponent(b.batchCode)}`}
                          className="px-3.5 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-primary/30 shadow-2xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Quét AI
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-on-surface-variant text-xs space-y-2">
                <p>Chưa có Lô hàng nào được tạo cho sản phẩm này.</p>
                {userRole !== 'VIEWER' && (
                  <button
                    onClick={handleOpenAddBatch}
                    className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tạo Lô đầu tiên
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Requirements & Guidelines */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d5]/60 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#191c1e] flex items-center gap-2 border-b border-[#c3c6d5]/40 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Ngưỡng Tuân thủ GACC
            </h3>

            <div className="space-y-3 text-xs text-[#434653]">
              <div className="flex justify-between items-center py-1.5 border-b border-[#c3c6d5]/30">
                <span>Cadmium (Cd) trong sầu riêng</span>
                <span className="font-mono font-bold text-emerald-700">≤ 0.05 mg/kg</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#c3c6d5]/30">
                <span>Chì (Lead - Pb)</span>
                <span className="font-mono font-bold text-[#191c1e]">≤ 0.1 mg/kg</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#c3c6d5]/30">
                <span>Dư lượng Chlorpyrifos</span>
                <span className="font-mono font-bold text-[#191c1e]">≤ 0.01 mg/kg</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span>Rệp sáp Pseudococcus cryptus</span>
                <span className="font-bold text-rose-600">Tuyệt đối không có</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: CHỈNH SỬA SẢN PHẨM */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-outline-variant overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#00327d]" />
                Chỉnh sửa Sản phẩm
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {productFormError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{productFormError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#191c1e] uppercase">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1e] uppercase">Ngành hàng / Phân loại *</label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1e] uppercase">Mã HS (HS Code)</label>
                  <input
                    type="text"
                    value={productForm.hsCode}
                    onChange={(e) => setProductForm({ ...productForm, hsCode: e.target.value })}
                    className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#191c1e] uppercase">Vùng trồng / Mã số PUC &amp; PHC</label>
                <input
                  type="text"
                  value={productForm.origin}
                  onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                  className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#191c1e] uppercase">Mô tả / Quy cách</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-[#c3c6d5] text-[#434653] hover:bg-[#f7f9fb] font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2 bg-[#00327d] hover:bg-[#0047ab] text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {savingProduct ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM LÔ HÀNG (BATCH) */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-outline-variant overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00327d]" />
                Tạo Lô hàng Xuất khẩu mới
              </h3>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBatch} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {batchFormError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{batchFormError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#191c1e] uppercase">Mã Lô hàng (Batch Code) *</label>
                <input
                  type="text"
                  required
                  value={batchForm.batchCode}
                  onChange={(e) => setBatchForm({ ...batchForm, batchCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm font-mono font-semibold focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface uppercase">Khối lượng xuất (Tấn) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="VD: 20.0"
                    value={batchForm.quantity}
                    onChange={(e) => setBatchForm({ ...batchForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface uppercase">Đơn vị tính</label>
                  <input
                    type="text"
                    value={batchForm.unit}
                    onChange={(e) => setBatchForm({ ...batchForm, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              {/* Dynamic Financial Calculator */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900 flex items-center gap-1">
                    💰 Ước tính giá trị thương mại:
                  </span>
                  <span className="font-mono font-bold text-emerald-800">
                    ~{(Number(batchForm.quantity || 0) * 0.12).toFixed(1)} Tỷ VNĐ
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-700">
                  <span>Quy mô vận chuyển quốc tế:</span>
                  <span className="font-semibold">
                    ~{(Number(batchForm.quantity || 0) / 20).toFixed(1)} Container 40ft Lạnh
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1e] uppercase">Ngày đóng hàng</label>
                  <input
                    type="date"
                    value={batchForm.producedAt}
                    onChange={(e) => setBatchForm({ ...batchForm, producedAt: e.target.value })}
                    className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1e] uppercase">Hạn sử dụng</label>
                  <input
                    type="date"
                    value={batchForm.expiresAt}
                    onChange={(e) => setBatchForm({ ...batchForm, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-4 py-2 border border-[#c3c6d5] text-[#434653] hover:bg-[#f7f9fb] font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingBatch}
                  className="px-5 py-2 bg-[#00327d] hover:bg-[#0047ab] text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {savingBatch ? "Đang lưu..." : "Tạo Lô hàng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG: XÁC NHẬN XÓA SẢN PHẨM */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-outline-variant p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-[#191c1e]">Xác nhận xóa Sản phẩm</h3>
              <p className="text-sm text-[#434653]">
                Bạn có chắc chắn muốn xóa <strong>{product.name}</strong>? Thao tác này không thể hoàn tác.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleting}
                className="px-4 py-2 border border-[#c3c6d5] text-[#434653] hover:bg-[#f7f9fb] font-semibold text-sm rounded-xl transition-colors cursor-pointer flex-1"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex-1"
              >
                {deleting ? "Đang xóa..." : "Xác nhận Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HỒ SƠ 4 KHÓA TUÂN THỦ CHO LÔ HÀNG */}
      {selectedBatchForVault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-base text-on-surface">
                    Quản lý Hồ sơ 4 Khóa: {selectedBatchForVault.batchCode}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Nạp và đối soát 4 chứng thư pháp lý bắt buộc để chuẩn bị xuất khẩu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBatchForVault(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <BatchDocumentVault
                batchId={selectedBatchForVault.id}
                batchCode={selectedBatchForVault.batchCode}
                onNavigateToCheck={(bId) => {
                  setSelectedBatchForVault(null);
                  router.push(`/checks/new?batch=${encodeURIComponent(selectedBatchForVault.batchCode)}`);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


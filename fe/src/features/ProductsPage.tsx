"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  X,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  Weight
} from "lucide-react";
import { api } from "@/lib/api";
import { BatchDocumentVault } from "@/features/documents/BatchDocumentVault";
import type { ProductItem, BatchItem, BatchStatus } from "@/types/api";
import { getErrorMessage } from "@/types/api";

const MARKET_OPTIONS = [
  { code: "CN", name: "Trung Quốc (GACC)", desc: "Nghị định thư 2024 & CIFER" },
  { code: "EU", name: "Liên minh Châu Âu (EUDR)", desc: "Tiêu chuẩn MRL & Chống phá rừng" },
  { code: "US", name: "Hoa Kỳ (FDA / USDA)", desc: "Chiếu xạ & Kiểm dịch Thực vật" },
  { code: "JP", name: "Nhật Bản (MAFF / MHLW)", desc: "Danh mục Positive List MRL" },
  { code: "KR", name: "Hàn Quốc (MFDS / APQA)", desc: "Hệ thống PLS & Chứng thư KDTV" },
  { code: "ASEAN", name: "Đông Nam Á (Singapore SFA)", desc: "Chứng nhận C/O Form D & ATTP" },
];

function parseOriginFields(originStr: string | null | undefined) {
  if (!originStr) {
    return { province: "", pucCode: "", phcCode: "", ciferCode: "" };
  }
  const pucMatch = originStr.match(/PUC:\s*([^|\)]+)/i);
  const phcMatch = originStr.match(/PHC:\s*([^|\)]+)/i);
  const ciferMatch = originStr.match(/CIFER:\s*([^|\)]+)/i);

  let province = originStr;
  if (originStr.includes('(')) {
    province = originStr.split('(')[0].trim();
  } else if (pucMatch || phcMatch || ciferMatch) {
    province = "";
  }

  return {
    province: province.trim(),
    pucCode: pucMatch ? pucMatch[1].trim() : "",
    phcCode: phcMatch ? phcMatch[1].trim() : "",
    ciferCode: ciferMatch ? ciferMatch[1].trim() : "",
  };
}

function buildOriginString(form: { province: string; pucCode: string; phcCode: string; ciferCode: string }) {
  const parts: string[] = [];
  if (form.province.trim()) parts.push(form.province.trim());

  const codes: string[] = [];
  if (form.pucCode.trim()) codes.push(`Mã PUC: ${form.pucCode.trim()}`);
  if (form.phcCode.trim()) codes.push(`PHC: ${form.phcCode.trim()}`);
  if (form.ciferCode.trim()) codes.push(`CIFER: ${form.ciferCode.trim()}`);

  if (codes.length > 0) {
    parts.push(`(${codes.join(' | ')})`);
  }

  return parts.join(' ').trim() || null;
}

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

export default function ProductsPage() {
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<'products' | 'batches'>('products');

  // Products State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Batches State
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [batchesError, setBatchesError] = useState<string | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Product Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Sầu riêng tươi",
    hsCode: "0810.60.00",
    province: "",
    pucCode: "",
    phcCode: "",
    ciferCode: "",
    description: "",
    selectedMarkets: ["CN"] as string[],
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState<string | null>(null);

  // Batch Modals
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<BatchItem | null>(null);
  const [batchForm, setBatchForm] = useState({
    batchCode: "",
    productId: "",
    quantity: "" as string | number,
    unit: "tấn",
    status: "DRAFT" as BatchStatus,
    producedAt: "",
    expiresAt: "",
  });
  const [savingBatch, setSavingBatch] = useState(false);
  const [batchFormError, setBatchFormError] = useState<string | null>(null);

  // Delete Confirm Dialog
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product' | 'batch'; id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 4-Key Compliance Gate Vault Modal
  const [selectedBatchForVault, setSelectedBatchForVault] = useState<{ id: string; batchCode: string } | null>(null);

  // Role & GACC Profile State from Settings
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

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const res = await api.get<ProductItem[]>('/products?pageSize=100');
      setProducts(res.data || []);
    } catch (err) {
      setProductsError(getErrorMessage(err, "Không thể tải danh sách sản phẩm"));
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Fetch Batches
  const fetchBatches = useCallback(async () => {
    setLoadingBatches(true);
    setBatchesError(null);
    try {
      const res = await api.get<BatchItem[]>('/batches?pageSize=100');
      setBatches(res.data || []);
    } catch (err) {
      setBatchesError(getErrorMessage(err, "Không thể tải danh sách lô hàng"));
    } finally {
      setLoadingBatches(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchBatches();
  }, [fetchProducts, fetchBatches]);

  // Product CRUD Handlers (Auto-fill GACC CIFER Profile)
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "Sầu riêng tươi",
      hsCode: "0810.60.00",
      province: "Tiền Giang",
      pucCode: gaccProfile.defaultPucCode || "VN-TGOR-0095",
      phcCode: gaccProfile.defaultPhcCode || "VN-TGPH-0012",
      ciferCode: gaccProfile.ciferCode || "CVNM2401240001",
      description: "",
      selectedMarkets: ["CN"],
    });
    setProductFormError(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProduct(p);
    const parsedOrigin = parseOriginFields(p.origin);
    setProductForm({
      name: p.name,
      category: p.category,
      hsCode: p.hsCode || "",
      province: parsedOrigin.province,
      pucCode: parsedOrigin.pucCode,
      phcCode: parsedOrigin.phcCode,
      ciferCode: parsedOrigin.ciferCode,
      description: p.description || "",
      selectedMarkets: p.marketRequirements?.map(m => m.marketCode) || ["CN"],
    });
    setProductFormError(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      setProductFormError("Vui lòng nhập tên sản phẩm");
      return;
    }
    setSavingProduct(true);
    setProductFormError(null);

    const formattedOrigin = buildOriginString({
      province: productForm.province,
      pucCode: productForm.pucCode,
      phcCode: productForm.phcCode,
      ciferCode: productForm.ciferCode,
    });

    const payload = {
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      hsCode: productForm.hsCode.trim() || null,
      origin: formattedOrigin,
      description: productForm.description.trim() || null,
      markets: productForm.selectedMarkets.map(code => ({
        marketCode: code,
        marketName: MARKET_OPTIONS.find(m => m.code === code)?.name || code,
      })),
    };

    try {
      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setIsProductModalOpen(false);
      await fetchProducts();
    } catch (err) {
      setProductFormError(getErrorMessage(err, "Không thể lưu thông tin sản phẩm"));
    } finally {
      setSavingProduct(false);
    }
  };

  // Batch CRUD Handlers (Auto-fill Year & 20 Tons Container Specs)
  const handleOpenAddBatch = (defaultProductId?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingBatch(null);
    const prodId = defaultProductId || (products.length > 0 ? products[0].id : "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const currentYear = new Date().getFullYear();
    setBatchForm({
      batchCode: `SR-${currentYear}-${randomSuffix}`,
      productId: prodId,
      quantity: 20.0, // Chuẩn 1 Container 40ft (20 tấn sầu riêng tươi)
      unit: "tấn",
      status: "DRAFT",
      producedAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    });
    setBatchFormError(null);
    setIsBatchModalOpen(true);
  };

  const handleOpenEditBatch = (b: BatchItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBatch(b);
    setBatchForm({
      batchCode: b.batchCode,
      productId: b.productId,
      quantity: b.quantity ?? "",
      unit: b.unit || "tấn",
      status: b.status,
      producedAt: b.producedAt ? new Date(b.producedAt).toISOString().split('T')[0] : "",
      expiresAt: b.expiresAt ? new Date(b.expiresAt).toISOString().split('T')[0] : "",
    });
    setBatchFormError(null);
    setIsBatchModalOpen(true);
  };

  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchForm.batchCode.trim()) {
      setBatchFormError("Vui lòng nhập mã Lô hàng");
      return;
    }
    if (!batchForm.productId) {
      setBatchFormError("Vui lòng chọn sản phẩm liên kết");
      return;
    }
    setSavingBatch(true);
    setBatchFormError(null);

    const payload = {
      batchCode: batchForm.batchCode.trim(),
      productId: batchForm.productId,
      quantity: batchForm.quantity ? Number(batchForm.quantity) : null,
      unit: batchForm.unit.trim(),
      status: batchForm.status,
      producedAt: batchForm.producedAt ? new Date(batchForm.producedAt).toISOString() : null,
      expiresAt: batchForm.expiresAt ? new Date(batchForm.expiresAt).toISOString() : null,
    };

    try {
      if (editingBatch) {
        await api.patch(`/batches/${editingBatch.id}`, payload);
      } else {
        await api.post('/batches', payload);
      }
      setIsBatchModalOpen(false);
      await fetchBatches();
      await fetchProducts();
    } catch (err) {
      setBatchFormError(getErrorMessage(err, "Không thể lưu thông tin lô hàng"));
    } finally {
      setSavingBatch(false);
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);

    try {
      if (deleteTarget.type === 'product') {
        await api.delete(`/products/${deleteTarget.id}`);
        await fetchProducts();
      } else {
        await api.delete(`/batches/${deleteTarget.id}`);
        await fetchBatches();
        await fetchProducts();
      }
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(getErrorMessage(err, "Xóa thất bại"));
    } finally {
      setDeleting(false);
    }
  };

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.hsCode && p.hsCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.origin && p.origin.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredBatches = batches.filter(b => {
    return (
      b.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.productName && b.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.origin && b.origin.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00327d] uppercase tracking-wider mb-1 font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            Hồ sơ Doanh nghiệp & Xuất khẩu
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#191c1e] mb-1">
            Quản lý Sản phẩm &amp; Lô hàng
          </h2>
          <p className="text-[#434653] text-sm max-w-2xl">
            Quản lý danh mục hàng hóa xuất khẩu, mã số vùng trồng (PUC), cơ sở đóng gói (PHC) và các lô hàng container chuẩn bị quét tuân thủ AI.
          </p>
        </div>

        {/* Primary CTA Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddProduct}
            className="px-4 py-2.5 bg-white border border-[#00327d] text-[#00327d] hover:bg-[#00327d]/5 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm Sản phẩm
          </button>
          <button
            onClick={() => handleOpenAddBatch()}
            className="px-4 py-2.5 bg-[#00327d] hover:bg-[#0047ab] text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tạo Lô hàng mới
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#c3c6d5]/60">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'border-[#00327d] text-[#00327d]'
              : 'border-transparent text-[#434653] hover:text-[#191c1e]'
          }`}
        >
          <Package className="w-4 h-4" />
          Danh mục Sản phẩm ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'batches'
              ? 'border-[#00327d] text-[#00327d]'
              : 'border-transparent text-[#434653] hover:text-[#191c1e]'
          }`}
        >
          <Layers className="w-4 h-4" />
          Tất cả Lô hàng xuất khẩu ({batches.length})
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-[#c3c6d5]/60 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#434653]" />
          <input
            type="text"
            placeholder={
              activeTab === 'products'
                ? "Tìm kiếm theo tên sản phẩm, mã HS, vùng trồng..."
                : "Tìm kiếm mã lô hàng (vd: DURIAN-2024-889), tên sản phẩm..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f7f9fb] border border-[#c3c6d5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeTab === 'products') fetchProducts();
              else fetchBatches();
            }}
            className="p-2 text-[#434653] hover:text-[#00327d] bg-[#f7f9fb] border border-[#c3c6d5] rounded-lg transition-colors cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCTS LIST */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {loadingProducts ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-xl border border-[#c3c6d5]/40 animate-pulse p-6" />
              ))}
            </div>
          ) : productsError ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm font-medium">{productsError}</span>
              </div>
              <button
                onClick={fetchProducts}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-[#c3c6d5] p-8 space-y-4">
              <div className="w-16 h-16 bg-[#00327d]/10 text-[#00327d] rounded-2xl flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#191c1e]">Chưa có sản phẩm nào</h3>
                <p className="text-sm text-[#434653] max-w-md mx-auto mt-1">
                  Thêm sản phẩm nông sản đầu tiên để cấu hình tiêu chuẩn thị trường và tạo các lô hàng xuất khẩu.
                </p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 bg-[#00327d] hover:bg-[#0047ab] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" /> Thêm Sản phẩm ngay
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/products/${product.id.toLowerCase()}`)}
                className="bg-white p-6 rounded-xl border border-[#c3c6d5]/60 hover:border-[#00327d]/60 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Product Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-[#0047ab]/10 border border-[#0047ab]/20 flex items-center justify-center text-[#00327d] flex-shrink-0 mt-0.5">
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-sans text-lg font-bold text-[#191c1e] group-hover:text-[#00327d] transition-colors">
                          {product.name}
                        </h3>
                        {product.hsCode && (
                          <span className="px-2.5 py-0.5 bg-[#eceef0] text-[#434653] text-xs font-mono font-bold rounded">
                            HS {product.hsCode}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 bg-[#d2e0fe]/60 text-[#00327d] text-xs font-bold rounded border border-[#00327d]/20">
                          {product.batchesCount || 0} Lô hàng
                        </span>
                      </div>

                      {product.description && (
                        <p className="text-xs text-[#434653] line-clamp-1">{product.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#434653] pt-1">
                        {product.origin && (
                          <span>
                            Vùng trồng: <strong className="text-[#191c1e]">{product.origin}</strong>
                          </span>
                        )}
                        <span>•</span>
                        <span>
                          Thị trường:{" "}
                          <strong className="text-[#191c1e]">
                            {product.marketRequirements && product.marketRequirements.length > 0
                              ? product.marketRequirements.map((m) => m.marketName).join(", ")
                              : "Trung Quốc (GACC)"}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 self-end lg:self-center">
                    <button
                      onClick={(e) => handleOpenAddBatch(product.id, e)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Tạo lô hàng cho sản phẩm này"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tạo Lô
                    </button>
                    <button
                      onClick={(e) => handleOpenEditProduct(product, e)}
                      className="p-2 text-[#434653] hover:text-[#00327d] hover:bg-[#f7f9fb] border border-transparent hover:border-[#c3c6d5] rounded-lg transition-colors cursor-pointer"
                      title="Chỉnh sửa sản phẩm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ type: 'product', id: product.id, name: product.name });
                        setDeleteError(null);
                      }}
                      className="p-2 text-[#434653] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: BATCHES LIST */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          {loadingBatches ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-white rounded-xl border border-[#c3c6d5]/40 animate-pulse p-6" />
              ))}
            </div>
          ) : batchesError ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm font-medium">{batchesError}</span>
              </div>
              <button
                onClick={fetchBatches}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-[#c3c6d5] p-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#191c1e]">Chưa có lô hàng xuất khẩu nào</h3>
                <p className="text-sm text-[#434653] max-w-md mx-auto mt-1">
                  Tạo lô hàng container mới và gắn với sản phẩm tương ứng để sẵn sàng nộp hồ sơ kiểm định.
                </p>
              </div>
              <button
                onClick={() => handleOpenAddBatch()}
                className="px-4 py-2 bg-[#00327d] hover:bg-[#0047ab] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" /> Tạo Lô hàng ngay
              </button>
            </div>
          ) : (
            filteredBatches.map((batch) => {
              const statusCfg = BATCH_STATUS_CONFIG[batch.status] || BATCH_STATUS_CONFIG.DRAFT;
              const qtyNum = batch.quantity || 0;
              const estValueBillion = (qtyNum * 0.12).toFixed(1);
              const estContainers = (qtyNum / 20).toFixed(1);

              return (
                <div
                  key={batch.id}
                  className="bg-white p-5 rounded-2xl border border-outline-variant/60 hover:border-primary/60 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-on-surface bg-slate-50 px-2.5 py-1 rounded-lg border border-outline-variant/60">
                        {batch.batchCode}
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
                            {qtyNum} {batch.unit || 'tấn'}
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

                    <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
                      <span>
                        Sản phẩm: <strong className="text-on-surface">{batch.productName || "Sầu riêng tươi"}</strong>
                      </span>
                      {batch.producedAt && (
                        <>
                          <span>•</span>
                          <span>
                            Ngày đóng cont: <strong>{new Date(batch.producedAt).toLocaleDateString('vi-VN')}</strong>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Proactive Compliance & Blind Spot Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                        🧪 Cadmium GB 2762-2022 (≤ 0.05 mg/kg)
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                        ⏳ Cửa Sổ Hạn KDTV (14 Ngày)
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedBatchForVault({ id: batch.id, batchCode: batch.batchCode })}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Hồ sơ 4 Khóa
                    </button>

                    <Link
                      href={`/checks/new?batch=${encodeURIComponent(batch.batchCode)}`}
                      className="px-3.5 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-primary/30 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Quét AI
                    </Link>

                    {userRole !== 'VIEWER' && (
                      <>
                        <button
                          onClick={(e) => handleOpenEditBatch(batch, e)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-slate-100 border border-transparent hover:border-outline-variant/60 rounded-xl transition-colors cursor-pointer"
                          title="Chỉnh sửa lô hàng"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget({ type: 'batch', id: batch.id, name: batch.batchCode });
                            setDeleteError(null);
                          }}
                          className="p-2 text-on-surface-variant hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition-colors cursor-pointer"
                          title="Xóa lô hàng"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MODAL: THÊM / SỬA SẢN PHẨM */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-outline-variant overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00327d]/10 text-[#00327d] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#191c1e]">
                    {editingProduct ? "Chỉnh sửa Thông tin Sản phẩm" : "Thêm Sản phẩm Xuất khẩu mới"}
                  </h3>
                  <p className="text-xs text-[#434653]">
                    Khai báo quy cách hàng hóa, mã số vùng trồng và thị trường xuất khẩu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-5 overflow-y-auto flex-1">
              {productFormError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{productFormError}</span>
                </div>
              )}

              {/* SECTION 1: THÔNG TIN SẢN PHẨM CƠ BẢN */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#191c1e] uppercase tracking-wider">
                    1. Thông tin hàng hóa cơ bản
                  </label>
                  <span className="text-[11px] text-[#434653] font-medium">* Bắt buộc</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#434653]">
                    Tên thương mại sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Sầu riêng Ri6 Tươi (Loại A) — Cơm vàng hạt lép"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#c3c6d5] rounded-xl text-sm focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e] bg-white shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#434653]">
                      Ngành hàng / Phân loại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Sầu riêng tươi"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#c3c6d5] rounded-xl text-sm focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e] bg-white shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#434653]">
                      Mã HS Quốc tế (HS Code)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 0810.60.00"
                      value={productForm.hsCode}
                      onChange={(e) => setProductForm({ ...productForm, hsCode: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#c3c6d5] rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e] bg-white shadow-2xs"
                    />
                  </div>
                </div>

                {/* Quick Suggestion Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[11px] text-[#434653]">Gợi ý nhanh:</span>
                  {[
                    { cat: "Sầu riêng tươi", hs: "0810.60.00" },
                    { cat: "Cà phê Robusta", hs: "0901.11.00" },
                    { cat: "Thanh long ruột đỏ", hs: "0810.90.92" },
                    { cat: "Xoài Cát Chu", hs: "0804.50.20" },
                    { cat: "Bưởi da xanh", hs: "0805.40.00" },
                  ].map((s) => (
                    <button
                      key={s.cat}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, category: s.cat, hsCode: s.hs })}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-[#434653] hover:bg-[#00327d]/10 hover:text-[#00327d] border border-slate-200 transition-colors cursor-pointer"
                    >
                      + {s.cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 2: MÃ SỐ VÙNG TRỒNG & HỒ SƠ HẢI QUAN */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#00327d]" />
                    <span className="text-xs font-bold text-[#191c1e] uppercase tracking-wider">
                      2. Hồ sơ Vùng trồng &amp; Mã số Hải quan
                    </span>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    XUẤT KHẨU CHÍNH NGẠCH
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#434653]">
                      Tỉnh / Vùng trồng xuất xứ
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Tiền Giang, Đắk Lắk..."
                      value={productForm.province}
                      onChange={(e) => setProductForm({ ...productForm, province: e.target.value })}
                      className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#434653]">
                      Mã số Vùng trồng (Mã PUC)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: VN-TGOR-0095"
                      value={productForm.pucCode}
                      onChange={(e) => setProductForm({ ...productForm, pucCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e] bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#434653]">
                      Mã Cơ sở đóng gói (Mã PHC)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: VN-TGPH-0012"
                      value={productForm.phcCode}
                      onChange={(e) => setProductForm({ ...productForm, phcCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e] bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#434653]">
                      Mã Doanh nghiệp CIFER (GACC)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: CVNM2401240001"
                      value={productForm.ciferCode}
                      onChange={(e) => setProductForm({ ...productForm, ciferCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: THỊ TRƯỜNG XUẤT KHẨU MỤC TIÊU */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#191c1e] uppercase tracking-wider">
                    3. Thị trường xuất khẩu mục tiêu
                  </label>
                  <span className="text-[11px] text-[#434653]">Áp dụng radar pháp lý &amp; ngưỡng MRL</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MARKET_OPTIONS.map((m) => {
                    const isChecked = productForm.selectedMarkets.includes(m.code);
                    return (
                      <label
                        key={m.code}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#00327d]/5 border-[#00327d] text-[#00327d] shadow-2xs'
                            : 'bg-white border-[#c3c6d5] text-[#434653] hover:border-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProductForm({
                                ...productForm,
                                selectedMarkets: [...productForm.selectedMarkets, m.code],
                              });
                            } else {
                              setProductForm({
                                ...productForm,
                                selectedMarkets: productForm.selectedMarkets.filter((c) => c !== m.code),
                              });
                            }
                          }}
                          className="mt-0.5 rounded text-[#00327d] focus:ring-[#00327d]"
                        />
                        <div className="min-w-0">
                          <div className="font-bold truncate">{m.name}</div>
                          <div className="text-[11px] text-[#434653] opacity-80 mt-0.5 truncate">{m.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: GHI CHÚ / MÔ TẢ THÊM (TÙY CHỌN) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#191c1e] uppercase tracking-wider">
                    4. Ghi chú / Mô tả thêm
                  </label>
                  <span className="text-[11px] text-[#434653] font-normal italic">Không bắt buộc</span>
                </div>
                <textarea
                  rows={2}
                  placeholder="VD: Trọng lượng quả 2.5 - 4.5 kg, độ brix ≥ 16%, phân loại hàng xuất khẩu tuyển chọn VIP..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-[#c3c6d5] rounded-xl text-sm focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e] bg-white shadow-2xs resize-none"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-3 border-t border-outline-variant flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#c3c6d5] text-[#434653] hover:bg-[#f7f9fb] font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2 bg-[#00327d] hover:bg-[#0047ab] text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {savingProduct ? "Đang lưu..." : editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM / SỬA LÔ HÀNG (BATCH) */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-outline-variant overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00327d]" />
                {editingBatch ? "Chỉnh sửa Lô hàng" : "Tạo Lô hàng Xuất khẩu mới"}
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
                  placeholder="VD: DURIAN-2024-889"
                  value={batchForm.batchCode}
                  onChange={(e) => setBatchForm({ ...batchForm, batchCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm font-mono font-semibold focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#191c1e] uppercase">Thuộc Sản phẩm *</label>
                <select
                  required
                  value={batchForm.productId}
                  onChange={(e) => setBatchForm({ ...batchForm, productId: e.target.value })}
                  className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
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
                  <label className="text-xs font-semibold text-[#191c1e] uppercase">Ngày đóng hàng / xuất xưởng</label>
                  <input
                    type="date"
                    value={batchForm.producedAt}
                    onChange={(e) => setBatchForm({ ...batchForm, producedAt: e.target.value })}
                    className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1e] uppercase">Hạn sử dụng dự kiến</label>
                  <input
                    type="date"
                    value={batchForm.expiresAt}
                    onChange={(e) => setBatchForm({ ...batchForm, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#191c1e] uppercase">Trạng thái ban đầu</label>
                <select
                  value={batchForm.status}
                  onChange={(e) => setBatchForm({ ...batchForm, status: e.target.value as BatchStatus })}
                  className="w-full px-3 py-2 border border-[#c3c6d5] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00327d]/20 focus:border-[#00327d] text-[#191c1e]"
                >
                  <option value="DRAFT">Nháp (DRAFT)</option>
                  <option value="COLLECTING_DOCUMENTS">Đang thu thập hồ sơ chứng từ</option>
                  <option value="READY_FOR_CHECK">Sẵn sàng thẩm định AI</option>
                </select>
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
                  {savingBatch ? "Đang lưu..." : editingBatch ? "Cập nhật" : "Tạo Lô hàng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG: XÁC NHẬN XÓA */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-outline-variant p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-[#191c1e]">
                Xác nhận xóa {deleteTarget.type === 'product' ? 'Sản phẩm' : 'Lô hàng'}
              </h3>
              <p className="text-sm text-[#434653]">
                Bạn có chắc chắn muốn xóa <strong>{deleteTarget.name}</strong>? Thao tác này không thể hoàn tác.
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
                onClick={() => setDeleteTarget(null)}
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
                onNavigateToCheck={() => {
                  const code = selectedBatchForVault.batchCode;
                  setSelectedBatchForVault(null);
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


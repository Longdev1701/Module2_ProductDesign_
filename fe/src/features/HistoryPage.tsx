"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Filter,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Building2,
  Layers,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";
import type { HistoryItem, HistorySummary, ProductItem } from "@/types/api";
import { getErrorMessage } from "@/types/api";

const MARKET_OPTIONS = [
  { value: "ALL", label: "Tất cả thị trường" },
  { value: "Trung Quốc", label: "Trung Quốc (GACC)" },
  { value: "EU", label: "Liên minh Châu Âu (EU)" },
  { value: "Hoa Kỳ", label: "Hoa Kỳ (FDA)" },
  { value: "Nhật Bản", label: "Nhật Bản (MHLW)" },
  { value: "Hàn Quốc", label: "Hàn Quốc (MFDS)" },
  { value: "Singapore", label: "Singapore (SFA)" },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả kết quả" },
  { value: "COMPLIANT", label: "Đạt chuẩn (Compliant)" },
  { value: "CONDITIONALLY_COMPLIANT", label: "Đạt có điều kiện" },
  { value: "NON_COMPLIANT", label: "Không đạt (Non-compliant)" },
  { value: "MANUAL_REVIEW_REQUIRED", label: "Cần rà soát thủ công" },
];

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [summary, setSummary] = useState<HistorySummary | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("ALL");
  const [selectedMarket, setSelectedMarket] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<string>("createdAt:desc");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Pagination States
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch product list for the filter dropdown
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.get<ProductItem[]>("/products?pageSize=100");
        if (res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
          setProducts(list);
        }
      } catch {
        // Ignore fallback
      }
    }
    void loadProducts();
  }, []);

  // Fetch Compliance Check History
  const fetchHistory = useCallback(
    async (targetPage = page) => {
      setLoading(true);
      setError(null);
      try {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(targetPage));
        searchParams.set("pageSize", String(pageSize));
        searchParams.set("sort", sortOrder);

        if (search.trim()) searchParams.set("search", search.trim());
        if (selectedProduct !== "ALL") searchParams.set("productId", selectedProduct);
        if (selectedMarket !== "ALL") searchParams.set("market", selectedMarket);
        if (selectedStatus !== "ALL") searchParams.set("status", selectedStatus);
        if (dateFrom) searchParams.set("dateFrom", dateFrom);
        if (dateTo) searchParams.set("dateTo", dateTo);

        const res = await api.get<HistoryItem[]>(`/reports/history?${searchParams.toString()}`);

        if (res.data) {
          const dataList = Array.isArray(res.data) ? res.data : [];
          setItems(dataList);
          const bodyAny = res as any;
          if (bodyAny.summary) {
            setSummary(bodyAny.summary);
          }
          if (res.meta) {
            setTotal(res.meta.total || 0);
            setTotalPages(res.meta.totalPages || 1);
            setPage(res.meta.page || 1);
          }
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Không thể tải lịch sử thẩm định tuân thủ từ hệ thống."));
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, sortOrder, search, selectedProduct, selectedMarket, selectedStatus, dateFrom, dateTo]
  );


  useEffect(() => {
    void fetchHistory(1);
  }, [selectedProduct, selectedMarket, selectedStatus, sortOrder, fetchHistory]);

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchHistory(1);
  };

  const handleResetFilter = () => {
    setSearch("");
    setSelectedProduct("ALL");
    setSelectedMarket("ALL");
    setSelectedStatus("ALL");
    setDateFrom("");
    setDateTo("");
    setSortOrder("createdAt:desc");
  };

  // Helper format date
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      return `${hours}:${mins} ${day}/${month}/${year}`;
    } catch {
      return isoString;
    }
  };

  // Helper render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLIANT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ĐẠT CHUẨN GACC
          </span>
        );
      case "CONDITIONALLY_COMPLIANT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ĐẠT CÓ ĐIỀU KIỆN
          </span>
        );
      case "NON_COMPLIANT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            KHÔNG ĐẠT
          </span>
        );
      case "MANUAL_REVIEW_REQUIRED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            CẦN RÀ SOÁT
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Top Breadcrumb */}
      <div className="flex items-center text-xs font-mono text-outline uppercase tracking-wider">
        <span>DASHBOARD</span>
        <ChevronRight className="mx-2 h-3 w-3" />
        <span className="text-primary font-semibold">LỊCH SỬ THẨM ĐỊNH AI</span>
      </div>

      {/* Header & Sort Control */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-on-surface tracking-tight">
            Lịch Sử Thẩm Định Tuân Thủ
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Tra cứu kết quả kiểm tra AI, biên bản thẩm định pháp lý xuất khẩu và mã băm toàn vẹn SHA-256
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-1 rounded-xl border border-outline-variant/60 shadow-2xs">
          <span className="text-[11px] font-mono font-semibold uppercase text-on-surface-variant px-2">SẮP XẾP:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="h-8 rounded-lg border-0 bg-slate-50 px-3 text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="createdAt:desc">Mới nhất trước</option>
            <option value="createdAt:asc">Cũ nhất trước</option>
            <option value="batchCode:asc">Mã Lô (A-Z)</option>
            <option value="batchCode:desc">Mã Lô (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Filter Form Card */}
      <Card className="rounded-2xl border-outline-variant/60 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <form onSubmit={handleApplyFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            {/* Search Input */}
            <div className="space-y-1.5 lg:col-span-2">
              <label className="block text-[11px] font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                Tìm kiếm Lô hàng / Sản phẩm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant" />
                <Input
                  type="text"
                  placeholder="Nhập mã lô (#LOT-...), tên sầu riêng, mã HS..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            {/* Product Filter */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                Sản Phẩm
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full h-9 px-3 border border-outline-variant/60 rounded-xl bg-white text-xs text-on-surface focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="ALL">Tất cả sản phẩm</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Market Filter */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                Thị Trường
              </label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full h-9 px-3 border border-outline-variant/60 rounded-xl bg-white text-xs text-on-surface focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {MARKET_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                Kết Quả Thẩm Định
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-9 px-3 border border-outline-variant/60 rounded-xl bg-white text-xs text-on-surface focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range: From */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                Từ Ngày
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            {/* Date Range: To */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                Đến Ngày
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 lg:col-span-3">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white text-xs font-bold h-9 px-5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" /> Áp dụng bộ lọc
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetFilter}
                className="text-xs font-semibold h-9 px-4 rounded-xl border-outline-variant/60 cursor-pointer"
              >
                Đặt lại
              </Button>
              <Link href="/checks/new" className="ml-auto">
                <Button
                  type="button"
                  className="bg-amber-400 hover:bg-amber-300 text-[#001946] text-xs font-bold h-9 px-4 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Tạo Thẩm Định Mới
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Main Table Card */}
      <Card className="rounded-2xl border-outline-variant/60 shadow-xs overflow-hidden">
        {/* Error State */}
        {error && (
          <div className="p-6 bg-rose-50 border-b border-rose-200 text-rose-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void fetchHistory()}
              className="text-xs border-rose-300 text-rose-700 hover:bg-rose-100 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Thử lại
            </Button>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans text-on-surface">
            <thead className="border-b border-outline-variant/60 bg-slate-50 text-[11px] font-mono font-bold uppercase text-on-surface-variant tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3.5">MÃ LÔ HÀNG</th>
                <th scope="col" className="px-5 py-3.5">SẢN PHẨM &amp; MÃ HS</th>
                <th scope="col" className="px-5 py-3.5">THỊ TRƯỜNG</th>
                <th scope="col" className="px-5 py-3.5">NGÀY THẨM ĐỊNH</th>
                <th scope="col" className="px-5 py-3.5">KẾT QUẢ AI</th>
                <th scope="col" className="px-5 py-3.5">ĐỘ TIN CẬY</th>
                <th scope="col" className="px-5 py-3.5 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {loading ? (
                // Skeleton Rows
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="h-4 bg-slate-200 rounded-md w-28 mb-1.5" />
                      <div className="h-3 bg-slate-100 rounded-md w-16" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 bg-slate-200 rounded-md w-40 mb-1.5" />
                      <div className="h-3 bg-slate-100 rounded-md w-24" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 bg-slate-200 rounded-md w-28" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 bg-slate-200 rounded-md w-32" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-6 bg-slate-200 rounded-full w-24" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 bg-slate-200 rounded-md w-12" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="h-8 bg-slate-200 rounded-lg w-20 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <Layers className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-on-surface">
                        Chưa có lịch sử thẩm định phù hợp
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        Không tìm thấy hồ sơ kiểm tra nào theo tiêu chí tìm kiếm hiện tại. Hãy thử đặt lại bộ lọc hoặc tạo bài kiểm tra AI mới.
                      </p>
                      <div className="pt-2">
                        <Link href="/checks/new">
                          <Button className="bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Tạo Thẩm Định Mới
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                // Real DB Rows
                items.map((row) => {
                  const targetReportId = row.reportId || row.batchId;

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Mã Lô Hàng */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Link
                          href={`/reports/${targetReportId}`}
                          className="font-mono font-bold text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {row.batchCode}
                        </Link>
                        {row.quantity && (
                          <div className="text-[11px] text-on-surface-variant font-mono">
                            {row.quantity} {row.unit || "tấn"}
                          </div>
                        )}
                      </td>

                      {/* Sản phẩm & Mã HS */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-on-surface text-xs">{row.productName}</div>
                        <div className="text-[10px] text-on-surface-variant font-mono">
                          Mã HS: {row.hsCode || "0810.60.00"} • {row.productCategory}
                        </div>
                      </td>

                      {/* Thị trường */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-on-surface">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>{row.market}</span>
                        </div>
                      </td>

                      {/* Ngày thực hiện */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-on-surface-variant text-[11px] font-mono">
                        {formatDate(row.createdAt)}
                      </td>

                      {/* Trạng thái kết quả AI */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {renderStatusBadge(row.result)}
                      </td>

                      {/* Độ tin cậy AI */}
                      <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs font-bold text-on-surface">
                        {row.aiConfidence ? `${row.aiConfidence.toFixed(1)}%` : "95.0%"}
                      </td>

                      {/* Thao tác */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/reports/${targetReportId}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2.5 text-xs font-semibold border-outline-variant/60 hover:border-primary hover:text-primary rounded-lg flex items-center gap-1 cursor-pointer"
                              title="Xem Báo Cáo Thẩm Định"
                            >
                              <Eye className="w-3.5 h-3.5 text-primary" />
                              <span>Báo cáo</span>
                            </Button>
                          </Link>
                          {row.integrityHash && (
                            <span
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200"
                              title={`Mã băm SHA-256 bất biến: ${row.integrityHash}`}
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Server-side Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/60 px-5 py-3.5 bg-slate-50/50">
          <span className="text-xs text-on-surface-variant font-mono">
            Hiển thị {items.length > 0 ? (page - 1) * pageSize + 1 : 0} -{" "}
            {Math.min(page * pageSize, total)} trên tổng số {total} lần thẩm định
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1 || loading}
              onClick={() => void fetchHistory(page - 1)}
              className="h-8 w-8 text-xs border-outline-variant/60 cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
              const pageNumber = idx + 1;
              const isCurrent = pageNumber === page;
              return (
                <Button
                  key={pageNumber}
                  variant={isCurrent ? "default" : "outline"}
                  size="icon"
                  disabled={loading}
                  onClick={() => void fetchHistory(pageNumber)}
                  className={`h-8 w-8 text-xs font-bold rounded-lg cursor-pointer ${
                    isCurrent ? "bg-primary text-white" : "border-outline-variant/60"
                  }`}
                >
                  {pageNumber}
                </Button>
              );
            })}

            {totalPages > 5 && <span className="px-1 text-xs text-on-surface-variant font-mono">... {totalPages}</span>}

            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages || loading}
              onClick={() => void fetchHistory(page + 1)}
              className="h-8 w-8 text-xs border-outline-variant/60 cursor-pointer disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Bottom Summary & Real Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Performance Summary Card */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-[#001946] via-[#002766] to-[#0047ab] p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-mono font-bold border border-white/15 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> HIỆU SUẤT TUÂN THỦ TỔNG THỂ
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
                Tóm tắt chỉ số an toàn lô hàng
              </h2>
              <p className="text-blue-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
                Tỉ lệ hồ sơ xuất khẩu đạt chuẩn theo Nghị định thư GACC và các tiêu chuẩn kiểm dịch thực vật đạt{" "}
                <span className="font-bold text-amber-300">{summary?.complianceRate ?? 100}%</span>. Đã thẩm định thành công{" "}
                <span className="font-bold text-white">{summary?.totalChecks ?? total}</span> lượt lô hàng.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
              <div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-300">
                  {summary?.complianceRate ?? 100}%
                </div>
                <div className="text-[11px] text-blue-200 mt-0.5">Tỉ lệ tuân thủ</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-emerald-400">
                  {summary?.compliantCount ?? 0}
                </div>
                <div className="text-[11px] text-blue-200 mt-0.5">Lô đạt chuẩn</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-rose-300">
                  {summary?.nonCompliantCount ?? 0}
                </div>
                <div className="text-[11px] text-blue-200 mt-0.5">Cần khắc phục</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Real Alerts Card */}
        <Card className="flex flex-col rounded-2xl border-outline-variant/60 shadow-xs">
          <CardHeader className="pb-3 border-b border-outline-variant/40">
            <CardTitle className="text-xs font-mono uppercase text-on-surface-variant tracking-wider flex items-center justify-between">
              <span>CẢNH BÁO QUY ĐỊNH MỚI NHẤT</span>
              <Badge className="bg-rose-100 text-rose-800 border-rose-300 text-[10px]">
                {summary?.recentAlerts?.length || 0} tin nóng
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 pt-4">
            {!summary?.recentAlerts || summary.recentAlerts.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-outline-variant/50 text-center space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-on-surface">Không có cảnh báo khẩn cấp</p>
                <p className="text-[11px] text-on-surface-variant">Toàn bộ chỉ tiêu xuất khẩu đang trong ngưỡng an toàn.</p>
              </div>
            ) : (
              summary.recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border space-y-1 ${
                    alert.severity === "CRITICAL"
                      ? "bg-rose-50 border-rose-200 text-rose-950"
                      : "bg-amber-50 border-amber-200 text-amber-950"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {alert.severity === "CRITICAL" ? (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <h4 className="font-bold text-xs truncate">{alert.title}</h4>
                  </div>
                  <p className="text-[11px] opacity-90 line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="pt-0 justify-center pb-4 border-t border-outline-variant/40 mt-auto">
            <Link href="/regulations" className="w-full">
              <Button variant="ghost" className="text-primary hover:bg-primary/5 font-semibold text-xs w-full flex items-center justify-center gap-1.5 cursor-pointer">
                <span>Tra cứu thư viện pháp lý GACC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

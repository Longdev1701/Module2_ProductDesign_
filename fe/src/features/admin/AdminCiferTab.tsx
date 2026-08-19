"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Filter,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "./AdminPagination";
import { AdminTableSkeleton } from "./AdminSkeletons";
import { api } from "@/lib/api";
import type { AdminCiferRecord } from "@/types/api";

interface AdminCiferTabProps {
  records?: AdminCiferRecord[];
  total?: number;
  loading?: boolean;
  search?: string;
  onSearchChange?: (val: string) => void;
  categoryFilter?: string;
  onCategoryFilterChange?: (val: string) => void;
  stateFilter?: string;
  onStateFilterChange?: (val: string) => void;
}

/**
 * Ánh xạ trạng thái CIFER GACC (Tiếng Trung/Anh) sang tiếng Việt & CSS badge
 */
export function parseCiferStatus(state?: string | null, expDate?: string | null) {
  const isChineseValid = state === "有效";
  const isEnglishValid = state?.toLowerCase() === "valid";
  const isRevoked = state === "注销" || state?.toLowerCase() === "revoked" || state?.toLowerCase() === "cancelled";
  const isSuspended = state === "暂停进口" || state?.toLowerCase() === "suspended";

  // Kiểm tra hạn hiệu lực thực tế theo ngày
  const isDateExpired = expDate ? new Date(expDate) < new Date("2026-08-19") : false;

  if (isRevoked) {
    return {
      status: "REVOKED",
      label: "Đã hủy (注销)",
      badgeClass: "bg-gray-100 text-gray-700 border-gray-300",
      isValid: false,
    };
  }

  if (isSuspended) {
    return {
      status: "SUSPENDED",
      label: "Tạm đình chỉ (暂停进口)",
      badgeClass: "bg-red-100 text-red-800 border-red-300",
      isValid: false,
    };
  }

  if (isDateExpired) {
    return {
      status: "EXPIRED",
      label: "Hết hạn hiệu lực",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
      isValid: false,
    };
  }

  if (isChineseValid || isEnglishValid || !state) {
    return {
      status: "VALID",
      label: "Hợp lệ (有效)",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      isValid: true,
    };
  }

  return {
    status: "UNKNOWN",
    label: state,
    badgeClass: "bg-surface-container text-on-surface-variant border-outline-variant",
    isValid: true,
  };
}

/**
 * Bộ từ điển chuyển đổi 100% ngành hàng CIFER từ tiếng Trung (GACC) sang tiếng Việt
 */
export const CIFER_CATEGORY_DICT: Record<string, string> = {
  // 1. Nông sản trái cây & Rau củ
  "冷冻水果": "Trái cây đông lạnh (Sầu riêng, xoài cấp đông...)",
  "干果": "Trái cây sấy khô (Xoài sấy, mít sấy, chuối sấy...)",
  "水果罐头": "Trái cây đóng hộp",
  "果粉": "Bột trái cây nguyên chất (Sầu riêng, xoài, thanh long)",
  "果酱": "Mứt trái cây (Mứt sệt / Jam)",
  "蜜饯": "Mứt quả sấy dẻo / Hoa quả ngâm đường",
  "果冻": "Thạch rau câu / Thạch trái cây",
  "果蔬汁及其饮料": "Nước ép rau củ & Nước trái cây",
  "蔬菜及其制品（保鲜和脱水蔬菜除外）": "Rau củ chế biến & Chế phẩm rau củ",
  "脱水蔬菜": "Rau củ sấy khô (Nông sản khử nước)",
  "棕榈芯": "Đọt cọ / Củ hũ dừa đóng hộp (Palm hearts)",

  // 2. Hạt, Ngũ cốc & Cà phê - Ca cao - Trà
  "坚果与籽类": "Hạt & Quả hạch (Hạt điều, mắc ca, hạt sen...)",
  "坚果及籽类制品": "Chế phẩm từ hạt & quả hạch",
  "经烘焙的咖啡豆及其制品": "Cà phê hạt rang & Chế phẩm cà phê",
  "咖啡（类）饮料": "Đồ uống cà phê",
  "经烘焙的可可豆及其制品": "Hạt ca-cao rang & Chế phẩm ca-cao",
  "茶叶类": "Trà & Chè khô các loại",
  "茶（类）饮料": "Đồ uống từ trà",
  "食用谷物": "Ngũ cốc lương thực (Gạo, nếp, ngô...)",
  "粮食制品以及其它产品": "Sản phẩm lương thực & Bột chế biến",
  "谷物制粉工业产品和麦芽": "Bột ngũ cốc xay & Mạch nha",
  "包馅面食": "Bánh bao, há cảo & Mì bột có nhân",
  "饼干、糕点、面包": "Bánh quy, bánh ngọt & Bánh mì",
  "膨化食品": "Thực phẩm phồng / Bánh snack",

  // 3. Thủy hải sản, Yến sào, Sữa & Dầu ăn
  "水产品": "Thủy hải sản & Chế phẩm thủy sản",
  "燕窝与燕窝制品": "Yến sào & Chế phẩm tổ yến",
  "巴氏杀菌乳和其他乳制品": "Sữa thanh trùng & Chế phẩm sữa",
  "食用植物油": "Dầu thực vật ăn được",

  // 4. Gia vị & Phụ gia thực phẩm
  "调味粉": "Bột gia vị & Bột nêm thực phẩm",
  "其他调味品": "Gia vị & Nước chấm khác",
  "酱油": "Nước tương / Xì dầu",
  "味精": "Bột ngọt (Mì chính / MSG)",
  "食用盐": "Muối ăn thực phẩm",
  "食品加工用菌种": "Men vi sinh & Vi nấm chế biến thực phẩm",
  "蛋白质及其衍生物": "Protein & Dẫn xuất protein",

  // 5. Đường & Bánh kẹo
  "食糖": "Đường ăn các loại",
  "原糖": "Đường thô",
  "糖浆": "Siro & Nước đường",
  "其他糖": "Các loại đường khác",
  "糖果": "Bánh kẹo các loại",
  "巧克力": "Sô-cô-la (Chocolate)",
  "其他糖果、巧克力": "Bánh kẹo & Sô-cô-la khác",

  // 6. Đồ uống & Rượu bia
  "固体饮料": "Đồ uống dạng bột / Đồ uống hòa tan",
  "植物饮料": "Đồ uống thảo mộc / Nước thảo dược",
  "蛋白饮料": "Đồ uống giàu đạm (Protein)",
  "碳酸饮料": "Nước giải khát có ga",
  "包装饮用水": "Nước uống đóng chai / Nước khoáng",
  "特殊用途饮料": "Đồ uống dinh dưỡng & Nước tăng lực",
  "其他饮料": "Đồ uống khác",
  "冷冻饮品及其制作料、食用冰": "Kem, đồ uống đông lạnh & Đá ăn",
  "发酵酒及其配制酒": "Rượu lên men & Rượu pha chế (Vang, bia...)",
  "蒸馏酒及其配制酒": "Rượu chưng cất & Rượu mạnh",
  "其他原酒及食用酒精": "Cồn thực phẩm & Rượu cốt",
};

export function translateCiferCategory(category?: string | null): string {
  if (!category) return "Nông sản & Thực phẩm";
  return CIFER_CATEGORY_DICT[category] || category;
}

export function AdminCiferTab({
  records: initialRecords = [],
  total: initialTotal = 0,
}: AdminCiferTabProps) {
  const [selectedRecord, setSelectedRecord] = useState<AdminCiferRecord | null>(null);

  // Server-side State
  const [records, setRecords] = useState<AdminCiferRecord[]>(initialRecords);
  const [totalCount, setTotalCount] = useState<number>(initialTotal);
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(initialTotal / 15) || 1);
  const [loading, setLoading] = useState<boolean>(false);

  // Query State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stateFilter, setStateFilter] = useState("ALL");

  // Fetch from Server with debounce on search
  const fetchCiferData = async (
    targetPage = page,
    targetPageSize = pageSize,
    targetSearch = searchTerm,
    targetCat = categoryFilter,
    targetState = stateFilter
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        pageSize: String(targetPageSize),
      });
      if (targetSearch.trim()) params.append("search", targetSearch.trim());
      if (targetCat && targetCat !== "ALL") params.append("category", targetCat);
      if (targetState && targetState !== "ALL") params.append("state", targetState);

      const res = await api.get<AdminCiferRecord[]>(`/admin/cifer?${params.toString()}`);
      if (res.data) {
        setRecords(res.data);
        const total = res.meta?.total !== undefined ? res.meta.total : res.data.length;
        setTotalCount(total);
        setTotalPages(res.meta?.totalPages || Math.ceil(total / targetPageSize) || 1);
      }
    } catch (err) {
      console.error("Error fetching CIFER registries from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and on page/filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchCiferData(page, pageSize, searchTerm, categoryFilter, stateFilter);
    }, 250);
    return () => clearTimeout(timer);
  }, [page, pageSize, searchTerm, categoryFilter, stateFilter]);

  const sortedCategoryOptions = useMemo(() => {
    return Object.entries(CIFER_CATEGORY_DICT).sort((a, b) =>
      a[1].localeCompare(b[1], "vi")
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Info & Quick KPI Badges */}
      <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300">
              GACC CIFER China Database
            </span>
            <span className="text-xs text-on-surface-variant font-mono">
              Tổng số cơ sở cấp phép: <strong className="text-primary text-sm">{totalCount.toLocaleString()}</strong> doanh nghiệp
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-on-surface flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            Danh Bạ Doanh Nghiệp Xuất Khẩu Được Cấp Phép CIFER (Trung Quốc)
          </h2>
          <p className="text-xs text-on-surface-variant">
            Toàn bộ cơ sở dữ liệu đăng ký xuất khẩu chính ngạch sang Tổng cục Hải quan Trung Quốc (GACC Lệnh 248).
          </p>
        </div>

        {/* Quick KPI badges */}
        <div className="flex items-center gap-2 self-stretch lg:self-auto justify-end">
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-[10px] font-mono text-emerald-700 uppercase font-semibold">Đang Hợp lệ (有效)</div>
            <div className="text-base font-bold text-emerald-900">&gt; 4.000</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-center">
            <div className="text-[10px] font-mono text-red-700 uppercase font-semibold">Tạm đình chỉ</div>
            <div className="text-base font-bold text-red-900">29</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-center">
            <div className="text-[10px] font-mono text-gray-700 uppercase font-semibold">Đã hủy/Thu hồi</div>
            <div className="text-base font-bold text-gray-900">63</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex-1 w-full flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/60">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm trong 4.375 cơ sở theo Mã CIFER (CVNM...), Tên doanh nghiệp, Mã MST, Địa chỉ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full text-xs bg-transparent focus:outline-none text-on-surface placeholder:text-on-surface-variant/60"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs px-3 py-2 rounded-lg border border-outline-variant bg-white text-on-surface focus:outline-none cursor-pointer max-w-[280px]"
          >
            <option value="ALL">Tất cả ngành hàng (53 ngành hàng GACC)</option>
            {sortedCategoryOptions.map(([chineseKey, vietName]) => (
              <option key={chineseKey} value={chineseKey}>
                {vietName}
              </option>
            ))}
          </select>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs px-3 py-2 rounded-lg border border-outline-variant bg-white text-on-surface focus:outline-none cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="VALID">Chỉ cơ sở Hợp lệ (有效)</option>
            <option value="SUSPENDED">Cơ sở bị Tạm ngưng (暂停进口)</option>
            <option value="REVOKED">Cơ sở Đã hủy (注销)</option>
          </select>
        </div>
      </div>

      {/* CIFER Table */}
      <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
        {loading ? (
          <AdminTableSkeleton rows={pageSize} cols={7} />
        ) : records.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-sm font-semibold text-on-surface">Không tìm thấy cơ sở CIFER phù hợp</p>
            <p className="text-xs text-on-surface-variant">Thử thay đổi từ khóa tìm kiếm hoặc chọn "Tất cả trạng thái"</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-outline-variant rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low font-mono uppercase text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3 font-semibold">MÃ CIFER (GACC)</th>
                    <th className="px-4 py-3 font-semibold">DOANH NGHIỆP / CƠ SỞ</th>
                    <th className="px-4 py-3 font-semibold">NGÀNH HÀNG (CIFER)</th>
                    <th className="px-4 py-3 font-semibold">HẠN HIỆU LỰC</th>
                    <th className="px-4 py-3 font-semibold">TRẠNG THÁI</th>
                    <th className="px-4 py-3 font-semibold">LIÊN KẾT HỆ THỐNG</th>
                    <th className="px-4 py-3 font-semibold text-right">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60">
                  {records.map((r) => {
                    const statusInfo = parseCiferStatus(r.state, r.expDate);
                    const vietCategory = translateCiferCategory(r.category);

                    return (
                      <tr key={r.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-purple-700 dark:text-purple-400 whitespace-nowrap">
                          {r.chinaRegNo}
                          {r.overseasRegNo && (
                            <div className="text-[10px] text-on-surface-variant font-normal">
                              Mã VN: {r.overseasRegNo}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-on-surface font-semibold max-w-[220px]">
                          <div className="truncate" title={r.name}>{r.name}</div>
                          <div className="text-[10px] text-on-surface-variant font-normal flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{r.address || r.country || "Vietnam"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-on-surface font-medium max-w-[180px] truncate" title={vietCategory}>
                          <div className="font-semibold text-on-surface truncate">{vietCategory}</div>
                          <div className="text-[10px] text-on-surface-variant font-mono">{r.category}</div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[11px] whitespace-nowrap">
                          <div>{r.expDate || "Vô thời hạn"}</div>
                          {r.regDate && (
                            <div className="text-[10px] text-on-surface-variant">Cấp: {r.regDate}</div>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border inline-flex items-center gap-1 whitespace-nowrap ${statusInfo.badgeClass}`}
                          >
                            {statusInfo.isValid ? (
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            ) : statusInfo.status === "SUSPENDED" ? (
                              <AlertTriangle className="w-2.5 h-2.5" />
                            ) : (
                              <XCircle className="w-2.5 h-2.5" />
                            )}
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {r.organization ? (
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium text-[11px] border border-blue-200">
                              {r.organization.name}
                            </span>
                          ) : (
                            <span className="text-on-surface-variant/60 italic text-[11px]">Chưa liên kết</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRecord(r)}
                            className="text-[11px] h-7 px-2 cursor-pointer"
                          >
                            Xem thẻ
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <AdminPagination
              page={page}
              pageSize={pageSize}
              total={totalCount}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
              }}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant space-y-4">
            <div className="border-b border-outline-variant pb-3 flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-purple-700 uppercase">Hồ Sơ Đăng Ký CIFER GACC</span>
                <h3 className="text-lg font-bold text-on-surface">{selectedRecord.name}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-on-surface-variant hover:text-on-surface font-bold text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container-low rounded-xl">
                <div>
                  <span className="text-on-surface-variant font-mono">MÃ ĐĂNG KÝ TRUNG QUỐC</span>
                  <div className="font-mono font-bold text-purple-700 text-sm">{selectedRecord.chinaRegNo}</div>
                </div>
                <div>
                  <span className="text-on-surface-variant font-mono">MÃ XUẤT KHẨU NƯỚC NGOÀI</span>
                  <div className="font-mono font-bold text-on-surface text-sm">{selectedRecord.overseasRegNo || "N/A"}</div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-on-surface">Ngành hàng / Danh mục xuất khẩu:</span>
                <p className="text-on-surface font-medium">{translateCiferCategory(selectedRecord.category)}</p>
                <p className="text-on-surface-variant font-mono text-[11px]">Tên gốc GACC: {selectedRecord.category}</p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-on-surface">Địa chỉ cơ sở / Vùng trồng:</span>
                <p className="text-on-surface-variant">{selectedRecord.address || "N/A"}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 p-3 bg-surface-container-low rounded-xl">
                <div>
                  <span className="text-on-surface-variant text-[11px]">Ngày cấp phép:</span>
                  <p className="font-mono font-bold text-on-surface">{selectedRecord.regDate || "N/A"}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[11px]">Hạn hiệu lực:</span>
                  <p className="font-mono font-bold text-on-surface">{selectedRecord.expDate || "Vô thời hạn"}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[11px]">Trạng thái:</span>
                  <div>
                    {(() => {
                      const st = parseCiferStatus(selectedRecord.state, selectedRecord.expDate);
                      return (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border inline-block ${st.badgeClass}`}>
                          {st.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant flex justify-end">
              <Button onClick={() => setSelectedRecord(null)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCiferTab;

"use client";

import React, { useState } from "react";
import {
  Globe2,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminLegalSyncStats } from "@/types/api";

interface AdminLegalSyncTabProps {
  stats: AdminLegalSyncStats | null;
  loading: boolean;
  onRefreshStats: () => Promise<void>;
  onTriggerSync: () => Promise<void>;
}

const MARKET_INFO: Record<string, { name: string; flag: string; agency: string; link: string }> = {
  VIETNAM: { name: "Việt Nam", flag: "🇻🇳", agency: "Cục Trồng trọt & BVTV (PPD)", link: "https://ppd.gov.vn" },
  CHINA: { name: "Trung Quốc", flag: "🇨🇳", agency: "Tổng cục Hải quan (GACC)", link: "http://english.customs.gov.cn" },
  USA: { name: "Hoa Kỳ", flag: "🇺🇸", agency: "Cục Quản lý Thực phẩm & Dược phẩm (FDA)", link: "https://www.fda.gov" },
  EU: { name: "Liên minh Châu Âu", flag: "🇪🇺", agency: "Ủy ban Châu Âu (EC Food Safety / RASFF)", link: "https://food.ec.europa.eu" },
  JAPAN: { name: "Nhật Bản", flag: "🇯🇵", agency: "Bộ Y tế, Lao động & Phúc lợi (MHLW)", link: "https://www.mhlw.go.jp" },
  KOREA: { name: "Hàn Quốc", flag: "🇰🇷", agency: "Bộ An toàn Thực phẩm & Dược phẩm (MFDS)", link: "https://www.mfds.go.kr" },
  AUSTRALIA: { name: "Úc", flag: "🇦🇺", agency: "Cơ quan Tiêu chuẩn Thực phẩm Úc-NZ (FSANZ)", link: "https://www.foodstandards.gov.au" },
  SINGAPORE: { name: "Singapore", flag: "🇸🇬", agency: "Cơ quan Thực phẩm Singapore (SFA)", link: "https://www.sfa.gov.sg" },
  UK: { name: "Anh Quốc", flag: "🇬🇧", agency: "Cơ quan Tiêu chuẩn Thực phẩm (FSA)", link: "https://www.food.gov.uk" },
  UAE: { name: "UAE (Trung Đông)", flag: "🇦🇪", agency: "Bộ Công nghiệp & Công nghệ Tiên tiến (ESMA)", link: "https://www.moiat.gov.ae" },
};

export function AdminLegalSyncTab({ stats, loading, onRefreshStats, onTriggerSync }: AdminLegalSyncTabProps) {
  const [triggering, setTriggering] = useState(false);
  const [triggerSuccess, setTriggerSuccess] = useState<string | null>(null);
  const [triggerError, setTriggerError] = useState<string | null>(null);

  const handleTrigger = async () => {
    setTriggering(true);
    setTriggerSuccess(null);
    setTriggerError(null);
    try {
      await onTriggerSync();
      setTriggerSuccess("Đã kích hoạt thành công tiến trình cào toàn văn & tóm tắt AI cho 9 thị trường! Dữ liệu đang được đồng bộ ngầm.");
      setTimeout(() => {
        void onRefreshStats();
      }, 3000);
    } catch (err: any) {
      setTriggerError(err?.message || "Không thể kích hoạt tiến trình cào tự động");
    } finally {
      setTriggering(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4" />
        <p className="text-sm text-on-surface-variant">Đang nạp thông số Trung tâm Đồng bộ Pháp lý...</p>
      </div>
    );
  }

  const distribution = stats.marketDistribution || {};

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              {stats.crawlerStatus}
            </span>
            <span className="text-xs text-on-surface-variant font-mono">
              Lần chạy gần nhất: {stats.lastSyncAt ? new Date(stats.lastSyncAt).toLocaleString("vi-VN") : "Chưa có"}
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-on-surface flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-primary" />
            Trung Tâm Đồng Bộ & Cào Văn Bản Pháp Lý Quốc Tế
          </h2>
          <p className="text-xs text-on-surface-variant">
            Thu thập trực tiếp toàn văn văn bản quy phạm pháp luật, nghị định thư và tiêu chuẩn MRL từ 9 cổng thông tin chính phủ, tự động phân tích và tóm tắt 100% Tiếng Việt qua Gemini 3.5 Flash.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={() => void onRefreshStats()}
            className="gap-2 cursor-pointer text-xs"
          >
            <RefreshCw className="w-4 h-4" /> Làm mới
          </Button>
          <Button
            onClick={handleTrigger}
            disabled={triggering}
            className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold cursor-pointer text-xs shadow-md"
          >
            {triggering ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Đang kích hoạt cào AI...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Kích hoạt Cào & Tóm tắt AI Ngay
              </>
            )}
          </Button>
        </div>
      </div>

      {triggerSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{triggerSuccess}</span>
        </div>
      )}

      {triggerError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{triggerError}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase">TỔNG VĂN BẢN ĐÃ CÀO</span>
          <div className="text-3xl font-black text-primary">{stats.totalUpdates} văn bản</div>
          <p className="text-[11px] text-on-surface-variant">Đã được Gemini AI xử lý và phân loại theo mã HS</p>
        </div>
        <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase">THƯ VIỆN QUY ĐỊNH CHUẨN</span>
          <div className="text-3xl font-black text-indigo-600">{stats.totalRegulations} quy chuẩn</div>
          <p className="text-[11px] text-on-surface-variant">Đồng bộ trực tiếp vào bảng danh mục quy định</p>
        </div>
        <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase">CƠ CHẾ BẢO ĐẢM TỰ ĐỘNG</span>
          <div className="text-lg font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
            <Sparkles className="w-5 h-5" /> 100% Tiếng Việt Chuẩn XNK
          </div>
          <p className="text-[11px] text-on-surface-variant">Tự động loại bỏ tin rác & dịch thuật chuyên sâu</p>
        </div>
      </div>

      {/* 9 Markets Status Grid */}
      <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-primary" />
          Phân Bổ Dữ Liệu Theo 9 Thị Trường Trọng Điểm
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(MARKET_INFO).map(([key, info]) => {
            const count = distribution[key] || 0;
            return (
              <div
                key={key}
                className="p-4 rounded-xl border border-outline-variant/70 hover:border-primary/40 bg-surface hover:bg-surface-container-low transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{info.flag}</span>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{info.name}</h4>
                      <p className="text-[11px] text-on-surface-variant truncate max-w-[180px]" title={info.agency}>
                        {info.agency}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-primary/10 text-primary">
                    {count} bài
                  </span>
                </div>

                <div className="pt-2 border-t border-outline-variant/40 flex justify-between items-center text-[11px]">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Nguồn chính phủ gốc
                  </span>
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-0.5"
                  >
                    Xem cổng <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

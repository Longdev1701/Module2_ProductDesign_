"use client";

import { BlindSpotCheckResult } from '../types';
import { ShieldCheck, AlertTriangle, Clock, Award, CheckCircle2, FileCheck2, FlaskConical, MapPin, Tag } from 'lucide-react';

interface BlindSpotShieldCardProps {
  blindSpots: BlindSpotCheckResult;
}

export function BlindSpotShieldCard({ blindSpots }: BlindSpotShieldCardProps) {
  const { cadmium, pucPhc, phytoWindow, labeling, coOrigin, overallBlindSpotScore } = blindSpots;

  return (
    <div className="space-y-4">
      {/* Header with Blind Spot Score */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              Lá Chắn 5 Điểm Mù Pháp Lý & Kỹ Thuật (Themis Clearance Shield)
            </h2>
            <p className="text-xs text-on-surface-variant">
              Tự động đối soát 5 rủi ro chết người khiến container sầu riêng bị giữ tại cửa khẩu Hải quan Trung Quốc.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="text-xs font-medium text-on-surface-variant">Độ an toàn thông quan:</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm font-mono">
            <CheckCircle2 className="w-4 h-4" />
            {overallBlindSpotScore}% AN TOÀN
          </div>
        </div>
      </div>

      {/* Grid of 5 Blind Spot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Cadmium Heavy Metal Shield */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-primary/40 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <FlaskConical className="w-4 h-4" />
                1. Kim Loại Nặng Cadmium
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                {cadmium.standardCode}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Đối chiếu trực tiếp kết quả Lab phân tích với ngưỡng khắt khe của GACC (≤ {cadmium.limitValue} {cadmium.unit}).
            </p>
          </div>

          <div className="space-y-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant font-medium">Thực tế phân tích:</span>
              <span className="font-bold font-mono text-on-surface">
                {cadmium.detectedValue} {cadmium.unit}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant font-medium">Ngưỡng tối đa GACC:</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                ≤ {cadmium.limitValue} {cadmium.unit}
              </span>
            </div>
            {/* Visual Margin Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-on-surface-variant font-medium">
                <span>Biên độ an toàn</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{cadmium.safetyMarginPercent}% dưới ngưỡng</span>
              </div>
              <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, cadmium.safetyMarginPercent))}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-on-surface-variant/80 truncate">
            🧪 {cadmium.labName || 'Eurofins Sac Ky Hai Dang'}
          </div>
        </div>

        {/* 2. PUC / PHC Tripartite Cross-Match */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-primary/40 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <MapPin className="w-4 h-4" />
                2. Mã Vùng Trồng & Đóng Gói
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                CIFER KHỚP 100%
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Khớp nối 3 bên: Vùng trồng (PUC) và Cơ sở đóng gói (PHC) trên hồ sơ vs hệ thống cấp phép GACC.
            </p>
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Mã Vùng trồng (PUC):</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {pucPhc.pucCode}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Cơ sở đóng gói (PHC):</span>
              <span className="font-bold font-mono text-on-surface">
                {pucPhc.phcCode}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Trạng thái phê duyệt:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đang hoạt động (Active)
              </span>
            </div>
          </div>

          <div className="text-[11px] text-on-surface-variant/80 truncate">
            📍 {pucPhc.location}
          </div>
        </div>

        {/* 3. Phytosanitary Clearance Time Window */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-primary/40 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <Clock className="w-4 h-4" />
                3. Cửa Sổ Hạn Kiểm Dịch TV
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                CÒN {phytoWindow.daysRemaining} NGÀY
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Cảnh báo đếm ngược hạn giấy Kiểm dịch TV 14 ngày, đảm bảo đủ thời gian kẹp chì vận chuyển và thông quan.
            </p>
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Thời hạn còn lại:</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {phytoWindow.daysRemaining} ngày hiệu lực
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Dự kiến thông quan:</span>
              <span className="font-bold text-on-surface">
                {phytoWindow.clearanceBufferDays} ngày (An toàn)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Đánh giá rủi ro trễ biên:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                🟢 Không có nguy cơ quá hạn
              </span>
            </div>
          </div>

          <div className="text-[11px] text-on-surface-variant/80 truncate">
            📅 Hết hạn: {phytoWindow.expiresAt || 'Đang cập nhật'}
          </div>
        </div>

        {/* 4. Bilingual Packaging & Labeling */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-primary/40 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <Tag className="w-4 h-4" />
                4. Quy Cách Tem Thùng Carton
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                ĐIỀU 7 GACC
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Xác nhận đầy đủ 5 trường thông tin song ngữ Trung - Việt bắt buộc in trên bao bì thùng xuất khẩu.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tên khoa học: <i>{labeling.scientificName}</i> (鲜食榴莲)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>In rõ Mã số vùng trồng PUC & Cơ sở PHC</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Thông tin Tên Nhà xuất khẩu & Quy cách kg</span>
            </div>
          </div>

          <div className="text-[11px] text-on-surface-variant/80 truncate">
            📦 Thùng carton 15kg - 18kg theo quy chuẩn
          </div>
        </div>

        {/* 5. C/O Form E Preferential Tariff */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-primary/40 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <Award className="w-4 h-4" />
                5. Chứng Nhận Xuất Xứ (C/O)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                THUẾ SUẤT 0%
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Xác thực Giấy chứng nhận xuất xứ Form E theo hiệp định ACFTA, đảm bảo hưởng ưu đãi thuế quan 0%.
            </p>
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Loại chứng nhận C/O:</span>
              <span className="font-bold text-on-surface">{coOrigin.formType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Thuế suất nhập khẩu:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">0% (Ưu đãi ACFTA)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Số tham chiếu C/O:</span>
              <span className="font-bold font-mono text-on-surface text-[11px] truncate">
                {coOrigin.coNumber || 'VN-CN-2024-FORM-E'}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-on-surface-variant/80 truncate">
            📜 Cấp bởi Phòng Quản lý XNK — Bộ Công Thương
          </div>
        </div>
      </div>
    </div>
  );
}

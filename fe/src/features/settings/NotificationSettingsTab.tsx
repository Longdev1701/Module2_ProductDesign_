"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sliders, Bell, AlertTriangle, Clock, Save, ShieldAlert, CheckCircle2 } from "lucide-react";

interface NotificationSettingsTabProps {
  cadmiumThreshold: number;
  setCadmiumThreshold: (val: number) => void;
  phytoBufferDays: number;
  setPhytoBufferDays: (val: number) => void;
  urgentGaccAlerts: boolean;
  setUrgentGaccAlerts: (val: boolean) => void;
  cadmiumAlerts: boolean;
  setCadmiumAlerts: (val: boolean) => void;
  phytoAlerts: boolean;
  setPhytoAlerts: (val: boolean) => void;
  isOwnerOrManager: boolean;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
}

export function NotificationSettingsTab({
  cadmiumThreshold,
  setCadmiumThreshold,
  phytoBufferDays,
  setPhytoBufferDays,
  urgentGaccAlerts,
  setUrgentGaccAlerts,
  cadmiumAlerts,
  setCadmiumAlerts,
  phytoAlerts,
  setPhytoAlerts,
  isOwnerOrManager,
  saving,
  onSave,
}: NotificationSettingsTabProps) {
  return (
    <form onSubmit={onSave} className="space-y-6">
      {/* 1. Safety Thresholds Configuration */}
      <Card className="rounded-2xl border-outline-variant/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-serif font-bold flex items-center gap-2 text-on-surface">
            <Sliders className="w-5 h-5 text-primary" />
            Cấu Hình Ngưỡng Cảnh Báo An Toàn &amp; Đệm Rủi Ro
          </CardTitle>
          <CardDescription className="text-xs">
            Điều chỉnh độ nhạy của hệ thống cảnh báo sớm đối với các chỉ tiêu kim loại nặng và cửa sổ thời gian thông quan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Cadmium Threshold Selector */}
          <div className="p-4 rounded-xl border border-outline-variant/60 bg-slate-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">🧪 MRL</span>
                  <h4 className="font-bold text-xs text-on-surface">
                    Vùng Tiệm Cận Cảnh Báo Sớm Cadmium (GB 2762-2022)
                  </h4>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Ngưỡng tối đa GACC là <b>≤ 0.05 mg/kg</b>. Hệ thống sẽ kích hoạt cờ đỏ cảnh báo khi mẫu test nằm trong vùng này do nguy cơ cô đặc nước khi đi cont lạnh.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={cadmiumThreshold}
                  onChange={(e) => setCadmiumThreshold(parseFloat(e.target.value))}
                  disabled={!isOwnerOrManager}
                  className="h-9 px-3 border border-outline-variant/60 rounded-xl bg-white text-xs font-mono font-bold text-rose-700 focus:outline-hidden focus:border-primary cursor-pointer"
                >
                  <option value={0.035}>≥ 0.035 mg/kg (Rất Khắt Khe)</option>
                  <option value={0.040}>≥ 0.040 mg/kg (Khuyến Nghị)</option>
                  <option value={0.045}>≥ 0.045 mg/kg (Cơ Bản)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Phyto Window Buffer Selector */}
          <div className="p-4 rounded-xl border border-outline-variant/60 bg-slate-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">⏳ HẠN</span>
                  <h4 className="font-bold text-xs text-on-surface">
                    Cửa Sổ Đệm An Toàn Kiểm Dịch Thực Vật (Phyto Buffer Window)
                  </h4>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Giấy KDTV có hiệu lực 14 ngày. Hệ thống sẽ báo động ưu tiên xe xuất bến khi thời hạn còn lại chạm ngưỡng này.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={phytoBufferDays}
                  onChange={(e) => setPhytoBufferDays(parseInt(e.target.value, 10))}
                  disabled={!isOwnerOrManager}
                  className="h-9 px-3 border border-outline-variant/60 rounded-xl bg-white text-xs font-mono font-bold text-amber-700 focus:outline-hidden focus:border-primary cursor-pointer"
                >
                  <option value={3}>Còn ≤ 3 ngày (Khuyến Nghị)</option>
                  <option value={5}>Còn ≤ 5 ngày (Mùa Ùn Tắc Biên)</option>
                  <option value={7}>Còn ≤ 7 ngày (Xuất Đường Biển)</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Urgent Alerts & Notifications Channels */}
      <Card className="rounded-2xl border-outline-variant/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-serif font-bold flex items-center gap-2 text-on-surface">
            <Bell className="w-5 h-5 text-primary" />
            Kênh Cảnh Báo Khẩn Cấp &amp; Thông Báo Thời Gian Thực
          </CardTitle>
          <CardDescription className="text-xs">
            Tự động gửi tín hiệu cảnh báo đến Email và Bảng điều khiển khi có sự kiện rủi ro pháp lý phát sinh.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-start justify-between p-3.5 border border-outline-variant/60 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="space-y-0.5 pr-4">
              <h4 className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                Cảnh báo Khẩn cấp từ Hải quan Trung Quốc (GACC) &amp; Cục BVTV
              </h4>
              <p className="text-[11px] text-on-surface-variant">
                Nhận thông báo ngay lập tức khi phát hiện cảnh báo mã PUC/PHC bị tạm dừng hoặc GACC ban hành lệnh kiểm soát mới.
              </p>
            </div>
            <input
              type="checkbox"
              checked={urgentGaccAlerts}
              onChange={(e) => setUrgentGaccAlerts(e.target.checked)}
              disabled={!isOwnerOrManager}
              className="w-4 h-4 accent-primary rounded cursor-pointer mt-0.5"
            />
          </label>

          <label className="flex items-start justify-between p-3.5 border border-outline-variant/60 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="space-y-0.5 pr-4">
              <h4 className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                Cảnh báo Lô Hàng Chạm Vùng Nguy Hiểm Cadmium
              </h4>
              <p className="text-[11px] text-on-surface-variant">
                Báo động đỏ trong "Việc Cần Làm Ngay" khi kết quả kiểm nghiệm Cadmium tiệm cận ngưỡng an toàn.
              </p>
            </div>
            <input
              type="checkbox"
              checked={cadmiumAlerts}
              onChange={(e) => setCadmiumAlerts(e.target.checked)}
              disabled={!isOwnerOrManager}
              className="w-4 h-4 accent-primary rounded cursor-pointer mt-0.5"
            />
          </label>

          <label className="flex items-start justify-between p-3.5 border border-outline-variant/60 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="space-y-0.5 pr-4">
              <h4 className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Cảnh báo Sắp Hết Hạn Giấy Kiểm Dịch TV (Phyto Window)
              </h4>
              <p className="text-[11px] text-on-surface-variant">
                Tự động nhắc nhở nhân viên điều xe xuất bến trước khi giấy chứng nhận hết hiệu lực 14 ngày.
              </p>
            </div>
            <input
              type="checkbox"
              checked={phytoAlerts}
              onChange={(e) => setPhytoAlerts(e.target.checked)}
              disabled={!isOwnerOrManager}
              className="w-4 h-4 accent-primary rounded cursor-pointer mt-0.5"
            />
          </label>
        </CardContent>

        {isOwnerOrManager && (
          <CardFooter className="pt-2 pb-4 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu cấu hình...' : 'Lưu Cấu Hình Ngưỡng & Cảnh Báo'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  );
}

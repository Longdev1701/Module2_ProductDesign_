"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell } from "lucide-react";

export function NotificationSettingsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Cấu hình Thông báo
        </CardTitle>
        <CardDescription>Tùy chỉnh thông báo cập nhật quy định pháp lý EU/MRL và chứng từ hết hạn.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface-container-lowest">
          <div>
            <h4 className="font-semibold text-sm">Cập nhật quy định EUDR & MRL khẩn cấp</h4>
            <p className="text-xs text-on-surface-variant">Tự động gửi cảnh báo khi luật nông sản EU có thay đổi ngưỡng hóa chất.</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
        </div>
        <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface-container-lowest">
          <div>
            <h4 className="font-semibold text-sm">Cảnh báo hạn chót chứng nhận CoO / Phyto</h4>
            <p className="text-xs text-on-surface-variant">Gửi thông báo trước 30 ngày khi chứng thư xuất khẩu sắp hết hạn.</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

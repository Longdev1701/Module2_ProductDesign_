"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  RefreshCw,
  ShieldAlert,
  FileCheck,
  Info,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { AppNotification, NotificationListResponse } from "@/types/api";

export function NotificationsDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "RISK">("ALL");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await api.get<AppNotification[]>("/notifications?limit=20");
      if (res.data) {
        setNotifications(res.data);
        const count = typeof res.unreadCount === "number" 
          ? res.unreadCount 
          : res.data.filter((n) => !n.isRead).length;
        setUnreadCount(count);
      }
    } catch {
      // Ignore background fetch error
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotifications(true);

    // Lắng nghe sự kiện làm mới toàn cục hoặc đổi tổ chức
    const handleRefresh = () => {
      void fetchNotifications(true);
    };

    window.addEventListener("themis:refresh-all", handleRefresh);
    window.addEventListener("themis:organization-changed", handleRefresh);

    return () => {
      window.removeEventListener("themis:refresh-all", handleRefresh);
      window.removeEventListener("themis:organization-changed", handleRefresh);
    };
  }, [fetchNotifications]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (notification: AppNotification) => {
    if (!notification.isRead) {
      try {
        await api.patch(`/notifications/${notification.id}/read`, {});
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // Ignore patch error
      }
    }

    if (notification.link) {
      setIsOpen(false);
      router.push(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Ignore
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    if (filter === "RISK") return n.type === "RISK_ALERT" || n.type === "REGULATION_UPDATE";
    return true;
  });

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffSec < 60) return "Vừa xong";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
      if (diffSec < 172800) return "Hôm qua";
      return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    } catch {
      return "Gần đây";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "RISK_ALERT":
        return (
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200">
            <ShieldAlert className="w-4 h-4" />
          </div>
        );
      case "REGULATION_UPDATE":
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200">
            <Bell className="w-4 h-4" />
          </div>
        );
      case "CHECK_COMPLETED":
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200">
            <FileCheck className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            void fetchNotifications(true);
          }
        }}
        className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-all relative cursor-pointer"
        title="Thông báo & Cảnh báo pháp lý"
        aria-label="Mở danh sách thông báo"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Dropdown Dialog */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-white border border-outline-variant shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-surface-container-lowest border-b border-outline-variant/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-on-surface">Thông Báo</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  {unreadCount} mới
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => void fetchNotifications(true)}
                disabled={isRefreshing}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors text-xs"
                title="Làm mới thông báo"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-2 py-1 rounded-lg text-[11px] font-semibold text-primary hover:bg-primary/5 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Đánh dấu tất cả là đã đọc"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Đọc hết
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-3 py-2 bg-surface-container-low/40 border-b border-outline-variant/40 flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === "ALL"
                  ? "bg-primary text-white shadow-2xs"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("UNREAD")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === "UNREAD"
                  ? "bg-primary text-white shadow-2xs"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("RISK")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === "RISK"
                  ? "bg-primary text-white shadow-2xs"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              Cảnh báo GACC
            </button>
          </div>

          {/* Body List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/40">
            {loading && notifications.length === 0 ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 animate-pulse">
                    <div className="w-8 h-8 bg-slate-200 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-200 rounded w-3/4" />
                      <div className="h-2.5 bg-slate-100 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant/60">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-on-surface">Không có thông báo nào</p>
                <p className="text-[11px] text-on-surface-variant">
                  {filter === "UNREAD"
                    ? "Bạn đã đọc hết tất cả thông báo."
                    : "Mọi quy định và lô hàng đều đang hoạt động bình thường."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleMarkAsRead(item)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer text-left hover:bg-surface-container-low/60 group relative ${
                    !item.isRead ? "bg-primary/5" : "bg-white"
                  }`}
                >
                  {/* Icon */}
                  {getNotificationIcon(item.type)}

                  {/* Text Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <h4
                        className={`text-xs font-bold truncate ${
                          !item.isRead ? "text-on-surface" : "text-on-surface-variant"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-on-surface-variant/70 shrink-0 font-mono">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    {item.link && (
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-primary group-hover:underline pt-0.5">
                        <span>Xem chi tiết</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Unread Blue Dot */}
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 self-center" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 bg-surface-container-low/50 border-t border-outline-variant/40 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/regulations");
              }}
              className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1 py-1"
            >
              Xem Radar Cập Nhật Quy Định Quốc Tế
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsDropdown;

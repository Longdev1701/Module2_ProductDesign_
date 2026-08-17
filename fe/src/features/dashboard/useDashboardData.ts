"use client";

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  DashboardOverview,
  DashboardSummary,
  DashboardRecentBatch,
  DashboardActionItem,
  DashboardTrends,
  getErrorMessage,
} from '@/types/api';

const CACHE_KEY = 'themis:dashboard_overview_cache';

// In-Memory Cache để chuyển đổi route 0ms không bao giờ hiển thị Skeleton
let inMemoryOverviewCache: DashboardOverview | null = null;

// Helper đọc cache an toàn
function getInitialCache(): DashboardOverview | null {
  if (inMemoryOverviewCache) return inMemoryOverviewCache;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DashboardOverview;
        inMemoryOverviewCache = parsed;
        return parsed;
      }
    } catch {
      // Ignore JSON parse error
    }
  }
  return null;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardOverview | null>(() => getInitialCache());
  const [loading, setLoading] = useState<boolean>(() => !getInitialCache());
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchOverview = useCallback(async (forceRefresh = false) => {
    if (!data || forceRefresh) {
      if (!data) setLoading(true);
      else setIsRefreshing(true);
    }
    setError(null);

    try {
      // 🚀 Gửi 1 request duy nhất tới endpoint tổng hợp
      const res = await api.get<DashboardOverview>('/dashboard/overview');

      if (res.data) {
        inMemoryOverviewCache = res.data;
        setData(res.data);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
          } catch {
            // Ignore localStorage storage limit
          }
        }
      }
    } catch (err: unknown) {
      if (!data) {
        setError(getErrorMessage(err, 'Không thể tải dữ liệu Dashboard.'));
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [data]);

  useEffect(() => {
    // Tải dữ liệu ngầm SWR ngay lập tức
    void fetchOverview();

    // Lắng nghe khi tổ chức thay đổi
    const handleOrgChanged = () => {
      inMemoryOverviewCache = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CACHE_KEY);
      }
      setData(null);
      void fetchOverview(true);
    };

    window.addEventListener('themis:organization-changed', handleOrgChanged);
    return () => {
      window.removeEventListener('themis:organization-changed', handleOrgChanged);
    };
  }, [fetchOverview]);

  return {
    summary: data?.summary || null,
    recentBatches: data?.recentBatches || [],
    actionItems: data?.actionItems || [],
    trends: data?.trends || null,
    loading,
    isRefreshing,
    error,
    refetch: () => fetchOverview(true),
  };
}

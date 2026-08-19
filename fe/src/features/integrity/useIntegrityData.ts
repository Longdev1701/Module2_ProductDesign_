"use client";

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { IntegrityStats, AuditLogItem, VerificationResult } from './types';

const CACHE_KEY = 'themis:integrity_cache';

interface CachedIntegrityData {
  stats: IntegrityStats | null;
  logs: AuditLogItem[];
  total: number;
  totalPages: number;
}

let inMemoryIntegrityCache: CachedIntegrityData | null = null;

export function useIntegrityData() {
  const [stats, setStats] = useState<IntegrityStats | null>(() => {
    if (inMemoryIntegrityCache?.stats) return inMemoryIntegrityCache.stats;
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) return JSON.parse(raw).stats;
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [logs, setLogs] = useState<AuditLogItem[]>(() => {
    if (inMemoryIntegrityCache?.logs) return inMemoryIntegrityCache.logs;
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) return JSON.parse(raw).logs || [];
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const [loading, setLoading] = useState(!inMemoryIntegrityCache);
  const [error, setError] = useState<string | null>(null);

  // Verification State
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const fetchData = useCallback(
    async (currentPage = 1, actionFilter = 'ALL', search = '') => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        queryParams.set('page', currentPage.toString());
        queryParams.set('pageSize', pageSize.toString());
        if (actionFilter !== 'ALL') {
          queryParams.set('action', actionFilter);
        }
        if (search.trim()) {
          queryParams.set('search', search.trim());
        }

        const [statsRes, logsRes] = await Promise.all([
          api.get<IntegrityStats>('/integrity/stats'),
          api.get<{ logs: AuditLogItem[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>(
            `/integrity/logs?${queryParams.toString()}`
          ),
        ]);

        const nextStats = statsRes.data;
        const nextLogs = logsRes.data.logs;
        const nextTotal = logsRes.data.pagination.total;
        const nextTotalPages = logsRes.data.pagination.totalPages;

        setStats(nextStats);
        setLogs(nextLogs);
        setTotal(nextTotal);
        setTotalPages(nextTotalPages);

        inMemoryIntegrityCache = {
          stats: nextStats,
          logs: nextLogs,
          total: nextTotal,
          totalPages: nextTotalPages,
        };

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(inMemoryIntegrityCache));
          } catch {
            // ignore
          }
        }
      } catch (err: any) {
        console.error('Lỗi khi nạp dữ liệu Liêm chính & Hộp đen:', err);
        setError(err.message || 'Không thể kết nối đến Hộp đen Kiểm toán');
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchData(page, selectedAction, searchTerm);
  }, [fetchData, page, selectedAction, searchTerm]);

  /**
   * Tra cứu mã băm SHA-256 từ Báo cáo hoặc Khóa niêm phong
   */
  const verifyHash = async (hashString: string): Promise<VerificationResult | null> => {
    if (!hashString.trim()) return null;

    setVerifying(true);
    try {
      const res = await api.get<VerificationResult>(
        `/integrity/verify/${encodeURIComponent(hashString.trim())}`
      );
      setVerificationResult(res.data);
      return res.data;
    } catch (err: any) {
      const failResult: VerificationResult = {
        isValid: false,
        status: 'NOT_FOUND',
        message: err.message || 'Mã băm không hợp lệ hoặc không tìm thấy trên hệ thống.',
      };
      setVerificationResult(failResult);
      return failResult;
    } finally {
      setVerifying(false);
    }
  };

  const clearVerification = () => {
    setVerificationResult(null);
  };

  return {
    stats,
    logs,
    loading,
    error,
    page,
    setPage,
    pageSize,
    total,
    totalPages,
    searchTerm,
    setSearchTerm,
    selectedAction,
    setSelectedAction,
    refetch: () => fetchData(page, selectedAction, searchTerm),
    verifyHash,
    verifying,
    verificationResult,
    clearVerification,
  };
}

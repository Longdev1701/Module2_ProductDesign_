"use client";

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { ReportDetail, ApproveReportPayload } from './types';
import { getErrorMessage } from '@/types/api';

const reportCache = new Map<string, ReportDetail>();

export function useReportData(reportIdOrBatchId: string) {
  const [report, setReport] = useState<ReportDetail | null>(() => reportCache.get(reportIdOrBatchId) || null);
  const [loading, setLoading] = useState<boolean>(() => !reportCache.has(reportIdOrBatchId));
  const [approving, setApproving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (id: string, force = false) => {
    if (!force && reportCache.has(id)) {
      setReport(reportCache.get(id)!);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await api.get<ReportDetail>(`/reports/${id}`);
      if (res.data) {
        reportCache.set(id, res.data);
        if (res.data.check.batchId) {
          reportCache.set(res.data.check.batchId, res.data);
        }
        setReport(res.data);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Không thể nạp dữ liệu Báo cáo Thẩm định.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reportIdOrBatchId) {
      void fetchReport(reportIdOrBatchId);
    }
  }, [reportIdOrBatchId, fetchReport]);

  const approveReport = async (payload: ApproveReportPayload): Promise<boolean> => {
    if (!report) return false;
    setApproving(true);
    setError(null);

    try {
      const res = await api.post<ReportDetail>(`/reports/${report.id}/approve`, payload);
      if (res.data) {
        reportCache.set(report.id, res.data);
        if (res.data.check.batchId) {
          reportCache.set(res.data.check.batchId, res.data);
        }
        setReport(res.data);
        return true;
      }
      return false;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Không thể phê duyệt báo cáo. Vui lòng thử lại.'));
      return false;
    } finally {
      setApproving(false);
    }
  };

  return {
    report,
    loading,
    approving,
    error,
    refetch: () => fetchReport(reportIdOrBatchId, true),
    approveReport,
  };
}

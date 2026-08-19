"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import type {
  BatchDocumentChecklist,
  UploadDocumentPayload,
  DocumentItem,
} from "@/types/api";
import { getErrorMessage } from "@/types/api";

export function useBatchDocuments(batchId: string | null) {
  const [checklist, setChecklist] = useState<BatchDocumentChecklist | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChecklist = useCallback(async () => {
    if (!batchId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<BatchDocumentChecklist>(`/batches/${batchId}/documents`);
      if (res.data) {
        setChecklist(res.data);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Không thể tải hồ sơ chứng từ của lô hàng"));
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    void Promise.resolve().then(fetchChecklist);
  }, [fetchChecklist]);

  const uploadDocument = async (payload: UploadDocumentPayload): Promise<DocumentItem | null> => {
    if (!batchId) return null;
    setUploading(true);
    setError(null);
    try {
      const res = await api.post<DocumentItem>(`/batches/${batchId}/documents`, payload);
      await fetchChecklist();
      return res.data || null;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Tải lên chứng từ thất bại");
      setError(msg);
      throw new Error(msg);
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = async (docId: string): Promise<boolean> => {
    if (!batchId) return false;
    setDeleting(true);
    setError(null);
    try {
      await api.delete(`/batches/${batchId}/documents/${docId}`);
      await fetchChecklist();
      return true;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Xóa chứng từ thất bại");
      setError(msg);
      throw new Error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return {
    checklist,
    loading,
    uploading,
    deleting,
    error,
    refresh: fetchChecklist,
    uploadDocument,
    removeDocument,
  };
}

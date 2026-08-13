"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@/lib/api";
import { getErrorMessage } from "@/types/api";

import {
  legalUpdateDetailResponseSchema,
  type LegalUpdateDetail,
} from "./types";

async function requestLegalUpdateDetail(id: string): Promise<LegalUpdateDetail> {
  const response = await api.get<unknown>(`/legal-updates/${id}`);
  const parsedResponse = legalUpdateDetailResponseSchema.safeParse(response);

  if (!parsedResponse.success) {
    throw new Error("Dữ liệu chi tiết cập nhật pháp lý không đúng định dạng.");
  }

  return parsedResponse.data.data;
}

export function useLegalUpdateDetail(id: string | null) {
  const [resolvedUpdate, setResolvedUpdate] = useState<{ id: string; update: LegalUpdateDetail } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestSequenceRef = useRef(0);

  const refresh = useCallback(async () => {
    if (!id) {
      return;
    }

    const requestSequence = ++requestSequenceRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const detail = await requestLegalUpdateDetail(id);
      if (requestSequence === requestSequenceRef.current) {
        setResolvedUpdate({ id, update: detail });
      }
    } catch (requestError) {
      if (requestSequence === requestSequenceRef.current) {
        setError(getErrorMessage(requestError, "Không thể tải chi tiết cập nhật pháp lý."));
      }
    } finally {
      if (requestSequence === requestSequenceRef.current) {
        setIsLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    void Promise.resolve().then(refresh);

    return () => {
      requestSequenceRef.current += 1;
    };
  }, [id, refresh]);

  const update = resolvedUpdate?.id === id ? resolvedUpdate.update : null;
  return { update, isLoading, error, refresh };
}

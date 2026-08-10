"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { subscribeToLegalUpdates } from "@/lib/supabase-realtime";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/types/api";

import {
  legalUpdateFeedResponseSchema,
  type LegalUpdateFeedItem,
} from "./types";

const LEGAL_UPDATES_ENDPOINT = "/legal-updates/feed?page=1&pageSize=3&sort=publishedAt:desc";

type FeedResult = {
  updates: LegalUpdateFeedItem[];
  error: string | null;
};

async function requestLegalUpdates(): Promise<FeedResult> {
  try {
    const response = await api.get<unknown>(LEGAL_UPDATES_ENDPOINT);
    const parsedResponse = legalUpdateFeedResponseSchema.safeParse(response);

    if (!parsedResponse.success) {
      return {
        updates: [],
        error: "Dữ liệu cập nhật pháp lý không đúng định dạng.",
      };
    }

    return { updates: parsedResponse.data.data, error: null };
  } catch (error) {
    return {
      updates: [],
      error: getErrorMessage(error, "Không thể tải cập nhật pháp lý."),
    };
  }
}

export function useLegalUpdates() {
  const [updates, setUpdates] = useState<LegalUpdateFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const isMountedRef = useRef(true);
  const inFlightRefreshRef = useRef<Promise<void> | null>(null);
  const pendingRefreshRef = useRef(false);
  const refreshRef = useRef<(() => Promise<void>) | null>(null);

  const refresh = useCallback(async () => {
    if (inFlightRefreshRef.current) {
      pendingRefreshRef.current = true;
      return inFlightRefreshRef.current;
    }

    const initialLoad = !hasLoadedRef.current;
    if (initialLoad) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    const task = requestLegalUpdates()
      .then((result) => {
        if (!isMountedRef.current) {
          return;
        }
        if (!result.error) {
          setUpdates(result.updates);
        } else if (initialLoad) {
          setUpdates([]);
        }
        setError(result.error);
        hasLoadedRef.current = true;
      })
      .finally(() => {
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
        inFlightRefreshRef.current = null;

        if (pendingRefreshRef.current) {
          pendingRefreshRef.current = false;
          queueMicrotask(() => void refreshRef.current?.());
        }
      });

    inFlightRefreshRef.current = task;
    return task;
  }, []);

  useEffect(() => {
    refreshRef.current = refresh;
    return () => {
      refreshRef.current = null;
    };
  }, [refresh]);

  useEffect(() => {
    isMountedRef.current = true;
    void refresh();

    return () => {
      isMountedRef.current = false;
    };
  }, [refresh]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      return;
    }

    return subscribeToLegalUpdates({
      accessToken,
      onChange: () => void refresh(),
    }) ?? undefined;
  }, [refresh]);

  useEffect(() => {
    const refreshWhenOrganizationChanges = () => void refresh();
    window.addEventListener("storage", refreshWhenOrganizationChanges);
    window.addEventListener("themis:organization-changed", refreshWhenOrganizationChanges);

    return () => {
      window.removeEventListener("storage", refreshWhenOrganizationChanges);
      window.removeEventListener("themis:organization-changed", refreshWhenOrganizationChanges);
    };
  }, [refresh]);

  return { updates, isLoading, isRefreshing, error, refresh };
}

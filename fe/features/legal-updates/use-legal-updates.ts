"use client";

import { createClient } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

import {
  legalUpdatesResponseSchema,
  type Regulation,
} from '@/features/legal-updates/types';

const LEGAL_UPDATES_ENDPOINT = '/api/regulations?page=1&pageSize=3&sort=createdAt:desc';

// Integration contract:
// 1. The backend remains the source of truth and returns validated regulation data.
// 2. Supabase Realtime only notifies this hook that the table changed.
// 3. On notification, refresh() requests the latest authorized data from the API.
// Keep the dashboard reviewable locally until the shared API is available.
// Production never uses these values: API failures remain visible to users.
const DEVELOPMENT_FALLBACK_UPDATES: Regulation[] = [
  {
    id: 'development-1',
    code: 'EU-MRL-DEMO',
    title: 'EU: Thay đổi MRL Trái cây khô',
    description: 'Vừa cập nhật 2 giờ trước. Ảnh hưởng đến 14 sản phẩm của bạn.',
    category: 'MRL',
    market: 'EU',
    effectiveDate: null,
    sourceUrl: '/regulations',
    isActive: true,
    createdAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'development-2',
    code: 'FDA-LABEL-DEMO',
    title: 'FDA: Kiểm tra nhãn mác mới',
    description: 'Quy định có hiệu lực trong 45 ngày tới. Cần rà soát bao bì.',
    category: 'LABELING',
    market: 'US',
    effectiveDate: '2026-09-22T00:00:00.000Z',
    sourceUrl: '/regulations',
    isActive: true,
    createdAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'development-3',
    code: 'CN-TRACEABILITY-DEMO',
    title: 'Trung Quốc: Luật BVTV 2025',
    description: 'Đang trong quá trình lấy ý kiến phản hồi công khai.',
    category: 'TRACEABILITY',
    market: 'CN',
    effectiveDate: null,
    sourceUrl: '/regulations',
    isActive: true,
    createdAt: '2026-08-08T00:00:00.000Z',
  },
];

type LegalUpdatesResult =
  | { updates: Regulation[]; error: null }
  | { updates: Regulation[]; error: string };

async function requestLegalUpdates(): Promise<LegalUpdatesResult> {
  const response = await api.get<unknown>(LEGAL_UPDATES_ENDPOINT);

  if (response.error) {
    return { updates: [], error: response.error.message };
  }

  const parsedResponse = legalUpdatesResponseSchema.safeParse(response.data);

  if (!parsedResponse.success) {
    return {
      updates: [],
      error: 'Dữ liệu cập nhật pháp lý không đúng định dạng.',
    };
  }

  return { updates: parsedResponse.data.data, error: null };
}

function resolveUpdates(result: LegalUpdatesResult): LegalUpdatesResult {
  if (result.error && process.env.NODE_ENV === 'development') {
    return { updates: DEVELOPMENT_FALLBACK_UPDATES, error: null };
  }

  return result;
}

export function useLegalUpdates() {
  const [updates, setUpdates] = useState<Regulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const result = resolveUpdates(await requestLegalUpdates());
    setUpdates(result.updates);
    setError(result.error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const loadInitialUpdates = async () => {
      const result = resolveUpdates(await requestLegalUpdates());

      if (!isCurrent) {
        return;
      }

      setUpdates(result.updates);
      setError(result.error);
      setIsLoading(false);
    };

    void loadInitialUpdates();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const channel = supabase
      .channel('legal-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'regulations' },
        () => void refresh(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { updates, isLoading, error, refresh };
}

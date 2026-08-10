import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { subscribeToLegalUpdates } from "@/lib/supabase-realtime";

import { useLegalUpdates } from "./use-legal-updates";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));
vi.mock("@/lib/supabase-realtime", () => ({ subscribeToLegalUpdates: vi.fn() }));

const feedResponse = {
  data: [{
    id: "17eb2551-77ab-4bf0-ab1c-b2a3f0f11111",
    title: "Quy định kiểm dịch sầu riêng",
    description: "Tóm tắt ngắn.",
    market: "CHINA",
    category: "phytosanitary",
    severity: "high",
    status: "effective",
    sourceAgency: "GACC",
    sourceUrl: "https://example.com/source",
    publishedAt: "2026-08-10T00:00:00.000Z",
    effectiveAt: null,
    createdAt: "2026-08-10T00:00:00.000Z",
  }],
  meta: { page: 1, pageSize: 3, total: 1, totalPages: 1, requestId: "17eb2551-77ab-4bf0-ab1c-b2a3f0f22222" },
};

describe("useLegalUpdates", () => {
  const apiGet = vi.mocked(api.get);
  const subscribe = vi.mocked(subscribeToLegalUpdates);

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("access_token", "test-access-token");
  });

  it("loads the Legal Updates API feed and refetches only when Realtime signals a change", async () => {
    const unsubscribe = vi.fn();
    let onChange: (() => void) | undefined;
    apiGet.mockResolvedValue(feedResponse);
    subscribe.mockImplementation((options) => {
      onChange = options.onChange;
      return unsubscribe;
    });

    const { result, unmount } = renderHook(() => useLegalUpdates());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiGet).toHaveBeenCalledWith("/legal-updates/feed?page=1&pageSize=3&sort=publishedAt:desc");
    expect(result.current.updates).toHaveLength(1);
    expect(subscribe).toHaveBeenCalledWith(expect.objectContaining({ accessToken: "test-access-token" }));

    await act(async () => onChange?.());
    await waitFor(() => expect(apiGet).toHaveBeenCalledTimes(2));

    unmount();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });
});

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { useLegalUpdateDetail } from "./use-legal-update-detail";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));

function deferred<T>() {
  let resolve: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve: (value: T) => resolve(value) };
}

function detailResponse(id: string, titleVi: string) {
  return {
    data: {
      id,
      sourceAgency: "GACC",
      sourceCountry: "CHINA",
      sourceUrl: "https://example.com/source",
      documentUrl: null,
      sourceReference: "GACC_TEST",
      sourceLanguage: "zh",
      titleOriginal: null,
      titleVi,
      summaryVi: "Tóm tắt",
      detailedSummaryVi: null,
      businessImpactVi: null,
      recommendedActions: [],
      citations: [],
      affectedProducts: [],
      affectedGroups: [],
      hsCodes: [],
      market: "CHINA",
      category: "phytosanitary",
      severity: "high",
      status: "effective",
      relevance: { status: "relevant", reasonVi: null },
      confidence: "high",
      publishedAt: "2026-08-10T00:00:00.000Z",
      effectiveAt: null,
      createdAt: "2026-08-10T00:00:00.000Z",
      updatedAt: "2026-08-10T00:00:00.000Z",
    },
    meta: { requestId: "17eb2551-77ab-4bf0-ab1c-b2a3f0f22222" },
  };
}

describe("useLegalUpdateDetail", () => {
  const apiGet = vi.mocked(api.get);

  beforeEach(() => vi.clearAllMocks());

  it("does not render a stale response after the selected update changes", async () => {
    const firstId = "17eb2551-77ab-4bf0-ab1c-b2a3f0f11111";
    const secondId = "17eb2551-77ab-4bf0-ab1c-b2a3f0f33333";
    const firstRequest = deferred<ReturnType<typeof detailResponse>>();
    const secondRequest = deferred<ReturnType<typeof detailResponse>>();
    apiGet.mockImplementation((endpoint) => endpoint.endsWith(firstId) ? firstRequest.promise : secondRequest.promise);

    const { result, rerender } = renderHook(({ id }) => useLegalUpdateDetail(id), { initialProps: { id: firstId } });
    await waitFor(() => expect(apiGet).toHaveBeenCalledWith(`/legal-updates/${firstId}`));
    rerender({ id: secondId });
    await waitFor(() => expect(apiGet).toHaveBeenCalledWith(`/legal-updates/${secondId}`));

    await act(async () => secondRequest.resolve(detailResponse(secondId, "Bản tin B")));
    await waitFor(() => expect(result.current.update?.titleVi).toBe("Bản tin B"));

    await act(async () => firstRequest.resolve(detailResponse(firstId, "Bản tin A")));
    expect(result.current.update?.titleVi).toBe("Bản tin B");
  });

  it("hides an already loaded update while a newly selected update is loading", async () => {
    const firstId = "17eb2551-77ab-4bf0-ab1c-b2a3f0f11111";
    const secondId = "17eb2551-77ab-4bf0-ab1c-b2a3f0f33333";
    const secondRequest = deferred<ReturnType<typeof detailResponse>>();
    apiGet.mockImplementation((endpoint) => endpoint.endsWith(firstId)
      ? Promise.resolve(detailResponse(firstId, "Bản tin A"))
      : secondRequest.promise);

    const { result, rerender } = renderHook(({ id }) => useLegalUpdateDetail(id), { initialProps: { id: firstId } });
    await waitFor(() => expect(result.current.update?.titleVi).toBe("Bản tin A"));

    rerender({ id: secondId });
    await waitFor(() => expect(apiGet).toHaveBeenCalledWith(`/legal-updates/${secondId}`));
    expect(result.current.update).toBeNull();

    await act(async () => secondRequest.resolve(detailResponse(secondId, "Bản tin B")));
    await waitFor(() => expect(result.current.update?.titleVi).toBe("Bản tin B"));
  });
});

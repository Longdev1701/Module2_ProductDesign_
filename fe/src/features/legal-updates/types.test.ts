import { describe, expect, it } from "vitest";

import { legalUpdateFeedResponseSchema } from "./types";

const validFeedResponse = {
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
  meta: {
    page: 1,
    pageSize: 3,
    total: 1,
    totalPages: 1,
    requestId: "17eb2551-77ab-4bf0-ab1c-b2a3f0f22222",
  },
};

describe("legalUpdateFeedResponseSchema", () => {
  it("accepts a valid Legal Updates feed response", () => {
    expect(legalUpdateFeedResponseSchema.safeParse(validFeedResponse).success).toBe(true);
  });

  it("rejects invalid enum values and invalid dates", () => {
    const invalidSeverity = structuredClone(validFeedResponse);
    invalidSeverity.data[0].severity = "urgent";
    expect(legalUpdateFeedResponseSchema.safeParse(invalidSeverity).success).toBe(false);

    const invalidDate = structuredClone(validFeedResponse);
    invalidDate.data[0].publishedAt = "10/08/2026";
    expect(legalUpdateFeedResponseSchema.safeParse(invalidDate).success).toBe(false);

    const unsafeSourceUrl = structuredClone(validFeedResponse);
    unsafeSourceUrl.data[0].sourceUrl = "javascript:alert(1)";
    expect(legalUpdateFeedResponseSchema.safeParse(unsafeSourceUrl).success).toBe(false);

    for (const sourceUrl of ["not-a-url", ""]) {
      const malformedSourceUrl = structuredClone(validFeedResponse);
      malformedSourceUrl.data[0].sourceUrl = sourceUrl;
      expect(legalUpdateFeedResponseSchema.safeParse(malformedSourceUrl).success).toBe(false);
    }
  });
});

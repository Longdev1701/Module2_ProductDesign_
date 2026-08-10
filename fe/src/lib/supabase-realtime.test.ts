import { afterEach, describe, expect, it, vi } from "vitest";

const realtimeMocks = vi.hoisted(() => {
  const channel = {
    on: vi.fn(),
    subscribe: vi.fn(),
  };
  channel.on.mockReturnValue(channel);
  channel.subscribe.mockReturnValue(channel);

  return {
    channel,
    createClient: vi.fn(),
    removeChannel: vi.fn(),
    setAuth: vi.fn(),
  };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: realtimeMocks.createClient,
}));

describe("subscribeToLegalUpdates", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    vi.resetModules();
    realtimeMocks.channel.on.mockReturnValue(realtimeMocks.channel);
    realtimeMocks.channel.subscribe.mockReturnValue(realtimeMocks.channel);
  });

  it("uses the public legal_updates channel, authenticates it, and cleans it up", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "public-key");
    realtimeMocks.createClient.mockReturnValue({
      realtime: { setAuth: realtimeMocks.setAuth },
      channel: vi.fn(() => realtimeMocks.channel),
      removeChannel: realtimeMocks.removeChannel,
    });

    const { subscribeToLegalUpdates } = await import("./supabase-realtime");
    const onChange = vi.fn();
    const unsubscribe = subscribeToLegalUpdates({ accessToken: "jwt-token", onChange });

    expect(realtimeMocks.setAuth).toHaveBeenCalledWith("jwt-token");
    expect(realtimeMocks.channel.on).toHaveBeenNthCalledWith(
      1,
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "legal_updates" },
      onChange,
    );
    expect(realtimeMocks.channel.on).toHaveBeenNthCalledWith(
      2,
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "legal_updates" },
      onChange,
    );

    unsubscribe?.();
    expect(realtimeMocks.removeChannel).toHaveBeenCalledWith(realtimeMocks.channel);
  });
});

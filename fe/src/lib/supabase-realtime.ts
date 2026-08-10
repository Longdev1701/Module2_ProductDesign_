import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";

let realtimeClient: SupabaseClient | null = null;
let realtimeClientConfig: string | null = null;

function getRealtimeClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  const config = `${url}:${publishableKey}`;
  if (realtimeClient && realtimeClientConfig === config) {
    return realtimeClient;
  }

  realtimeClient = createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  realtimeClientConfig = config;
  return realtimeClient;
}

export function subscribeToLegalUpdates(options: {
  accessToken: string;
  onChange: () => void;
}): (() => void) | null {
  const client = getRealtimeClient();
  if (!client || !options.accessToken) {
    return null;
  }

  client.realtime.setAuth(options.accessToken);

  const channel: RealtimeChannel = client
    .channel("legal-updates-feed")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "legal_updates" },
      options.onChange,
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "legal_updates" },
      options.onChange,
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}

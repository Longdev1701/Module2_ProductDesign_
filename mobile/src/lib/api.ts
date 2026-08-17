import * as SecureStore from 'expo-secure-store';

const BE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.100.234:3001/api';
const TOKEN_KEY = 'themis_token';
const ORG_KEY = 'themis_org_id';

// Memory cache fallback for ultra-fast response
let inMemoryToken: string | null = null;
let inMemoryOrgId: string | null = null;

export async function getToken(): Promise<string | null> {
  if (inMemoryToken) return inMemoryToken;
  try {
    const isAvail = await SecureStore.isAvailableAsync().catch(() => false);
    if (isAvail) {
      const val = await Promise.race([
        SecureStore.getItemAsync(TOKEN_KEY),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000)),
      ]);
      inMemoryToken = val;
      return val;
    }
  } catch (err) {
    console.warn('[SecureStore] Fallback to memory:', err);
  }
  return inMemoryToken;
}

export async function setToken(token: string): Promise<void> {
  inMemoryToken = token;
  try {
    const isAvail = await SecureStore.isAvailableAsync().catch(() => false);
    if (isAvail) {
      await SecureStore.setItemAsync(TOKEN_KEY, token).catch(() => {});
    }
  } catch (err) {
    console.warn('[SecureStore] Failed to write token:', err);
  }
}

export async function getOrgId(): Promise<string | null> {
  if (inMemoryOrgId) return inMemoryOrgId;
  try {
    const isAvail = await SecureStore.isAvailableAsync().catch(() => false);
    if (isAvail) {
      const val = await Promise.race([
        SecureStore.getItemAsync(ORG_KEY),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000)),
      ]);
      inMemoryOrgId = val;
      return val;
    }
  } catch (err) {
    console.warn('[SecureStore] Fallback orgId to memory:', err);
  }
  return inMemoryOrgId;
}

export async function setOrgId(id: string): Promise<void> {
  inMemoryOrgId = id;
  try {
    const isAvail = await SecureStore.isAvailableAsync().catch(() => false);
    if (isAvail) {
      await SecureStore.setItemAsync(ORG_KEY, id).catch(() => {});
    }
  } catch (err) {
    console.warn('[SecureStore] Failed to write orgId:', err);
  }
}

export async function clearAuth(): Promise<void> {
  inMemoryToken = null;
  inMemoryOrgId = null;
  try {
    const isAvail = await SecureStore.isAvailableAsync().catch(() => false);
    if (isAvail) {
      await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
      await SecureStore.deleteItemAsync(ORG_KEY).catch(() => {});
    }
  } catch (err) {
    console.warn('[SecureStore] Failed to clear auth:', err);
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await getToken();
  const orgId = await getOrgId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (orgId) headers['x-organization-id'] = orgId;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(`${BE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const rawText = await res.text();
    let json: any;
    try {
      json = JSON.parse(rawText);
    } catch {
      throw new Error(`Máy chủ phản hồi (HTTP ${res.status}): ${rawText.slice(0, 120)}`);
    }

    if (!res.ok) {
      const msg = json?.error?.message ?? json?.message ?? `Lỗi kết nối (HTTP ${res.status})`;
      throw new Error(msg);
    }
    return json.data ?? json;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

/**
 * Themis LexiGuard Mobile — Production-Real Auth Manager
 * 100% Real Authentication with Supabase JWT & Express Backend
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';
const AUTH_KEY = 'themis_mobile_auth_session';

export interface MobileUserSession {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  organizationId: string;
  organizationName: string;
}

let inMemoryStorage: Record<string, string> = {};

async function storageGet(key: string): Promise<string | null> {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key);
  }
  return inMemoryStorage[key] || null;
}

async function storageSet(key: string, value: string): Promise<void> {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
  } else {
    inMemoryStorage[key] = value;
  }
}

async function storageRemove(key: string): Promise<void> {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key);
  } else {
    delete inMemoryStorage[key];
  }
}

export async function loginWithBackend(email: string, password: string): Promise<MobileUserSession> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!res.ok || !json.data?.session?.accessToken) {
    throw new Error(json.error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.');
  }

  const token = json.data.session.accessToken;
  const user = json.data.user;
  const org = json.data.organizations?.[0] || { id: '', name: 'Doanh nghiệp xuất khẩu' };

  const session: MobileUserSession = {
    token,
    userId: user.id,
    email: user.email,
    fullName: user.fullName || email.split('@')[0],
    role: user.platformRole || 'COMPLIANCE',
    organizationId: org.id,
    organizationName: org.name,
  };

  await setMobileSession(session);
  return session;
}

export async function getMobileSession(): Promise<MobileUserSession | null> {
  try {
    const raw = await storageGet(AUTH_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to read auth session:', err);
  }
  return null;
}

export async function setMobileSession(session: MobileUserSession): Promise<void> {
  try {
    await storageSet(AUTH_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save auth session:', err);
  }
}

export async function clearMobileSession(): Promise<void> {
  try {
    await storageRemove(AUTH_KEY);
  } catch (err) {
    console.error('Failed to clear auth session:', err);
  }
}

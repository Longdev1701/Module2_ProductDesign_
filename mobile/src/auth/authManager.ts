/**
 * Themis LexiGuard Mobile — Production-Real Auth Manager
 * 100% Real Authentication with Supabase JWT & Express Backend
 * ZERO Hardcoded Presets or Fakes
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to read AsyncStorage auth session:', err);
  }
  return null;
}

export async function setMobileSession(session: MobileUserSession): Promise<void> {
  try {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save AsyncStorage auth session:', err);
  }
}

export async function clearMobileSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
  } catch (err) {
    console.error('Failed to clear AsyncStorage auth session:', err);
  }
}

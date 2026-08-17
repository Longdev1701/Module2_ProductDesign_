import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface MobileUserSession {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  role: 'OWNER' | 'MANAGER' | 'COMPLIANCE' | 'VIEWER';
  organizationId: string;
  organizationName: string;
}

const AUTH_KEY = 'themis_mobile_auth_session';

export const DEFAULT_FIELD_USER: MobileUserSession = {
  token: 'mobile-field-jwt-token-2026',
  userId: 'usr-kcs-001',
  email: 'rochthi2006@gmail.com',
  fullName: 'Chăm Rốch Thi (Cán bộ QA/QC Thực địa)',
  role: 'COMPLIANCE',
  organizationId: 'org-durian-tiengiang',
  organizationName: 'Hợp Tác Xã Sầu Riêng Tiền Giang',
};

export const PRESET_ACCOUNTS: MobileUserSession[] = [
  {
    token: 'token-kcs-001',
    userId: 'usr-kcs-001',
    email: 'rochthi2006@gmail.com',
    fullName: 'Chăm Rốch Thi (Cán bộ QA/QC Thực địa)',
    role: 'COMPLIANCE',
    organizationId: 'org-durian-tiengiang',
    organizationName: 'Hợp Tác Xã Sầu Riêng Tiền Giang',
  },
  {
    token: 'token-giamdoc-002',
    userId: 'usr-giamdoc-002',
    email: 'long.pt@themis.vn',
    fullName: 'Phạm Thành Long (Giám Đốc XNK)',
    role: 'OWNER',
    organizationId: 'org-durian-tiengiang',
    organizationName: 'Hợp Tác Xã Sầu Riêng Tiền Giang',
  },
  {
    token: 'token-taixe-003',
    userId: 'usr-taixe-003',
    email: 'taixe.tanthanh@themis.vn',
    fullName: 'Trần Văn Lái (Quản Lý Xe Cont Cửa Khẩu)',
    role: 'VIEWER',
    organizationId: 'org-durian-tiengiang',
    organizationName: 'Hợp Tác Xã Sầu Riêng Tiền Giang',
  },
];

export async function loginWithBackend(email: string, password: string): Promise<MobileUserSession> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!res.ok || !json.data?.session?.accessToken) {
    throw new Error(json.error?.message || 'Đăng nhập thất bại. Kiểm tra lại email hoặc mật khẩu');
  }

  const token = json.data.session.accessToken;
  const user = json.data.user;
  const org = json.data.organizations?.[0] || { id: 'org-durian-tiengiang', name: 'Hợp Tác Xã Sầu Riêng Tiền Giang' };

  const session: MobileUserSession = {
    token,
    userId: user.id,
    email: user.email,
    fullName: user.fullName || email.split('@')[0],
    role: 'COMPLIANCE',
    organizationId: org.id,
    organizationName: org.name,
  };

  await setMobileSession(session);
  return session;
}

export async function getMobileSession(): Promise<MobileUserSession> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to read AsyncStorage auth session:', err);
  }
  return DEFAULT_FIELD_USER;
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

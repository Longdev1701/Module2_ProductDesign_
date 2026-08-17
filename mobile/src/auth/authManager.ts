import AsyncStorage from '@react-native-async-storage/async-storage';

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
  email: 'kcs.tiengiang@themis.vn',
  fullName: 'Nguyễn Văn KCS (Cán bộ QA/QC Thực địa)',
  role: 'COMPLIANCE',
  organizationId: 'org-durian-tiengiang',
  organizationName: 'Hợp Tác Xã Sầu Riêng Tiền Giang',
};

export const PRESET_ACCOUNTS: MobileUserSession[] = [
  {
    token: 'token-kcs-001',
    userId: 'usr-kcs-001',
    email: 'kcs.tiengiang@themis.vn',
    fullName: 'Nguyễn Văn KCS (Cán bộ QA/QC Thực địa)',
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

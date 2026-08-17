import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { api, clearAuth, getToken } from '../lib/api';
import { ScreenShell, Card, ErrorBanner } from '../components/ui';
import { C, FONT_SIZE } from '../lib/theme';

interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
  organization?: { name: string; id: string };
}

interface Props {
  onLogout: () => void;
}

export function SettingsScreen({ onLogout }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<any>('/auth/me');
      if (res) {
        const u = res.user ?? res;
        const orgs = res.organizations ?? [];
        const primaryOrg = orgs[0];
        setProfile({
          id: u.id,
          email: u.email,
          fullName: u.fullName,
          role: primaryOrg?.role ?? u.platformRole,
          organization: primaryOrg ? { id: primaryOrg.id, name: primaryOrg.name } : undefined,
        });
      }
    } catch (e: any) {
      setError(e?.message ?? 'Không tải được thông tin tài khoản.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  function handleLogout() {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await clearAuth();
            onLogout();
          },
        },
      ],
    );
  }

  const ROLE_LABELS: Record<string, string> = {
    OWNER:      'Chủ sở hữu',
    MANAGER:    'Quản lý',
    COMPLIANCE: 'Phân tích viên',
    VIEWER:     'Xem',
  };

  return (
    <ScreenShell
      title="Cài đặt & Tài khoản"
      subtitle="Themis LexiGuard — Phân quyền RBAC"
      loading={loading}
    >
      {error && <ErrorBanner message={error} onRetry={fetchProfile} />}

      {profile && (
        <>
          {/* Profile card */}
          <Card>
            <View style={s.avatarRow}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>
                  {(profile.fullName ?? profile.email)[0].toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{profile.fullName ?? 'Chưa cập nhật'}</Text>
                <Text style={s.email}>{profile.email}</Text>
              </View>
            </View>
          </Card>

          {/* Organization */}
          {profile.organization && (
            <Card>
              <Text style={s.sectionLabel}>TỔ CHỨC</Text>
              <Text style={s.orgName}>{profile.organization.name}</Text>
              <Text style={s.orgRole}>
                Vai trò: {ROLE_LABELS[profile.role ?? ''] ?? profile.role ?? '—'}
              </Text>
            </Card>
          )}

          {/* System Info */}
          <Card>
            <Text style={s.sectionLabel}>PHẠM VI HỆ THỐNG</Text>
            <InfoRow label="Tiêu chuẩn" value="GACC Protocol 2024" />
            <InfoRow label="Thị trường" value="Trung Quốc (CN)" />
            <InfoRow label="Mã HS" value="0810.60.00 — Sầu riêng" />
          </Card>

          {/* Logout */}
          <TouchableOpacity onPress={handleLogout} style={s.logoutBtn} activeOpacity={0.8}>
            <Text style={s.logoutText}>Đăng xuất khỏi hệ thống</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={s.version}>Themis LexiGuard Mobile v1.0.0</Text>
    </ScreenShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={ir.row}>
      <Text style={ir.label}>{label}</Text>
      <Text style={ir.value}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  avatarRow:   { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar:      { width: 48, height: 48, borderRadius: 24, backgroundColor: C.navyMid, alignItems: 'center', justifyContent: 'center' },
  avatarText:  { fontSize: FONT_SIZE.xl, fontWeight: '900', color: C.gold },
  name:        { fontSize: FONT_SIZE.md, fontWeight: '800', color: C.textPrimary },
  email:       { fontSize: FONT_SIZE.xs, color: C.textMuted, marginTop: 2 },
  sectionLabel:{ fontSize: FONT_SIZE.xs, fontWeight: '800', color: C.textMuted, letterSpacing: 0.8, marginBottom: 8 },
  orgName:     { fontSize: FONT_SIZE.base, fontWeight: '700', color: C.textPrimary },
  orgRole:     { fontSize: FONT_SIZE.xs, color: C.textSecondary, marginTop: 4 },
  logoutBtn:   { backgroundColor: C.roseBg, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FECDD3' },
  logoutText:  { fontSize: FONT_SIZE.base, fontWeight: '800', color: C.rose },
  version:     { textAlign: 'center', fontSize: FONT_SIZE.xs, color: C.textMuted, marginTop: 8 },
});

const ir = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.borderFaint },
  label: { fontSize: FONT_SIZE.xs, color: C.textSecondary, fontWeight: '600' },
  value: { fontSize: FONT_SIZE.xs, color: C.textPrimary, fontWeight: '700', fontVariant: ['tabular-nums'] },
});

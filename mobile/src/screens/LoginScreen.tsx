import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  KeyboardAvoidingView, Platform, TouchableOpacity,
  ScrollView, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, setToken, setOrgId } from '../lib/api';
import { PrimaryButton } from '../components/ui';
import { C, FONT_SIZE } from '../lib/theme';

interface Props {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<any>(
        '/auth/login',
        { email: email.trim().toLowerCase(), password },
      );

      const token =
        res?.session?.accessToken ||
        res?.data?.session?.accessToken ||
        res?.token ||
        res?.accessToken;

      const orgId =
        res?.organizations?.[0]?.id ||
        res?.data?.organizations?.[0]?.id ||
        res?.user?.defaultOrganizationId;

      if (token) {
        await setToken(token);
      }
      if (orgId) {
        await setOrgId(orgId);
      }

      onLoginSuccess();
    } catch (e: any) {
      setError(e?.message ?? 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: Math.max(insets.top + 20, 48), paddingBottom: Math.max(insets.bottom + 20, 32) }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View style={s.brand}>
          <View style={s.logo}>
            <Text style={s.logoText}>T</Text>
          </View>
          <Text style={s.brandName}>Themis LexiGuard</Text>
          <Text style={s.brandTagline}>AI Compliance Navigator</Text>
          <View style={s.hsBadge}>
            <Text style={s.hsText}>HS: 0810.60.00 — GACC 2024</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={s.card}>
          <Text style={s.formTitle}>Đăng nhập hệ thống</Text>

          {error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <View style={s.field}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              placeholder="example@company.com"
              placeholderTextColor={C.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>Mật khẩu</Text>
            <TextInput
              style={s.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={C.textMuted}
              secureTextEntry
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          <PrimaryButton
            label="ĐĂNG NHẬP"
            onPress={handleLogin}
            loading={loading}
          />
        </View>

        <Text style={s.footer}>
          Phiên bản dành riêng cho KCS thực địa và quản lý xuất khẩu
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: C.navy },
  scroll:       { flexGrow: 1, justifyContent: 'center', padding: 20, paddingTop: 60 },
  brand:        { alignItems: 'center', marginBottom: 32, gap: 8 },
  logo:         { width: 64, height: 64, borderRadius: 16, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  logoText:     { fontSize: 28, fontWeight: '900', color: C.navy },
  brandName:    { fontSize: FONT_SIZE.xl, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  brandTagline: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5 },
  hsBadge:      { backgroundColor: 'rgba(255,184,0,0.15)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(255,184,0,0.3)' },
  hsText:       { fontSize: FONT_SIZE.xs, color: C.gold, fontWeight: '700', fontVariant: ['tabular-nums'] },
  card:         { backgroundColor: '#fff', borderRadius: 20, padding: 24, gap: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 8 },
  formTitle:    { fontSize: FONT_SIZE.lg, fontWeight: '800', color: C.textPrimary },
  errorBox:     { backgroundColor: C.roseBg, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#FECDD3' },
  errorText:    { fontSize: FONT_SIZE.sm, color: C.rose, fontWeight: '600' },
  field:        { gap: 6 },
  label:        { fontSize: FONT_SIZE.sm, fontWeight: '700', color: C.textSecondary },
  input:        { borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 13, fontSize: FONT_SIZE.base, color: C.textPrimary, backgroundColor: C.surface },
  footer:       { marginTop: 24, textAlign: 'center', fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.35)' },
});

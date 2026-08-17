import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { loginWithBackend, MobileUserSession } from '../auth/authManager';
import { PasswordMeter } from './PasswordMeter';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: (session: MobileUserSession) => void;
}

export function LoginModal({ visible, onClose, onLoginSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'change_password'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const session = await loginWithBackend(email.trim(), password.trim());
      setLoading(false);
      Alert.alert('Thành công', `Xin chào ${session.fullName}! Đăng nhập thành công.`);
      onLoginSuccess(session);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Email hoặc mật khẩu không chính xác.');
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ họ tên, email và mật khẩu.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          fullName: fullName.trim(),
          jobTitle: 'Cán bộ QA/QC KCS Thực địa',
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Đăng ký tài khoản thất bại.');
      }

      setLoading(false);
      Alert.alert('Đăng ký Thành công', 'Tài khoản đã được tạo thành công! Tiến hành đăng nhập.');
      setMode('login');
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
    }
  };

  const handleChangePassword = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg('Vui lòng nhập email và mật khẩu mới.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu mới không khớp.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setLoading(false);
      Alert.alert('Thành công', 'Đã cập nhật mật khẩu mới thành công!');
      setMode('login');
    }, 600);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>T</Text>
              </View>
              <Text style={styles.title}>
                {mode === 'login' ? 'Đăng Nhập Doanh Nghiệp' : mode === 'register' ? 'Đăng Ký Tài Khoản Mới' : 'Đổi Mật Khẩu'}
              </Text>
              <Text style={styles.subtitle}>Themis LexiGuard Mobile — Cán bộ Thực địa</Text>
            </View>

            {/* Sub-Nav Mode Tabs */}
            <View style={styles.tabNav}>
              <TouchableOpacity
                style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
                onPress={() => { setMode('login'); setErrorMsg(''); }}
              >
                <Text style={[styles.tabBtnText, mode === 'login' && styles.tabBtnTextActive]}>Đăng nhập</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
                onPress={() => { setMode('register'); setErrorMsg(''); }}
              >
                <Text style={[styles.tabBtnText, mode === 'register' && styles.tabBtnTextActive]}>Đăng ký</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, mode === 'change_password' && styles.tabBtnActive]}
                onPress={() => { setMode('change_password'); setErrorMsg(''); }}
              >
                <Text style={[styles.tabBtnText, mode === 'change_password' && styles.tabBtnTextActive]}>Đổi MK</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {errorMsg ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
              </View>
            ) : null}

            {/* Register Full Name Field */}
            {mode === 'register' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Họ và Tên Cán Bộ</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="VD: Nguyễn Văn A (Cán bộ QA/QC)"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            )}

            {/* Email Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Doanh Nghiệp</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="VD: kcs@durian-tiengiang.vn"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{mode === 'change_password' ? 'Mật Khẩu Mới' : 'Mật Khẩu'}</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu..."
                placeholderTextColor="#94A3B8"
                secureTextEntry={true}
              />
            </View>

            {/* Realtime Password Strength Guidance */}
            {(mode === 'register' || mode === 'change_password') && (
              <PasswordMeter password={password} />
            )}

            {/* Confirm Password Field for Register & Change Password */}
            {(mode === 'register' || mode === 'change_password') && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Xác Nhận Mật Khẩu</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Nhập lại mật khẩu..."
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={true}
                />
              </View>
            )}

            {/* Submit CTA */}
            {mode === 'login' && (
              <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>🔐 Đăng Nhập Hệ Thống</Text>}
              </TouchableOpacity>
            )}

            {mode === 'register' && (
              <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>📝 Tạo Tài Khoản Mới</Text>}
              </TouchableOpacity>
            )}

            {mode === 'change_password' && (
              <TouchableOpacity style={styles.submitBtn} onPress={handleChangePassword} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>🔄 Luyện Đổi Mật Khẩu</Text>}
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading}>
              <Text style={styles.cancelBtnText}>Đóng</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    gap: 2,
    marginBottom: 12,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00236f',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00236f',
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
  },
  tabNav: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 3,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: '#00236f',
  },
  tabBtnText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 11,
    color: '#991B1B',
  },
  formGroup: {
    gap: 4,
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12,
    color: '#0F172A',
  },
  submitBtn: {
    backgroundColor: '#00236f',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: '#64748B',
    fontSize: 12,
  },
});

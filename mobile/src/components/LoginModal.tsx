import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { loginWithBackend, MobileUserSession } from '../auth/authManager';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: (session: MobileUserSession) => void;
}

export function LoginModal({ visible, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setErrorMsg(err.message || 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>T</Text>
            </View>
            <Text style={styles.title}>Đăng Nhập Doanh Nghiệp</Text>
            <Text style={styles.subtitle}>Themis LexiGuard Mobile — Cán bộ Thực địa</Text>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Doanh Nghiệp</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email tài khoản (VD: user@company.com)"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mật Khẩu</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#94A3B8"
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>🔐 Đăng Nhập Hệ Thống</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading}>
            <Text style={styles.cancelBtnText}>Đóng</Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00236f',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00236f',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 10,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#991B1B',
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  submitBtn: {
    backgroundColor: '#00236f',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelBtnText: {
    color: '#64748B',
    fontSize: 13,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PasswordMeterProps {
  password: string;
}

export function PasswordMeter({ password }: PasswordMeterProps) {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const score = [hasMinLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  let strengthLabel = 'Chưa nhập';
  let strengthColor = '#94A3B8';
  let barWidth = '0%';

  if (password.length > 0) {
    if (score <= 1) {
      strengthLabel = 'Yếu';
      strengthColor = '#EF4444';
      barWidth = '25%';
    } else if (score === 2) {
      strengthLabel = 'Trung bình';
      strengthColor = '#F59E0B';
      barWidth = '50%';
    } else if (score === 3) {
      strengthLabel = 'Khá mạnh';
      strengthColor = '#3B82F6';
      barWidth = '75%';
    } else {
      strengthLabel = 'Rất mạnh (Đạt chuẩn GACC)';
      strengthColor = '#10B981';
      barWidth = '100%';
    }
  }

  return (
    <View style={styles.container}>
      {/* Strength Bar */}
      <View style={styles.barHeader}>
        <Text style={styles.labelText}>Độ mạnh mật khẩu:</Text>
        <Text style={[styles.statusText, { color: strengthColor }]}>{strengthLabel}</Text>
      </View>

      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: barWidth, backgroundColor: strengthColor }]} />
      </View>

      {/* Real-time Checklist */}
      <View style={styles.checklist}>
        <Text style={[styles.checkItem, hasMinLength ? styles.validItem : styles.invalidItem]}>
          {hasMinLength ? '✅' : '⚪'} Tối thiểu 8 ký tự
        </Text>
        <Text style={[styles.checkItem, hasUpper ? styles.validItem : styles.invalidItem]}>
          {hasUpper ? '✅' : '⚪'} Ít nhất 1 chữ hoa (A-Z)
        </Text>
        <Text style={[styles.checkItem, hasNumber ? styles.validItem : styles.invalidItem]}>
          {hasNumber ? '✅' : '⚪'} Ít nhất 1 chữ số (0-9)
        </Text>
        <Text style={[styles.checkItem, hasSpecial ? styles.validItem : styles.invalidItem]}>
          {hasSpecial ? '✅' : '⚪'} Ít nhất 1 ký tự đặc biệt (@#$%)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginTop: 4,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 11,
    color: '#64748B',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  barBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  checklist: {
    gap: 2,
    marginTop: 2,
  },
  checkItem: {
    fontSize: 11,
  },
  validItem: {
    color: '#059669',
    fontWeight: '600',
  },
  invalidItem: {
    color: '#94A3B8',
  },
});

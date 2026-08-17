import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { getMobileSession, setMobileSession, PRESET_ACCOUNTS, MobileUserSession } from '../auth/authManager';

export const AppHeader = React.memo(function AppHeader() {
  const [session, setSession] = useState<MobileUserSession | null>(null);

  useEffect(() => {
    getMobileSession().then(setSession);
  }, []);

  const handleAccountSwitch = () => {
    Alert.alert(
      'Chuyển Đổi Tài Khoản Thực Địa',
      `Tài khoản hiện tại: ${session?.fullName || 'Cán bộ KCS'}\n\nChọn vai trò làm việc:`,
      PRESET_ACCOUNTS.map((acc) => ({
        text: `👤 ${acc.fullName}`,
        onPress: async () => {
          await setMobileSession(acc);
          setSession(acc);
          Alert.alert('Thành công', `Đã chuyển sang tài khoản: ${acc.fullName}`);
        },
      })).concat([{ text: 'Hủy', style: 'cancel' }])
    );
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>T</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.headerSub}>AI COMPLIANCE NAVIGATOR</Text>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            Themis LexiGuard Mobile
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.userBadge}
        onPress={handleAccountSwitch}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.userIcon}>👤</Text>
        <Text style={styles.userRoleText} numberOfLines={1}>
          {session?.role === 'OWNER' ? 'Giám Đốc' : session?.role === 'COMPLIANCE' ? 'Cán Bộ KCS' : 'Tài Xế'}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#00236f',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#00236f',
  },
  titleContainer: {
    flex: 1,
  },
  headerSub: {
    fontSize: 8,
    fontFamily: 'monospace',
    color: '#FCD34D',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    minHeight: 36,
  },
  userIcon: {
    fontSize: 14,
  },
  userRoleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFB800',
  },
});

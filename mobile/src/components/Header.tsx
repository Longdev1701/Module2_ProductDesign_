import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { getMobileSession, clearMobileSession, MobileUserSession } from '../auth/authManager';
import { LoginModal } from './LoginModal';

export const AppHeader = React.memo(function AppHeader() {
  const [session, setSession] = useState<MobileUserSession | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    getMobileSession().then(setSession);
  }, []);

  const handleAccountPress = () => {
    if (session) {
      Alert.alert(
        'Tài Khoản Doanh Nghiệp',
        `Họ tên: ${session.fullName}\nEmail: ${session.email}\nVai trò: ${session.role}`,
        [
          {
            text: 'Đăng xuất',
            style: 'destructive',
            onPress: async () => {
              await clearMobileSession();
              setSession(null);
              Alert.alert('Thông báo', 'Đã đăng xuất tài khoản.');
            },
          },
          { text: 'Đóng', style: 'cancel' },
        ]
      );
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftGroup}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoSymbol}>⚖️</Text>
        </View>
        <View style={styles.titleColumn}>
          <View style={styles.pillBadge}>
            <Text style={styles.pillText}>GACC COMPLIANCE NAVIGATOR</Text>
          </View>
          <Text style={styles.brandTitle} numberOfLines={1}>
            Themis LexiGuard Mobile
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.profileChip}
        onPress={handleAccountPress}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.liveDot} />
        <Text style={styles.profileText} numberOfLines={1}>
          {session ? session.fullName.split(' ')[0] : 'Đăng nhập'}
        </Text>
      </TouchableOpacity>

      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(newSession) => setSession(newSession)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#00143B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 184, 0, 0.3)',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFB800',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoSymbol: {
    fontSize: 22,
  },
  titleColumn: {
    flex: 1,
    gap: 2,
  },
  pillBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: '#FFB800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  profileText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFB800',
  },
});

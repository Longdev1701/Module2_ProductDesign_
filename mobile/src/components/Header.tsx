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
          <Text style={styles.brandSub}>THEMIS LEXIGUARD — GACC DURIAN</Text>
          <Text style={styles.brandTitle} numberOfLines={1}>
            Điều Hướng Pháp Lý Thực Địa
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
    paddingVertical: 14,
    backgroundColor: '#00143B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 184, 0, 0.25)',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'linear-gradient(135deg, #FFB800 0%, #D97706 100%)',
    borderWidth: 1,
    borderColor: '#FCD34D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#FFB800',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoSymbol: {
    fontSize: 20,
  },
  titleColumn: {
    flex: 1,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1.2,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  profileText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFB800',
  },
});

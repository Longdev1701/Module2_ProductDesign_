import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { WebDashboardView } from './WebDashboardView';

export type MobileNavModule =
  | 'dashboard'
  | 'products'
  | 'batches'
  | 'vault'
  | 'reports'
  | 'integrity'
  | 'settings';

export function UnifiedMobileShell() {
  const [activeModule, setActiveModule] = useState<MobileNavModule>('dashboard');

  const getModulePath = (module: MobileNavModule): string => {
    switch (module) {
      case 'dashboard':
        return '/dashboard';
      case 'products':
        return '/products';
      case 'batches':
        return '/batches';
      case 'vault':
        return '/vault';
      case 'reports':
        return '/reports';
      case 'integrity':
        return '/integrity';
      case 'settings':
        return '/settings';
      default:
        return '/dashboard';
    }
  };

  return (
    <View style={styles.shellContainer}>
      {/* Full-width 100% Mobile Content Frame (No Sidebar) */}
      <View style={styles.webFrame}>
        <WebDashboardView routePath={getModulePath(activeModule)} />
      </View>

      {/* Professional Bottom Footer Bar Navigation (No Emojis) */}
      <View style={styles.bottomFooterNav}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.footerScroll}>
          <TouchableOpacity
            style={[styles.footerTab, activeModule === 'dashboard' && styles.footerTabActive]}
            onPress={() => setActiveModule('dashboard')}
            activeOpacity={0.8}
          >
            <Text style={[styles.footerTabText, activeModule === 'dashboard' && styles.footerTabTextActive]}>
              TỔNG QUAN
            </Text>
            {activeModule === 'dashboard' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerTab, activeModule === 'products' && styles.footerTabActive]}
            onPress={() => setActiveModule('products')}
            activeOpacity={0.8}
          >
            <Text style={[styles.footerTabText, activeModule === 'products' && styles.footerTabTextActive]}>
              SẢN PHẨM
            </Text>
            {activeModule === 'products' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerTab, activeModule === 'batches' && styles.footerTabActive]}
            onPress={() => setActiveModule('batches')}
            activeOpacity={0.8}
          >
            <Text style={[styles.footerTabText, activeModule === 'batches' && styles.footerTabTextActive]}>
              LÔ HÀNG
            </Text>
            {activeModule === 'batches' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerTab, activeModule === 'vault' && styles.footerTabActive]}
            onPress={() => setActiveModule('vault')}
            activeOpacity={0.8}
          >
            <Text style={[styles.footerTabText, activeModule === 'vault' && styles.footerTabTextActive]}>
              KHO CHỨNG TỪ
            </Text>
            {activeModule === 'vault' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerTab, activeModule === 'reports' && styles.footerTabActive]}
            onPress={() => setActiveModule('reports')}
            activeOpacity={0.8}
          >
            <Text style={[styles.footerTabText, activeModule === 'reports' && styles.footerTabTextActive]}>
              BÁO CÁO GACC
            </Text>
            {activeModule === 'reports' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerTab, activeModule === 'integrity' && styles.footerTabActive]}
            onPress={() => setActiveModule('integrity')}
            activeOpacity={0.8}
          >
            <Text style={[styles.footerTabText, activeModule === 'integrity' && styles.footerTabTextActive]}>
              MÃ BĂM SHA-256
            </Text>
            {activeModule === 'integrity' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerTab, activeModule === 'settings' && styles.footerTabActive]}
            onPress={() => setActiveModule('settings')}
            activeOpacity={0.8}
          >
            <Text style={[styles.footerTabText, activeModule === 'settings' && styles.footerTabTextActive]}>
              PHÂN QUYỀN
            </Text>
            {activeModule === 'settings' && <View style={styles.activeDot} />}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shellContainer: {
    flex: 1,
    backgroundColor: '#FAF8FF',
  },
  webFrame: {
    flex: 1,
    backgroundColor: '#FAF8FF',
  },
  bottomFooterNav: {
    backgroundColor: '#00143B',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 184, 0, 0.3)',
    paddingVertical: 8,
    height: 60,
  },
  footerScroll: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  footerTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    position: 'relative',
    alignItems: 'center',
  },
  footerTabActive: {
    backgroundColor: '#00236f',
    borderColor: '#FFB800',
  },
  footerTabText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  footerTabTextActive: {
    color: '#FFB800',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFB800',
    marginTop: 2,
  },
});

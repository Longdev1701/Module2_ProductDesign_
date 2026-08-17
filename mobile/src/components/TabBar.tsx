import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface TabBarProps {
  activeTab: 'radar' | 'scan' | 'tracker' | 'ai';
  onSelectTab: (tab: 'radar' | 'scan' | 'tracker' | 'ai') => void;
}

export const TabBar = React.memo(function TabBar({ activeTab, onSelectTab }: TabBarProps) {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'radar' && styles.navItemActive]}
        onPress={() => onSelectTab('radar')}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.navIcon}>📡</Text>
        <Text style={[styles.navText, activeTab === 'radar' && styles.navTextActive]}>
          Ra-da
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, activeTab === 'scan' && styles.navItemActive]}
        onPress={() => onSelectTab('scan')}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.navIcon}>📷</Text>
        <Text style={[styles.navText, activeTab === 'scan' && styles.navTextActive]}>
          Quét KCS
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, activeTab === 'tracker' && styles.navItemActive]}
        onPress={() => onSelectTab('tracker')}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.navIcon}>🚛</Text>
        <Text style={[styles.navText, activeTab === 'tracker' && styles.navTextActive]}>
          Lô Hàng
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, activeTab === 'ai' && styles.navItemActive]}
        onPress={() => onSelectTab('ai')}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.navIcon}>🤖</Text>
        <Text style={[styles.navText, activeTab === 'ai' && styles.navTextActive]}>
          Trợ lý AI
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#00236f',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    height: 60,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 48,
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#FFB800',
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  navTextActive: {
    color: '#FFB800',
    fontWeight: 'bold',
  },
});

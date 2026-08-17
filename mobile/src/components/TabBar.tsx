import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface TabBarProps {
  activeTab: 'radar' | 'scan' | 'tracker' | 'ai';
  onSelectTab: (tab: 'radar' | 'scan' | 'tracker' | 'ai') => void;
}

export const TabBar = React.memo(function TabBar({ activeTab, onSelectTab }: TabBarProps) {
  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'radar' && styles.tabItemActive]}
        onPress={() => onSelectTab('radar')}
        activeOpacity={0.8}
      >
        <Text style={styles.tabIcon}>📡</Text>
        <Text style={[styles.tabLabel, activeTab === 'radar' && styles.tabLabelActive]}>
          Ra-da
        </Text>
        {activeTab === 'radar' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'scan' && styles.tabItemActive]}
        onPress={() => onSelectTab('scan')}
        activeOpacity={0.8}
      >
        <Text style={styles.tabIcon}>📷</Text>
        <Text style={[styles.tabLabel, activeTab === 'scan' && styles.tabLabelActive]}>
          Quét KCS
        </Text>
        {activeTab === 'scan' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'tracker' && styles.tabItemActive]}
        onPress={() => onSelectTab('tracker')}
        activeOpacity={0.8}
      >
        <Text style={styles.tabIcon}>🚛</Text>
        <Text style={[styles.tabLabel, activeTab === 'tracker' && styles.tabLabelActive]}>
          Lô Hàng
        </Text>
        {activeTab === 'tracker' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'ai' && styles.tabItemActive]}
        onPress={() => onSelectTab('ai')}
        activeOpacity={0.8}
      >
        <Text style={styles.tabIcon}>🤖</Text>
        <Text style={[styles.tabLabel, activeTab === 'ai' && styles.tabLabelActive]}>
          Trợ Lý AI
        </Text>
        {activeTab === 'ai' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#00143B',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 184, 0, 0.25)',
    paddingVertical: 8,
    height: 64,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    position: 'relative',
  },
  tabItemActive: {},
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabLabelActive: {
    color: '#FFB800',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    backgroundColor: '#FFB800',
    borderRadius: 2,
  },
});

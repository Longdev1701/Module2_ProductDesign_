import React, { useState, useCallback } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { AppHeader } from './src/components/Header';
import { TabBar } from './src/components/TabBar';
import { WebDashboardView } from './src/components/WebDashboardView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'radar' | 'scan' | 'tracker' | 'ai'>('radar');

  const handleSelectTab = useCallback((tab: 'radar' | 'scan' | 'tracker' | 'ai') => {
    setActiveTab(tab);
  }, []);

  const getRoutePath = (tab: 'radar' | 'scan' | 'tracker' | 'ai') => {
    switch (tab) {
      case 'radar':
        return '/dashboard';
      case 'scan':
        return '/vault';
      case 'tracker':
        return '/batches';
      case 'ai':
        return '/regulations';
      default:
        return '/dashboard';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00143B" />

      {/* App Header */}
      <AppHeader />

      {/* Main Content Body — 100% Direct Web App Integration */}
      <View style={styles.body}>
        <WebDashboardView routePath={getRoutePath(activeTab)} />
      </View>

      {/* Bottom Navigation Bar */}
      <TabBar activeTab={activeTab} onSelectTab={handleSelectTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00143B',
  },
  body: {
    flex: 1,
    backgroundColor: '#FAF8FF',
  },
});

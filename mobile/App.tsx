import React, { useState, useCallback } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { AppHeader } from './src/components/Header';
import { TabBar } from './src/components/TabBar';
import { LegalRadarTab } from './src/screens/LegalRadarTab';
import { FieldScanTab } from './src/screens/FieldScanTab';
import { BatchTrackerTab } from './src/screens/BatchTrackerTab';
import { AiAssistantTab } from './src/screens/AiAssistantTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'radar' | 'scan' | 'tracker' | 'ai'>('radar');

  const handleSelectTab = useCallback((tab: 'radar' | 'scan' | 'tracker' | 'ai') => {
    setActiveTab(tab);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00236f" />

      {/* App Header */}
      <AppHeader />

      {/* Main Content Body */}
      <View style={styles.body}>
        {activeTab === 'radar' && <LegalRadarTab />}
        {activeTab === 'scan' && <FieldScanTab />}
        {activeTab === 'tracker' && <BatchTrackerTab />}
        {activeTab === 'ai' && <AiAssistantTab />}
      </View>

      {/* Bottom Navigation Bar */}
      <TabBar activeTab={activeTab} onSelectTab={handleSelectTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00236f',
  },
  body: {
    flex: 1,
    backgroundColor: '#f7f9fb',
  },
});

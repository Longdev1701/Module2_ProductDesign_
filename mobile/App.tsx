import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { AppHeader } from './src/components/Header';
import { UnifiedMobileShell } from './src/components/UnifiedMobileShell';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00143B" />

      {/* App Header */}
      <AppHeader />

      {/* Main Unified 100% Web Feature Shell */}
      <View style={styles.body}>
        <UnifiedMobileShell />
      </View>
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

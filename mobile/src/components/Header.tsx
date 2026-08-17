import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const AppHeader = React.memo(function AppHeader() {
  return (
    <View style={styles.header}>
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
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#00236f',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#00236f',
  },
  titleContainer: {
    flex: 1,
  },
  headerSub: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#FCD34D',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

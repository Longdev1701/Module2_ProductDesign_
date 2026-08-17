import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

interface WebDashboardViewProps {
  routePath: string;
}

const WEB_HOST = 'http://192.168.100.234:3000';

export function WebDashboardView({ routePath }: WebDashboardViewProps) {
  const targetUrl = `${WEB_HOST}${routePath}`;

  // On Web Preview, use responsive iframe container
  if (typeof window !== 'undefined' && window.document) {
    return (
      <View style={styles.webContainer}>
        {/* @ts-ignore */}
        <iframe
          src={targetUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="Themis LexiGuard Web App"
        />
      </View>
    );
  }

  // On Mobile Native App (Expo Go on Android/iOS), use WebView
  return (
    <View style={styles.webContainer}>
      <WebView
        source={{ uri: targetUrl }}
        style={styles.webView}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#FAF8FF',
  },
  webView: {
    flex: 1,
  },
});

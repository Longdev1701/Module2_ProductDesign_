import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getToken } from './src/lib/api';
import { C } from './src/lib/theme';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { ChecksScreen } from './src/screens/ChecksScreen';
import { IntegrityScreen } from './src/screens/IntegrityScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

export type RootTabParamList = {
  DIEU_HANH: undefined;
  SAN_PHAM: undefined;
  TU_VAN: undefined;
  LIEM_CHINH: undefined;
  CAI_DAT: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// ─── Tab icon labels (text-only badges, 0% emoji) ───────────────────────────
const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  DIEU_HANH: 'DH',
  SAN_PHAM:  'SP',
  TU_VAN:    'AI',
  LIEM_CHINH:'LC',
  CAI_DAT:   'CD',
};

function TabIcon({ name, focused }: { name: keyof RootTabParamList; focused: boolean }) {
  return (
    <View
      style={{
        width: 32,
        height: 24,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? 'rgba(255,184,0,0.22)' : 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: focused ? C.gold : 'rgba(255,255,255,0.1)',
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: '900',
          color: focused ? C.gold : '#94A3B8',
          letterSpacing: 0.5,
        }}
      >
        {TAB_ICONS[name] ?? '••'}
      </Text>
    </View>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [authState, setAuthState] = useState<'loading' | 'logged_in' | 'logged_out'>('loading');

  useEffect(() => {
    let mounted = true;
    getToken()
      .then((token) => {
        if (mounted) setAuthState(token ? 'logged_in' : 'logged_out');
      })
      .catch(() => {
        if (mounted) setAuthState('logged_out');
      });

    // Fail-safe: Maximum 600ms loading splash then immediately proceed to login
    const timer = setTimeout(() => {
      if (mounted) {
        setAuthState((prev) => (prev === 'loading' ? 'logged_out' : prev));
      }
    }, 600);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={C.navy} />

      {authState === 'loading' ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.navy }}>
          <ActivityIndicator size="large" color={C.gold} />
        </View>
      ) : authState === 'logged_out' ? (
        <LoginScreen onLoginSuccess={() => setAuthState('logged_in')} />
      ) : (
        <NavigationContainer>
          <Tab.Navigator
            id="RootTabs"
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor: C.navy,
                borderTopColor: 'rgba(255,184,0,0.25)',
                borderTopWidth: 1,
                height: 64,
                paddingBottom: 8,
                paddingTop: 6,
              },
              tabBarActiveTintColor: C.gold,
              tabBarInactiveTintColor: '#64748B',
              tabBarLabelStyle: {
                fontSize: 9,
                fontWeight: '800',
                letterSpacing: 0.3,
              },
              tabBarIcon: ({ focused }) => (
                <TabIcon name={route.name as keyof RootTabParamList} focused={focused} />
              ),
            })}
          >
            <Tab.Screen
              name="DIEU_HANH"
              component={DashboardScreen}
              options={{ tabBarLabel: 'ĐIỀU HÀNH' }}
            />

            <Tab.Screen
              name="SAN_PHAM"
              component={ProductsScreen}
              options={{ tabBarLabel: 'SẢN PHẨM' }}
            />

            <Tab.Screen
              name="TU_VAN"
              component={ChecksScreen}
              options={{ tabBarLabel: 'TƯ VẤN AI' }}
            />

            <Tab.Screen
              name="LIEM_CHINH"
              component={IntegrityScreen}
              options={{ tabBarLabel: 'LIÊM CHÍNH' }}
            />

            <Tab.Screen
              name="CAI_DAT"
              options={{ tabBarLabel: 'CÀI ĐẶT' }}
            >
              {() => <SettingsScreen onLogout={() => setAuthState('logged_out')} />}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}

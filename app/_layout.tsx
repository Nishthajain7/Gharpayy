import React from 'react';
import { StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { AppProvider } from '@/hooks/useAppStore';
import { COLORS } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <Stack
        screenOptions={{
          headerStyle:        { backgroundColor: COLORS.surface },
          headerTitleStyle:   { color: COLORS.text, fontWeight: '700' },
          headerShadowVisible: false,
          headerTintColor:    COLORS.primary,
          contentStyle:       { backgroundColor: COLORS.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation:  'modal',
            title:         'Lead Details',
            headerShown:   true,
          }}
        />
      </Stack>
    </AppProvider>
  );
}

// app/(tabs)/_layout.tsx
import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { COLORS, hoursAgo } from '@/constants/theme';
import { useAppStore } from '@/hooks/useAppStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ICONS = {
  index: 'view-dashboard',
  leads: 'account-group',
  pipeline: 'chart-timeline-variant',
  visits: 'calendar-check',
  followups: 'bell-ring',
} as const;

const LABELS: Record<string, string> = {
  index: 'Dashboard',
  leads: 'Leads',
  pipeline: 'Pipeline',
  visits: 'Visits',
  followups: 'Follow-ups',
};

export default function TabsLayout() {
  const { state } = useAppStore();
  const followupCount = state.leads.filter(
    l => l.stage !== 'Booked' && l.stage !== 'Lost' && hoursAgo(l.lastActivity) >= 24
  ).length;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: COLORS.surface },
        headerTitleStyle: { color: COLORS.text, fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 58,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            <MaterialCommunityIcons
              name={ICONS[route.name as keyof typeof ICONS]}
              size={22}
              color={focused ? COLORS.primary : COLORS.text}
            />
          </Text>
        ),
        title: LABELS[route.name] ?? route.name,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="leads" />
      <Tabs.Screen name="pipeline" />
      <Tabs.Screen name="visits" />
      <Tabs.Screen
        name="followups"
        options={{
          tabBarBadge: followupCount > 0 ? followupCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.danger,
            color: '#fff', fontSize: 10, minWidth: 16, height: 16, lineHeight: 16,
          },
        }}
      />
    </Tabs>
  );
}

import { useI18n } from '@/contexts/I18nContext';
// AERO — Admin Tab Navigator
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontWeight } from '@/constants/theme';

export default function AdminLayout() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.select({ ios: insets.bottom + 60, android: insets.bottom + 60, default: 70 }),
          paddingTop: 8,
          paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }),
          paddingHorizontal: 12,
          backgroundColor: '#111111',
          borderTopWidth: 1,
          borderTopColor: '#2A2A2A',
        },
        tabBarActiveTintColor: '#F97316',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontSize: 11, fontWeight: fontWeight.semibold },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="drivers"
        options={{
          title: t('tab_admin_drivers'),
          tabBarIcon: ({ color, size }) => <MaterialIcons name="people" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'SOS / Alerts',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="warning" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

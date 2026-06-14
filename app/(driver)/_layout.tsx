import { useI18n } from '@/contexts/I18nContext';
// AERO — Tab navigator Șofer
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontWeight } from '@/constants/theme';

export default function DriverLayout() {
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
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontSize: 11, fontWeight: fontWeight.semibold },
      }}
    >
      <Tabs.Screen
        name="drive"
        options={{
          title: t('tab_driver_drive'),
          tabBarIcon: ({ color, size }) => <MaterialIcons name="local-taxi" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: t('tab_driver_rides'),
          tabBarIcon: ({ color, size }) => <MaterialIcons name="receipt-long" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="passes"
        options={{
          title: t('tab_driver_subscription'),
          tabBarIcon: ({ color, size }) => <MaterialIcons name="card-membership" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tab_driver_profile'),
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

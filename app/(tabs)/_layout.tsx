// Powered by OnSpace.AI
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontWeight } from '@/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarStyle = {
    height: Platform.select({ ios: insets.bottom + 60, android: insets.bottom + 60, default: 70 }),
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }),
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontSize: 12, fontWeight: fontWeight.semibold },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Acasă',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="explore" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="drive"
        options={{
          title: 'Mod Șofer',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="local-taxi" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activitate',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="receipt-long" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Cont',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

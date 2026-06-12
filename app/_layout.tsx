// Powered by OnSpace.AI
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { RideProvider } from '@/contexts/RideContext';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <RideProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                headerStyle: { backgroundColor: colors.surface },
                headerTitleStyle: { color: colors.text, fontWeight: '700' },
                headerTintColor: colors.text,
                headerShadowVisible: false,
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="ride/request" options={{ headerShown: true, title: 'Comandă cursă' }} />
              <Stack.Screen name="ride/offers" options={{ headerShown: true, title: 'Oferte șoferi' }} />
              <Stack.Screen name="ride/active" options={{ headerShown: false }} />
              <Stack.Screen name="driver/onboarding" options={{ headerShown: true, title: 'Devino Șofer' }} />
            </Stack>
          </RideProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}

// AERO — Root Layout cu Auth Guard
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { RideProvider } from '@/contexts/RideContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

// Guard component — redirecționează în funcție de starea de autentificare
function AuthGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Inițializare push notifications
  useNotifications();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user) {
      // Neautentificat → splash/landing
      if (!inAuthGroup) {
        router.replace('/(auth)');
      }
    } else {
      // Autentificat → redirect pe rol
      if (inAuthGroup) {
        const role = user.role ?? 'passenger';
        if (role === 'driver') {
          router.replace('/(driver)/drive');
        } else {
          router.replace('/(passenger)/ride');
        }
      }
    }
  }, [user, loading, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <I18nProvider>
      <AlertProvider>
        <SafeAreaProvider>
          <AuthProvider>
            <RideProvider>
              <StatusBar style="dark" />
              <AuthGuard />
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
                {/* Auth group */}
                <Stack.Screen name="(auth)" />

                {/* Passenger group */}
                <Stack.Screen name="(passenger)" />

                {/* Driver group */}
                <Stack.Screen name="(driver)" />

                {/* Admin group */}
                <Stack.Screen name="(admin)" />

                {/* Chat */}
                <Stack.Screen name="chat/[rideId]" options={{ headerShown: false }} />

                {/* Shared stack screens */}
                <Stack.Screen name="ride/request" options={{ headerShown: true, title: 'Comandă cursă' }} />
                <Stack.Screen name="ride/offers" options={{ headerShown: true, title: 'Oferte șoferi' }} />
                <Stack.Screen name="ride/pending" options={{ headerShown: false }} />
                <Stack.Screen name="ride/active" options={{ headerShown: false }} />
                <Stack.Screen name="ride/chat" options={{ headerShown: true, title: 'Chat' }} />
                <Stack.Screen name="ride/rating" options={{ headerShown: false }} />
                <Stack.Screen name="driver/onboarding" options={{ headerShown: true, title: 'Devino Șofer' }} />

                {/* Legacy tabs — backward compat */}
                <Stack.Screen name="(tabs)" />
              </Stack>
            </RideProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </AlertProvider>
    </I18nProvider>
  );
}

// AERO — Passenger Home (Ride tab)
// Placeholder temporar — va fi înlocuit în Etapa 3
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing, shadows } from '@/constants/theme';
import { MapSurface } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { useRide } from '@/hooks/useRide';
import { CURRENT_LOCATION, PLACES, CURRENCY } from '@/services/mockData';
import type { MapPin } from '@/components';

export default function PassengerRideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { pickup, activeRide, setDropoff } = useRide();

  const pins: MapPin[] = [
    { x: CURRENT_LOCATION.x, y: CURRENT_LOCATION.y, kind: 'pickup', label: 'Tu' },
    { x: PLACES[0].x, y: PLACES[0].y, kind: 'driver' },
    { x: PLACES[6].x, y: PLACES[6].y, kind: 'driver' },
    { x: PLACES[3].x, y: PLACES[3].y, kind: 'driver' },
  ];

  const quick = [PLACES[0], PLACES[2], PLACES[4]];

  return (
    <View style={styles.container}>
      <MapSurface pins={pins} style={StyleSheet.absoluteFillObject} />

      {/* Greeting card */}
      <View style={[styles.top, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.greetCard}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarText}>{(user?.name ?? 'A').charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.hello}>Salut, {user?.name?.split(' ')[0] ?? 'pasager'} 👋</Text>
            <Text style={styles.sub}>Unde te ducem azi?</Text>
          </View>
          <MaterialIcons name="notifications-none" size={24} color={colors.text} />
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.sheet, { paddingBottom: spacing.md + insets.bottom }]}>
        {activeRide && (
          <Pressable style={styles.activeBanner} onPress={() => router.push('/ride/active')}>
            <MaterialIcons name="directions-car" size={22} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.activeTitle}>Cursă în desfășurare</Text>
              <Text style={styles.activeSub}>
                {activeRide.offer?.driverName} · {activeRide.finalPrice} {CURRENCY}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#fff" />
          </Pressable>
        )}

        <Pressable style={styles.searchBar} onPress={() => router.push('/ride/request')}>
          <MaterialIcons name="search" size={20} color={colors.textFaint} />
          <Text style={styles.searchText}>Unde mergi?</Text>
        </Pressable>

        <View style={styles.quickRow}>
          {quick.map((p) => (
            <Pressable
              key={p.id}
              style={styles.quickChip}
              onPress={() => {
                setDropoff(p);
                router.push('/ride/request');
              }}
            >
              <MaterialIcons name="bookmark-border" size={16} color={colors.accent} />
              <Text style={styles.quickText} numberOfLines={1}>{p.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mapBg },
  top: { paddingHorizontal: spacing.md },
  greetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.sm,
    paddingRight: spacing.md,
    ...shadows.card,
  },
  avatarMini: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: fontWeight.bold },
  hello: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  sub: { fontSize: fontSize.sm, color: colors.textSubtle },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    padding: spacing.md, gap: spacing.md,
  },
  activeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.ink, borderRadius: radius.lg, padding: spacing.md,
  },
  activeTitle: { color: '#fff', fontSize: fontSize.md, fontWeight: fontWeight.bold },
  activeSub: { color: 'rgba(255,255,255,0.7)', fontSize: fontSize.sm },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.pill,
    padding: spacing.md, ...shadows.card,
    borderWidth: 1.5, borderColor: colors.border,
  },
  searchText: { fontSize: fontSize.md, color: colors.textFaint },
  quickRow: { flexDirection: 'row', gap: spacing.sm },
  quickChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surface, borderRadius: radius.pill,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.sm,
    ...shadows.card,
  },
  quickText: { flex: 1, fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.text },
});

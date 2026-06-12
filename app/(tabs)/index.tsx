// Powered by OnSpace.AI
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, fontWeight, radius, shadows, spacing } from '@/constants/theme';
import { MapSurface, DestinationTrigger, Avatar } from '@/components';
import type { MapPin } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { useRide } from '@/hooks/useRide';
import { CURRENT_LOCATION, PLACES, CURRENCY } from '@/services/mockData';

export default function HomeScreen() {
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

      {/* top greeting */}
      <View style={[styles.top, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.greetCard}>
          <Avatar name={user?.name ?? 'A'} color={user?.avatarColor ?? colors.primary} size={40} />
          <View style={{ flex: 1 }}>
            <Text style={styles.hello}>Salut, {user?.name?.split(' ')[0] ?? 'pasager'}</Text>
            <Text style={styles.sub}>Unde te ducem azi?</Text>
          </View>
          <MaterialIcons name="notifications-none" size={24} color={colors.text} />
        </View>
      </View>

      {/* bottom sheet */}
      <View style={[styles.sheet, { paddingBottom: spacing.md }]}>
        {activeRide ? (
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
        ) : null}

        <DestinationTrigger pickupLabel={pickup.name} onPress={() => router.push('/ride/request')} />

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
              <MaterialIcons name="bookmark-border" size={16} color={colors.primaryDark} />
              <Text style={styles.quickText} numberOfLines={1}>
                {p.name}
              </Text>
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
  hello: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  sub: { fontSize: fontSize.sm, color: colors.textSubtle },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    gap: spacing.md,
  },
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  activeTitle: { color: '#fff', fontSize: fontSize.md, fontWeight: fontWeight.bold },
  activeSub: { color: 'rgba(255,255,255,0.7)', fontSize: fontSize.sm },
  quickRow: { flexDirection: 'row', gap: spacing.sm },
  quickChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...shadows.card,
  },
  quickText: { flex: 1, fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.text },
});

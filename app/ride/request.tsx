// Powered by OnSpace.AI
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { MapSurface, PlaceList, PriceStepper, Button, Card } from '@/components';
import type { MapPin } from '@/components';
import { useRide } from '@/hooks/useRide';
import { PLACES, CURRENCY } from '@/services/mockData';

export default function RequestScreen() {
  const router = useRouter();
  const {
    pickup,
    dropoff,
    distanceKm,
    durationMin,
    recommendedPrice,
    offeredPrice,
    setDropoff,
    adjustPrice,
    sendRequest,
  } = useRide();

  const handleSend = () => {
    sendRequest();
    router.push('/ride/offers');
  };

  if (!dropoff) {
    return (
      <View style={styles.container}>
        <View style={styles.searchHeader}>
          <View style={styles.fromRow}>
            <View style={styles.dotGreen} />
            <Text style={styles.fromText} numberOfLines={1}>
              {pickup.name}
            </Text>
          </View>
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={20} color={colors.textSubtle} />
            <Text style={styles.searchPlaceholder}>Alege destinația</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ padding: spacing.md }} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>Destinații populare</Text>
          <PlaceList places={PLACES} onSelect={setDropoff} />
        </ScrollView>
      </View>
    );
  }

  const pins: MapPin[] = [
    { x: pickup.x, y: pickup.y, kind: 'pickup', label: 'Plecare' },
    { x: dropoff.x, y: dropoff.y, kind: 'dropoff', label: dropoff.name },
  ];

  return (
    <View style={styles.container}>
      <MapSurface pins={pins} showRoute height={240} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.routeRow}>
            <View style={styles.dotGreen} />
            <Text style={styles.routeText} numberOfLines={1}>{pickup.name}</Text>
          </View>
          <View style={styles.connector} />
          <View style={styles.routeRow}>
            <View style={styles.dotDark} />
            <Text style={styles.routeText} numberOfLines={1}>{dropoff.name}</Text>
          </View>
          <View style={styles.statsRow}>
            <Stat icon="route" label={`${distanceKm} km`} />
            <Stat icon="schedule" label={`${durationMin} min`} />
            <Button label="Schimbă" size="sm" variant="ghost" onPress={() => setDropoff(pickup)} />
          </View>
        </Card>

        <Card>
          <Text style={styles.priceTitle}>Propune un preț</Text>
          <Text style={styles.priceSub}>
            Ajustează cu pașii de mai jos. Șoferii pot accepta sau face contraoferte.
          </Text>
          <View style={{ height: spacing.md }} />
          <PriceStepper value={offeredPrice} recommended={recommendedPrice} onAdjust={adjustPrice} />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={`Trimite cererea · ${offeredPrice} ${CURRENCY}`}
          fullWidth
          size="lg"
          icon="send"
          onPress={handleSend}
        />
      </View>
    </View>
  );
}

function Stat({ icon, label }: { icon: keyof typeof MaterialIcons.glyphMap; label: string }) {
  return (
    <View style={styles.stat}>
      <MaterialIcons name={icon} size={18} color={colors.textSubtle} />
      <Text style={styles.statText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchHeader: { padding: spacing.md, gap: spacing.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  fromRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  dotDark: { width: 10, height: 10, borderRadius: 2, backgroundColor: colors.ink },
  fromText: { fontSize: fontSize.sm, color: colors.textSubtle },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  searchPlaceholder: { fontSize: fontSize.md, color: colors.textSubtle },
  sectionLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSubtle, marginBottom: spacing.sm },
  body: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  routeText: { flex: 1, fontSize: fontSize.md, color: colors.text, fontWeight: fontWeight.medium },
  connector: { width: 1, height: 16, backgroundColor: colors.border, marginLeft: 4, marginVertical: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.md },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: fontSize.sm, color: colors.textSubtle },
  priceTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  priceSub: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 2 },
  footer: { padding: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});

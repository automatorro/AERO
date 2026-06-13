// AERO — Passenger Rides History
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Screen, Header } from '@/components';
import { useRide } from '@/hooks/useRide';
import { CURRENCY } from '@/services/mockData';

export default function PassengerRidesScreen() {
  const insets = useSafeAreaInsets();
  const { history } = useRide();

  return (
    <Screen>
      <Header title="Istoricul curselor" />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {history.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="receipt-long" size={48} color={colors.textFaint} />
            <Text style={styles.emptyTitle}>Nicio cursă încă</Text>
            <Text style={styles.emptyText}>Cursele tale vor apărea aici</Text>
          </View>
        ) : (
          history.map((ride) => (
            <View key={ride.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <MaterialIcons name="trip-origin" size={16} color={colors.success} />
                <View style={styles.route}>
                  <Text style={styles.addr} numberOfLines={1}>{ride.pickup.name}</Text>
                  <View style={styles.routeDot} />
                  <Text style={styles.addr} numberOfLines={1}>{ride.dropoff.name}</Text>
                </View>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.price}>{ride.finalPrice ?? ride.offeredPrice} {CURRENCY}</Text>
                <Text style={styles.date}>{new Date(ride.createdAt).toLocaleDateString('ro-RO')}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl },
  empty: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  emptyText: { fontSize: fontSize.sm, color: colors.textSubtle },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, gap: spacing.md,
  },
  cardLeft: { flex: 1, flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  route: { flex: 1, gap: 4 },
  addr: { fontSize: fontSize.sm, color: colors.text, fontWeight: fontWeight.medium },
  routeDot: { width: 1, height: 8, backgroundColor: colors.border, marginLeft: 2 },
  cardRight: { alignItems: 'flex-end', gap: 2 },
  price: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  date: { fontSize: fontSize.xs, color: colors.textFaint },
});

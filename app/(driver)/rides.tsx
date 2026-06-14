import { useI18n } from '@/contexts/I18nContext';
// AERO — Driver Rides History
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Screen, Header } from '@/components';
import { useRide } from '@/hooks/useRide';
import { CURRENCY } from '@/services/mockData';

export default function DriverRidesScreen() {
  const { t } = useI18n();
  const { history } = useRide();

  const totalEarnings = history.reduce((sum, r) => sum + (r.finalPrice ?? 0), 0);
  const avgRating = 4.9;

  return (
    <Screen>
      <Header title="Cursele mele" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sumar */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{history.length}</Text>
            <Text style={styles.summaryLabel}>{t('rides_total_rides')}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalEarnings} {CURRENCY}</Text>
            <Text style={styles.summaryLabel}>{t('rides_total_earnings')}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>★ {avgRating}</Text>
            <Text style={styles.summaryLabel}>{t('rides_average_rating')}</Text>
          </View>
        </View>

        {history.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="receipt-long" size={48} color={colors.textFaint} />
            <Text style={styles.emptyTitle}>{t('rides_empty_title')}</Text>
            <Text style={styles.emptyText}>{t('rides_empty_subtitle')}</Text>
          </View>
        ) : (
          history.map((ride) => (
            <View key={ride.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.pasenger}>{ride.offer?.driverName ?? 'Pasager'}</Text>
                <Text style={styles.price}>{ride.finalPrice ?? ride.offeredPrice} {CURRENCY}</Text>
              </View>
              <View style={styles.route}>
                <MaterialIcons name="trip-origin" size={14} color={colors.success} />
                <Text style={styles.addr} numberOfLines={1}>{ride.pickup.name}</Text>
              </View>
              <View style={styles.route}>
                <MaterialIcons name="place" size={14} color={colors.danger} />
                <Text style={styles.addr} numberOfLines={1}>{ride.dropoff.name}</Text>
              </View>
              <Text style={styles.date}>{new Date(ride.createdAt).toLocaleDateString('ro-RO')}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl },
  summary: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm,
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 4 },
  summaryValue: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  summaryLabel: { fontSize: fontSize.xs, color: colors.textFaint, textAlign: 'center' },
  summaryDivider: { width: 1, backgroundColor: colors.border, marginVertical: 4 },
  empty: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  emptyText: { fontSize: fontSize.sm, color: colors.textSubtle },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, gap: 6,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  pasenger: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.text },
  price: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.accent },
  route: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addr: { flex: 1, fontSize: fontSize.sm, color: colors.textSubtle },
  date: { fontSize: fontSize.xs, color: colors.textFaint, marginTop: 4 },
});

// Powered by OnSpace.AI
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Screen, Header, EmptyState, Badge } from '@/components';
import { useRide } from '@/hooks/useRide';
import { Ride } from '@/services/types';
import { CURRENCY } from '@/services/mockData';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function ActivityScreen() {
  const { history } = useRide();

  const renderItem = ({ item }: { item: Ride }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.price}>{item.finalPrice ?? item.offeredPrice} {CURRENCY}</Text>
      </View>
      <View style={styles.routeRow}>
        <View style={styles.dotGreen} />
        <Text style={styles.routeText} numberOfLines={1}>{item.pickup.name}</Text>
      </View>
      <View style={styles.connector} />
      <View style={styles.routeRow}>
        <View style={styles.dotDark} />
        <Text style={styles.routeText} numberOfLines={1}>{item.dropoff.name}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.meta}>{item.distanceKm} km · {item.durationMin} min</Text>
        <Badge label="Finalizată" tone="success" icon="check" />
      </View>
    </View>
  );

  return (
    <Screen>
      <Header title="Activitate" subtitle="Istoricul curselor tale" />
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={history.length === 0 ? styles.emptyWrap : styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            image={require('@/assets/images/empty-rides.png')}
            title="Nicio cursă încă"
            message="Cursele tale finalizate vor apărea aici, ca pasager sau ca șofer."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.md },
  emptyWrap: { flexGrow: 1, justifyContent: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  date: { fontSize: fontSize.sm, color: colors.textSubtle },
  price: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.primaryDark },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dotGreen: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary },
  dotDark: { width: 9, height: 9, borderRadius: 2, backgroundColor: colors.ink },
  connector: { width: 1, height: 14, backgroundColor: colors.border, marginLeft: 4 },
  routeText: { flex: 1, fontSize: fontSize.md, color: colors.text },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  meta: { fontSize: fontSize.sm, color: colors.textSubtle },
});

// Powered by OnSpace.AI
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { RideOffer } from '@/services/types';
import { CURRENCY } from '@/services/mockData';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/ui/Button';

interface OfferCardProps {
  offer: RideOffer;
  recommended: number;
  onAccept: (offer: RideOffer) => void;
}

export function OfferCard({ offer, recommended, onAccept }: OfferCardProps) {
  const extra = offer.price - recommended;
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Avatar name={offer.driverName} color={offer.avatarColor} size={48} />
        <View style={styles.info}>
          <Text style={styles.name}>{offer.driverName}</Text>
          <View style={styles.metaRow}>
            <RatingStars rating={offer.rating} />
            <Text style={styles.dot}>·</Text>
            <Text style={styles.meta}>{offer.trips} curse</Text>
          </View>
          <Text style={styles.vehicle}>
            {offer.vehicle} · {offer.plate}
          </Text>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.price}>{offer.price}</Text>
          <Text style={styles.currency}>{CURRENCY}</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.eta}>
          <MaterialIcons name="schedule" size={16} color={colors.textSubtle} />
          <Text style={styles.etaText}>{offer.etaMin} min până la tine</Text>
          {extra > 0 ? <Text style={styles.extra}>+{extra} {CURRENCY}</Text> : null}
        </View>
        <Button label="Acceptă cursa" size="sm" onPress={() => onAccept(offer)} icon="check" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1 },
  name: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  dot: { color: colors.textFaint },
  meta: { fontSize: fontSize.sm, color: colors.textSubtle },
  vehicle: { fontSize: fontSize.xs, color: colors.textFaint, marginTop: 2 },
  priceBox: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  price: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.primaryDark },
  currency: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.primaryDark },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  etaText: { fontSize: fontSize.sm, color: colors.textSubtle },
  extra: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.warning,
    marginLeft: 6,
  },
});

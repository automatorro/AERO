// Powered by OnSpace.AI
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { DriverRequest } from '@/services/types';
import { CURRENCY } from '@/services/mockData';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { useI18n } from '@/contexts/I18nContext';

interface DriverRequestCardProps {
  request: DriverRequest;
  onAccept: (req: DriverRequest, extra: number) => void;
  onIgnore: (id: string) => void;
}

// Drivers act only via predefined buttons. No keyboard input allowed.
export function DriverRequestCard({ request, onAccept, onIgnore }: DriverRequestCardProps) {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = require('react').useState(30);

  require('react').useEffect(() => {
    if (timeLeft <= 0) {
      onIgnore(request.id);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t: number) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, request.id, onIgnore]);

  return (
    <View style={styles.card}>
      {/* ProgressBar for countdown */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(timeLeft / 30) * 100}%` }]} />
      </View>
      <View style={styles.top}>
        <Avatar name={request.passengerName} color={request.avatarColor} size={44} />
        <View style={styles.info}>
          <Text style={styles.name}>{request.passengerName}</Text>
          <RatingStars rating={request.rating} />
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.price}>{request.offeredPrice}</Text>
          <Text style={styles.currency}>{CURRENCY}</Text>
        </View>
      </View>

      <View style={styles.route}>
        <View style={styles.routeRow}>
          <View style={styles.dotGreen} />
          <Text style={styles.routeText} numberOfLines={1}>{request.pickup.name}</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routeRow}>
          <View style={styles.dotDark} />
          <Text style={styles.routeText} numberOfLines={1}>{request.dropoff.name}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat icon="route" value={`${request.distanceKm} km`} />
        <Stat icon="schedule" value={`${request.durationMin} min`} />
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => onIgnore(request.id)}
          style={({ pressed }) => [styles.ignore, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={styles.ignoreText}>{t('driver_card_btn_ignore')}</Text>
        </Pressable>
        <Pressable
          onPress={() => onAccept(request, 5)}
          style={({ pressed }) => [styles.counter, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={styles.counterText}>+5 {CURRENCY}</Text>
        </Pressable>
        <Pressable
          onPress={() => onAccept(request, 10)}
          style={({ pressed }) => [styles.counter, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={styles.counterText}>+10 {CURRENCY}</Text>
        </Pressable>
        <Pressable
          onPress={() => onAccept(request, 0)}
          style={({ pressed }) => [styles.accept, { opacity: pressed ? 0.85 : 1 }]}
        >
          <MaterialIcons name="check" size={18} color="#fff" />
          <Text style={styles.acceptText}>{t('driver_card_btn_accept')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Stat({ icon, value }: { icon: keyof typeof MaterialIcons.glyphMap; value: string }) {
  return (
    <View style={styles.stat}>
      <MaterialIcons name={icon} size={16} color={colors.textSubtle} />
      <Text style={styles.statText}>{value}</Text>
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
    overflow: 'hidden',
  },
  progressTrack: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 4,
    backgroundColor: colors.surfaceAlt,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xs },
  info: { flex: 1, gap: 2 },
  name: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  priceBox: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  price: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.primary },
  currency: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.primary },
  route: { gap: 2 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dotGreen: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary },
  dotDark: { width: 9, height: 9, borderRadius: 2, backgroundColor: colors.ink },
  routeLine: { width: 1, height: 14, backgroundColor: colors.border, marginLeft: 4 },
  routeText: { flex: 1, fontSize: fontSize.sm, color: colors.text },
  statsRow: { flexDirection: 'row', gap: spacing.lg },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: fontSize.sm, color: colors.textSubtle },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ignore: { paddingVertical: 10, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt },
  ignoreText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSubtle },
  counter: { paddingVertical: 10, paddingHorizontal: spacing.sm, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.borderStrong },
  counterText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.text },
  accept: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  acceptText: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#fff' },
});

// Powered by OnSpace.AI
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, shadows, spacing } from '@/constants/theme';

interface DestinationTriggerProps {
  onPress: () => void;
  pickupLabel: string;
}

export function DestinationTrigger({ onPress, pickupLabel }: DestinationTriggerProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, { opacity: pressed ? 0.95 : 1 }]}
    >
      <View style={styles.locRow}>
        <View style={styles.dotGreen} />
        <Text style={styles.pickup} numberOfLines={1}>
          {pickupLabel}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.searchRow}>
        <MaterialIcons name="search" size={22} color={colors.textSubtle} />
        <Text style={styles.searchText}>Unde mergi?</Text>
        <View style={styles.now}>
          <MaterialIcons name="schedule" size={16} color={colors.primaryDark} />
          <Text style={styles.nowText}>Acum</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.float,
  },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  pickup: { flex: 1, fontSize: fontSize.sm, color: colors.textSubtle },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 18 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  searchText: { flex: 1, fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text },
  now: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  nowText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.primaryDark },
});

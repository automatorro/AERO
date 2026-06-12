// Powered by OnSpace.AI
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { CURRENCY } from '@/services/mockData';

interface PriceStepperProps {
  value: number;
  recommended: number;
  onAdjust: (deltaPct: number) => void;
}

const STEPS = [-20, -10, 10, 20];

export function PriceStepper({ value, recommended, onAdjust }: PriceStepperProps) {
  const isRecommended = value === recommended;
  return (
    <View style={styles.wrap}>
      <View style={styles.priceRow}>
        <Pressable
          onPress={() => onAdjust(-10)}
          hitSlop={8}
          style={({ pressed }) => [styles.round, { opacity: pressed ? 0.7 : 1 }]}
        >
          <MaterialIcons name="remove" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.priceCenter}>
          <Text style={styles.price}>
            {value} <Text style={styles.currency}>{CURRENCY}</Text>
          </Text>
          <Text style={styles.hint}>
            {isRecommended ? 'Preț recomandat' : `Recomandat: ${recommended} ${CURRENCY}`}
          </Text>
        </View>

        <Pressable
          onPress={() => onAdjust(10)}
          hitSlop={8}
          style={({ pressed }) => [styles.round, styles.roundPrimary, { opacity: pressed ? 0.7 : 1 }]}
        >
          <MaterialIcons name="add" size={24} color={colors.textInverse} />
        </Pressable>
      </View>

      <View style={styles.chips}>
        {STEPS.map((s) => (
          <Pressable
            key={s}
            onPress={() => onAdjust(s)}
            style={({ pressed }) => [styles.chip, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={styles.chipText}>{s > 0 ? `+${s}%` : `${s}%`}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  round: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundPrimary: { backgroundColor: colors.primary },
  priceCenter: { alignItems: 'center', flex: 1 },
  price: { fontSize: fontSize.display, fontWeight: fontWeight.bold, color: colors.text, includeFontPadding: false },
  currency: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.textSubtle },
  hint: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 2 },
  chips: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
  },
  chipText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.text },
});

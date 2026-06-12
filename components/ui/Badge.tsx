// Powered by OnSpace.AI
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'primary';

const TONE: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.surfaceAlt, fg: colors.textSubtle },
  success: { bg: colors.successSoft, fg: colors.success },
  warning: { bg: colors.warningSoft, fg: '#B45309' },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  primary: { bg: colors.primarySoft, fg: colors.primaryDark },
};

interface BadgeProps {
  label: string;
  tone?: Tone;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export function Badge({ label, tone = 'neutral', icon }: BadgeProps) {
  const c = TONE[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      {icon ? <MaterialIcons name={icon} size={13} color={c.fg} /> : null}
      <Text style={[styles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, includeFontPadding: false },
});

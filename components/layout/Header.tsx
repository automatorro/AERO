// Powered by OnSpace.AI
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '@/constants/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function Header({ title, subtitle, right }: HeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  left: { flex: 1 },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, includeFontPadding: false },
  subtitle: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 2 },
});

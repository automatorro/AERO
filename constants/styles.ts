// Powered by OnSpace.AI
import { StyleSheet } from 'react-native';
import { colors, radius, spacing, shadows, fontSize, fontWeight } from './theme';

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    includeFontPadding: false,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    includeFontPadding: false,
  },
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    color: colors.text,
    lineHeight: fontSize.md * 1.6,
    includeFontPadding: false,
  },
  subtle: {
    fontSize: fontSize.sm,
    color: colors.textSubtle,
    includeFontPadding: false,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});

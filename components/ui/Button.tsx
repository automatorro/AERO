// Powered by OnSpace.AI
import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
}

const BG: Record<Variant, string> = {
  primary: colors.primary,
  dark: colors.ink,
  outline: 'transparent',
  ghost: 'transparent',
  danger: colors.danger,
  success: colors.success,
};

const FG: Record<Variant, string> = {
  primary: colors.textInverse,
  dark: colors.textInverse,
  outline: colors.text,
  ghost: colors.primaryDark,
  danger: colors.textInverse,
  success: colors.textInverse,
};

const HEIGHTS: Record<Size, number> = { sm: 40, md: 50, lg: 58 };

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled,
  loading,
  fullWidth,
  style,
}: ButtonProps) {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      hitSlop={6}
      style={({ pressed }) => [
        styles.base,
        {
          height: HEIGHTS[size],
          backgroundColor: BG[variant],
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          borderWidth: isOutline ? 1.5 : 0,
          borderColor: colors.borderStrong,
        },
        fullWidth ? styles.full : null,
        style as ViewStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={FG[variant]} />
      ) : (
        <>
          {icon ? <MaterialIcons name={icon} size={size === 'sm' ? 18 : 20} color={FG[variant]} /> : null}
          <Text style={[styles.label, { color: FG[variant], fontSize: size === 'sm' ? fontSize.sm : fontSize.md }]}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  full: { alignSelf: 'stretch' },
  label: { fontWeight: fontWeight.semibold, includeFontPadding: false },
});

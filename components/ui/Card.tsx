// Powered by OnSpace.AI
import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '@/constants/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  floating?: boolean;
  padded?: boolean;
}

export function Card({ children, style, floating, padded = true }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        padded ? styles.padded : null,
        floating ? shadows.float : shadows.card,
        style as ViewStyle,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  padded: { padding: spacing.md },
});

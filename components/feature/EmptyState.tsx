// Powered by OnSpace.AI
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, fontSize, fontWeight, spacing } from '@/constants/theme';

interface EmptyStateProps {
  image: number;
  title: string;
  message: string;
}

export function EmptyState({ image, title, message }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Image source={image} style={styles.image} contentFit="contain" transition={200} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  image: { width: 160, height: 160, marginBottom: spacing.sm },
  title: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  message: { fontSize: fontSize.sm, color: colors.textSubtle, textAlign: 'center', lineHeight: fontSize.sm * 1.6 },
});

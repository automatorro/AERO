// Powered by OnSpace.AI
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight } from '@/constants/theme';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

export function RatingStars({ rating, size = 14, showValue = true }: RatingStarsProps) {
  return (
    <View style={styles.row}>
      <MaterialIcons name="star" size={size} color={colors.warning} />
      {showValue ? <Text style={[styles.text, { fontSize: size }]}>{rating.toFixed(1)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  text: { color: colors.text, fontWeight: fontWeight.semibold, includeFontPadding: false },
});

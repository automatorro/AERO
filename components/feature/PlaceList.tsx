// Powered by OnSpace.AI
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Place } from '@/services/types';

interface PlaceListProps {
  places: Place[];
  onSelect: (place: Place) => void;
}

export function PlaceList({ places, onSelect }: PlaceListProps) {
  return (
    <View>
      {places.map((place) => (
        <Pressable
          key={place.id}
          onPress={() => onSelect(place)}
          style={({ pressed }) => [styles.row, { backgroundColor: pressed ? colors.surfaceAlt : 'transparent' }]}
        >
          <View style={styles.icon}>
            <MaterialIcons name="place" size={20} color={colors.textSubtle} />
          </View>
          <View style={styles.text}>
            <Text style={styles.name}>{place.name}</Text>
            <Text style={styles.address} numberOfLines={1}>
              {place.address}
            </Text>
          </View>
          <MaterialIcons name="north-east" size={18} color={colors.textFaint} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  name: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  address: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 1 },
});

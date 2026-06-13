// AERO — Passenger Saved Locations (Passes tab)
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Screen, Header } from '@/components';

const SAVED = [
  { id: '1', label: 'Acasă', icon: 'home' as const, address: 'Str. Lipscani 12, București' },
  { id: '2', label: 'Serviciu', icon: 'work' as const, address: 'Bd. Magheru 28, București' },
];

export default function PassengerPassesScreen() {
  return (
    <Screen>
      <Header title="Locații favorite" />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {SAVED.map((loc) => (
          <View key={loc.id} style={styles.card}>
            <View style={styles.iconBox}>
              <MaterialIcons name={loc.icon} size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{loc.label}</Text>
              <Text style={styles.addr}>{loc.address}</Text>
            </View>
            <Pressable hitSlop={8}>
              <MaterialIcons name="more-vert" size={20} color={colors.textFaint} />
            </Pressable>
          </View>
        ))}
        <Pressable style={styles.addBtn}>
          <MaterialIcons name="add" size={20} color={colors.primary} />
          <Text style={styles.addText}>Adaugă locație</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  iconBox: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center',
  },
  label: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  addr: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 2 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, borderWidth: 1.5, borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addText: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.primary },
});

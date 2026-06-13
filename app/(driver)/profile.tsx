// AERO — Driver Profile
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAlert } from '@/template';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Screen, Header, Badge, Card } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { getSharedSupabaseClient } from '@/template/core/client';
import { useRouter } from 'expo-router';

const DOC_ITEMS = [
  { id: 'license', label: 'Permis de conducere' },
  { id: 'id', label: 'Carte de identitate' },
  { id: 'insurance', label: 'Asigurare RCA' },
  { id: 'itp', label: 'ITP' },
];

export default function DriverProfileScreen() {
  const { showAlert } = useAlert();
  const { user, isTrialActive, trialDaysLeft, deleteAccount } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const approved = user.driverStatus === 'approved';

  const handleLogout = async () => {
    showAlert('Deconectare', 'Ești sigur?', [
      { text: 'Anulează', style: 'cancel' },
      { text: 'Deconectează-mă', onPress: async () => {
        try { await getSharedSupabaseClient().auth.signOut(); } catch {}
        router.replace('/(auth)');
      }},
    ]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header title="Profilul meu" />

        {/* Profile card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user.name ?? 'S').charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.phone}>{user.phone}</Text>
            <View style={styles.badgeRow}>
              <Badge label="Șofer" tone="primary" icon="local-taxi" />
              {approved && isTrialActive ? <Badge label={`Trial ${trialDaysLeft}z`} tone="success" icon="schedule" /> : null}
              {!approved && user.driverStatus === 'pending' ? <Badge label="În verificare" tone="warning" icon="hourglass-top" /> : null}
            </View>
          </View>
        </Card>

        {/* Vehicul */}
        {user.vehicle && (
          <>
            <Text style={styles.sectionLabel}>Vehicul</Text>
            <Card style={styles.vehicleCard}>
              <View style={styles.vehicleRow}>
                <MaterialIcons name="directions-car" size={22} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.vehicleTitle}>{user.vehicle.make} {user.vehicle.model}</Text>
                  <Text style={styles.vehiclePlate}>{user.vehicle.plate}</Text>
                </View>
              </View>
            </Card>
          </>
        )}

        {/* Documente */}
        <Text style={styles.sectionLabel}>Documente</Text>
        <View style={styles.group}>
          {DOC_ITEMS.map((doc, idx) => (
            <View key={doc.id}>
              {idx > 0 && <View style={styles.divider} />}
              <Pressable style={styles.docRow} onPress={() => showAlert(doc.label, 'Re-upload document disponibil în curând.')}>
                <View style={styles.docIcon}>
                  <MaterialIcons name="description" size={18} color={colors.textSubtle} />
                </View>
                <Text style={styles.docLabel}>{doc.label}</Text>
                <MaterialIcons
                  name={approved ? 'check-circle' : 'hourglass-top'}
                  size={18}
                  color={approved ? colors.success : colors.warning}
                />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Setări */}
        <Text style={styles.sectionLabel}>Setări</Text>
        <View style={styles.group}>
          <Row icon="language" label="Limbă" hint="Română" onPress={() => showAlert('Limbă', 'i18n — în curând.')} />
          <View style={styles.divider} />
          <Row icon="notifications" label="Notificări" onPress={() => showAlert('Notificări', 'Setări notificări — în curând.')} />
          <View style={styles.divider} />
          <Row icon="help-outline" label="Ajutor și suport" onPress={() => showAlert('Suport', 'contact@aero.app')} />
        </View>

        <Text style={styles.sectionLabel}>Cont</Text>
        <View style={styles.group}>
          <Row icon="logout" label="Deconectare" onPress={handleLogout} />
          <View style={styles.divider} />
          <Row icon="delete-outline" label="Șterge contul" tone="danger" onPress={() => {
            showAlert('Șterge contul', 'Această acțiune este ireversibilă. Continui?', [
              { text: 'Anulează', style: 'cancel' },
              { text: 'Șterge', style: 'destructive', onPress: () => { deleteAccount(); router.replace('/(auth)'); }},
            ]);
          }} />
        </View>

        <Text style={styles.footerNote}>AERO · Marketplace ridesharing · Comision 0%</Text>
      </ScrollView>
    </Screen>
  );
}

function Row({ icon, label, hint, onPress, tone }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; hint?: string; onPress: () => void; tone?: 'danger' }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={[styles.rowIcon, tone === 'danger' ? { backgroundColor: colors.dangerSoft } : null]}>
        <MaterialIcons name={icon} size={20} color={tone === 'danger' ? colors.danger : colors.textSubtle} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: tone === 'danger' ? colors.danger : colors.text }]}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      <MaterialIcons name="chevron-right" size={22} color={colors.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xl, gap: spacing.sm },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginHorizontal: spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 26, fontWeight: fontWeight.bold },
  name: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  phone: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
  sectionLabel: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.textFaint, marginHorizontal: spacing.md, marginTop: spacing.md, textTransform: 'uppercase', letterSpacing: 1 },
  vehicleCard: { marginHorizontal: spacing.md },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  vehicleTitle: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  vehiclePlate: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 2, fontFamily: 'monospace' },
  group: { backgroundColor: colors.surface, borderRadius: radius.lg, marginHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  docIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  docLabel: { flex: 1, fontSize: fontSize.md, color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  rowIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: fontSize.md, fontWeight: fontWeight.medium },
  rowHint: { fontSize: fontSize.xs, color: colors.textSubtle, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 68 },
  footerNote: { textAlign: 'center', fontSize: fontSize.xs, color: colors.textFaint, marginTop: spacing.lg },
});

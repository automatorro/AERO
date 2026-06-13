// AERO — Passenger Profile
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAlert } from '@/template';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Screen, Header, Badge, Card } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { getSharedSupabaseClient } from '@/template/core/client';
import { useRouter } from 'expo-router';

export default function PassengerProfileScreen() {
  const { showAlert } = useAlert();
  const { user, deleteAccount } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    showAlert('Deconectare', 'Ești sigur că vrei să te deconectezi?', [
      { text: 'Anulează', style: 'cancel' },
      {
        text: 'Deconectează-mă',
        onPress: async () => {
          try {
            await getSharedSupabaseClient().auth.signOut();
          } catch {}
          router.replace('/(auth)');
        },
      },
    ]);
  };

  const confirmDelete = () => {
    showAlert(
      'Șterge contul',
      'Datele tale vor fi șterse ireversibil. Continui?',
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Șterge contul',
          style: 'destructive',
          onPress: () => {
            deleteAccount();
            router.replace('/(auth)');
            showAlert('Cont șters', 'Datele tale au fost anonimizate.');
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header title="Profilul meu" />

        {/* Profile card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user.name ?? 'A').charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.phone}>{user.phone}</Text>
            <View style={styles.badgeRow}>
              <Badge label="Pasager" tone="primary" icon="person" />
              <Badge label={`★ ${user.rating?.toFixed(1) ?? '5.0'}`} tone="primary" icon="star" />
            </View>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Cont</Text>
        <View style={styles.group}>
          <Row icon="payment" label="Metode de plată" hint="Carduri salvate" onPress={() => showAlert('Plăți', 'Funcționalitate Stripe — disponibil în curând.')} />
          <Divider />
          <Row icon="person-pin" label="Contact de urgență" hint="Folosit pentru butonul SOS" onPress={() => showAlert('SOS', 'Adaugă un contact de urgență din setări.')} />
          <Divider />
          <Row icon="language" label="Limbă" hint="Română" onPress={() => showAlert('Limbă', 'Funcționalitate i18n — disponibil în curând.')} />
          <Divider />
          <Row icon="help-outline" label="Ajutor și suport" onPress={() => showAlert('Suport', 'contact@aero.app')} />
        </View>

        <Text style={styles.sectionLabel}>Cont</Text>
        <View style={styles.group}>
          <Row icon="logout" label="Deconectare" onPress={handleLogout} />
          <Divider />
          <Row icon="delete-outline" label="Șterge contul" tone="danger" onPress={confirmDelete} />
        </View>

        <Text style={styles.footerNote}>AERO · Marketplace ridesharing · Comision 0%</Text>
      </ScrollView>
    </Screen>
  );
}

function Row({ icon, label, hint, onPress, tone }: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  hint?: string;
  onPress: () => void;
  tone?: 'danger';
}) {
  const textColor = tone === 'danger' ? colors.danger : colors.text;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={[styles.rowIcon, tone === 'danger' ? { backgroundColor: colors.dangerSoft } : null]}>
        <MaterialIcons name={icon} size={20} color={tone === 'danger' ? colors.danger : colors.textSubtle} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: textColor }]}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      <MaterialIcons name="chevron-right" size={22} color={colors.textFaint} />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xl, gap: spacing.sm },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginHorizontal: spacing.md },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 26, fontWeight: fontWeight.bold },
  name: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  phone: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  sectionLabel: {
    fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.textFaint,
    marginHorizontal: spacing.md, marginTop: spacing.md,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  group: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    marginHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  rowIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center',
  },
  rowLabel: { fontSize: fontSize.md, fontWeight: fontWeight.medium },
  rowHint: { fontSize: fontSize.xs, color: colors.textSubtle, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 68 },
  footerNote: { textAlign: 'center', fontSize: fontSize.xs, color: colors.textFaint, marginTop: spacing.lg },
});

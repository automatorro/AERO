// Powered by OnSpace.AI
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAlert } from '@/template';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Screen, Header, Avatar, Badge, Card } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/services/types';

export default function AccountScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { user, isTrialActive, trialDaysLeft, safetyActions, setRole, deleteAccount } = useAuth();

  if (!user) return null;
  const approved = user.driverStatus === 'approved';

  const handleRole = (role: UserRole) => {
    if (role === 'driver' && !approved) {
      showAlert('Mod Șofer', 'Trebuie să fii aprobat ca șofer mai întâi.', [
        { text: 'Anulează', style: 'cancel' },
        { text: 'Devino Șofer', onPress: () => router.push('/(tabs)/drive') },
      ]);
      return;
    }
    setRole(role);
  };

  const confirmDelete = () => {
    showAlert(
      'Șterge contul',
      'Datele tale vor fi șterse / anonimizate imediat și ireversibil. Continui?',
      [
        { text: 'Anulează', style: 'cancel' },
        { text: 'Șterge contul', style: 'destructive', onPress: () => { deleteAccount(); showAlert('Cont șters', 'Datele tale au fost anonimizate.'); } },
      ],
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header title="Cont" />

        <Card style={styles.profile}>
          <Avatar name={user.name} color={user.avatarColor} size={60} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.phone}>{user.phone}</Text>
            <View style={styles.badgeRow}>
              <Badge label={user.role === 'driver' ? 'Șofer' : 'Pasager'} tone="primary" icon="person" />
              {approved && isTrialActive ? <Badge label={`Trial ${trialDaysLeft}z`} tone="success" icon="schedule" /> : null}
            </View>
          </View>
        </Card>

        {/* Role switch */}
        <Text style={styles.sectionLabel}>Mod aplicație</Text>
        <View style={styles.segment}>
          {(['passenger', 'driver'] as UserRole[]).map((role) => {
            const active = user.role === role;
            return (
              <Pressable
                key={role}
                onPress={() => handleRole(role)}
                style={[styles.segmentItem, active ? styles.segmentActive : null]}
              >
                <MaterialIcons
                  name={role === 'passenger' ? 'airline-seat-recline-normal' : 'local-taxi'}
                  size={18}
                  color={active ? '#fff' : colors.textSubtle}
                />
                <Text style={[styles.segmentText, active ? styles.segmentTextActive : null]}>
                  {role === 'passenger' ? 'Pasager' : 'Șofer'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {!approved ? (
          <Row icon="badge" label="Devino Șofer" hint="Înregistrare și verificare KYC" onPress={() => router.push('/(tabs)/drive')} />
        ) : null}

        {/* Safety & settings */}
        <Text style={styles.sectionLabel}>Siguranță și confidențialitate</Text>
        <View style={styles.group}>
          <Row icon="shield" label="Raportări și blocări" hint={`${safetyActions.length} înregistrate`} onPress={() => showAlert('Trust & Safety', safetyActions.length ? safetyActions.map((a) => `${a.type === 'report' ? 'Raport' : 'Blocare'}: ${a.targetName}`).join('\n') : 'Nicio acțiune înregistrată.')} />
          <Divider />
          <Row icon="lock" label="Permisiuni locație" hint="Doar cât folosești aplicația / Online" onPress={() => showAlert('Locație', 'Locația în fundal este folosită doar cât ești șofer Online.')} />
        </View>

        <Text style={styles.sectionLabel}>Cont</Text>
        <View style={styles.group}>
          <Row icon="help-outline" label="Ajutor și suport" onPress={() => showAlert('Suport', 'Pentru asistență: contact@onspace.ai')} />
          <Divider />
          <Row icon="delete-outline" label="Șterge contul" tone="danger" onPress={confirmDelete} />
        </View>

        <Text style={styles.footerNote}>AERO · versiune demo · comision 0%</Text>
      </ScrollView>
    </Screen>
  );
}

function Row({
  icon,
  label,
  hint,
  onPress,
  tone,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  hint?: string;
  onPress: () => void;
  tone?: 'danger';
}) {
  const color = tone === 'danger' ? colors.danger : colors.text;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={[styles.rowIcon, tone === 'danger' ? { backgroundColor: colors.dangerSoft } : null]}>
        <MaterialIcons name={icon} size={20} color={tone === 'danger' ? colors.danger : colors.textSubtle} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color }]}>{label}</Text>
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
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginHorizontal: spacing.md },
  name: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  phone: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 1 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  sectionLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSubtle, marginHorizontal: spacing.md, marginTop: spacing.md },
  segment: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, padding: 4, marginHorizontal: spacing.md },
  segmentItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: radius.pill },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSubtle },
  segmentTextActive: { color: '#fff' },
  group: { backgroundColor: colors.surface, borderRadius: radius.lg, marginHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  rowIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: fontSize.md, fontWeight: fontWeight.medium },
  rowHint: { fontSize: fontSize.xs, color: colors.textSubtle, marginTop: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 68 },
  footerNote: { textAlign: 'center', fontSize: fontSize.xs, color: colors.textFaint, marginTop: spacing.lg },
});

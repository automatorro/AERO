import { useI18n } from '@/contexts/I18nContext';
// AERO — Admin: Settings / Config
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { spacing, fontSize, fontWeight, radius } from '@/constants/theme';
import { useAlert } from '@/template';
import { getSharedSupabaseClient } from '@/template/core/client';

export default function AdminSettings() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const handleLogout = async () => {
    try { await getSharedSupabaseClient().auth.signOut(); } catch {}
    router.replace('/(auth)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>{t('admin_settings_title')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin_settings_section_platform')}</Text>
        <View style={styles.card}>
          <Row icon="info" label="Versiune" value="1.0.0-beta" />
          <View style={styles.divider} />
          <Row icon="dns" label="Supabase Project" value="uyjmabxpbfweskilvecr" />
          <View style={styles.divider} />
          <Row icon="cloud" label="API Status" value="Online" valueColor="#22C55E" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin_settings_section_pricing')}</Text>
        <View style={styles.card}>
          <Row icon="attach-money" label={t('admin_settings_label_min_price')} value="5 RON" />
          <View style={styles.divider} />
          <Row icon="credit-card" label="Abonament lunar" value="50 RON" />
          <View style={styles.divider} />
          <Row icon="percent" label={t('admin_settings_label_commission')} value="0%" />
          <View style={styles.divider} />
          <Row icon="card-giftcard" label="Trial (luni)" value="3" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin_settings_section_actions')}</Text>
        <Pressable style={styles.dangerBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#FFF" />
          <Text style={styles.dangerBtnText}>{t('admin_settings_btn_logout')}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Row({ icon, label, value, valueColor }: { icon: any; label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.row}>
      <MaterialIcons name={icon} size={20} color="#888" />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: '#111111', borderBottomWidth: 1, borderColor: '#2A2A2A' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.xl },
  sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#888', marginBottom: spacing.sm, marginLeft: spacing.sm },
  card: { backgroundColor: '#1A1A1A', borderRadius: radius.lg, borderWidth: 1, borderColor: '#2A2A2A', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  rowLabel: { flex: 1, fontSize: fontSize.md, color: '#CCC', fontWeight: fontWeight.medium },
  rowValue: { fontSize: fontSize.md, color: '#FFF', fontWeight: fontWeight.bold },
  divider: { height: 1, backgroundColor: '#2A2A2A', marginLeft: 44 },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: '#EF4444', borderRadius: radius.lg, paddingVertical: 14, marginTop: spacing.sm,
  },
  dangerBtnText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#FFF' },
});

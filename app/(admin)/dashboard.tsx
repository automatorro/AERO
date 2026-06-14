import { useI18n } from '@/contexts/I18nContext';
// AERO — Admin Dashboard
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { getSharedSupabaseClient } from '@/template/core/client';
import { spacing, fontSize, fontWeight, radius, shadows } from '@/constants/theme';

interface Stats {
  totalUsers: number;
  totalDrivers: number;
  pendingDrivers: number;
  totalRides: number;
  activeRides: number;
  sosAlerts: number;
}

function StatCard({ icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <MaterialIcons name={icon} size={28} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function AdminDashboard() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, totalDrivers: 0, pendingDrivers: 0,
    totalRides: 0, activeRides: 0, sosAlerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const client = getSharedSupabaseClient();

      const [usersRes, driversRes, pendingRes, ridesRes, activeRes, sosRes] = await Promise.all([
        client.from('user_profiles').select('id', { count: 'exact', head: true }),
        client.from('user_profiles').select('id', { count: 'exact', head: true }).eq('role', 'driver'),
        client.from('user_profiles').select('id', { count: 'exact', head: true }).eq('driver_status', 'pending'),
        client.from('ride_requests').select('id', { count: 'exact', head: true }),
        client.from('ride_requests').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        client.from('safety_actions').select('id', { count: 'exact', head: true }).eq('type', 'sos'),
      ]);

      setStats({
        totalUsers: usersRes.count ?? 0,
        totalDrivers: driversRes.count ?? 0,
        pendingDrivers: pendingRes.count ?? 0,
        totalRides: ridesRes.count ?? 0,
        activeRides: activeRes.count ?? 0,
        sosAlerts: sosRes.count ?? 0,
      });
    } catch (e) {
      console.warn('Admin stats error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.logo}>AERO</Text>
        <Text style={styles.headerTitle}>{t('admin_dash_title')}</Text>
      </View>

      <View style={styles.grid}>
        <StatCard icon="people" label="Total Utilizatori" value={stats.totalUsers} color="#3B82F6" />
        <StatCard icon="local-taxi" label={t('admin_dash_active_drivers')} value={stats.totalDrivers} color="#22C55E" />
        <StatCard icon="pending" label={t('admin_dash_pending_drivers')} value={stats.pendingDrivers} color="#F59E0B" />
        <StatCard icon="receipt-long" label="Total Curse" value={stats.totalRides} color="#8B5CF6" />
        <StatCard icon="play-circle" label="Curse Active" value={stats.activeRides} color="#06B6D4" />
        <StatCard icon="warning" label="Alerte SOS" value={stats.sosAlerts} color="#EF4444" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin_dash_actions_title')}</Text>
        <Text style={styles.infoText}>
          {t('admin_dash_actions_desc')}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.lg,
    backgroundColor: '#111111', borderBottomWidth: 1, borderColor: '#2A2A2A',
  },
  logo: { fontSize: 20, fontWeight: '800', color: '#F97316', letterSpacing: 3 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFF', marginTop: 4 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', padding: spacing.md, gap: spacing.md,
  },
  statCard: {
    width: '47%', backgroundColor: '#1A1A1A', borderRadius: radius.lg,
    padding: spacing.md, borderLeftWidth: 4, gap: 6,
    ...shadows.card,
  },
  statValue: { fontSize: 32, fontWeight: '900', color: '#FFF' },
  statLabel: { fontSize: 12, color: '#AAA', fontWeight: fontWeight.medium },
  section: { padding: spacing.lg },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: '#FFF', marginBottom: spacing.sm },
  infoText: { fontSize: fontSize.sm, color: '#888', lineHeight: 20 },
});

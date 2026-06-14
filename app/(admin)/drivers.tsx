import { useI18n } from '@/contexts/I18nContext';
// AERO — Admin: Verificare Șoferi
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { getSharedSupabaseClient } from '@/template/core/client';
import { spacing, fontSize, fontWeight, radius } from '@/constants/theme';
import { useAlert } from '@/template';

interface DriverRow {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  driver_status: string;
  vehicle: any;
  created_at: string;
}

export default function AdminDrivers() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [drivers, setDrivers] = useState<DriverRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');

  useEffect(() => {
    fetchDrivers();
  }, [filter]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const client = getSharedSupabaseClient();
      let query = client.from('user_profiles').select('*').eq('role', 'driver');
      if (filter !== 'all') {
        query = query.eq('driver_status', filter);
      }
      const { data, error } = await query.order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      setDrivers((data ?? []) as DriverRow[]);
    } catch (e) {
      console.warn('Admin drivers error:', e);
    } finally {
      setLoading(false);
    }
  };

  const approveDriver = async (driverId: string) => {
    try {
      const client = getSharedSupabaseClient();
      const trialEnd = new Date();
      trialEnd.setMonth(trialEnd.getMonth() + 3);
      
      const { error } = await client.from('user_profiles').update({
        driver_status: 'approved',
        trial_ends_at: trialEnd.toISOString(),
      }).eq('id', driverId);

      if (error) throw error;
      showAlert(t('admin_drivers_approved_alert_title'), t('admin_drivers_approved_alert'));
      fetchDrivers();
    } catch (e) {
      showAlert(t('common_error'), t('admin_drivers_error_approve'));
    }
  };

  const rejectDriver = async (driverId: string) => {
    try {
      const client = getSharedSupabaseClient();
      const { error } = await client.from('user_profiles').update({
        driver_status: 'none',
      }).eq('id', driverId);
      if (error) throw error;
      showAlert(t('admin_drivers_rejected_alert_title'), t('admin_drivers_rejected_alert'));
      fetchDrivers();
    } catch (e) {
      showAlert(t('common_error'), t('admin_drivers_error_reject'));
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>{t('admin_drivers_title')}</Text>
        <View style={styles.filterRow}>
          {(['pending', 'approved', 'all'] as const).map(f => (
            <Pressable
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'pending' ? t('admin_drivers_filter_pending') : f === 'approved' ? t('admin_drivers_filter_approved') : t('admin_drivers_filter_all')}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl }}>
        {loading ? (
          <ActivityIndicator color="#F97316" size="large" style={{ marginTop: 40 }} />
        ) : drivers.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MaterialIcons name="check-circle" size={48} color="#22C55E" />
            <Text style={styles.emptyText}>{t('admin_drivers_empty')}</Text>
          </View>
        ) : (
          drivers.map(d => (
            <View key={d.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.avatar, { backgroundColor: '#F97316' }]}>
                  <Text style={styles.avatarText}>{(d.name || d.email)?.[0]?.toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{d.name || d.email}</Text>
                  <Text style={styles.driverSub}>{d.email}</Text>
                  {d.phone && <Text style={styles.driverSub}>{d.phone}</Text>}
                </View>
                <View style={[styles.statusBadge, d.driver_status === 'approved' ? styles.badgeGreen : styles.badgeYellow]}>
                  <Text style={styles.statusText}>
                    {d.driver_status === 'approved' ? 'Aprobat' : d.driver_status === 'pending' ? 'Pending' : d.driver_status}
                  </Text>
                </View>
              </View>

              {d.vehicle && (
                <View style={styles.vehicleRow}>
                  <MaterialIcons name="directions-car" size={16} color="#888" />
                  <Text style={styles.vehicleText}>
                    {d.vehicle.brand} {d.vehicle.model} · {d.vehicle.color} · {d.vehicle.plate}
                  </Text>
                </View>
              )}

              {d.driver_status === 'pending' && (
                <View style={styles.actionsRow}>
                  <Pressable style={[styles.actionBtn, styles.approveBtn]} onPress={() => approveDriver(d.id)}>
                    <MaterialIcons name="check" size={18} color="#FFF" />
                    <Text style={styles.actionText}>{t('admin_drivers_btn_approve')}</Text>
                  </Pressable>
                  <Pressable style={[styles.actionBtn, styles.rejectBtn]} onPress={() => rejectDriver(d.id)}>
                    <MaterialIcons name="close" size={18} color="#FFF" />
                    <Text style={styles.actionText}>{t('admin_drivers_btn_reject')}</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: '#111111', borderBottomWidth: 1, borderColor: '#2A2A2A' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  filterRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#333' },
  filterBtnActive: { backgroundColor: '#F97316', borderColor: '#F97316' },
  filterText: { fontSize: 13, color: '#888', fontWeight: fontWeight.medium },
  filterTextActive: { color: '#FFF' },
  emptyWrap: { alignItems: 'center', marginTop: 60, gap: spacing.md },
  emptyText: { fontSize: fontSize.md, color: '#888' },
  card: { backgroundColor: '#1A1A1A', borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: '#2A2A2A' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  driverName: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#FFF' },
  driverSub: { fontSize: 12, color: '#888' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeGreen: { backgroundColor: 'rgba(34,197,94,0.2)' },
  badgeYellow: { backgroundColor: 'rgba(245,158,11,0.2)' },
  statusText: { fontSize: 11, fontWeight: fontWeight.bold, color: '#FFF' },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm, paddingLeft: 56 },
  vehicleText: { fontSize: 13, color: '#AAA' },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: radius.md },
  approveBtn: { backgroundColor: '#22C55E' },
  rejectBtn: { backgroundColor: '#EF4444' },
  actionText: { fontSize: 14, fontWeight: fontWeight.bold, color: '#FFF' },
});

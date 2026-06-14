// AERO — Admin: SOS Alerts
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { getSharedSupabaseClient } from '@/template/core/client';
import { spacing, fontSize, fontWeight, radius } from '@/constants/theme';

interface AlertRow {
  id: string;
  user_id: string;
  type: string;
  target_name: string;
  reason: string | null;
  created_at: string;
}

export default function AdminAlerts() {
  const insets = useSafeAreaInsets();
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();

    // Realtime subscription pentru alerte noi
    const client = getSharedSupabaseClient();
    const channel = client.channel('admin_sos')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'safety_actions',
      }, (payload) => {
        setAlerts(prev => [payload.new as AlertRow, ...prev]);
      })
      .subscribe();

    return () => { client.removeChannel(channel); };
  }, []);

  const fetchAlerts = async () => {
    try {
      const client = getSharedSupabaseClient();
      const { data, error } = await client
        .from('safety_actions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      setAlerts((data ?? []) as AlertRow[]);
    } catch (e) {
      console.warn('Admin alerts error:', e);
    } finally {
      setLoading(false);
    }
  };

  const iconForType = (type: string) => {
    switch (type) {
      case 'sos': return 'warning';
      case 'report': return 'flag';
      case 'block': return 'block';
      default: return 'info';
    }
  };

  const colorForType = (type: string) => {
    switch (type) {
      case 'sos': return '#EF4444';
      case 'report': return '#F59E0B';
      case 'block': return '#8B5CF6';
      default: return '#888';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>Alerte & Rapoarte</Text>
        <Text style={styles.headerSub}>Live monitoring · Realtime</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl }}>
        {loading ? (
          <ActivityIndicator color="#F97316" size="large" style={{ marginTop: 40 }} />
        ) : alerts.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MaterialIcons name="verified-user" size={48} color="#22C55E" />
            <Text style={styles.emptyText}>Nicio alertă activă</Text>
          </View>
        ) : (
          alerts.map(a => (
            <View key={a.id} style={styles.card}>
              <View style={styles.cardRow}>
                <View style={[styles.iconWrap, { backgroundColor: colorForType(a.type) + '30' }]}>
                  <MaterialIcons name={iconForType(a.type)} size={24} color={colorForType(a.type)} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertType}>{a.type.toUpperCase()}</Text>
                  <Text style={styles.alertTarget}>Target: {a.target_name}</Text>
                  {a.reason && <Text style={styles.alertReason}>{a.reason}</Text>}
                  <Text style={styles.alertTime}>
                    {new Date(a.created_at).toLocaleString('ro-RO')}
                  </Text>
                </View>
              </View>
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
  headerSub: { fontSize: 12, color: '#22C55E', fontWeight: fontWeight.medium, marginTop: 4 },
  emptyWrap: { alignItems: 'center', marginTop: 60, gap: spacing.md },
  emptyText: { fontSize: fontSize.md, color: '#888' },
  card: { backgroundColor: '#1A1A1A', borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: '#2A2A2A' },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  alertType: { fontSize: 13, fontWeight: '800', color: '#FFF', letterSpacing: 1 },
  alertTarget: { fontSize: 14, color: '#CCC', marginTop: 2 },
  alertReason: { fontSize: 13, color: '#AAA', marginTop: 2, fontStyle: 'italic' },
  alertTime: { fontSize: 11, color: '#666', marginTop: 4 },
});

import { useI18n } from '@/contexts/I18nContext';
// AERO — Cursă Activă (Pasager)
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapSurface, Button, Card } from '@/components';
import { colors, fontSize, fontWeight, radius, spacing, shadows } from '@/constants/theme';
import { useRide } from '@/hooks/useRide';
import { CURRENCY } from '@/services/mockData';
import { useAlert } from '@/template';

export default function ActiveRideScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeRide, completeRide, status } = useRide();
  const { showAlert } = useAlert();
  
  // Mock driver location moving
  const [driverPos, setDriverPos] = useState(0);

  useEffect(() => {
    if (!activeRide) {
      router.replace('/(passenger)/ride');
      return;
    }
    
    // Simulam progresul soferului
    const interval = setInterval(() => {
      setDriverPos(p => Math.min(1, p + 0.05));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeRide, router]);

  useEffect(() => {
    // Dacă statusul s-a schimbat în completed (din exterior)
    if (status === 'completed') {
      router.replace('/(passenger)/ride');
    }
  }, [status, router]);

  if (!activeRide || !activeRide.offer) return null;

  const { pickup, dropoff, offer } = activeRide;

  // Calculam o pozitie intermediara pentru sofer
  const dx = dropoff.x - pickup.x;
  const dy = dropoff.y - pickup.y;
  const currentX = pickup.x + dx * driverPos;
  const currentY = pickup.y + dy * driverPos;

  const handleSOS = async () => {
    try {
      await require('@/services/rideBackend').triggerSOS(require('@/hooks/useAuth').useAuth().user?.id, offer.driverName);
      showAlert(t('active_sos_alerted_title'), t('active_sos_alerted'), [{ text: t('active_close_btn') }]);
    } catch (e) {
      showAlert(t('common_error'), t('active_sos_alert_error'));
    }
  };

  const handleCompleteMock = () => {
    router.replace('/(passenger)/rating');
  };

  return (
    <View style={styles.container}>
      <MapSurface 
        pins={[
          { x: pickup.x, y: pickup.y, kind: 'pickup' },
          { x: dropoff.x, y: dropoff.y, kind: 'dropoff' },
          { x: currentX, y: currentY, kind: 'driver', label: offer.plate },
        ]}
        showRoute
      />

      <View style={[styles.topBar, { top: insets.top + spacing.sm }]}>
        <View style={styles.etaBadge}>
          <Text style={styles.etaValue}>{Math.max(1, Math.round(offer.etaMin * (1 - driverPos)))}</Text>
          <Text style={styles.etaText}>min</Text>
        </View>
        <Pressable style={styles.sosBtn} onPress={handleSOS}>
          <Text style={styles.sosText}>{t('active_sos_btn')}</Text>
        </Pressable>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        <Text style={styles.statusText}>
          {driverPos < 0.1 ? t('active_status_ontheway') : driverPos < 0.9 ? t('active_status_inprogress') : t('active_status_arrived')}
        </Text>

        <Card style={styles.driverCard} padded>
          <View style={styles.driverTop}>
            <View style={[styles.avatar, { backgroundColor: offer.avatarColor }]}>
              <Text style={styles.avatarText}>{offer.driverName.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>{offer.driverName}</Text>
              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingText}>{offer.rating.toFixed(1)} · {offer.trips} curse</Text>
              </View>
            </View>
            <View style={styles.priceWrap}>
              <Text style={styles.price}>{activeRide.finalPrice} {CURRENCY}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.carRow}>
            <MaterialIcons name="directions-car" size={20} color={colors.textSubtle} />
            <Text style={styles.carText}>{offer.vehicle}</Text>
            <View style={styles.plateWrap}>
              <Text style={styles.plate}>{offer.plate}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.actionsRow}>
          <Pressable style={styles.actionBtn} onPress={() => router.push({ pathname: '/chat/[rideId]', params: { rideId: activeRide.id } })}>
            <MaterialIcons name="chat" size={24} color={colors.text} />
            <Text style={styles.actionText}>{t('active_chat_btn')}</Text>
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <MaterialIcons name="share" size={24} color={colors.text} />
            <Text style={styles.actionText}>{t('active_share_btn')}</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={handleCompleteMock}>
            <MaterialIcons name="check-circle" size={24} color={colors.success} />
            <Text style={styles.actionText}>{t('active_complete_btn')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mapBg },
  topBar: { position: 'absolute', left: spacing.md, right: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  etaBadge: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg, alignItems: 'center', ...shadows.card },
  etaValue: { fontSize: 24, fontWeight: '800', color: colors.text },
  etaText: { fontSize: fontSize.xs, color: colors.textSubtle, textTransform: 'uppercase', fontWeight: 'bold' },
  sosBtn: { backgroundColor: colors.danger, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, ...shadows.card },
  sosText: { color: '#fff', fontWeight: 'bold', fontSize: fontSize.md },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.md, gap: spacing.md, ...shadows.card },
  statusText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text, textAlign: 'center' },
  driverCard: { gap: spacing.md },
  driverTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: fontSize.xl },
  driverName: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: fontSize.sm, color: colors.textSubtle },
  priceWrap: { alignItems: 'flex-end' },
  price: { fontSize: fontSize.xl, fontWeight: '800', color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border },
  carRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  carText: { flex: 1, fontSize: fontSize.md, color: colors.text },
  plateWrap: { backgroundColor: colors.surfaceAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: colors.border },
  plate: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.text, letterSpacing: 1 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.md },
  actionBtn: { alignItems: 'center', gap: 4 },
  actionText: { fontSize: fontSize.xs, color: colors.textSubtle, fontWeight: 'bold' },
});

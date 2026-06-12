// Powered by OnSpace.AI
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlert } from '@/template';
import { colors, fontSize, fontWeight, radius, shadows, spacing } from '@/constants/theme';
import { MapSurface, Avatar, RatingStars, Button } from '@/components';
import type { MapPin } from '@/components';
import { useRide } from '@/hooks/useRide';
import { useAuth } from '@/hooks/useAuth';
import { CURRENCY } from '@/services/mockData';

export default function ActiveRideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { activeRide, startRide, completeRide } = useRide();
  const { reportUser, blockUser } = useAuth();
  const [paying, setPaying] = useState(false);

  if (!activeRide || !activeRide.offer) {
    return <Redirect href="/(tabs)" />;
  }

  const { pickup, dropoff, offer, distanceKm, durationMin, finalPrice, status } = activeRide;
  const driverName = offer.driverName;

  const pins: MapPin[] = [
    { x: pickup.x, y: pickup.y, kind: 'pickup', label: 'Plecare' },
    { x: dropoff.x, y: dropoff.y, kind: 'dropoff', label: dropoff.name },
    { x: pickup.x + 0.08, y: pickup.y - 0.06, kind: 'driver', label: driverName },
  ];

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      showAlert(
        'Plată reușită',
        `${finalPrice} ${CURRENCY} au fost transferați direct către ${driverName} (Stripe Connect · Direct Charge). AERO nu reține banii.`,
        [{ text: 'Gata', onPress: () => { completeRide(); router.replace('/(tabs)'); } }],
      );
    }, 1500);
  };

  const handleReport = () => {
    showAlert('Trust & Safety', `Ce vrei să faci cu ${driverName}?`, [
      { text: 'Anulează', style: 'cancel' },
      { text: 'Raportează', onPress: () => { reportUser(driverName, 'Raportat din cursa activă'); showAlert('Trimis', 'Raportul a fost salvat pentru revizuire.'); } },
      { text: 'Blochează', style: 'destructive', onPress: () => { blockUser(driverName); showAlert('Blocat', `${driverName} nu îți va mai apărea.`); } },
    ]);
  };

  const statusLabel =
    status === 'accepted' ? 'Șoferul vine spre tine' : 'Cursă în desfășurare';

  return (
    <View style={styles.container}>
      <MapSurface pins={pins} showRoute style={StyleSheet.absoluteFillObject} />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.closeBtn} onPress={() => router.replace('/(tabs)')}>
          <MaterialIcons name="close" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.statusPill}>
          <View style={styles.pulse} />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
          <View style={styles.driverRow}>
            <Avatar name={driverName} color={offer.avatarColor} size={52} />
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>{driverName}</Text>
              <View style={styles.metaRow}>
                <RatingStars rating={offer.rating} />
                <Text style={styles.dot}>·</Text>
                <Text style={styles.meta}>{offer.vehicle} · {offer.plate}</Text>
              </View>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.price}>{finalPrice}</Text>
              <Text style={styles.currency}>{CURRENCY}</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <CircleAction icon="call" label="Sună" onPress={() => showAlert('Apelare', `Te conectăm cu ${driverName}...`)} />
            <CircleAction icon="message" label="Mesaj" onPress={() => showAlert('Chat', 'Chat indisponibil în versiunea demo.')} />
            <CircleAction icon="report-gmailerrorred" label="Raportează" tone="danger" onPress={handleReport} />
          </View>

          <View style={styles.payInfo}>
            <MaterialIcons name="lock" size={16} color={colors.textSubtle} />
            <Text style={styles.payInfoText}>
              Plata merge direct în contul șoferului (Stripe Connect). AERO nu reține comision.
            </Text>
          </View>

          {status === 'accepted' ? (
            <Button label="Începe cursa" fullWidth size="lg" icon="play-arrow" onPress={startRide} />
          ) : (
            <Button
              label={`Finalizează și plătește · ${finalPrice} ${CURRENCY}`}
              fullWidth
              size="lg"
              icon="payments"
              loading={paying}
              onPress={handlePay}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function CircleAction({
  icon,
  label,
  onPress,
  tone,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  tone?: 'danger';
}) {
  const color = tone === 'danger' ? colors.danger : colors.text;
  return (
    <Pressable style={styles.circleAction} onPress={onPress}>
      <View style={[styles.circle, tone === 'danger' ? { backgroundColor: colors.dangerSoft } : null]}>
        <MaterialIcons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.circleLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mapBg },
  topBar: { paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', ...shadows.card,
  },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: 8,
    borderRadius: radius.pill, ...shadows.card,
  },
  pulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  statusText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.text },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    padding: spacing.md, maxHeight: '60%', ...shadows.float,
  },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  driverName: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  dot: { color: colors.textFaint },
  meta: { fontSize: fontSize.sm, color: colors.textSubtle },
  priceBox: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  price: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.primaryDark },
  currency: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.primaryDark },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  circleAction: { alignItems: 'center', gap: 6 },
  circle: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  circleLabel: { fontSize: fontSize.xs, color: colors.textSubtle },
  payInfo: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.sm,
  },
  payInfoText: { flex: 1, fontSize: fontSize.xs, color: colors.textSubtle, lineHeight: fontSize.xs * 1.5 },
});

// Powered by OnSpace.AI
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlert } from '@/template';
import { colors, fontSize, fontWeight, radius, shadows, spacing } from '@/constants/theme';
import {
  MapSurface,
  DriverRequestCard,
  ProminentDisclosureModal,
  Button,
  Badge,
  Card,
  Avatar,
} from '@/components';
import type { MapPin } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { useRide } from '@/hooks/useRide';
import { CURRENCY } from '@/services/mockData';
import { openExternalNavigation } from '@/services/navigationLinks';

export default function DriveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isTrialActive, trialDaysLeft, approveDriverMock, renewSubscriptionMock } = useAuth();
  const {
    isOnline,
    nearbyRequests,
    driverActiveRide,
    goOnline,
    goOffline,
    acceptRequest,
    ignoreRequest,
    completeDriverRide,
  } = useRide();
  const { showAlert } = useAlert();
  const [showDisclosure, setShowDisclosure] = useState(false);
  const [hasBgConsent, setHasBgConsent] = useState(false);

  const status = user?.driverStatus ?? 'none';

  const requestOnline = () => {
    if (!hasBgConsent) {
      setShowDisclosure(true);
      return;
    }
    goOnline();
  };

  const handleAgree = () => {
    setHasBgConsent(true);
    setShowDisclosure(false);
    // Simulate the OS "Always Allow" prompt fired only after consent.
    showAlert('Permisiune acordată', 'Locația în fundal este acum activă cât ești Online.', [
      { text: 'Continuă', onPress: goOnline },
    ]);
  };

  // ---- Driver has an active ride ----
  if (driverActiveRide) {
    const r = driverActiveRide;
    const pins: MapPin[] = [
      { x: r.pickup.x, y: r.pickup.y, kind: 'passenger', label: 'Pasager' },
      { x: r.dropoff.x, y: r.dropoff.y, kind: 'dropoff', label: r.dropoff.name },
    ];
    return (
      <View style={styles.container}>
        <MapSurface pins={pins} showRoute style={StyleSheet.absoluteFillObject} />
        <View style={[styles.activeSheet, { paddingBottom: insets.bottom + spacing.md }]}>
          <Badge label="Cursă acceptată" tone="success" icon="check-circle" />
          <View style={styles.activeRow}>
            <Avatar name={r.offer?.driverName ?? 'P'} color={r.offer?.avatarColor ?? colors.primary} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={styles.activeName}>{r.offer?.driverName}</Text>
              <Text style={styles.activeMeta}>{r.distanceKm} km · {r.durationMin} min</Text>
            </View>
            <Text style={styles.activePrice}>{r.finalPrice} {CURRENCY}</Text>
          </View>
          <Button
            label="Navighează (Waze / Maps)"
            fullWidth
            icon="navigation"
            onPress={() => openExternalNavigation(r.pickup)}
          />
          <Button
            label="Finalizează cursa"
            variant="dark"
            fullWidth
            icon="flag"
            onPress={() => {
              completeDriverRide();
              showAlert('Cursă finalizată', `Ai încasat ${r.finalPrice} ${CURRENCY} direct în contul tău.`);
            }}
          />
        </View>
      </View>
    );
  }

  // ---- Not a driver yet ----
  if (status === 'none') {
    return (
      <ScrollView style={styles.plain} contentContainerStyle={[styles.plainContent, { paddingTop: insets.top + spacing.md }]}>
        <Image source={require('@/assets/images/driver-hero.png')} style={styles.hero} contentFit="contain" transition={200} />
        <Text style={styles.bigTitle}>Devino Șofer AERO</Text>
        <Text style={styles.lead}>
          Primești comenzi de la pasageri pe bază de abonament. Comisionul AERO este 0% — banii merg
          direct la tine.
        </Text>
        <View style={styles.benefits}>
          <Benefit icon="payments" text="Plăți directe în contul tău (Stripe Connect)" />
          <Benefit icon="event-available" text="3 luni gratuite la aprobare" />
          <Benefit icon="tune" text="Tu controlezi prețul prin contraoferte" />
        </View>
        <Button label="Începe înregistrarea" fullWidth size="lg" icon="arrow-forward" onPress={() => router.push('/driver/onboarding')} />
      </ScrollView>
    );
  }

  // ---- KYC pending ----
  if (status === 'pending') {
    return (
      <View style={[styles.plain, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.pendingIcon}>
          <MaterialIcons name="hourglass-top" size={36} color={colors.warning} />
        </View>
        <Text style={styles.bigTitle}>Documente în verificare</Text>
        <Text style={styles.lead}>
          Echipa AERO îți verifică actele. Vei putea prelua curse imediat după aprobare.
        </Text>
        <Card style={{ alignSelf: 'stretch', marginTop: spacing.md }}>
          <Text style={styles.demoLabel}>Demo admin</Text>
          <Text style={styles.demoText}>
            În producție aprobarea se face din panoul web de admin. Aici o poți simula:
          </Text>
          <View style={{ height: spacing.sm }} />
          <Button label="Simulează aprobarea" variant="outline" fullWidth icon="verified" onPress={approveDriverMock} />
        </Card>
      </View>
    );
  }

  // ---- Approved but subscription expired ----
  if (status === 'approved' && !isTrialActive) {
    return (
      <View style={[styles.plain, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.expiredIcon}>
          <MaterialIcons name="lock-clock" size={36} color={colors.danger} />
        </View>
        <Text style={styles.bigTitle}>Abonament expirat</Text>
        <Text style={styles.lead}>
          Perioada ta s-a încheiat. Pentru a relua cursele, reînnoiește abonamentul accesând
          platforma web AERO.
        </Text>
        <Card style={{ alignSelf: 'stretch', marginTop: spacing.md }}>
          <Text style={styles.demoLabel}>Demo</Text>
          <Text style={styles.demoText}>Simulează reînnoirea făcută pe web:</Text>
          <View style={{ height: spacing.sm }} />
          <Button label="Am reînnoit pe web" variant="outline" fullWidth icon="autorenew" onPress={renewSubscriptionMock} />
        </Card>
      </View>
    );
  }

  // ---- Approved + active trial: Radar ----
  const pins: MapPin[] = [
    { x: 0.5, y: 0.55, kind: 'driver', label: 'Tu' },
    ...nearbyRequests.map((r) => ({ x: r.x, y: r.y, kind: 'passenger' as const, label: r.passengerName })),
  ];

  return (
    <View style={styles.container}>
      <MapSurface pins={pins} style={StyleSheet.absoluteFillObject} />

      <View style={[styles.radarTop, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.statusCard}>
          <View style={[styles.onlineDot, { backgroundColor: isOnline ? colors.primary : colors.textFaint }]} />
          <Text style={styles.statusCardText}>{isOnline ? 'Online · primești comenzi' : 'Offline'}</Text>
          <Badge label={`Trial: ${trialDaysLeft}z`} tone="primary" icon="schedule" />
        </View>
      </View>

      <View style={[styles.radarSheet, { paddingBottom: insets.bottom + spacing.md }]}>
        {!isOnline ? (
          <Pressable style={styles.goOnline} onPress={requestOnline}>
            <MaterialIcons name="power-settings-new" size={26} color="#fff" />
            <Text style={styles.goOnlineText}>Intră Online</Text>
          </Pressable>
        ) : (
          <>
            <View style={styles.reqHeader}>
              <Text style={styles.reqTitle}>Cereri în apropiere</Text>
              <Pressable onPress={goOffline} hitSlop={8}>
                <Text style={styles.offlineLink}>Ieși Offline</Text>
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.sm }}>
              {nearbyRequests.length === 0 ? (
                <Text style={styles.noReq}>Nu sunt cereri momentan. Stai online pentru a primi comenzi.</Text>
              ) : (
                nearbyRequests.map((req) => (
                  <DriverRequestCard key={req.id} request={req} onAccept={acceptRequest} onIgnore={ignoreRequest} />
                ))
              )}
            </ScrollView>
          </>
        )}
      </View>

      <ProminentDisclosureModal
        visible={showDisclosure}
        onAgree={handleAgree}
        onDismiss={() => setShowDisclosure(false)}
      />
    </View>
  );
}

function Benefit({ icon, text }: { icon: keyof typeof MaterialIcons.glyphMap; text: string }) {
  return (
    <View style={styles.benefitRow}>
      <View style={styles.benefitIcon}>
        <MaterialIcons name={icon} size={20} color={colors.primaryDark} />
      </View>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mapBg },
  plain: { flex: 1, backgroundColor: colors.background },
  plainContent: { padding: spacing.lg, gap: spacing.md, alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  hero: { width: 220, height: 180 },
  bigTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, textAlign: 'center' },
  lead: { fontSize: fontSize.md, color: colors.textSubtle, textAlign: 'center', lineHeight: fontSize.md * 1.6 },
  benefits: { alignSelf: 'stretch', gap: spacing.sm, marginVertical: spacing.sm },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  benefitIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  benefitText: { flex: 1, fontSize: fontSize.md, color: colors.text },
  pendingIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.warningSoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  expiredIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  demoLabel: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.5 },
  demoText: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 4 },
  radarTop: { paddingHorizontal: spacing.md },
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, ...shadows.card },
  onlineDot: { width: 10, height: 10, borderRadius: 5 },
  statusCardText: { flex: 1, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.text },
  radarSheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.md, maxHeight: '64%', ...shadows.float },
  goOnline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: spacing.md + 2 },
  goOnlineText: { color: '#fff', fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  reqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  reqTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  offlineLink: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.danger },
  noReq: { fontSize: fontSize.sm, color: colors.textSubtle, textAlign: 'center', padding: spacing.lg },
  activeSheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.md, gap: spacing.md, ...shadows.float },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  activeName: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  activeMeta: { fontSize: fontSize.sm, color: colors.textSubtle },
  activePrice: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primaryDark },
});

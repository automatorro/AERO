import { useI18n } from '@/contexts/I18nContext';
// AERO — Request Ride (Pasager)
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapSurface, Button } from '@/components';
import { colors, fontSize, fontWeight, radius, spacing, shadows } from '@/constants/theme';
import { useRide } from '@/hooks/useRide';
import { useAuth } from '@/hooks/useAuth';
import { calcRecommendedPrice, estimateDistance, estimateDuration, CURRENCY } from '@/services/mockData';
import { savePassengerRideRequest } from '@/services/rideBackend';
import { useAlert } from '@/template';

const CLASSES = [
  { id: 'aero', name: t('request_class_aero_name'), desc: t('request_class_aero_desc'), icon: 'local-taxi' },
  { id: 'plus', name: t('request_class_plus_name'), desc: t('request_class_plus_desc'), icon: 'airport-shuttle' },
  { id: 'vip', name: t('request_class_vip_name'), desc: t('request_class_vip_desc'), icon: 'directions-car' },
];

export default function RequestRideScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pickup, dropoff, sendRequest } = useRide();
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [selectedClass, setSelectedClass] = useState('aero');
  const [offerOffset, setOfferOffset] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallbacks in caz de lipsa de date (navigare gresita)
  if (!pickup || !dropoff) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>{t('request_error_no_destination')}</Text>
        <Button label={t('common_back')} onPress={() => router.back()} />
      </View>
    );
  }

  const dist = estimateDistance(pickup, dropoff);
  const dur = estimateDuration(dist);
  const basePrice = calcRecommendedPrice(dist, dur);
  const finalOffer = Math.max(5, basePrice + offerOffset);

  const handleRequest = async () => {
    setIsSubmitting(true);
    try {
      // Daca userul schimba pretul pe ecran, il salvam in context (vom extinde adjustPrice)
      // dar pentru MVP doar setam status-ul prin sendRequest care genereaza si oferte mock
      sendRequest();
      router.replace('/(passenger)/searching');
    } catch (err: any) {
      showAlert('Eroare', 'Nu am putut plasa cererea: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapWrap}>
        <MapSurface 
          pins={[
            { x: pickup.x, y: pickup.y, kind: 'pickup', label: 'Start' },
            { x: dropoff.x, y: dropoff.y, kind: 'dropoff', label: 'Stop' },
          ]} 
          showRoute 
        />
        <Pressable style={[styles.backBtn, { top: insets.top + spacing.sm }]} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView style={styles.sheet} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}>
        <View style={styles.locations}>
          <View style={styles.locRow}>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <Text style={styles.locText} numberOfLines={1}>{pickup.name}</Text>
          </View>
          <View style={styles.locLine} />
          <View style={styles.locRow}>
            <View style={[styles.dot, { backgroundColor: colors.ink }]} />
            <Text style={styles.locText} numberOfLines={1}>{dropoff.name}</Text>
          </View>
          <Text style={styles.meta}>{dist.toFixed(1)} km · {dur} min</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('request_class_title')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.classList}>
          {CLASSES.map(c => {
            const isSel = selectedClass === c.id;
            return (
              <Pressable key={c.id} style={[styles.classCard, isSel && styles.classCardActive]} onPress={() => setSelectedClass(c.id)}>
                <MaterialIcons name={c.icon as any} size={32} color={isSel ? colors.primary : colors.textSubtle} />
                <Text style={[styles.className, isSel && styles.classNameActive]}>{c.name}</Text>
                <Text style={styles.classDesc}>{c.desc}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>{t('request_price_title')}</Text>
          <Text style={styles.priceSub}>{t('request_price_sub', { basePrice, currency: CURRENCY })}</Text>
          <View style={styles.priceControls}>
            <Pressable style={styles.priceBtn} onPress={() => setOfferOffset(o => o - 1)}>
              <MaterialIcons name="remove" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.priceValue}>{finalOffer} {CURRENCY}</Text>
            <Pressable style={styles.priceBtn} onPress={() => setOfferOffset(o => o + 1)}>
              <MaterialIcons name="add" size={24} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <Button 
          label={t('request_btn_submit_price', { price: finalOffer, currency: CURRENCY })} 
          fullWidth size="lg" 
          disabled={isSubmitting}
          onPress={handleRequest} 
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  mapWrap: { height: '40%', position: 'relative' },
  backBtn: {
    position: 'absolute', left: spacing.md,
    backgroundColor: colors.surface, width: 44, height: 44,
    borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    ...shadows.card,
  },
  sheet: { flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.md, marginTop: -20, ...shadows.card },
  locations: { backgroundColor: colors.surfaceAlt, padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.lg },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  locLine: { width: 2, height: 16, backgroundColor: colors.border, marginLeft: 4, marginVertical: 2 },
  locText: { flex: 1, fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.text },
  meta: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: spacing.sm, textAlign: 'right' },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.sm },
  classList: { gap: spacing.md, marginBottom: spacing.lg, paddingRight: spacing.lg },
  classCard: {
    width: 130, padding: spacing.md, backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg, borderWidth: 2, borderColor: 'transparent',
    alignItems: 'center', gap: 4,
  },
  classCardActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  className: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  classNameActive: { color: colors.primary },
  classDesc: { fontSize: 10, color: colors.textSubtle, textAlign: 'center' },
  priceSection: { marginBottom: spacing.xl, alignItems: 'center' },
  priceSub: { fontSize: fontSize.sm, color: colors.textSubtle, textAlign: 'center', marginBottom: spacing.md },
  priceControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  priceBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  priceValue: { fontSize: 32, fontWeight: '800', color: colors.text, minWidth: 100, textAlign: 'center' },
});

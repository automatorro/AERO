import { useI18n } from '@/contexts/I18nContext';
// AERO — Căutare Șoferi + Oferte Pasager
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapSurface, Button, Card } from '@/components';
import { colors, fontSize, fontWeight, radius, spacing, shadows } from '@/constants/theme';
import { useRide } from '@/hooks/useRide';
import { CURRENCY } from '@/services/mockData';

export default function SearchingScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pickup, dropoff, status, offers, acceptOffer, cancelRide } = useRide();

  // Radar Animation
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === 'requesting') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'accepted') {
      router.replace('/(passenger)/active');
    }
  }, [status, router]);

  if (!pickup || !dropoff) {
    return null;
  }

  const handleCancel = () => {
    cancelRide();
    router.replace('/(passenger)/ride');
  };

  return (
    <View style={styles.container}>
      <MapSurface 
        pins={[
          { x: pickup.x, y: pickup.y, kind: 'pickup' },
          { x: dropoff.x, y: dropoff.y, kind: 'dropoff' },
          // Punem si oferte pe harta mock
          ...offers.map((o, i) => ({ x: pickup.x + (i + 1) * 0.05, y: pickup.y + (i + 1) * 0.05, kind: 'driver' as const })),
        ]}
      />

      <View style={[styles.backBtn, { top: insets.top + spacing.sm }]}>
        <Pressable style={styles.iconBtn} onPress={handleCancel}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        {status === 'requesting' ? (
          <View style={styles.searchingWrap}>
            <Animated.View style={[styles.radar, {
              transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2] }) }],
              opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] })
            }]} />
            <View style={styles.radarCenter}>
              <MaterialIcons name="search" size={32} color="#fff" />
            </View>
            <Text style={styles.searchingText}>{t('searching_text')}</Text>
            <Button label={t('searching_cancel_btn')} variant="ghost" onPress={handleCancel} />
          </View>
        ) : (
          <View style={styles.offersWrap}>
            <Text style={styles.offersTitle}>{t('searching_offers_title', { count: offers.length })}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersList}>
              {offers.map(offer => (
                <Card key={offer.id} style={styles.offerCard} padded>
                  <View style={styles.offerTop}>
                    <View style={[styles.avatar, { backgroundColor: offer.avatarColor }]}>
                      <Text style={styles.avatarText}>{offer.driverName.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.driverName}>{offer.driverName}</Text>
                      <View style={styles.ratingRow}>
                        <MaterialIcons name="star" size={14} color="#F59E0B" />
                        <Text style={styles.ratingText}>{offer.rating.toFixed(1)}</Text>
                      </View>
                    </View>
                    <Text style={styles.eta}>{offer.etaMin} min</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.offerBottom}>
                    <View>
                      <Text style={styles.carInfo}>{offer.vehicle}</Text>
                      <Text style={styles.plate}>{offer.plate}</Text>
                    </View>
                    <Text style={styles.price}>{offer.price} {CURRENCY}</Text>
                  </View>
                  <Button label={t('searching_accept_offer_btn')} fullWidth onPress={() => acceptOffer(offer)} />
                </Card>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mapBg },
  backBtn: { position: 'absolute', left: spacing.md },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.card },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.md, ...shadows.card },
  searchingWrap: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.lg, position: 'relative' },
  radar: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primarySoft, top: 20 },
  radarCenter: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  searchingText: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.text, marginTop: spacing.md },
  offersWrap: { gap: spacing.md },
  offersTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  offersList: { gap: spacing.md, paddingRight: spacing.lg },
  offerCard: { width: 280, gap: spacing.md },
  offerTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: fontSize.md },
  driverName: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: fontSize.sm, color: colors.textSubtle },
  eta: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.primary, backgroundColor: colors.primarySoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  divider: { height: 1, backgroundColor: colors.border },
  offerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  carInfo: { fontSize: fontSize.sm, color: colors.textSubtle },
  plate: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.text },
  price: { fontSize: 24, fontWeight: '800', color: colors.text },
});

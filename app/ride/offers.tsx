// Powered by OnSpace.AI
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing } from '@/constants/theme';
import { OfferCard, Button } from '@/components';
import { useRide } from '@/hooks/useRide';
import { RideOffer } from '@/services/types';
import { CURRENCY } from '@/services/mockData';

export default function OffersScreen() {
  const router = useRouter();
  const { status, offers, recommendedPrice, offeredPrice, acceptOffer, cancelRide } = useRide();

  const handleAccept = (offer: RideOffer) => {
    acceptOffer(offer);
    router.replace('/ride/active');
  };

  const handleCancel = () => {
    cancelRide();
    router.dismissAll();
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>Prețul tău propus</Text>
        <Text style={styles.bannerPrice}>
          {offeredPrice} <Text style={styles.bannerCurrency}>{CURRENCY}</Text>
        </Text>
      </View>

      {status === 'requesting' ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingTitle}>Căutăm șoferi disponibili...</Text>
          <Text style={styles.loadingSub}>Trimitem cererea ta către șoferii din apropiere</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          <View style={styles.countRow}>
            <MaterialIcons name="bolt" size={18} color={colors.primaryDark} />
            <Text style={styles.countText}>{offers.length} oferte primite</Text>
          </View>
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} recommended={recommendedPrice} onAccept={handleAccept} />
          ))}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Button label="Anulează cererea" variant="ghost" fullWidth onPress={handleCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  banner: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: fontSize.sm },
  bannerPrice: { color: '#fff', fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  bannerCurrency: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.xl },
  loadingTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginTop: spacing.md },
  loadingSub: { fontSize: fontSize.sm, color: colors.textSubtle, textAlign: 'center' },
  list: { padding: spacing.md, gap: spacing.md },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  countText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSubtle },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
});

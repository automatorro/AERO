// AERO — Abonament Șoferi
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card } from '@/components';
import { colors, fontSize, fontWeight, radius, spacing, shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';

export default function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { renewSubscriptionMock } = useAuth();
  const { showAlert } = useAlert();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    // În producție, aici se integrează @stripe/stripe-react-native
    // 1. Apel către backend (/create-subscription) pentru a primi clientSecret
    // 2. await initPaymentSheet({ paymentIntentClientSecret: secret })
    // 3. await presentPaymentSheet()
    
    // MOCK FLUX:
    setTimeout(() => {
      renewSubscriptionMock();
      setIsProcessing(false);
      showAlert('Plată Confirmată', 'Abonamentul AERO Flex a fost activat! Poți prelua curse din nou.', [
        { text: 'Mergi la Radar', onPress: () => router.replace('/(driver)/drive') }
      ]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Abonament AERO</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.hero}>
          <FontAwesome5 name="crown" size={48} color={colors.primary} />
          <Text style={styles.heroTitle}>AERO Flex</Text>
          <Text style={styles.heroSub}>Păstrezi 100% din banii pe cursă, cu 0 comision.</Text>
        </View>

        <Card style={styles.pricingCard}>
          <Text style={styles.priceAmount}>50<Text style={styles.priceCurrency}> RON</Text></Text>
          <Text style={styles.pricePeriod}>/ lună</Text>
        </Card>

        <View style={styles.benefits}>
          <Text style={styles.sectionTitle}>Ce include abonamentul?</Text>
          <Benefit text="Comision 0% la toate cursele" icon="money-off" />
          <Benefit text="Acces la toate tipurile de cereri (AERO, VIP)" icon="verified" />
          <Benefit text="Plăți zilnice direct în contul tău" icon="account-balance-wallet" />
          <Benefit text="Suport prioritar In-App 24/7" icon="support-agent" />
        </View>

        <View style={{ height: spacing.xl }} />

        <Button 
          label={isProcessing ? 'Se procesează plata...' : 'Plătește sigur prin Stripe'} 
          fullWidth 
          size="lg" 
          icon={isProcessing ? undefined : 'lock'}
          disabled={isProcessing}
          onPress={handleSubscribe} 
        />
        <Text style={styles.footerText}>
          Plata este securizată de Stripe. Abonamentul se va reînnoi automat în fiecare lună. Poți anula oricând din setări.
        </Text>
      </ScrollView>
    </View>
  );
}

function Benefit({ text, icon }: { text: string; icon: any }) {
  return (
    <View style={styles.benefitRow}>
      <MaterialIcons name={icon} size={24} color={colors.success} />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, paddingBottom: spacing.sm, ...shadows.card 
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  content: { padding: spacing.lg },
  hero: { alignItems: 'center', marginVertical: spacing.xl },
  heroTitle: { fontSize: 32, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  heroSub: { fontSize: fontSize.md, color: colors.textSubtle, textAlign: 'center', marginTop: spacing.sm },
  pricingCard: { alignItems: 'center', paddingVertical: spacing.xl, backgroundColor: colors.primarySoft, borderColor: colors.primary, borderWidth: 2 },
  priceAmount: { fontSize: 48, fontWeight: '900', color: colors.primary },
  priceCurrency: { fontSize: 24, fontWeight: 'bold' },
  pricePeriod: { fontSize: fontSize.md, color: colors.primary, fontWeight: 'bold', marginTop: -4 },
  benefits: { marginTop: spacing.xl, gap: spacing.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.sm },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  benefitText: { fontSize: fontSize.md, color: colors.text, flex: 1 },
  footerText: { fontSize: 12, color: colors.textFaint, textAlign: 'center', marginTop: spacing.md, lineHeight: 18 },
});

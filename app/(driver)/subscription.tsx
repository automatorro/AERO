import { useI18n } from '@/contexts/I18nContext';
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
  const { t } = useI18n();
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
      showAlert(t('sub_payment_confirmed_title'), t('sub_success_message'), [
        { text: t('sub_btn_radar'), onPress: () => router.replace('/(driver)/drive') }
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
          <Text style={styles.heroTitle}>{t('sub_title')}</Text>
          <Text style={styles.heroSub}>{t('sub_hero_desc')}</Text>
        </View>

        <Card style={styles.pricingCard}>
          <Text style={styles.priceAmount}>50<Text style={styles.priceCurrency}> RON</Text></Text>
          <Text style={styles.pricePeriod}>/ lună</Text>
        </Card>

        <View style={styles.benefits}>
          <Text style={styles.sectionTitle}>{t('sub_benefits_title')}</Text>
          <Benefit text={t('sub_benefit_1')} icon="money-off" />
          <Benefit text={t('sub_benefit_2')} icon="verified" />
          <Benefit text={t('sub_benefit_4')} icon="account-balance-wallet" />
          <Benefit text={t('sub_benefit_3_driver')} icon="support-agent" />
        </View>

        <View style={{ height: spacing.xl }} />

        <Button 
          label={isProcessing ? t('sub_processing') : t('sub_btn_pay')} 
          fullWidth 
          size="lg" 
          icon={isProcessing ? undefined : 'lock'}
          disabled={isProcessing}
          onPress={handleSubscribe} 
        />
        <Text style={styles.footerText}>
          {t('sub_footer_text')}
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

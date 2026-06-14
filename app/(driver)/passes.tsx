import { useI18n } from '@/contexts/I18nContext';
// AERO — Driver Subscription (Passes tab)
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Screen, Header, Badge, Card } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components';
import { useAlert } from '@/template';

export default function DriverPassesScreen() {
  const { t } = useI18n();
  const { user, isTrialActive, trialDaysLeft, renewSubscriptionMock } = useAuth();
  const { showAlert } = useAlert();

  const driverStatus = user?.driverStatus ?? 'none';

  return (
    <Screen>
      <Header title={t('driver_passes_title')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Status curent */}
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusIcon, { backgroundColor: isTrialActive ? colors.successSoft : colors.dangerSoft }]}>
              <MaterialIcons
                name={isTrialActive ? 'check-circle' : 'lock-clock'}
                size={28}
                color={isTrialActive ? colors.success : colors.danger}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>
                {driverStatus === 'approved' && isTrialActive
                  ? t('profile_trial_active', { days: trialDaysLeft })
                  : driverStatus === 'approved'
                  ? t('driver_expired_title')
                  : driverStatus === 'pending'
                  ? t('driver_passes_status_pending')
                  : t('driver_passes_status_unregistered')}
              </Text>
              <Text style={styles.statusSub}>
                {isTrialActive
                  ? t('driver_passes_trial_sub')
                  : t('driver_expired_text')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Plan disponibil */}
        <Text style={styles.sectionLabel}>{t('driver_passes_plan_name')}</Text>
        <Card style={styles.planCard}>
          <View style={styles.planTop}>
            <View>
              <Text style={styles.planName}>{t('driver_passes_plan_name')}</Text>
              <Text style={styles.planDesc}>{t('driver_passes_plan_desc')}</Text>
            </View>
            <View style={styles.planPrice}>
              <Text style={styles.planAmount}>500</Text>
              <Text style={styles.planCurrency}>{t('driver_passes_plan_period')}</Text>
            </View>
          </View>
          <View style={styles.planFeatures}>
            <PlanFeature text={t('sub_benefit_1')} />
            <PlanFeature text={t('driver_passes_plan_feature_1')} />
            <PlanFeature text={t('sub_benefit_3')} />
            <PlanFeature text={t('driver_passes_trial_sub')} />
          </View>
          <Button
            label={t('driver_passes_btn_activate')}
            fullWidth
            icon="card-membership"
            onPress={() => showAlert(t('sub_title'), t('driver_passes_btn_activate_stripe_mock'))}
          />
        </Card>

        {/* Cont bancar */}
        <Text style={styles.sectionLabel}>{t('driver_passes_bank_section')}</Text>
        <Card>
          <View style={styles.bankRow}>
            <View style={styles.bankIcon}>
              <MaterialIcons name="account-balance" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bankTitle}>Stripe Connect</Text>
              <Text style={styles.bankSub}>
                {user?.vehicle ? t('driver_passes_bank_connected') : t('driver_passes_bank_disconnected')}
              </Text>
            </View>
            <Pressable
              style={styles.bankBtn}
              onPress={() => showAlert(t('driver_passes_bank_section'), t('driver_passes_bank_onboarding_mock'))}
            >
              <Text style={styles.bankBtnText}>{t('driver_passes_btn_setup')}</Text>
            </Pressable>
          </View>
        </Card>

        {/* Demo renew */}
        <Card style={{ marginTop: spacing.sm }}>
          <Text style={styles.demoLabel}>Demo</Text>
          <Text style={styles.demoText}>Simulează reînnoirea (fără Stripe real):</Text>
          <View style={{ height: spacing.sm }} />
          <Button label="Simulează reînnoire" variant="outline" fullWidth icon="autorenew" onPress={renewSubscriptionMock} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

function PlanFeature({ text }: { text: string }) {
  return (
    <View style={styles.feature}>
      <MaterialIcons name="check" size={16} color={colors.success} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl },
  statusCard: { padding: spacing.md },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  statusIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  statusTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  statusSub: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 2 },
  sectionLabel: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 1, marginTop: spacing.sm },
  planCard: { gap: spacing.md },
  planTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planName: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  planDesc: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 2 },
  planPrice: { alignItems: 'flex-end' },
  planAmount: { fontSize: 28, fontWeight: '800', color: colors.text },
  planCurrency: { fontSize: fontSize.sm, color: colors.textSubtle },
  planFeatures: { gap: 8 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  featureText: { fontSize: fontSize.sm, color: colors.text, flex: 1 },
  bankRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bankIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  bankTitle: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  bankSub: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 2 },
  bankBtn: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bankBtnText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  demoLabel: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.5 },
  demoText: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 4 },
});

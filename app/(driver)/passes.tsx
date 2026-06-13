// AERO — Driver Subscription (Passes tab)
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Screen, Header, Badge, Card } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components';
import { useAlert } from '@/template';

export default function DriverPassesScreen() {
  const { user, isTrialActive, trialDaysLeft, renewSubscriptionMock } = useAuth();
  const { showAlert } = useAlert();

  const driverStatus = user?.driverStatus ?? 'none';

  return (
    <Screen>
      <Header title="Abonamentul meu" />
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
                  ? `Trial activ — ${trialDaysLeft} zile rămase`
                  : driverStatus === 'approved'
                  ? 'Abonament expirat'
                  : driverStatus === 'pending'
                  ? 'Cont în verificare'
                  : 'Cont neînregistrat'}
              </Text>
              <Text style={styles.statusSub}>
                {isTrialActive
                  ? 'Prima lună gratuită'
                  : 'Reînnoiește pentru a prelua curse'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Plan disponibil */}
        <Text style={styles.sectionLabel}>Plan disponibil</Text>
        <Card style={styles.planCard}>
          <View style={styles.planTop}>
            <View>
              <Text style={styles.planName}>Plan Standard</Text>
              <Text style={styles.planDesc}>Acces complet la toate cursele</Text>
            </View>
            <View style={styles.planPrice}>
              <Text style={styles.planAmount}>500</Text>
              <Text style={styles.planCurrency}>RON/lună</Text>
            </View>
          </View>
          <View style={styles.planFeatures}>
            <PlanFeature text="Comision 0% — păstrezi 100% din cursă" />
            <PlanFeature text="Cereri curse nelimitate" />
            <PlanFeature text="Chat + navigație integrată" />
            <PlanFeature text="Prima lună gratuită" />
          </View>
          <Button
            label="Activează abonament"
            fullWidth
            icon="card-membership"
            onPress={() => showAlert('Stripe', 'Integrare Stripe Subscriptions — disponibil în curând.')}
          />
        </Card>

        {/* Cont bancar */}
        <Text style={styles.sectionLabel}>Cont bancar</Text>
        <Card>
          <View style={styles.bankRow}>
            <View style={styles.bankIcon}>
              <MaterialIcons name="account-balance" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bankTitle}>Stripe Connect</Text>
              <Text style={styles.bankSub}>
                {user?.vehicle ? 'Conectat' : 'Neconectat — conectează pentru a primi plăți'}
              </Text>
            </View>
            <Pressable
              style={styles.bankBtn}
              onPress={() => showAlert('Stripe Connect', 'Onboarding Stripe — disponibil în curând.')}
            >
              <Text style={styles.bankBtnText}>Configurează</Text>
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

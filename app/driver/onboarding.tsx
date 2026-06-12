// Powered by OnSpace.AI
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useAlert } from '@/template';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Button, Card } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { KYC_DOCS } from '@/services/mockData';

export default function OnboardingScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { submitKyc } = useAuth();
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setUploaded((prev) => ({ ...prev, [id]: !prev[id] }));
  const allDone = KYC_DOCS.every((d) => uploaded[d.id]);

  const submit = () => {
    submitKyc({ make: 'Dacia', model: 'Logan', plate: 'B 00 AERO', color: 'Alb' });
    showAlert(
      'Trimis spre verificare',
      'Documentele tale au fost trimise. Vei putea prelua curse după aprobarea echipei AERO.',
      [{ text: 'Am înțeles', onPress: () => router.back() }],
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Image source={require('@/assets/images/driver-hero.png')} style={styles.hero} contentFit="contain" transition={200} />
      <Text style={styles.title}>Verificare șofer (KYC)</Text>
      <Text style={styles.sub}>
        Încarcă documentele necesare. Toate sunt obligatorii pentru aprobare.
      </Text>

      <View style={styles.docs}>
        {KYC_DOCS.map((doc) => {
          const done = !!uploaded[doc.id];
          return (
            <Pressable key={doc.id} onPress={() => toggle(doc.id)}>
              <Card style={[styles.docCard, done ? styles.docDone : null]} padded>
                <View style={[styles.docIcon, done ? styles.docIconDone : null]}>
                  <MaterialIcons name={done ? 'check' : 'add-a-photo'} size={22} color={done ? '#fff' : colors.textSubtle} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docLabel}>{doc.label}</Text>
                  <Text style={styles.docHint}>{done ? 'Încărcat' : doc.hint}</Text>
                </View>
                <MaterialIcons name={done ? 'check-circle' : 'chevron-right'} size={22} color={done ? colors.success : colors.textFaint} />
              </Card>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.notice}>
        <MaterialIcons name="info-outline" size={16} color={colors.textSubtle} />
        <Text style={styles.noticeText}>
          Datele sunt folosite doar pentru verificarea identității și siguranța comunității.
        </Text>
      </View>

      <Button label="Trimite spre verificare" fullWidth size="lg" icon="verified-user" disabled={!allDone} onPress={submit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md, alignItems: 'center' },
  hero: { width: 160, height: 130 },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, textAlign: 'center' },
  sub: { fontSize: fontSize.sm, color: colors.textSubtle, textAlign: 'center' },
  docs: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.sm },
  docCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  docDone: { borderWidth: 1, borderColor: colors.primary },
  docIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  docIconDone: { backgroundColor: colors.primary },
  docLabel: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  docHint: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 1 },
  notice: { flexDirection: 'row', gap: spacing.sm, alignSelf: 'stretch', alignItems: 'center', paddingHorizontal: spacing.xs },
  noticeText: { flex: 1, fontSize: fontSize.xs, color: colors.textSubtle, lineHeight: fontSize.xs * 1.5 },
});

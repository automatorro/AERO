// AERO — Onboarding Șofer (KYC + Stripe Connect)
import { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlert } from '@/template';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Button, Card } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { getCountryDocuments, uploadDriverDocument } from '@/services/rideBackend';

export default function OnboardingScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { user, refreshUser } = useAuth();
  const insets = useSafeAreaInsets();

  const [docs, setDocs] = useState<any[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  // In a real app we'd detect country. Hardcoded 'RO' for MVP.
  const countryCode = 'RO';

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const data = await getCountryDocuments(countryCode);
      setDocs(data || []);
      // Ideally we'd also check 'driver_documents' table to see what's already uploaded
    } catch (err) {
      showAlert('Eroare', 'Nu am putut încărca lista de documente.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (docType: string) => {
    if (!user) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploading(docType);
        
        await uploadDriverDocument({
          driverId: user.id,
          docType,
          countryCode,
          fileUri: result.assets[0].uri,
          mimeType: result.assets[0].mimeType || 'image/jpeg',
        });

        setUploadedDocs((prev) => ({ ...prev, [docType]: true }));
        showAlert('Succes', 'Documentul a fost încărcat cu succes.');
      }
    } catch (err: any) {
      showAlert('Eroare Upload', err.message || 'A apărut o problemă la încărcare.');
    } finally {
      setUploading(null);
    }
  };

  const handleStripeConnect = async () => {
    // Placeholder pentru Stripe Connect OAuth flow
    await WebBrowser.openBrowserAsync('https://connect.stripe.com/express/oauth/authorize?client_id=ca_123&state=abc');
    showAlert('Stripe Connect', 'Contul tău bancar ar fi fost conectat cu succes (Demo).');
  };

  const submit = async () => {
    showAlert(
      'Trimis spre verificare',
      'Documentele tale au fost trimise. Vei putea prelua curse după aprobarea echipei AERO.',
      [{ text: 'Am înțeles', onPress: () => router.replace('/(driver)/drive') }],
    );
  };

  const requiredDocs = docs.filter(d => d.is_required);
  const allRequiredDone = requiredDocs.length > 0 && requiredDocs.every((d) => uploadedDocs[d.doc_type]);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Verificare KYC</Text>
      <Text style={styles.sub}>
        Încarcă documentele necesare pentru {countryCode}. Toate sunt obligatorii pentru activarea contului.
      </Text>

      <View style={styles.docs}>
        {docs.map((doc) => {
          const done = !!uploadedDocs[doc.doc_type];
          const isUploading = uploading === doc.doc_type;
          // doc_label_i18n is JSON like {"ro": "Permis auto", "en": "..."}
          const label = doc.doc_label_i18n?.['ro'] || doc.doc_type;

          return (
            <Pressable key={doc.doc_type} onPress={() => !done && pickImage(doc.doc_type)}>
              <Card style={[styles.docCard, done ? styles.docDone : null]} padded>
                <View style={[styles.docIcon, done ? styles.docIconDone : null]}>
                  {isUploading ? (
                    <ActivityIndicator color={colors.primary} size="small" />
                  ) : (
                    <MaterialIcons name={done ? 'check' : 'add-a-photo'} size={22} color={done ? '#fff' : colors.textSubtle} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docLabel}>{label}</Text>
                  <Text style={styles.docHint}>{done ? 'Încărcat și trimis' : 'Atinge pentru a încărca (foto)'}</Text>
                </View>
                <MaterialIcons name={done ? 'check-circle' : 'chevron-right'} size={22} color={done ? colors.success : colors.textFaint} />
              </Card>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Plăți (Stripe Connect)</Text>
      <Card style={styles.stripeCard}>
        <View style={styles.stripeTop}>
          <MaterialIcons name="account-balance" size={24} color={colors.primary} />
          <Text style={styles.stripeText}>Conectează-ți contul bancar pentru a primi plățile de la pasageri fără comision intermediar.</Text>
        </View>
        <Button label="Conectează cont bancar" variant="outline" fullWidth onPress={handleStripeConnect} />
      </Card>

      <View style={styles.notice}>
        <MaterialIcons name="info-outline" size={16} color={colors.textSubtle} />
        <Text style={styles.noticeText}>
          Datele tale sunt criptate și protejate.
        </Text>
      </View>

      <Button label="Trimite spre verificare" fullWidth size="lg" icon="verified-user" disabled={!allRequiredDone} onPress={submit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  content: { padding: spacing.md, gap: spacing.md },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
  sub: { fontSize: fontSize.sm, color: colors.textSubtle },
  docs: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.sm },
  docCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  docDone: { borderWidth: 1, borderColor: colors.primary },
  docIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  docIconDone: { backgroundColor: colors.primary },
  docLabel: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  docHint: { fontSize: fontSize.sm, color: colors.textSubtle, marginTop: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  sectionLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.text, textTransform: 'uppercase', letterSpacing: 0.5 },
  stripeCard: { gap: spacing.md, padding: spacing.md },
  stripeTop: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  stripeText: { flex: 1, fontSize: fontSize.sm, color: colors.textSubtle, lineHeight: 20 },
  notice: { flexDirection: 'row', gap: spacing.sm, alignSelf: 'stretch', alignItems: 'center', paddingHorizontal: spacing.xs },
  noticeText: { flex: 1, fontSize: fontSize.xs, color: colors.textSubtle },
});

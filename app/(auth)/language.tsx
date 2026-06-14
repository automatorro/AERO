// AERO — Language Selection
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Button } from '@/components';
import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Language } from '@/constants/locales';

const LANGUAGES: { code: Language, name: string, flag: string }[] = [
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Српски', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useI18n();
  const [selected, setSelected] = useState<Language>(language);

  const handleContinue = async () => {
    await setLanguage(selected);
    router.push('/(auth)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}>
      <View style={styles.header}>
        <MaterialIcons name="language" size={32} color={colors.primary} />
        <Text style={styles.title}>Alege limba</Text>
        <Text style={styles.subtitle}>Select language / Choisissez la langue</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {LANGUAGES.map((lang) => (
          <Pressable
            key={lang.code}
            style={[styles.langRow, selected === lang.code && styles.langRowActive]}
            onPress={() => setSelected(lang.code)}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text style={[styles.langName, selected === lang.code && styles.langNameActive]}>
              {lang.name}
            </Text>
            {selected === lang.code && (
              <MaterialIcons name="check-circle" size={24} color={colors.primary} />
            )}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Continuă" fullWidth size="lg" icon="arrow-forward" onPress={handleContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: fontSize.sm, color: colors.textSubtle, textAlign: 'center' },
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  langRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, borderWidth: 1.5, borderColor: colors.border,
  },
  langRowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  flag: { fontSize: 24 },
  langName: { flex: 1, fontSize: fontSize.lg, fontWeight: fontWeight.medium, color: colors.text },
  langNameActive: { fontWeight: fontWeight.bold, color: colors.primary },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
});

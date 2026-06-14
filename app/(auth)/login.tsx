import { useI18n } from '@/contexts/I18nContext';
// AERO — Login Screen
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { getSharedSupabaseClient } from '@/template/core/client';

export default function LoginScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError(t('login_error_empty_fields'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      const supabase = getSharedSupabaseClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (authError) throw authError;

      // Redirect pe baza rolului
      const role = data.user?.user_metadata?.role ?? 'passenger';
      if (role === 'driver') {
        router.replace('/(driver)/drive');
      } else {
        router.replace('/(passenger)/ride');
      }
    } catch (err: any) {
      setError(err?.message ?? t('login_error_auth_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.header}>
          <View style={styles.logoMini}>
            <MaterialIcons name="flight" size={18} color={colors.accent} />
            <Text style={styles.logoText}>AERO</Text>
          </View>
          <Text style={styles.title}>{t('login_welcome_back')}</Text>
          <Text style={styles.subtitle}>{t('login_subtitle')}</Text>
        </View>

        <View style={styles.form}>
          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('login_label_email')}</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="email" size={18} color={colors.textFaint} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="adresa@email.com"
                placeholderTextColor={colors.textFaint}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('login_label_password')}</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="lock" size={18} color={colors.textFaint} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingRight: 48 }]}
                placeholder={t('login_placeholder_password')}
                placeholderTextColor={colors.textFaint}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn} hitSlop={8}>
                <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={colors.textFaint} />
              </Pressable>
            </View>
          </View>

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <MaterialIcons name="error-outline" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Submit */}
          <Pressable
            style={({ pressed }) => [styles.btnPrimary, { opacity: pressed || loading ? 0.75 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnPrimaryText}>{t('login_btn_submit')}</Text>
            )}
          </Pressable>
        </View>

        {/* Register link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('login_no_account_spaced')}</Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={[styles.footerText, styles.footerLink]}>{t('login_link_register')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.lg, flexGrow: 1 },
  backBtn: { marginBottom: spacing.lg, alignSelf: 'flex-start' },
  header: { marginBottom: spacing.xl, gap: spacing.sm },
  logoMini: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  logoText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text, letterSpacing: 3 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textSubtle },
  form: { gap: spacing.md },
  fieldGroup: { gap: 6 },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.text },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    height: 52,
  },
  inputIcon: { paddingHorizontal: spacing.md },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    paddingRight: spacing.md,
  },
  eyeBtn: { position: 'absolute', right: spacing.md },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.dangerSoft,
    padding: spacing.sm + 4,
    borderRadius: radius.md,
  },
  errorText: { flex: 1, fontSize: fontSize.sm, color: colors.danger },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnPrimaryText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#FFFFFF' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { fontSize: fontSize.sm, color: colors.textSubtle },
  footerLink: { color: colors.text, fontWeight: fontWeight.bold },
});

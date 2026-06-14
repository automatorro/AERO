import { useI18n } from '@/contexts/I18nContext';
// AERO — Register Screen (Pasager & Șofer)
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { getSharedSupabaseClient } from '@/template/core/client';

type Role = 'passenger' | 'driver';

export default function RegisterScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ role?: string }>();

  const [role, setRole] = useState<Role>((params.role === 'driver' ? 'driver' : 'passenger') as Role);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  // Câmpuri extra șofer
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      setError(t('register_error_empty_fields'));
      return;
    }
    if (password.length < 6) {
      setError(t('register_error_password_length'));
      return;
    }
    if (role === 'driver' && (!carMake.trim() || !carModel.trim() || !carPlate.trim())) {
      setError(t('register_error_vehicle_data'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const supabase = getSharedSupabaseClient();

      const metadata: Record<string, any> = {
        name: name.trim(),
        phone: phone.trim(),
        role,
        driverStatus: role === 'driver' ? 'pending' : 'none',
        avatarColor: '#111111',
        rating: 5.0,
        trialEndsAt: null,
      };

      if (role === 'driver') {
        metadata.vehicle = {
          make: carMake.trim(),
          model: carModel.trim(),
          plate: carPlate.trim().toUpperCase(),
          color: '',
        };
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: metadata },
      });

      if (authError) throw authError;

      if (role === 'driver') {
        // Șoferii merg la onboarding pentru upload documente
        router.replace('/driver/onboarding');
      } else {
        // Pasagerii merg direct la home
        router.replace('/(passenger)/ride');
      }
    } catch (err: any) {
      setError(err?.message ?? t('register_error_failed'));
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
          <Text style={styles.title}>{t('register_btn_submit')}</Text>
          <Text style={styles.subtitle}>{t('register_subtitle')}</Text>
        </View>

        {/* Role toggle */}
        <View style={styles.roleToggle}>
          {(['passenger', 'driver'] as Role[]).map((r) => (
            <Pressable
              key={r}
              style={[styles.roleBtn, role === r && styles.roleBtnActive]}
              onPress={() => setRole(r)}
            >
              <MaterialIcons
                name={r === 'passenger' ? 'airline-seat-recline-normal' : 'local-taxi'}
                size={16}
                color={role === r ? '#FFFFFF' : colors.textSubtle}
              />
              <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
                {r === 'passenger' ? t('role_passenger') : t('role_driver')}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.form}>
          <Field label={t('register_label_name')} placeholder={t('register_placeholder_name')} value={name} onChangeText={setName} icon="person" />
          <Field label={t('register_label_email')} placeholder={t('register_placeholder_email')} value={email} onChangeText={setEmail} icon="email" keyboardType="email-address" autoCapitalize="none" />
          <Field label={t('register_label_phone')} placeholder={t('register_placeholder_phone')} value={phone} onChangeText={setPhone} icon="phone" keyboardType="phone-pad" />

          {/* Parolă cu toggle vizibilitate */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('register_label_password')}</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="lock" size={18} color={colors.textFaint} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingRight: 48 }]}
                placeholder={t('register_placeholder_password')}
                placeholderTextColor={colors.textFaint}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn} hitSlop={8}>
                <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={colors.textFaint} />
              </Pressable>
            </View>
          </View>

          {/* Extra câmpuri pentru șoferi */}
          {role === 'driver' && (
            <View style={styles.driverSection}>
              <View style={styles.sectionDivider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{t('register_section_vehicle')}</Text>
                <View style={styles.dividerLine} />
              </View>
              <Field label={t('register_label_car_make')} placeholder={t('register_placeholder_car_make')} value={carMake} onChangeText={setCarMake} icon="directions-car" />
              <Field label={t('register_label_car_model')} placeholder={t('register_placeholder_car_model')} value={carModel} onChangeText={setCarModel} icon="directions-car" />
              <Field label={t('register_label_car_plate')} placeholder={t('register_placeholder_car_plate')} value={carPlate} onChangeText={setCarPlate} icon="confirmation-number" autoCapitalize="characters" />

              <View style={styles.noteBox}>
                <MaterialIcons name="info-outline" size={16} color={colors.accent} />
                <Text style={styles.noteText}>
                  {t('register_driver_note')}
                </Text>
              </View>
            </View>
          )}

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
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.btnPrimaryText}>{t('register_btn_submit')}</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </Pressable>
        </View>

        {/* Login link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('register_have_account_spaced')}</Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={[styles.footerText, styles.footerLink]}>{t('register_link_login')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  keyboardType = 'default',
  autoCapitalize = 'words',
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  icon: keyof typeof MaterialIcons.glyphMap;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <MaterialIcons name={icon} size={18} color={colors.textFaint} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaint}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.lg, flexGrow: 1 },
  backBtn: { marginBottom: spacing.lg, alignSelf: 'flex-start' },
  header: { marginBottom: spacing.lg, gap: 4 },
  logoMini: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  logoText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text, letterSpacing: 3 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textSubtle },

  roleToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.lg,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  roleBtnActive: { backgroundColor: colors.primary },
  roleBtnText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSubtle },
  roleBtnTextActive: { color: '#FFFFFF' },

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
  input: { flex: 1, fontSize: fontSize.md, color: colors.text, paddingRight: spacing.md },
  eyeBtn: { position: 'absolute', right: spacing.md },

  driverSection: { gap: spacing.md },
  sectionDivider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginVertical: spacing.xs },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 1 },

  noteBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.accentSoft,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.2)',
  },
  noteText: { flex: 1, fontSize: fontSize.sm, color: colors.textSubtle, lineHeight: 20 },

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    marginTop: spacing.sm,
  },
  btnPrimaryText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#FFFFFF' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { fontSize: fontSize.sm, color: colors.textSubtle },
  footerLink: { color: colors.text, fontWeight: fontWeight.bold },
});

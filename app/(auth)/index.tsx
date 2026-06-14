// AERO — Splash / Landing Screen
import { Pressable, StyleSheet, Text, View, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useI18n } from '@/contexts/I18nContext';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      {/* Dark gradient background */}
      <LinearGradient
        colors={['#0D0D0D', '#1A1A2E', '#0D0D0D']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Grid overlay pentru efect hartă */}
      <View style={styles.gridOverlay} pointerEvents="none" />

      {/* Puncte decorative */}
      <View style={[styles.dot, { top: height * 0.15, left: width * 0.2 }]} />
      <View style={[styles.dot, styles.dotLarge, { top: height * 0.25, right: width * 0.15 }]} />
      <View style={[styles.dot, { top: height * 0.4, left: width * 0.7 }]} />
      <View style={[styles.dot, styles.dotAccent, { top: height * 0.35, left: width * 0.3 }]} />
      <View style={[styles.dot, styles.dotLarge, { top: height * 0.5, left: width * 0.55 }]} />

      {/* Linie rutieră decorativă */}
      <View style={[styles.routeLine, { top: height * 0.3 }]} />
      <View style={[styles.routeLineV, { left: width * 0.45 }]} />

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top + spacing.xl }]}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <MaterialIcons name="flight" size={22} color={colors.accent} />
          </View>
          <Text style={styles.logo}>AERO</Text>
        </View>

        <Text style={styles.tagline}>{t('landing_tagline')}</Text>
      </View>

      {/* Bottom CTA */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Text style={styles.headline}>{t('landing_headline_1')}</Text>
        <Text style={styles.headline}>{t('landing_headline_2')}</Text>
        <Text style={styles.subtext}>{t('landing_subtext')}</Text>

        {/* Buton Pasager */}
        <Pressable
          style={({ pressed }) => [styles.btnPrimary, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() => router.push('/(auth)/register?role=passenger')}
        >
          <MaterialIcons name="airline-seat-recline-normal" size={20} color={colors.primary} />
          <Text style={styles.btnPrimaryText}>{t('landing_passenger_btn')}</Text>
        </Pressable>

        {/* Buton Șofer */}
        <Pressable
          style={({ pressed }) => [styles.btnSecondary, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() => router.push('/(auth)/register?role=driver')}
        >
          <MaterialIcons name="local-taxi" size={20} color="#FFFFFF" />
          <Text style={styles.btnSecondaryText}>{t('landing_driver_btn')}</Text>
        </Pressable>

        {/* Link login */}
        <Pressable onPress={() => router.push('/(auth)/login')} style={styles.loginLink}>
          <Text style={styles.loginText}>{t('landing_login_q')}</Text>
          <Text style={[styles.loginText, styles.loginTextBold]}>{t('landing_login_link')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
  },
  dotLarge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.3,
  },
  dotAccent: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F97316',
    opacity: 0.9,
  },
  routeLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#F97316',
    opacity: 0.2,
  },
  routeLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#F97316',
    opacity: 0.15,
  },
  content: {
    paddingHorizontal: spacing.lg,
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(249,115,22,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.3)',
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  tagline: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 6,
    letterSpacing: 1,
  },
  bottom: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 38,
  },
  subtext: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
    paddingVertical: 16,
  },
  btnPrimaryText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'transparent',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 16,
  },
  btnSecondaryText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  loginText: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.5)',
  },
  loginTextBold: {
    color: '#FFFFFF',
    fontWeight: fontWeight.semibold,
  },
});

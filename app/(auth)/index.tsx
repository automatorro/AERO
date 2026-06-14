// AERO — Splash / Landing Screen
import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';

const { width, height } = Dimensions.get('window');

const demoTranslations: Record<string, Record<string, string>> = {
  ro: {
    btn: "Mod Demo (Fără cont)",
    title: "Mod Demo",
    message: "Alege un rol pentru a explora aplicația:",
    passenger: "Intră ca Pasager",
    driver: "Intră ca Șofer",
    cancel: "Anulează",
  },
  en: {
    btn: "Demo Mode (No account)",
    title: "Demo Mode",
    message: "Choose a role to explore the app:",
    passenger: "Enter as Passenger",
    driver: "Enter as Driver",
    cancel: "Cancel",
  },
  de: {
    btn: "Demo-Modus (Ohne Konto)",
    title: "Demo-Modus",
    message: "Wählen Sie eine Rolle, um die App zu erkunden:",
    passenger: "Als Fahrgast beitreten",
    driver: "Als Fahrer beitreten",
    cancel: "Abbrechen",
  },
  fr: {
    btn: "Mode Démo (Sans compte)",
    title: "Mode Démo",
    message: "Choisissez un rôle pour explorer l'application :",
    passenger: "Entrer comme Passager",
    driver: "Entrer comme Chauffeur",
    cancel: "Annuler",
  },
  it: {
    btn: "Modalità Demo (Senza account)",
    title: "Modalità Demo",
    message: "Scegli un ruolo per esplorare l'applicazione:",
    passenger: "Entra come Passeggero",
    driver: "Entra come Autista",
    cancel: "Annulla",
  },
  es: {
    btn: "Modo Demo (Sin cuenta)",
    title: "Modo Demo",
    message: "Elige un rol para explorar la aplicación:",
    passenger: "Entrar como Pasajero",
    driver: "Entrar como Conductor",
    cancel: "Cancelar",
  },
  pt: {
    btn: "Modo Demo (Sem conta)",
    title: "Modo Demo",
    message: "Escolha um papel para explorar a aplicação:",
    passenger: "Entrar como Passageiro",
    driver: "Entrar como Motorista",
    cancel: "Cancelar",
  },
  hu: {
    btn: "Demo Mód (Fiók nélkül)",
    title: "Demo Mód",
    message: "Válassz egy szerepkört az alkalmazás felfedezéséhez:",
    passenger: "Belépés utasként",
    driver: "Belépés sofőrként",
    cancel: "Mégse",
  },
  bg: {
    btn: "Демо режим (Без акаунт)",
    title: "Демо режим",
    message: "Изберете роля, за да разгледате приложението:",
    passenger: "Влез като пътник",
    driver: "Влез като шофьор",
    cancel: "Отказ",
  },
  pl: {
    btn: "Tryb demonstracyjny (Bez konta)",
    title: "Tryb demonstracyjny",
    message: "Wybierz rolę, aby zapoznać się z aplikacją:",
    passenger: "Wejdź jako Pasażer",
    driver: "Wejdź jako Kierowca",
    cancel: "Anuluj",
  },
  cs: {
    btn: "Demo režim (Bez účtu)",
    title: "Demo režim",
    message: "Vyberte roli pro prozkoumání aplikace:",
    passenger: "Vstoupit jako Cestující",
    driver: "Vstoupit jako Řidič",
    cancel: "Zrušit",
  },
  sk: {
    btn: "Demo režim (Bez účtu)",
    title: "Demo režim",
    message: "Vyberte rolu na preskúmanie aplikácie:",
    passenger: "Vstúpiť ako Cestujúci",
    driver: "Vstúpiť ako Vodič",
    cancel: "Zrušit",
  },
  hr: {
    btn: "Demo način (Bez računa)",
    title: "Demo način",
    message: "Odaberite ulogu za istraživanje aplikacije:",
    passenger: "Uđi kao putnik",
    driver: "Uđi kao vozač",
    cancel: "Odustani",
  },
  sr: {
    btn: "Demo režim (Bez naloga)",
    title: "Demo režim",
    message: "Izaberite ulogu za istraživanje aplikacije:",
    passenger: "Uđi kao putnik",
    driver: "Uđi kao vozač",
    cancel: "Otkaži",
  },
  sl: {
    btn: "Demo način (Brez računa)",
    title: "Demo način",
    message: "Izberite vlogo za raziskovanje aplikacije:",
    passenger: "Vstopi kot potnik",
    driver: "Vstopi kot voznik",
    cancel: "Prekliči",
  },
  nl: {
    btn: "Demo-modus (Zonder account)",
    title: "Demo-modus",
    message: "Kies een rol om de app te verkennen:",
    passenger: "Als passagier invoeren",
    driver: "Als chauffeur invoeren",
    cancel: "Annuleren",
  },
  el: {
    btn: "Λειτουργία Demo (Χωρίς λογαριασμό)",
    title: "Λειτουργία Demo",
    message: "Επιλέξτε έναν ρόλο για να εξερευνήσετε την εφαρμογή:",
    passenger: "Είσοδος ως Επιβάτης",
    driver: "Είσοδος ως Οδηγός",
    cancel: "Ακύρωση",
  },
  tr: {
    btn: "Demo Modu (Hesapsız)",
    title: "Demo Modu",
    message: "Uygulamayı keşfetmek için bir rol seçin:",
    passenger: "Yolcu olarak gir",
    driver: "Sürücü olarak gir",
    cancel: "İptal",
  },
  uk: {
    btn: "Демо-режим (Без аккаунта)",
    title: "Демо-режим",
    message: "Виберіть роль для ознайомлення з додатком:",
    passenger: "Увійти як Пасажир",
    driver: "Увійти як Водій",
    cancel: "Скасувати",
  },
  ru: {
    btn: "Демо-режим (Без аккаунта)",
    title: "Демо-режим",
    message: "Выберите роль для ознакомления с приложением:",
    passenger: "Войти как Пассажир",
    driver: "Войти как Водитель",
    cancel: "Отмена",
  },
  sv: {
    btn: "Demoläge (Utan konto)",
    title: "Demoläge",
    message: "Välj en roll för att utforska appen:",
    passenger: "Gå in som Passagerare",
    driver: "Gå in som Förare",
    cancel: "Avbryt",
  },
  da: {
    btn: "Demotilstand (Uden konto)",
    title: "Demotilstand",
    message: "Vælg en rolle for at udforske appen:",
    passenger: "Gå ind som Passager",
    driver: "Gå ind som Fører",
    cancel: "Annuller",
  },
  ar: {
    btn: "وضع تجريبي (بدون حساب)",
    title: "وضع تجريبي",
    message: "اختر دورًا لاستكشاف التطبيق:",
    passenger: "دخول كراكب",
    driver: "دخول كسائق",
    cancel: "إلغاء",
  }
};

const getDemoText = (key: 'btn' | 'title' | 'message' | 'passenger' | 'driver' | 'cancel', lang: string) => {
  const dict = demoTranslations[lang] || demoTranslations['en'] || demoTranslations['ro'];
  return dict[key] || demoTranslations['en'][key];
};

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, language } = useI18n();
  const { loginAsDemo } = useAuth();
  const { showAlert } = useAlert();

  const handleDemoPress = () => {
    showAlert(
      getDemoText('title', language),
      getDemoText('message', language),
      [
        {
          text: getDemoText('passenger', language),
          onPress: async () => {
            await loginAsDemo('passenger');
          }
        },
        {
          text: getDemoText('driver', language),
          onPress: async () => {
            await loginAsDemo('driver');
          }
        },
        {
          text: getDemoText('cancel', language),
          style: 'cancel'
        }
      ]
    );
  };

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

        {/* Link demo */}
        <Pressable onPress={handleDemoPress} style={styles.demoLink}>
          <Text style={styles.demoText}>{getDemoText('btn', language)}</Text>
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
    paddingVertical: spacing.xs,
  },
  loginText: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.5)',
  },
  loginTextBold: {
    color: '#FFFFFF',
    fontWeight: fontWeight.semibold,
  },
  demoLink: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  demoText: {
    fontSize: fontSize.sm,
    color: colors.accent,
    fontWeight: fontWeight.semibold,
    textDecorationLine: 'underline',
  },
});

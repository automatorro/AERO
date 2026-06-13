// AERO design tokens — negru #111111 + portocaliu #F97316

export const colors = {
  // Fundal & suprafețe
  background: '#F7F7F7',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F0F0',
  surfaceMuted: '#F5F5F5',

  // Texte
  text: '#111111',
  textSubtle: '#555555',
  textFaint: '#999999',
  textInverse: '#FFFFFF',

  // Primar — negru
  primary: '#111111',
  primaryDark: '#000000',
  primarySoft: '#E8E8E8',

  // Accent — portocaliu (status COUNTERED, negociere)
  accent: '#F97316',
  accentSoft: '#FFF0E6',
  accentDark: '#EA6A00',

  // Status-uri
  success: '#22C55E',     // ACCEPTED, Online
  successSoft: '#DCFCE7',
  danger: '#EF4444',      // SOS, erori, documente expirate
  dangerSoft: '#FEE2E2',
  warning: '#F59E0B',     // In verificare
  warningSoft: '#FEF3C7',

  // Hartă
  ink: '#111111',
  inkSoft: '#333333',
  mapBg: '#1A1A2E',
  mapGrid: '#252540',
  mapRoad: '#333355',
  routeLine: '#F97316',

  // Borduri
  border: '#E5E5E5',
  borderStrong: '#CCCCCC',
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const shadows = {
  card: {
    shadowColor: '#0E1B14',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  float: {
    shadowColor: '#0E1B14',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

export const theme = { colors, spacing, radius, fontSize, fontWeight, shadows };

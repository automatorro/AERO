// Powered by OnSpace.AI
// AERO design tokens

export const colors = {
  background: '#F3F6F4',
  surface: '#FFFFFF',
  surfaceAlt: '#EAF0EC',
  surfaceMuted: '#F0F3F1',
  text: '#0E1B14',
  textSubtle: '#5E6B64',
  textFaint: '#8A958F',
  textInverse: '#FFFFFF',
  primary: '#00B86B',
  primaryDark: '#00935A',
  primarySoft: '#DBF5E8',
  ink: '#10231A',
  inkSoft: '#1B2C24',
  mapBg: '#16241D',
  mapGrid: '#21372C',
  mapRoad: '#2E4A3C',
  routeLine: '#00D77E',
  success: '#16A34A',
  successSoft: '#DCFCE7',
  danger: '#E5484D',
  dangerSoft: '#FDE7E7',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  border: '#E1E8E3',
  borderStrong: '#CBD6CF',
  overlay: 'rgba(10,20,15,0.5)',
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

// Powered by OnSpace.AI
import { AppUser, DriverRequest, KycDoc, Place } from './types';

export const CURRENCY = 'lei';

export const AVATAR_COLORS = [
  '#00B86B', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6',
];

export function colorFromName(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) sum += name.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export function createDefaultUser(): AppUser {
  return {
    id: `u_${Date.now()}`,
    name: 'Alex Marin',
    phone: '+40 7xx xxx xxx',
    avatarColor: '#00B86B',
    rating: 4.9,
    role: 'passenger',
    driverStatus: 'none',
    trialEndsAt: null,
  };
}

// Current location anchor on the mock map
export const CURRENT_LOCATION: Place = {
  id: 'current',
  name: 'Locația ta curentă',
  address: 'Str. Lipscani 12, București',
  x: 0.5,
  y: 0.55,
};

export const PLACES: Place[] = [
  { id: 'p1', name: 'Aeroportul Otopeni', address: 'Calea Bucureștilor 224E', x: 0.78, y: 0.12 },
  { id: 'p2', name: 'Gara de Nord', address: 'Piața Gării de Nord 1', x: 0.28, y: 0.32 },
  { id: 'p3', name: 'AFI Cotroceni', address: 'Bd. Vasile Milea 4', x: 0.18, y: 0.7 },
  { id: 'p4', name: 'Piața Unirii', address: 'Piața Unirii, București', x: 0.55, y: 0.62 },
  { id: 'p5', name: 'Băneasa Shopping City', address: 'Șos. București-Ploiești 42D', x: 0.62, y: 0.18 },
  { id: 'p6', name: 'Parcul Herăstrău', address: 'Bd. Aviatorilor', x: 0.6, y: 0.34 },
  { id: 'p7', name: 'Pipera Business', address: 'Bd. Dimitrie Pompeiu', x: 0.74, y: 0.28 },
  { id: 'p8', name: 'Universitate', address: 'Piața Universității', x: 0.5, y: 0.5 },
];

export const KYC_DOCS: KycDoc[] = [
  { id: 'license', label: 'Permis de conducere', hint: 'Față și verso, clar și lizibil', uploaded: false },
  { id: 'id', label: 'Carte de identitate', hint: 'Buletin valabil', uploaded: false },
  { id: 'car', label: 'Poză cu mașina', hint: 'Exterior + plăcuța de înmatriculare', uploaded: false },
  { id: 'insurance', label: 'Asigurare RCA', hint: 'Poliță valabilă', uploaded: false },
];

const PASSENGER_NAMES = ['Ioana D.', 'Mihai R.', 'Elena S.', 'Vlad T.', 'Ana P.'];

export function seedDriverRequests(): DriverRequest[] {
  const pairs: Array<[Place, Place]> = [
    [PLACES[3], PLACES[0]],
    [PLACES[7], PLACES[2]],
    [PLACES[1], PLACES[5]],
  ];
  return pairs.map((pair, i) => {
    const [pickup, dropoff] = pair;
    const distanceKm = estimateDistance(pickup, dropoff);
    const durationMin = estimateDuration(distanceKm);
    return {
      id: `req_${i}`,
      passengerName: PASSENGER_NAMES[i % PASSENGER_NAMES.length],
      avatarColor: colorFromName(PASSENGER_NAMES[i]),
      rating: 4.6 + i * 0.1,
      pickup,
      dropoff,
      distanceKm,
      durationMin,
      offeredPrice: calcRecommendedPrice(distanceKm, durationMin) + (i === 1 ? -3 : 2),
      x: pickup.x,
      y: pickup.y,
    };
  });
}

// ---- Pricing & route math ----
export const PRICING = { base: 5, perKm: 2, perMin: 0.5 };

export function estimateDistance(a: Place, b: Place): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const km = Math.sqrt(dx * dx + dy * dy) * 22; // map scale factor
  return Math.max(1, Math.round(km * 10) / 10);
}

export function estimateDuration(distanceKm: number): number {
  return Math.max(3, Math.round(distanceKm * 2.4 + 3));
}

export function calcRecommendedPrice(distanceKm: number, durationMin: number): number {
  const raw = PRICING.base + PRICING.perKm * distanceKm + PRICING.perMin * durationMin;
  return Math.round(raw);
}

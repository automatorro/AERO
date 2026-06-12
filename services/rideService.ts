// Powered by OnSpace.AI
import { Place, RideOffer } from './types';
import {
  calcRecommendedPrice,
  colorFromName,
  estimateDistance,
  estimateDuration,
} from './mockData';

export interface RouteEstimate {
  distanceKm: number;
  durationMin: number;
  recommendedPrice: number;
}

export function estimateRoute(pickup: Place, dropoff: Place): RouteEstimate {
  const distanceKm = estimateDistance(pickup, dropoff);
  const durationMin = estimateDuration(distanceKm);
  return {
    distanceKm,
    durationMin,
    recommendedPrice: calcRecommendedPrice(distanceKm, durationMin),
  };
}

const DRIVERS = [
  { name: 'Andrei P.', vehicle: 'Dacia Logan', plate: 'B 12 AERO', trips: 1840 },
  { name: 'Maria I.', vehicle: 'Toyota Corolla', plate: 'B 88 AER', trips: 932 },
  { name: 'George N.', vehicle: 'VW Passat', plate: 'IF 04 AER', trips: 2310 },
  { name: 'Cristina B.', vehicle: 'Skoda Octavia', plate: 'B 21 AERO', trips: 540 },
  { name: 'Radu M.', vehicle: 'Hyundai i30', plate: 'B 77 AER', trips: 1290 },
];

// Generate negotiation counter-offers around the price proposed by the passenger.
export function generateOffers(offeredPrice: number): RideOffer[] {
  const deltas = [0, 5, 10, 0, 5];
  const count = 3 + Math.floor(Math.random() * 2); // 3-4 offers
  return DRIVERS.slice(0, count).map((d, i) => ({
    id: `offer_${i}_${Date.now()}`,
    driverName: d.name,
    avatarColor: colorFromName(d.name),
    rating: Math.round((4.5 + Math.random() * 0.5) * 10) / 10,
    price: offeredPrice + deltas[i],
    etaMin: 2 + Math.floor(Math.random() * 8),
    vehicle: d.vehicle,
    plate: d.plate,
    trips: d.trips,
  }));
}

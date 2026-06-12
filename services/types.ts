// Powered by OnSpace.AI
export type UserRole = 'passenger' | 'driver';
export type DriverStatus = 'none' | 'pending' | 'approved';

export interface Vehicle {
  make: string;
  model: string;
  plate: string;
  color: string;
}

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  rating: number;
  role: UserRole;
  driverStatus: DriverStatus;
  trialEndsAt: string | null; // ISO date
  vehicle?: Vehicle;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  x: number; // normalized 0..1 on the mock map
  y: number;
}

export interface RideOffer {
  id: string;
  driverName: string;
  avatarColor: string;
  rating: number;
  price: number;
  etaMin: number;
  vehicle: string;
  plate: string;
  trips: number;
}

export type RideStatus =
  | 'idle'
  | 'selected'
  | 'requesting'
  | 'offers'
  | 'accepted'
  | 'inprogress'
  | 'completed'
  | 'cancelled';

export interface Ride {
  id: string;
  pickup: Place;
  dropoff: Place;
  distanceKm: number;
  durationMin: number;
  basePrice: number;
  offeredPrice: number;
  finalPrice?: number;
  offer?: RideOffer;
  status: RideStatus;
  createdAt: string;
}

export interface DriverRequest {
  id: string;
  passengerName: string;
  avatarColor: string;
  rating: number;
  pickup: Place;
  dropoff: Place;
  distanceKm: number;
  durationMin: number;
  offeredPrice: number;
  x: number;
  y: number;
}

export interface SafetyAction {
  id: string;
  type: 'report' | 'block';
  targetName: string;
  reason?: string;
  createdAt: string;
}

export interface KycDoc {
  id: string;
  label: string;
  hint: string;
  uploaded: boolean;
}

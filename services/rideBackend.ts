// @ts-nocheck
import { getSharedSupabaseClient } from '@/template/core/client';
import { DriverRequest, Place, Ride, RideOffer } from './types';
import { calcRecommendedPrice, colorFromName, estimateDistance, estimateDuration, seedDriverRequests } from './mockData';
import { generateOffers } from './rideService';

const DRIVER_REQUESTS_TABLE = 'ride_requests';
const RIDES_TABLE = 'rides';

function toPlace(value: any, fallback: Place): Place {
  if (!value || typeof value !== 'object') return fallback;

  return {
    id: value.id ?? fallback.id,
    name: value.name ?? fallback.name,
    address: value.address ?? fallback.address,
    x: typeof value.x === 'number' ? value.x : fallback.x,
    y: typeof value.y === 'number' ? value.y : fallback.y,
  };
}

function toDriverRequest(row: any): DriverRequest {
  const payload = row?.payload ?? row;
  const fallback = seedDriverRequests()[0];
  const pickup = toPlace(payload.pickup, fallback.pickup);
  const dropoff = toPlace(payload.dropoff, fallback.dropoff);
  const passengerName = payload.passengerName ?? payload.passenger_name ?? row.passenger_name ?? fallback.passengerName;

  return {
    id: row.id ?? payload.id ?? `req_${Date.now()}`,
    passengerName,
    avatarColor: payload.avatarColor ?? payload.avatar_color ?? row.avatar_color ?? colorFromName(passengerName),
    rating: typeof payload.rating === 'number' ? payload.rating : row.rating ?? fallback.rating,
    pickup,
    dropoff,
    distanceKm: typeof payload.distanceKm === 'number'
      ? payload.distanceKm
      : typeof payload.distance_km === 'number'
        ? payload.distance_km
        : typeof row.distance_km === 'number'
          ? row.distance_km
          : estimateDistance(pickup, dropoff),
    durationMin: typeof payload.durationMin === 'number'
      ? payload.durationMin
      : typeof payload.duration_min === 'number'
        ? payload.duration_min
        : typeof row.duration_min === 'number'
          ? row.duration_min
          : estimateDuration(estimateDistance(pickup, dropoff)),
    offeredPrice:
      typeof payload.offeredPrice === 'number'
        ? payload.offeredPrice
        : typeof payload.offered_price === 'number'
          ? payload.offered_price
          : row.offered_price ?? calcRecommendedPrice(estimateDistance(pickup, dropoff), estimateDuration(estimateDistance(pickup, dropoff))),
    x: typeof payload.x === 'number' ? payload.x : typeof row.x === 'number' ? row.x : pickup.x,
    y: typeof payload.y === 'number' ? payload.y : typeof row.y === 'number' ? row.y : pickup.y,
  };
}

function toRide(row: any): Ride {
  const payload = row?.payload ?? row;
  const fallbackRequests = seedDriverRequests();
  const fallbackPickup = fallbackRequests[0].pickup;
  const fallbackDropoff = fallbackRequests[0].dropoff;
  const pickup = toPlace(payload.pickup, fallbackPickup);
  const dropoff = toPlace(payload.dropoff, fallbackDropoff);
  const offeredPrice =
    typeof payload.offeredPrice === 'number'
      ? payload.offeredPrice
      : typeof payload.offered_price === 'number'
        ? payload.offered_price
        : row.offered_price ?? 0;
  const finalPrice =
    typeof payload.finalPrice === 'number'
      ? payload.finalPrice
      : typeof payload.final_price === 'number'
        ? payload.final_price
        : row.final_price ?? offeredPrice;
  const offerPayload = payload.offer ?? row.offer ?? null;
  const offer: RideOffer | undefined = offerPayload
    ? {
        id: offerPayload.id ?? 'offer_supabase',
        driverName: offerPayload.driverName ?? offerPayload.driver_name ?? 'Șofer AERO',
        avatarColor: offerPayload.avatarColor ?? offerPayload.avatar_color ?? colorFromName(offerPayload.driverName ?? offerPayload.driver_name ?? 'Șofer AERO'),
        rating: offerPayload.rating ?? 4.8,
        price: offerPayload.price ?? finalPrice,
        etaMin: offerPayload.etaMin ?? offerPayload.eta_min ?? 4,
        vehicle: offerPayload.vehicle ?? '',
        plate: offerPayload.plate ?? '',
        trips: offerPayload.trips ?? 0,
      }
    : undefined;

  return {
    id: row.id ?? payload.id ?? `ride_${Date.now()}`,
    pickup,
    dropoff,
    distanceKm:
      typeof payload.distanceKm === 'number'
        ? payload.distanceKm
        : typeof payload.distance_km === 'number'
          ? payload.distance_km
          : row.distance_km ?? estimateDistance(pickup, dropoff),
    durationMin:
      typeof payload.durationMin === 'number'
        ? payload.durationMin
        : typeof payload.duration_min === 'number'
          ? payload.duration_min
          : row.duration_min ?? estimateDuration(estimateDistance(pickup, dropoff)),
    basePrice:
      typeof payload.basePrice === 'number'
        ? payload.basePrice
        : typeof payload.base_price === 'number'
          ? payload.base_price
          : row.base_price ?? offeredPrice,
    offeredPrice,
    finalPrice,
    offer,
    status: payload.status ?? row.status ?? 'accepted',
    createdAt: payload.createdAt ?? payload.created_at ?? row.created_at ?? new Date().toISOString(),
  };
}

async function withFallback<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch {
    return fallback;
  }
}

export async function loadNearbyDriverRequests(ownerId?: string): Promise<DriverRequest[]> {
  return withFallback(async () => {
    const client = getSharedSupabaseClient();
    let query = client
      .from(DRIVER_REQUESTS_TABLE)
      .select('*')
      .eq('kind', 'passenger_request')
      .eq('status', 'searching')
      .order('created_at', { ascending: false })
      .limit(20);

    if (ownerId) {
      query = query.neq('owner_id', ownerId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const requests = (data ?? []).map(toDriverRequest);
    return requests.length > 0 ? requests : seedDriverRequests();
  }, seedDriverRequests());
}

export async function savePassengerRideRequest(input: {
  ownerId?: string;
  pickup: Place;
  dropoff: Place;
  distanceKm: number;
  durationMin: number;
  offeredPrice: number;
}) {
  return withFallback(async () => {
    const client = getSharedSupabaseClient();
    const payload = {
      owner_id: input.ownerId ?? null,
      kind: 'passenger_request',
      passenger_name: input.ownerId ?? 'Pasager',
      avatar_color: '#00B86B',
      rating: 4.9,
      pickup: input.pickup,
      dropoff: input.dropoff,
      distance_km: input.distanceKm,
      duration_min: input.durationMin,
      offered_price: input.offeredPrice,
      status: 'searching',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client.from(DRIVER_REQUESTS_TABLE).insert([payload]).select('*').single();
    if (error) throw error;
    return data;
  }, null);
}

export async function saveRide(input: {
  ownerId?: string;
  ride: Ride;
  status?: Ride['status'];
}) {
  return withFallback(async () => {
    const client = getSharedSupabaseClient();
    const payload = {
      owner_id: input.ownerId ?? null,
      kind: 'ride',
      pickup: input.ride.pickup,
      dropoff: input.ride.dropoff,
      distance_km: input.ride.distanceKm,
      duration_min: input.ride.durationMin,
      base_price: input.ride.basePrice,
      offered_price: input.ride.offeredPrice,
      final_price: input.ride.finalPrice ?? input.ride.offer?.price ?? input.ride.offeredPrice,
      offer: input.ride.offer ?? null,
      status: input.status ?? input.ride.status,
      created_at: input.ride.createdAt,
      updated_at: input.ride.createdAt,
    };

    const { data, error } = await client.from(RIDES_TABLE).insert([payload]).select('*').single();
    if (error) throw error;
    return data;
  }, null);
}

export async function updateRideStatus(input: {
  rideId: string;
  status: Ride['status'];
  ownerId?: string;
}) {
  return withFallback(async () => {
    const client = getSharedSupabaseClient();
    const { error } = await client
      .from(RIDES_TABLE)
      .update({ status: input.status, updated_at: new Date().toISOString() })
      .eq('id', input.rideId)
      .maybeSingle();

    if (error) throw error;
    return true;
  }, false);
}

export async function claimDriverRequest(input: {
  requestId: string;
  ownerId?: string;
  ride: Ride;
}) {
  return withFallback(async () => {
    const client = getSharedSupabaseClient();
    const updates = {
      owner_id: input.ownerId ?? null,
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: requestError } = await client
      .from(DRIVER_REQUESTS_TABLE)
      .update(updates)
      .eq('id', input.requestId);

    if (requestError) throw requestError;

    const { error: rideError } = await client.from(RIDES_TABLE).insert([
      {
        owner_id: input.ownerId ?? null,
        kind: 'driver',
        status: 'accepted',
        pickup: input.ride.pickup,
        dropoff: input.ride.dropoff,
        distance_km: input.ride.distanceKm,
        duration_min: input.ride.durationMin,
        base_price: input.ride.basePrice,
        offered_price: input.ride.offeredPrice,
        final_price: input.ride.finalPrice ?? input.ride.offer?.price ?? input.ride.offeredPrice,
        offer: input.ride.offer ?? null,
        created_at: input.ride.createdAt,
        updated_at: input.ride.createdAt,
      },
    ]);

    if (rideError) throw rideError;
    return true;
  }, false);
}

export async function loadRideHistory(ownerId?: string): Promise<Ride[]> {
  return withFallback(async () => {
    const client = getSharedSupabaseClient();
    let query = client.from(RIDES_TABLE).select('*').order('created_at', { ascending: false }).limit(20);

    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map(toRide);
  }, []);
}

export async function getCountryDocuments(countryCode: string) {
  return withFallback(async () => {
    const client = getSharedSupabaseClient();
    const { data, error } = await client
      .from('country_documents')
      .select('*')
      .eq('country_code', countryCode)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  }, []);
}

export async function uploadDriverDocument(input: {
  driverId: string;
  docType: string;
  countryCode: string;
  fileUri: string;
  mimeType: string;
}) {
  const client = getSharedSupabaseClient();

  // 1. Convertire fisier local in Blob (sau base64 conform Supabase pe RN)
  const ext = input.fileUri.split('.').pop() || 'jpg';
  const fileName = `${input.driverId}/${input.docType}_${Date.now()}.${ext}`;
  
  // Fetch nu merge mereu perfect in React Native pentru fișiere locale cu Supabase, 
  // dar FormData sau arrayBuffer merge. Pentru simplitate, simulam upload-ul sau folosim FormData.
  const formData = new FormData();
  formData.append('file', {
    uri: input.fileUri,
    name: fileName,
    type: input.mimeType,
  } as any);

  // In mediu de productie s-ar folosi fetch(input.fileUri).then(r => r.blob())
  const { data: uploadData, error: uploadError } = await client.storage
    .from('driver_documents')
    .upload(fileName, formData);

  if (uploadError) throw uploadError;

  // 2. Inserare referinta (calea fișierului) in baza de date
  // NU folosim getPublicUrl deoarece documentele (buletin, permis) trebuie să fie PRIVATE.
  const { data, error } = await client
    .from('driver_documents')
    .insert([
      {
        driver_id: input.driverId,
        doc_type: input.docType,
        country_code: input.countryCode,
        file_url: fileName, // Salvăm doar calea în bucket, adminul va genera un signed URL
        status: 'pending',
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function triggerSOS(userId: string, targetName: string) {
  return withFallback(async () => {
    const client = getSharedSupabaseClient();
    const { error } = await client.from('safety_actions').insert([
      {
        user_id: userId,
        type: 'sos',
        target_name: targetName,
        reason: 'Emergency triggered in-app',
      }
    ]);
    if (error) throw error;
    return true;
  }, false);
}

export async function sendChatMessage(rideId: string, senderId: string, text: string) {
  return withFallback(async () => {
    const client = getSharedSupabaseClient();
    const { data, error } = await client.from('messages').insert([
      { ride_id: rideId, sender_id: senderId, text }
    ]).select().single();
    if (error) throw error;
    return data;
  }, null);
}

export async function loadChatMessages(rideId: string) {
  return withFallback(async () => {
    const client = getSharedSupabaseClient();
    const { data, error } = await client
      .from('messages')
      .select('*')
      .eq('ride_id', rideId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data ?? [];
  }, []);
}

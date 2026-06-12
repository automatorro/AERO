// Powered by OnSpace.AI
import { createContext, useCallback, useMemo, useRef, useState, ReactNode } from 'react';
import { DriverRequest, Place, Ride, RideOffer, RideStatus } from '@/services/types';
import { CURRENT_LOCATION, seedDriverRequests } from '@/services/mockData';
import { estimateRoute, generateOffers } from '@/services/rideService';

interface RideContextValue {
  // passenger flow
  pickup: Place;
  dropoff: Place | null;
  distanceKm: number;
  durationMin: number;
  recommendedPrice: number;
  offeredPrice: number;
  status: RideStatus;
  offers: RideOffer[];
  activeRide: Ride | null;
  history: Ride[];
  setDropoff: (place: Place) => void;
  adjustPrice: (deltaPct: number) => void;
  resetPrice: () => void;
  sendRequest: () => void;
  acceptOffer: (offer: RideOffer) => void;
  startRide: () => void;
  completeRide: () => void;
  cancelRide: () => void;
  // driver flow
  isOnline: boolean;
  nearbyRequests: DriverRequest[];
  driverActiveRide: Ride | null;
  goOnline: () => void;
  goOffline: () => void;
  acceptRequest: (req: DriverRequest, extra?: number) => void;
  ignoreRequest: (id: string) => void;
  completeDriverRide: () => void;
}

export const RideContext = createContext<RideContextValue | undefined>(undefined);

export function RideProvider({ children }: { children: ReactNode }) {
  const pickup = CURRENT_LOCATION;
  const [dropoff, setDropoffState] = useState<Place | null>(null);
  const [distanceKm, setDistanceKm] = useState(0);
  const [durationMin, setDurationMin] = useState(0);
  const [recommendedPrice, setRecommendedPrice] = useState(0);
  const [offeredPrice, setOfferedPrice] = useState(0);
  const [status, setStatus] = useState<RideStatus>('idle');
  const [offers, setOffers] = useState<RideOffer[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [history, setHistory] = useState<Ride[]>([]);

  const [isOnline, setIsOnline] = useState(false);
  const [nearbyRequests, setNearbyRequests] = useState<DriverRequest[]>([]);
  const [driverActiveRide, setDriverActiveRide] = useState<Ride | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setDropoff = useCallback(
    (place: Place) => {
      const est = estimateRoute(pickup, place);
      setDropoffState(place);
      setDistanceKm(est.distanceKm);
      setDurationMin(est.durationMin);
      setRecommendedPrice(est.recommendedPrice);
      setOfferedPrice(est.recommendedPrice);
      setStatus('selected');
      setOffers([]);
    },
    [pickup],
  );

  const adjustPrice = useCallback(
    (deltaPct: number) => {
      setOfferedPrice((prev) => {
        const min = Math.round(recommendedPrice * 0.6);
        const max = Math.round(recommendedPrice * 2);
        const next = Math.round(prev + recommendedPrice * (deltaPct / 100));
        return Math.min(max, Math.max(min, next));
      });
    },
    [recommendedPrice],
  );

  const resetPrice = useCallback(() => setOfferedPrice(recommendedPrice), [recommendedPrice]);

  const sendRequest = useCallback(() => {
    if (!dropoff) return;
    setStatus('requesting');
    setOffers([]);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setOffers(generateOffers(offeredPrice));
      setStatus('offers');
    }, 2200);
  }, [dropoff, offeredPrice]);

  const acceptOffer = useCallback(
    (offer: RideOffer) => {
      if (!dropoff) return;
      const ride: Ride = {
        id: `ride_${Date.now()}`,
        pickup,
        dropoff,
        distanceKm,
        durationMin,
        basePrice: recommendedPrice,
        offeredPrice,
        finalPrice: offer.price,
        offer,
        status: 'accepted',
        createdAt: new Date().toISOString(),
      };
      setActiveRide(ride);
      setStatus('accepted');
    },
    [dropoff, pickup, distanceKm, durationMin, recommendedPrice, offeredPrice],
  );

  const startRide = useCallback(() => {
    setActiveRide((prev) => (prev ? { ...prev, status: 'inprogress' } : prev));
    setStatus('inprogress');
  }, []);

  const resetPassenger = useCallback(() => {
    setDropoffState(null);
    setDistanceKm(0);
    setDurationMin(0);
    setRecommendedPrice(0);
    setOfferedPrice(0);
    setOffers([]);
    setStatus('idle');
    setActiveRide(null);
  }, []);

  const completeRide = useCallback(() => {
    setActiveRide((prev) => {
      if (prev) {
        const done: Ride = { ...prev, status: 'completed' };
        setHistory((h) => [done, ...h]);
      }
      return prev;
    });
    resetPassenger();
  }, [resetPassenger]);

  const cancelRide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    resetPassenger();
  }, [resetPassenger]);

  // ---- Driver ----
  const goOnline = useCallback(() => {
    setIsOnline(true);
    setNearbyRequests(seedDriverRequests());
  }, []);

  const goOffline = useCallback(() => {
    setIsOnline(false);
    setNearbyRequests([]);
  }, []);

  const acceptRequest = useCallback((req: DriverRequest, extra = 0) => {
    const ride: Ride = {
      id: `dride_${Date.now()}`,
      pickup: req.pickup,
      dropoff: req.dropoff,
      distanceKm: req.distanceKm,
      durationMin: req.durationMin,
      basePrice: req.offeredPrice,
      offeredPrice: req.offeredPrice,
      finalPrice: req.offeredPrice + extra,
      offer: {
        id: 'self',
        driverName: req.passengerName,
        avatarColor: req.avatarColor,
        rating: req.rating,
        price: req.offeredPrice + extra,
        etaMin: 4,
        vehicle: '',
        plate: '',
        trips: 0,
      },
      status: 'accepted',
      createdAt: new Date().toISOString(),
    };
    setDriverActiveRide(ride);
    setNearbyRequests((prev) => prev.filter((r) => r.id !== req.id));
  }, []);

  const ignoreRequest = useCallback((id: string) => {
    setNearbyRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const completeDriverRide = useCallback(() => {
    setDriverActiveRide((prev) => {
      if (prev) {
        const done: Ride = { ...prev, status: 'completed' };
        setHistory((h) => [done, ...h]);
      }
      return null;
    });
  }, []);

  const value = useMemo(
    () => ({
      pickup,
      dropoff,
      distanceKm,
      durationMin,
      recommendedPrice,
      offeredPrice,
      status,
      offers,
      activeRide,
      history,
      setDropoff,
      adjustPrice,
      resetPrice,
      sendRequest,
      acceptOffer,
      startRide,
      completeRide,
      cancelRide,
      isOnline,
      nearbyRequests,
      driverActiveRide,
      goOnline,
      goOffline,
      acceptRequest,
      ignoreRequest,
      completeDriverRide,
    }),
    [
      pickup,
      dropoff,
      distanceKm,
      durationMin,
      recommendedPrice,
      offeredPrice,
      status,
      offers,
      activeRide,
      history,
      setDropoff,
      adjustPrice,
      resetPrice,
      sendRequest,
      acceptOffer,
      startRide,
      completeRide,
      cancelRide,
      isOnline,
      nearbyRequests,
      driverActiveRide,
      goOnline,
      goOffline,
      acceptRequest,
      ignoreRequest,
      completeDriverRide,
    ],
  );

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
}

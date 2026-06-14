// Powered by OnSpace.AI
import { createContext, useCallback, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { DriverRequest, Place, Ride, RideOffer, RideStatus } from '@/services/types';
import { CURRENT_LOCATION, seedDriverRequests } from '@/services/mockData';
import { estimateRoute, generateOffers } from '@/services/rideService';
import { useAuth } from '@/hooks/useAuth';
import {
  claimDriverRequest,
  loadNearbyDriverRequests,
  loadRideHistory,
  savePassengerRideRequest,
  saveRide,
  updateRideStatus,
} from '@/services/rideBackend';
import { AeroNotifications } from '@/services/notifications';

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
  const { user } = useAuth();
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

  useEffect(() => {
    let mounted = true;

    const syncDriverRequests = async () => {
      const requests = await loadNearbyDriverRequests(user?.id);
      if (!mounted) return;

      setNearbyRequests(requests.length > 0 ? requests : seedDriverRequests());
    };

    const syncHistory = async () => {
      const rides = await loadRideHistory(user?.id);
      if (!mounted) return;

      setHistory(rides);
    };

    void syncDriverRequests();
    void syncHistory();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

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
      const newOffers = generateOffers(offeredPrice);
      setOffers(newOffers);
      setStatus('offers');
      // Notificare: s-au primit oferte
      if (newOffers.length > 0) {
        AeroNotifications.counterOffer(newOffers[0].driverName, String(newOffers[0].price));
      }
    }, 2200);

    void savePassengerRideRequest({
      ownerId: user?.id,
      passengerName: user?.name,
      avatarColor: user?.avatarColor,
      rating: user?.rating,
      pickup,
      dropoff,
      distanceKm,
      durationMin,
      offeredPrice,
    });
  }, [dropoff, offeredPrice, user?.id, pickup, distanceKm, durationMin]);

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
      // Notificare: cursa a fost acceptata
      AeroNotifications.rideAccepted(offer.driverName, offer.etaMin);

      void saveRide({
        ownerId: user?.id,
        ride,
        status: 'accepted',
      });
    },
    [dropoff, pickup, distanceKm, durationMin, recommendedPrice, offeredPrice, user?.id],
  );

  const startRide = useCallback(() => {
    setActiveRide((prev) => {
      if (!prev) return prev;
      void updateRideStatus({ rideId: prev.id, status: 'inprogress', ownerId: user?.id });
      return { ...prev, status: 'inprogress' };
    });
    setStatus('inprogress');
  }, [user?.id]);

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
        void updateRideStatus({ rideId: prev.id, status: 'completed', ownerId: user?.id });
      }
      return prev;
    });
    // Notificare: cursa finalizata
    AeroNotifications.rideCompleted(String(activeRide?.finalPrice ?? ''));
    resetPassenger();
  }, [resetPassenger, user?.id]);

  const cancelRide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveRide((prev) => {
      if (prev) {
        void updateRideStatus({ rideId: prev.id, status: 'cancelled', ownerId: user?.id });
      }
      return prev;
    });
    resetPassenger();
  }, [resetPassenger, user?.id]);

  // ---- Driver ----
  const goOnline = useCallback(() => {
    setIsOnline(true);
    setNearbyRequests(seedDriverRequests());

    void loadNearbyDriverRequests(user?.id).then((requests) => {
      setNearbyRequests(requests.length > 0 ? requests : seedDriverRequests());
    });
  }, [user?.id]);

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

    void claimDriverRequest({
      requestId: req.id,
      ownerId: user?.id,
      ride,
    });
    // Notificare: cerere noua de cursa acceptata de sofer
    AeroNotifications.newRideRequest(req.pickup.name, String(req.offeredPrice));
  }, [user?.id]);

  const ignoreRequest = useCallback((id: string) => {
    setNearbyRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const completeDriverRide = useCallback(() => {
    setDriverActiveRide((prev) => {
      if (prev) {
        const done: Ride = { ...prev, status: 'completed' };
        setHistory((h) => [done, ...h]);
        void updateRideStatus({ rideId: prev.id, status: 'completed', ownerId: user?.id });
      }
      return null;
    });
  }, [user?.id]);

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

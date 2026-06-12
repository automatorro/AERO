// Powered by OnSpace.AI
import { createContext, useCallback, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUser, SafetyAction, UserRole, Vehicle } from '@/services/types';
import { colorFromName, createDefaultUser } from '@/services/mockData';
import { getSharedSupabaseClient } from '@/template/core/client';

const STORAGE_KEY = 'aero.user';
const SAFETY_KEY = 'aero.safety';
const DEFAULT_TRIAL_MONTHS = 3;

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  isTrialActive: boolean;
  trialDaysLeft: number;
  safetyActions: SafetyAction[];
  setRole: (role: UserRole) => void;
  submitKyc: (vehicle: Vehicle) => void;
  approveDriverMock: () => void;
  renewSubscriptionMock: () => void;
  reportUser: (targetName: string, reason: string) => void;
  blockUser: (targetName: string) => void;
  deleteAccount: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function mergeUserProfile(base: AppUser, patch: Partial<AppUser>): AppUser {
  return {
    ...base,
    ...patch,
    vehicle: patch.vehicle ?? base.vehicle,
  };
}

function mapSupabaseUserToAppUser(sessionUser: any, fallback: AppUser): AppUser {
  const metadata = sessionUser?.user_metadata ?? {};
  const name =
    metadata.name ||
    metadata.username ||
    metadata.full_name ||
    sessionUser?.email?.split('@')[0] ||
    fallback.name;

  return mergeUserProfile(fallback, {
    id: sessionUser.id,
    name,
    phone: metadata.phone || fallback.phone,
    avatarColor: metadata.avatarColor || colorFromName(name),
    rating: typeof metadata.rating === 'number' ? metadata.rating : fallback.rating,
    role: metadata.role === 'driver' ? 'driver' : 'passenger',
    driverStatus:
      metadata.driverStatus === 'pending' || metadata.driverStatus === 'approved'
        ? metadata.driverStatus
        : 'none',
    trialEndsAt: typeof metadata.trialEndsAt === 'string' ? metadata.trialEndsAt : null,
    vehicle: metadata.vehicle ?? fallback.vehicle,
  });
}

function toSupabaseMetadata(user: AppUser) {
  return {
    name: user.name,
    phone: user.phone,
    avatarColor: user.avatarColor,
    rating: user.rating,
    role: user.role,
    driverStatus: user.driverStatus,
    trialEndsAt: user.trialEndsAt,
    vehicle: user.vehicle ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(createDefaultUser());
  const [safetyActions, setSafetyActions] = useState<SafetyAction[]>([]);
  const [loading, setLoading] = useState(true);
  const userRef = useRef<AppUser | null>(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const persistUser = useCallback(async (next: AppUser) => {
    userRef.current = next;
    setUser(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    try {
      const client = getSharedSupabaseClient();
      const { data: { user: sessionUser } } = await client.auth.getUser();
      if (!sessionUser) return;

      await client.auth.updateUser({ data: toSupabaseMetadata(next) });
    } catch {
      // Keep the local profile usable even when there is no signed-in Supabase session.
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const initialize = async () => {
      try {
        const [rawUser, rawSafety] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(SAFETY_KEY),
        ]);

        if (!mounted) return;

        const storedUser = safeParse<AppUser>(rawUser, createDefaultUser());
        const storedSafety = safeParse<SafetyAction[]>(rawSafety, []);

        setUser(storedUser);
        userRef.current = storedUser;
        setSafetyActions(storedSafety);

        const client = getSharedSupabaseClient();
        const { data: { session } } = await client.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          const hydrated = mapSupabaseUserToAppUser(session.user, storedUser);
          userRef.current = hydrated;
          setUser(hydrated);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
        }

        const { data: { subscription: authSubscription } } = client.auth.onAuthStateChange(async (_event, nextSession) => {
          if (!mounted) return;

          if (!nextSession?.user) {
            const fallbackUser = userRef.current ?? storedUser ?? createDefaultUser();
            userRef.current = fallbackUser;
            setUser(fallbackUser);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
            return;
          }

          const nextUser = mapSupabaseUserToAppUser(
            nextSession.user,
            userRef.current ?? storedUser ?? createDefaultUser(),
          );

          userRef.current = nextUser;
          setUser(nextUser);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        });

        subscription = authSubscription;
      } catch {
        if (!mounted) return;
        setUser((current) => current ?? createDefaultUser());
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const updateUser = useCallback(
    (updater: (current: AppUser) => AppUser) => {
      const current = userRef.current ?? createDefaultUser();
      const next = updater(current);
      void persistUser(next);
    },
    [persistUser],
  );

  const persistSafety = useCallback((next: SafetyAction[]) => {
    setSafetyActions(next);
    AsyncStorage.setItem(SAFETY_KEY, JSON.stringify(next)).catch(() => undefined);
  }, []);

  const setRole = useCallback(
    (role: UserRole) => {
      const current = userRef.current;
      if (!current) return;
      if (role === 'driver' && current.driverStatus !== 'approved') return;
      updateUser((profile) => ({ ...profile, role }));
    },
    [updateUser],
  );

  const submitKyc = useCallback(
    (vehicle: Vehicle) => {
      if (!userRef.current) return;
      updateUser((profile) => ({ ...profile, driverStatus: 'pending', vehicle }));
    },
    [updateUser],
  );

  const approveDriverMock = useCallback(() => {
    if (!userRef.current) return;
    updateUser((profile) => ({
      ...profile,
      driverStatus: 'approved',
      trialEndsAt: addMonths(new Date(), DEFAULT_TRIAL_MONTHS).toISOString(),
    }));
  }, [updateUser]);

  const renewSubscriptionMock = useCallback(() => {
    if (!userRef.current) return;
    updateUser((profile) => ({ ...profile, trialEndsAt: addMonths(new Date(), 1).toISOString() }));
  }, [updateUser]);

  const reportUser = useCallback(
    (targetName: string, reason: string) => {
      const action: SafetyAction = {
        id: `rep_${Date.now()}`,
        type: 'report',
        targetName,
        reason,
        createdAt: new Date().toISOString(),
      };
      persistSafety([action, ...safetyActions]);
    },
    [safetyActions, persistSafety],
  );

  const blockUser = useCallback(
    (targetName: string) => {
      const action: SafetyAction = {
        id: `blk_${Date.now()}`,
        type: 'block',
        targetName,
        createdAt: new Date().toISOString(),
      };
      persistSafety([action, ...safetyActions]);
    },
    [safetyActions, persistSafety],
  );

  const deleteAccount = useCallback(() => {
    const fresh = createDefaultUser();
    fresh.name = 'Utilizator nou';
    void persistUser(fresh);
    persistSafety([]);

    try {
      const client = getSharedSupabaseClient();
      void client.auth.signOut();
    } catch {
      // Local profile reset is enough if no Supabase session exists.
    }
  }, [persistUser, persistSafety]);

  const isTrialActive = useMemo(() => {
    if (!user || user.driverStatus !== 'approved' || !user.trialEndsAt) return false;
    return new Date(user.trialEndsAt).getTime() > Date.now();
  }, [user]);

  const trialDaysLeft = useMemo(() => {
    if (!user?.trialEndsAt) return 0;
    const diff = new Date(user.trialEndsAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isTrialActive,
      trialDaysLeft,
      safetyActions,
      setRole,
      submitKyc,
      approveDriverMock,
      renewSubscriptionMock,
      reportUser,
      blockUser,
      deleteAccount,
    }),
    [
      user,
      loading,
      isTrialActive,
      trialDaysLeft,
      safetyActions,
      setRole,
      submitKyc,
      approveDriverMock,
      renewSubscriptionMock,
      reportUser,
      blockUser,
      deleteAccount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

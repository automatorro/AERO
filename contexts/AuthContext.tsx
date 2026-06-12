// Powered by OnSpace.AI
import { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUser, SafetyAction, UserRole, Vehicle } from '@/services/types';
import { createDefaultUser } from '@/services/mockData';

const STORAGE_KEY = 'aero.user';
const SAFETY_KEY = 'aero.safety';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [safetyActions, setSafetyActions] = useState<SafetyAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const safetyRaw = await AsyncStorage.getItem(SAFETY_KEY);
        setUser(raw ? (JSON.parse(raw) as AppUser) : createDefaultUser());
        if (safetyRaw) setSafetyActions(JSON.parse(safetyRaw) as SafetyAction[]);
      } catch {
        setUser(createDefaultUser());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback((next: AppUser) => {
    setUser(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
  }, []);

  const persistSafety = useCallback((next: SafetyAction[]) => {
    setSafetyActions(next);
    AsyncStorage.setItem(SAFETY_KEY, JSON.stringify(next)).catch(() => undefined);
  }, []);

  const setRole = useCallback(
    (role: UserRole) => {
      if (!user) return;
      if (role === 'driver' && user.driverStatus !== 'approved') return;
      persist({ ...user, role });
    },
    [user, persist],
  );

  const submitKyc = useCallback(
    (vehicle: Vehicle) => {
      if (!user) return;
      persist({ ...user, driverStatus: 'pending', vehicle });
    },
    [user, persist],
  );

  // Mock of the admin approval performed from the web backend.
  const approveDriverMock = useCallback(() => {
    if (!user) return;
    persist({
      ...user,
      driverStatus: 'approved',
      trialEndsAt: addMonths(new Date(), 3).toISOString(),
    });
  }, [user, persist]);

  const renewSubscriptionMock = useCallback(() => {
    if (!user) return;
    persist({ ...user, trialEndsAt: addMonths(new Date(), 1).toISOString() });
  }, [user, persist]);

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
    persist(fresh);
    persistSafety([]);
  }, [persist, persistSafety]);

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

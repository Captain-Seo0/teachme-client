import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { supabase } from '@/lib/supabase';

type AuthContextValue = {
  session: Session | null;
  /** True until the stored session has been read. */
  loading: boolean;
  /** Launch gate: false until the splash animation has finished once per app launch. */
  splashDone: boolean;
  completeSplash: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setLoading(false));

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Refresh tokens only while the app is in the foreground (Supabase RN guidance).
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });
    supabase.auth.startAutoRefresh();
    return () => {
      sub.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  const completeSplash = useCallback(() => setSplashDone(true), []);

  const value = useMemo(
    () => ({ session, loading, splashDone, completeSplash }),
    [session, loading, splashDone, completeSplash],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

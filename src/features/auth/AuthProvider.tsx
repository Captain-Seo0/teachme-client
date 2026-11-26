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
import type { Profile } from '@/types/profile';

import { fetchProfile } from '../onboarding/profileService';
import { AuthUiError, toAuthMessage } from './authErrors';

/**
 * Profile lookup state. A profiles row means onboarding is complete.
 * - loading: session or profile is still being read
 * - none:    signed out, or signed in without a profiles row (onboarding needed)
 * - ready:   profile exists
 * - error:   the profile lookup failed (network etc.); retry with refreshProfile
 */
export type ProfileState = 'loading' | 'none' | 'ready' | 'error';

type AuthContextValue = {
  session: Session | null;
  /** True only during the initial launch, until the session (and profile, if signed in) are read. */
  loading: boolean;
  profile: Profile | null;
  profileState: ProfileState;
  /** Re-reads the profile (after onboarding completes, or to retry after an error). */
  refreshProfile: () => Promise<void>;
  /** Launch gate: false until the splash animation has finished once per app launch. */
  splashDone: boolean;
  completeSplash: () => void;
  /**
   * Signs out (email and social sessions alike). Throws AuthUiError with a Korean message on failure.
   * On success the session becomes null and the root layout redirects to login.
   */
  signOut: () => Promise<void>;
};

type ProfileResult = { userId: string; profile: Profile | null; failed: boolean };

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [result, setResult] = useState<ProfileResult | null>(null);
  const [booted, setBooted] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  const userId = session?.user.id ?? null;

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setSessionLoading(false));

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

  const loadProfile = useCallback(async (id: string) => {
    try {
      const profile = await fetchProfile(id);
      setResult({ userId: id, profile, failed: false });
    } catch {
      setResult({ userId: id, profile: null, failed: true });
    }
  }, []);

  // Read the profile whenever the signed-in user changes (not on every token refresh).
  useEffect(() => {
    if (userId) void loadProfile(userId);
  }, [userId, loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (userId) await loadProfile(userId);
  }, [userId, loadProfile]);

  // Derived so there is never a frame where a new session is paired with a stale profile result.
  const current = userId && result?.userId === userId ? result : null;
  const profile = current?.profile ?? null;
  const profileState: ProfileState = sessionLoading
    ? 'loading'
    : !userId
      ? 'none'
      : !current
        ? 'loading'
        : current.failed
          ? 'error'
          : current.profile
            ? 'ready'
            : 'none';

  useEffect(() => {
    if (!booted && profileState !== 'loading') setBooted(true);
  }, [booted, profileState]);

  const completeSplash = useCallback(() => setSplashDone(true), []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      throw new AuthUiError(toAuthMessage(e));
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      loading: !booted,
      profile,
      profileState,
      refreshProfile,
      splashDone,
      completeSplash,
      signOut,
    }),
    [session, booted, profile, profileState, refreshProfile, splashDone, completeSplash, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

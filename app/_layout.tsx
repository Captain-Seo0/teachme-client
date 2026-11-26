import { Redirect, SplashScreen, Stack, useSegments, type Href } from 'expo-router';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { ProfileStatusOverlay } from '@/features/auth/components/ProfileStatusOverlay';
import { AUTH_SCREENS } from '@/features/auth/constants';
import { PROFILE_FLOW_SCREENS } from '@/features/onboarding/constants';
import { useAppFonts } from '@/hooks/useAppFonts';

SplashScreen.preventAutoHideAsync();

const includes = (list: readonly string[], value: string | undefined) =>
  value !== undefined && list.includes(value);

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const fontsReady = useAppFonts();
  const { session, loading, profileState, splashDone } = useAuth();
  const segments = useSegments() as string[];

  // The native splash stays up until fonts, the session and (if signed in) the profile are read.
  const ready = fontsReady && !loading;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  const inOnboarding = segments[0] === '(onboarding)';
  const screen = segments[1];
  const onSplash = inOnboarding && screen === 'splash';

  // App start -> splash, then:
  //   no session                      -> login
  //   session, no profiles row        -> onboarding (profile -> school -> concern -> welcome)
  //   session, profiles row exists    -> (tabs)
  // A profile makes onboarding "complete", but welcome (and the screens before it, while the
  // profile is being created) are left alone so the user can finish the flow.
  let redirect: Href | null = null;
  if (!splashDone) {
    if (!onSplash) redirect = '/(onboarding)/splash';
  } else if (!session) {
    if (!inOnboarding || !includes(AUTH_SCREENS, screen)) redirect = '/(onboarding)/login';
  } else if (profileState === 'ready') {
    if (inOnboarding && (screen === 'splash' || includes(AUTH_SCREENS, screen))) redirect = '/(tabs)';
  } else if (profileState === 'none') {
    if (!inOnboarding || !includes(PROFILE_FLOW_SCREENS, screen)) redirect = '/(onboarding)/profile';
  }
  // profileState 'loading' / 'error': wait; ProfileStatusOverlay covers the screen.

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson" />
      </Stack>
      {redirect ? <Redirect href={redirect} /> : null}
      <ProfileStatusOverlay />
    </>
  );
}

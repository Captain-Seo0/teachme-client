import { Redirect, SplashScreen, Stack, useSegments, type Href } from 'expo-router';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { AUTH_SCREENS, POST_AUTH_HREF } from '@/features/auth/constants';
import { useAppFonts } from '@/hooks/useAppFonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const fontsReady = useAppFonts();
  const { session, loading, splashDone } = useAuth();
  const segments = useSegments() as string[];

  const ready = fontsReady && !loading;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  // App start -> splash -> (session) tabs / (no session) login.
  const inOnboarding = segments[0] === '(onboarding)';
  const screen = segments[1];
  const onSplash = inOnboarding && screen === 'splash';

  let redirect: Href | null = null;
  if (!splashDone) {
    if (!onSplash) redirect = '/(onboarding)/splash';
  } else if (onSplash) {
    redirect = session ? '/(tabs)' : '/(onboarding)/login';
  } else if (!session && !inOnboarding) {
    redirect = '/(onboarding)/login';
  } else if (session && inOnboarding && (AUTH_SCREENS as readonly string[]).includes(screen)) {
    redirect = POST_AUTH_HREF;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson" />
      </Stack>
      {redirect ? <Redirect href={redirect} /> : null}
    </>
  );
}

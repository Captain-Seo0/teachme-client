import { Stack } from 'expo-router';

import { OnboardingProvider } from '@/features/onboarding/OnboardingProvider';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Once the profile exists there is no going back to the earlier steps. */}
        <Stack.Screen name="matched" options={{ gestureEnabled: false }} />
        <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
      </Stack>
    </OnboardingProvider>
  );
}

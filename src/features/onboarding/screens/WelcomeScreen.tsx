import { useRouter } from 'expo-router';

import { OnboardingLayout } from '../components/OnboardingLayout';

// Minimal welcome screen. Figma 회원가입 4/4 welcome (node 1:234) has a chalkboard illustration and
// AI student avatars; those are planned for feature/onboarding-matching.
export function WelcomeScreen() {
  const router = useRouter();

  return (
    <OnboardingLayout
      step={4}
      title="환영해요"
      subtitle="수많은 학생들이 선생님의 첫 수업을 기다리고 있어요"
      cta={{ label: '티치미 시작하기', onPress: () => router.replace('/(tabs)') }}
    />
  );
}

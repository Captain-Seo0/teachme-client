import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius, spacing, typography } from '@/theme';

import { useAuth } from '../../auth/AuthProvider';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { STUDENT_INFO } from '../constants';

// Minimal matching result (no Figma frame yet). Visual polish is planned for feature/onboarding-matching.
const AVATAR_SIZE = 96;

export function MatchedScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  if (!profile) return null; // the root layout sends users without a profile back to onboarding

  const student = STUDENT_INFO[profile.matched_student];

  return (
    <OnboardingLayout
      title={`${profile.nickname} 선생님의\n첫 AI 학생이에요`}
      subtitle="공부 고민에 맞춰 매칭했어요. 언제든지 바꿀 수 있어요."
      cta={{ label: '다음', onPress: () => router.push('/(onboarding)/welcome') }}
    >
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{student.name[0]}</Text>
        </View>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.description}>{student.description}</Text>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: spacing[12],
    paddingVertical: spacing[32],
    paddingHorizontal: spacing[20],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.bg.surface,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.illustration.skin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.displayMd, fontFamily: fontFamily.display, color: colors.green[800] },
  name: { ...typography.heading2, fontFamily: fontFamily.display, color: colors.text.primary },
  description: { ...typography.body2, color: colors.text.secondary, textAlign: 'center' },
});

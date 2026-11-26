import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, spacing, typography } from '@/theme';

import { OnboardingLayout } from '../components/OnboardingLayout';
import { ILLUSTRATIONS } from '../constants';
import { useOnboarding } from '../OnboardingProvider';

// Figma 회원가입 4/4 welcome (node 1:234). The chalkboard image already contains the
// "오늘부터 나도 선생님!" text and the three student faces, so nothing is layered on top of it.
// No back button: the profile has been created by the time this screen shows.
const GRAPHIC = { width: 280, height: 234 };

export function WelcomeScreen() {
  const router = useRouter();
  const { draft } = useOnboarding();

  return (
    <OnboardingLayout
      step={4}
      centerContent
      cta={{ label: '티치미 시작하기', onPress: () => router.replace('/(tabs)') }}
    >
      <View style={styles.content}>
        <Image
          source={ILLUSTRATIONS.chalkboard}
          accessibilityLabel="오늘부터 나도 선생님! 칠판과 AI 학생들"
          style={styles.graphic}
        />
        <Text style={styles.title}>환영해요</Text>
        <Text style={styles.body}>{'수많은 학생들이 선생님의\n첫 수업을 기다리고 있어요'}</Text>
        {draft.avatarNotice ? (
          <Text accessibilityLiveRegion="polite" style={styles.notice}>
            {draft.avatarNotice}
          </Text>
        ) : null}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: spacing[12] },
  graphic: { width: GRAPHIC.width, height: GRAPHIC.height, marginBottom: spacing[12] },
  title: { ...typography.heading2, fontFamily: fontFamily.display, color: colors.green[600] },
  body: { ...typography.body1, fontFamily: fontFamily.body.regular, color: colors.text.secondary, textAlign: 'center' },
  notice: { ...typography.caption, color: colors.text.tertiary, textAlign: 'center', marginTop: spacing[12] },
});

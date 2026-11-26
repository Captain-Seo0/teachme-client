import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

import { ConcernOption } from '../components/ConcernOption';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { CONCERN_OPTIONS, CONCERN_TO_STUDENT, ILLUSTRATIONS, STUDENT_INFO } from '../constants';
import { useOnboarding } from '../OnboardingProvider';
import { NicknameTakenError, ProfileServiceError } from '../profileService';

const CARD_GAP = 10;

// Figma 회원가입 4/4 (node 1:181). Choosing a concern and pressing the CTA inserts the profile once.
export function ConcernScreen() {
  const router = useRouter();
  const { draft, update, submit } = useOnboarding();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const matched = draft.concern ? STUDENT_INFO[CONCERN_TO_STUDENT[draft.concern]] : null;

  async function handleSubmit() {
    setError(undefined);
    setSubmitting(true);
    try {
      await submit();
      // The profile now exists (insert finished); the root layout keeps welcome reachable.
      router.replace('/(onboarding)/welcome');
    } catch (e) {
      if (e instanceof NicknameTakenError) {
        // Send the user back to the nickname step.
        update({ notice: '이미 사용 중인 활동명이에요. 다른 이름을 입력해 주세요.' });
        router.dismissTo('/(onboarding)/profile');
      } else if (e instanceof ProfileServiceError) {
        setError(e.message);
      } else {
        setError('문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <OnboardingLayout
      step={3}
      title={'공부할 때 가장 고민인 점은\n무엇인가요?'}
      subtitle={'답변에 맞춰 선생님의 첫 AI 학생을 매칭해 드려요.\n(언제든지 바꿀 수 있어요)'}
      onBack={() => router.back()}
      cta={{
        label: matched ? `${matched.name}와 첫 수업 시작하기` : '고민을 선택해 주세요',
        disabled: !draft.concern,
        loading: submitting,
        onPress: handleSubmit,
      }}
    >
      <View style={styles.list} accessibilityRole="radiogroup">
        {CONCERN_OPTIONS.map((option) => (
          <ConcernOption
            key={option.value}
            label={option.label}
            studentName={STUDENT_INFO[CONCERN_TO_STUDENT[option.value]].name}
            studentImage={ILLUSTRATIONS.students[CONCERN_TO_STUDENT[option.value]]}
            selected={draft.concern === option.value}
            onPress={() => update({ concern: option.value })}
          />
        ))}
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: CARD_GAP },
  error: { ...typography.caption, color: colors.semantic.error, marginTop: spacing[12] },
});

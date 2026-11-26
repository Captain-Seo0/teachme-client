import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { spacing } from '@/theme';

import { AvatarPicker } from '../components/AvatarPicker';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { useOnboarding } from '../OnboardingProvider';
import { useNicknameAvailability } from '../useNicknameAvailability';

// Figma 회원가입 1/4 (node 1:121). There is no back button: this is the first step.
// Not ported: nickname suggestions ("이런 이름은 어때요?"), clear button, photo upload.
export function ProfileScreen() {
  const router = useRouter();
  const { draft, update } = useOnboarding();
  const { status, retry } = useNicknameAvailability(draft.nickname);

  const error =
    status.kind === 'invalid'
      ? status.message
      : status.kind === 'taken'
        ? '이미 사용 중인 활동명이에요.'
        : status.kind === 'error'
          ? status.message
          : draft.notice && status.kind === 'checking'
            ? draft.notice
            : undefined;

  const helperText =
    status.kind === 'checking' && !error
      ? '확인하는 중이에요...'
      : status.kind === 'available'
        ? '사용할 수 있는 닉네임이에요'
        : status.kind === 'idle'
          ? '2~20자로 입력해 주세요.'
          : undefined;

  return (
    <OnboardingLayout
      step={1}
      title={'선생님, 어떻게\n불러드릴까요?'}
      subtitle="티치미에서 사용할 활동명이에요."
      cta={{
        label: '확인',
        disabled: status.kind !== 'available',
        onPress: () => router.push('/(onboarding)/school'),
      }}
    >
      <View style={styles.body}>
        <AvatarPicker
          nickname={draft.nickname}
          value={draft.avatar}
          onChange={(avatar) => update({ avatar })}
        />
        <TextInput
          label="활동명"
          placeholder="활동명을 입력해 주세요"
          value={draft.nickname}
          onChangeText={(nickname) => update({ nickname, notice: null })}
          error={error}
          helperText={helperText}
          helperTone={status.kind === 'available' ? 'success' : 'default'}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          containerStyle={styles.input}
        />
        {status.kind === 'error' ? (
          <Button label="다시 확인" variant="text" size="M" onPress={retry} />
        ) : null}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing[20] },
  input: { alignSelf: 'stretch' },
});

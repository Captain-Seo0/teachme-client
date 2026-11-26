import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { spacing } from '@/theme';

import { pickAvatarPhoto } from '../avatarService';
import { AvatarPicker } from '../components/AvatarPicker';
import { NicknameSuggestions } from '../components/NicknameSuggestions';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { pickNicknameSuggestions } from '../nicknameSuggestions';
import { useOnboarding } from '../OnboardingProvider';
import { useNicknameAvailability } from '../useNicknameAvailability';

// Figma 회원가입 1/4 (node 1:121). No back button: this is the first step.
export function ProfileScreen() {
  const router = useRouter();
  const { draft, update } = useOnboarding();
  const { status, retry } = useNicknameAvailability(draft.nickname);
  const [suggestions, setSuggestions] = useState(() => pickNicknameSuggestions());
  const [photoMessage, setPhotoMessage] = useState<string>();

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

  async function handlePickPhoto() {
    setPhotoMessage(undefined);
    try {
      const result = await pickAvatarPhoto();
      if (result.status === 'picked') {
        update({ avatarPhotoUri: result.uri });
      } else if (result.status === 'denied') {
        setPhotoMessage(
          result.canAskAgain
            ? '사진을 고르려면 사진 보관함 접근을 허용해 주세요.'
            : '사진 접근이 꺼져 있어요. 설정에서 사진 접근을 허용해 주세요.',
        );
      }
    } catch {
      setPhotoMessage('사진을 불러오지 못했어요. 다시 시도해 주세요.');
    }
  }

  function handleSuggestion(nickname: string) {
    update({ nickname, notice: null });
    setSuggestions(pickNicknameSuggestions(3, [nickname]));
  }

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
          value={draft.avatar}
          // Choosing a color drops a previously chosen photo.
          onChange={(avatar) => update({ avatar, avatarPhotoUri: null })}
          photoUri={draft.avatarPhotoUri}
          onPickPhoto={handlePickPhoto}
          message={photoMessage}
        />
        <TextInput
          label="활동명"
          placeholder="활동명을 입력해 주세요"
          value={draft.nickname}
          onChangeText={(nickname) => update({ nickname, notice: null })}
          clearable
          error={error}
          helperText={helperText}
          helperTone={status.kind === 'available' ? 'success' : 'default'}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
        />
        {status.kind === 'error' ? (
          <Button label="다시 확인" variant="text" size="M" onPress={retry} />
        ) : null}
        <NicknameSuggestions suggestions={suggestions} onSelect={handleSuggestion} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing[20] },
});

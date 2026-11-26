import { useRouter } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { colors, layout, spacing, typography } from '@/theme';

import { signInWithEmail, signUpWithEmail } from '../authService';
import { toAuthMessage } from '../authErrors';
import { MIN_PASSWORD_LENGTH } from '../constants';
import { validateEmail, validatePassword } from '../validation';

// TEMPORARY layout: Figma has no email login / sign-up frames yet. Built from the design
// system (Button, TextInput) and meant to be replaced when those frames exist.

type Mode = 'login' | 'signup';

const copy = {
  login: {
    title: '이메일로 로그인',
    subtitle: '가입한 이메일과 비밀번호를 입력해 주세요.',
    submit: '로그인',
    switchLabel: '아직 계정이 없어요? 회원가입',
    switchHref: '/(onboarding)/signup',
  },
  signup: {
    title: '회원가입',
    subtitle: '이메일과 비밀번호로 티치미를 시작해요.',
    submit: '가입하기',
    switchLabel: '이미 계정이 있어요? 로그인',
    switchHref: '/(onboarding)/email-login',
  },
} as const;

export function EmailAuthScreen({ mode }: { mode: Mode }) {
  const router = useRouter();
  const c = copy[mode];
  const passwordRef = useRef<ComponentRef<typeof RNTextInput>>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function submit() {
    const nextEmailError = validateEmail(email) ?? undefined;
    const nextPasswordError = validatePassword(password) ?? undefined;
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError(undefined);
    if (nextEmailError || nextPasswordError) return;

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        // On success the root layout reacts to the new session.
      } else {
        const { needsEmailConfirmation } = await signUpWithEmail(email, password);
        // TODO: after sign-up, send new users to '/(onboarding)/profile' (see constants.ts).
        if (needsEmailConfirmation) setConfirmationSent(true);
      }
    } catch (e) {
      setFormError(toAuthMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(onboarding)/login');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Button label="뒤로" variant="text" size="M" onPress={goBack} style={styles.back} />

          <View style={styles.titleBlock}>
            <Text style={styles.title}>{c.title}</Text>
            <Text style={styles.subtitle}>{c.subtitle}</Text>
          </View>

          {confirmationSent ? (
            <View style={styles.form}>
              <Text accessibilityLiveRegion="polite" style={styles.notice}>
                확인 메일을 보냈어요. 메일함에서 인증을 마친 뒤 로그인해 주세요.
              </Text>
              <Button
                label="로그인하러 가기"
                fullWidth
                onPress={() => router.replace('/(onboarding)/email-login')}
              />
            </View>
          ) : (
            <View style={styles.form}>
              <TextInput
                label="이메일"
                placeholder="example@teachme.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError(undefined);
                }}
                error={emailError}
                disabled={submitting}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <TextInput
                ref={passwordRef}
                label="비밀번호"
                placeholder="비밀번호를 입력해 주세요"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError(undefined);
                }}
                helperText={mode === 'signup' ? `${MIN_PASSWORD_LENGTH}자 이상 입력해 주세요` : undefined}
                error={passwordError}
                disabled={submitting}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                textContentType={mode === 'signup' ? 'newPassword' : 'password'}
                returnKeyType="done"
                onSubmitEditing={submit}
              />

              {formError ? (
                <Text accessibilityLiveRegion="polite" style={styles.formError}>
                  {formError}
                </Text>
              ) : null}

              <Button label={c.submit} fullWidth loading={submitting} onPress={submit} />
              <Button
                label={c.switchLabel}
                variant="text"
                size="M"
                fullWidth
                disabled={submitting}
                onPress={() => router.replace(c.switchHref)}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.canvas },
  flex: { flex: 1 },
  content: { paddingHorizontal: layout.screenMargin, paddingBottom: spacing[32] },
  back: { marginLeft: -spacing[20] },
  titleBlock: { marginTop: spacing[16], gap: spacing[8] },
  title: { ...typography.heading1, color: colors.text.primary },
  subtitle: { ...typography.body2, color: colors.text.secondary },
  form: { marginTop: spacing[32], gap: spacing[16] },
  formError: { ...typography.caption, color: colors.semantic.error },
  notice: { ...typography.body1, color: colors.text.secondary },
});

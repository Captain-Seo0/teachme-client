import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontFamily, layout, spacing, typography } from '@/theme';

import { signInWithSocial, type SocialProvider } from '../authService';
import { toAuthMessage } from '../authErrors';
import { Logo } from '../components/LogoGraphics';
import { SocialButton } from '../components/SocialButton';

// Source: Figma "로그인 - 한국어" (node 1:432), 375 x 812.
// Offsets are measured from the safe area (design: logo y=210 under a 58px status bar).
const LOGO_TOP_OFFSET = 152;
const OPTIONS_TOP_OFFSET = 84;

// TODO: Apple sign-in. No Apple button exists in the Figma design yet; add it here when it does.

type Message = { tone: 'error' | 'info'; text: string };

export function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [pending, setPending] = useState<SocialProvider | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  async function handleSocial(provider: SocialProvider) {
    setMessage(null);
    setPending(provider);
    try {
      const result = await signInWithSocial(provider);
      if (result === 'cancelled') setMessage({ tone: 'info', text: '로그인을 취소했어요.' });
      // On success the root layout reacts to the new session.
    } catch (e) {
      setMessage({ tone: 'error', text: toAuthMessage(e) });
    } finally {
      setPending(null);
    }
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + LOGO_TOP_OFFSET, paddingBottom: insets.bottom + spacing[40] },
      ]}
    >
      <View style={styles.header}>
        <Logo />
        <Text style={styles.tagline}>가르치면서 진짜 내 것이 되는 공부</Text>
      </View>

      <View style={styles.options}>
        <SocialButton
          provider="kakao"
          loading={pending === 'kakao'}
          disabled={pending !== null}
          onPress={() => handleSocial('kakao')}
        />
        <SocialButton
          provider="google"
          loading={pending === 'google'}
          disabled={pending !== null}
          onPress={() => handleSocial('google')}
        />

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.or}>또는</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.links}>
          <Pressable
            accessibilityRole="link"
            hitSlop={spacing[8]}
            onPress={() => router.push('/(onboarding)/email-login')}
          >
            <Text style={styles.emailLink}>이메일로 로그인</Text>
          </Pressable>
          <View style={styles.linkDivider} />
          <Pressable
            accessibilityRole="link"
            hitSlop={spacing[8]}
            onPress={() => router.push('/(onboarding)/signup')}
          >
            <Text style={styles.signupLink}>회원가입</Text>
          </Pressable>
        </View>

        {message ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[
              styles.message,
              { color: message.tone === 'error' ? colors.semantic.error : colors.text.tertiary },
            ]}
          >
            {message.text}
          </Text>
        ) : null}
      </View>

      <View style={styles.spacer} />

      {/* TODO: link 서비스 이용약관 / 개인정보 처리방침 to their pages once URLs exist. */}
      <Text style={styles.terms}>
        {'계속 진행하면 티치미의 '}
        <Text style={styles.termsLink}>서비스 이용약관</Text>
        {' 및\n'}
        <Text style={styles.termsLink}>개인정보 처리방침</Text>
        에 동의하는 것으로 간주합니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.surface,
    paddingHorizontal: layout.screenMargin,
  },
  header: { alignItems: 'center', gap: spacing[20] },
  tagline: {
    ...typography.title2,
    fontFamily: fontFamily.body.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  options: { marginTop: OPTIONS_TOP_OFFSET, alignItems: 'center', gap: spacing[12] },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing[12],
    paddingVertical: spacing[4],
  },
  line: { flex: 1, height: 1, backgroundColor: colors.border.default },
  or: { ...typography.body2, fontFamily: fontFamily.body.regular, color: colors.text.tertiary },
  links: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[16] },
  linkDivider: { width: 1, height: 12, backgroundColor: colors.border.strong },
  emailLink: { ...typography.body1, color: colors.neutral[800] },
  signupLink: { ...typography.body1, fontFamily: fontFamily.body.bold, color: colors.green[500] },
  message: { ...typography.caption, textAlign: 'center' },
  spacer: { flex: 1 },
  terms: {
    ...typography.micro,
    fontFamily: fontFamily.body.regular,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  termsLink: { color: colors.text.secondary, textDecorationLine: 'underline' },
});

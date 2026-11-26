import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius, spacing, typography } from '@/theme';

import type { SocialProvider } from '../authService';
import { GoogleIcon, KakaoIcon, KAKAO_SYMBOL_COLOR } from './SocialIcons';

// Source: Figma "로그인 - 한국어" (node 1:432). Kakao yellow is mandated by Kakao's brand guidelines.
const KAKAO_YELLOW = '#FEE500';
const HEIGHT = 54;
const WIDTH = 300;

type Props = {
  provider: SocialProvider;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

const config = {
  kakao: {
    label: '카카오로 계속하기',
    icon: <KakaoIcon />,
    bg: KAKAO_YELLOW,
    text: KAKAO_SYMBOL_COLOR,
    border: KAKAO_YELLOW,
  },
  google: {
    label: 'Google로 계속하기',
    icon: <GoogleIcon />,
    bg: colors.bg.surface,
    text: colors.text.primary,
    border: colors.border.default,
  },
} as const;

export function SocialButton({ provider, onPress, loading = false, disabled = false }: Props) {
  const c = config[provider];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={c.label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: c.bg, borderColor: c.border },
        pressed && styles.pressed,
        disabled && !loading && styles.dimmed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={c.text} />
      ) : (
        <View style={styles.content}>
          {c.icon}
          <Text style={[styles.label, { color: c.text }]}>{c.label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[24],
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing[8] },
  label: { ...typography.title2, fontFamily: fontFamily.body.medium },
  pressed: { opacity: 0.85 },
  dimmed: { opacity: 0.5 },
});

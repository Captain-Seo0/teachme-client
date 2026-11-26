import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { colors, layout, spacing, typography } from '@/theme';

import { useAuth } from '../AuthProvider';

/**
 * Covers the app while the profile is being read after sign-in, or when that read failed.
 * Rendered over the navigator (not instead of it) so navigation state is kept.
 */
export function ProfileStatusOverlay() {
  const { session, loading, profileState, refreshProfile, signOut } = useAuth();
  const [retrying, setRetrying] = useState(false);

  if (!session || loading) return null;
  if (profileState !== 'loading' && profileState !== 'error') return null;

  if (profileState === 'loading') {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator color={colors.green[500]} />
      </View>
    );
  }

  async function retry() {
    setRetrying(true);
    await refreshProfile();
    setRetrying(false);
  }

  return (
    <View style={styles.overlay}>
      <Text style={styles.message}>정보를 불러오지 못했어요.{'\n'}네트워크 연결을 확인해 주세요.</Text>
      <Button label="다시 시도" loading={retrying} onPress={retry} />
      <Button label="로그아웃" variant="text" size="M" onPress={() => signOut().catch(() => {})} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.bg.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[16],
    padding: layout.screenMargin,
  },
  message: { ...typography.body1, color: colors.text.secondary, textAlign: 'center' },
});

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';

import { toAuthMessage } from '../authErrors';
import { useAuth } from '../AuthProvider';

/** Temporary sign-out button for development. See the TODO where it is rendered. */
export function DevSignOutButton() {
  const { signOut } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function handlePress() {
    setError(undefined);
    setPending(true);
    try {
      await signOut();
      // On success the root layout redirects to login.
    } catch (e) {
      setError(toAuthMessage(e));
      setPending(false);
    }
  }

  return (
    <View style={styles.container}>
      <Button label="로그아웃" variant="outline" size="M" loading={pending} onPress={handlePress} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing[8] },
  error: { ...typography.caption, color: colors.semantic.error },
});

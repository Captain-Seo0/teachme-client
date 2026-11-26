import { StyleSheet, View } from 'react-native';

import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';
import { DevSignOutButton } from '@/features/auth/components/DevSignOutButton';
import { spacing } from '@/theme';

export default function HomeScreen() {
  return (
    <View style={styles.flex}>
      <ScreenPlaceholder title="홈" />
      {/* TODO: 마이 화면(feature/my)에서 설정의 로그아웃으로 교체하고 이 버튼은 삭제 */}
      {__DEV__ ? (
        <View style={styles.devButton}>
          <DevSignOutButton />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  devButton: { position: 'absolute', left: 0, right: 0, bottom: spacing[40] },
});

import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fontFamily, radius, spacing, typography } from '@/theme';

// Source: Figma 회원가입 2/4 search field (node 1:295): 36px pill with a search icon.
const HEIGHT = 36;
const LENS = 10;

export function SchoolSearchBox(props: Omit<TextInputProps, 'style'>) {
  return (
    <View style={styles.box}>
      {/* Magnifier drawn with views (no icon dependency). */}
      <View style={styles.icon}>
        <View style={styles.lens} />
        <View style={styles.handle} />
      </View>
      <TextInput
        placeholder="학교 이름으로 검색"
        placeholderTextColor={colors.text.tertiary}
        selectionColor={colors.green[500]}
        accessibilityLabel="학교 이름으로 검색"
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    paddingHorizontal: spacing[12],
    borderRadius: radius.md,
    backgroundColor: colors.bg.default,
  },
  icon: { width: 16, height: 16 },
  lens: {
    width: LENS,
    height: LENS,
    borderRadius: LENS / 2,
    borderWidth: 1.5,
    borderColor: colors.text.tertiary,
  },
  handle: {
    position: 'absolute',
    right: 1,
    bottom: 2,
    width: 6,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: colors.text.tertiary,
    transform: [{ rotate: '45deg' }],
  },
  input: {
    flex: 1,
    padding: 0,
    ...typography.body2,
    fontFamily: fontFamily.body.regular,
    color: colors.text.primary,
  },
});

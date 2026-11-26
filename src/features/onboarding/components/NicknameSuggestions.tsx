import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius, spacing, typography } from '@/theme';

// Source: Figma 회원가입 1/4 "이런 이름은 어때요?" (node 1:160).
const CHIP_GAP = 6;
const CHIP_PADDING_V = 6;

type Props = { suggestions: string[]; onSelect: (nickname: string) => void };

export function NicknameSuggestions({ suggestions, onSelect }: Props) {
  if (suggestions.length === 0) return null;
  return (
    <View style={styles.root}>
      <Text style={styles.title}>이런 이름은 어때요?</Text>
      <View style={styles.chips}>
        {suggestions.map((nickname) => (
          <Pressable
            key={nickname}
            accessibilityRole="button"
            accessibilityLabel={`추천 활동명 ${nickname}`}
            onPress={() => onSelect(nickname)}
            style={styles.chip}
          >
            <Text style={styles.chipText}>{nickname}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing[8],
    paddingVertical: spacing[12],
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  title: { ...typography.caption, color: colors.text.tertiary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: CHIP_GAP, justifyContent: 'center' },
  chip: {
    paddingHorizontal: spacing[12],
    paddingVertical: CHIP_PADDING_V,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.bg.surface,
  },
  chipText: { ...typography.caption, fontFamily: fontFamily.body.medium, color: colors.text.secondary },
});

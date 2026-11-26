import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, spacing, typography } from '@/theme';

import { AVATAR_OPTIONS, type AvatarId } from '../constants';

// Source: Figma 회원가입 1/4 (nodes 1:127, 1:138). Preview 112, color dots 30.
// The face illustration is not ported yet: the preview shows the nickname's first character.
// "사진 등록" (photo upload) is out of scope for this branch.
const PREVIEW_SIZE = 112;
const PREVIEW_RADIUS = 40;
const DOT_SIZE = 30;
const DOT_RING = 2;

type Props = {
  nickname: string;
  value: AvatarId;
  onChange: (id: AvatarId) => void;
};

export function AvatarPicker({ nickname, value, onChange }: Props) {
  const selected = AVATAR_OPTIONS.find((o) => o.id === value) ?? AVATAR_OPTIONS[0];
  const initial = Array.from(nickname.trim())[0] ?? '';

  return (
    <View style={styles.root}>
      <View style={[styles.preview, { backgroundColor: selected.color }]}>
        <Text style={styles.initial}>{initial}</Text>
      </View>
      <View style={styles.dots}>
        {AVATAR_OPTIONS.map((option) => {
          const isSelected = option.id === value;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityLabel={`아바타 색상 ${option.id}`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(option.id)}
              style={[styles.dotRing, isSelected && { borderColor: colors.green[500] }]}
            >
              <View style={[styles.dot, { backgroundColor: option.color }]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: spacing[20] },
  preview: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: PREVIEW_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { ...typography.displayLg, fontFamily: fontFamily.display, color: colors.green[800] },
  dots: { flexDirection: 'row', gap: spacing[8], alignItems: 'center' },
  dotRing: {
    padding: DOT_RING,
    borderRadius: DOT_SIZE,
    borderWidth: DOT_RING,
    borderColor: 'transparent',
  },
  dot: {
    width: DOT_SIZE - DOT_RING * 2,
    height: DOT_SIZE - DOT_RING * 2,
    borderRadius: DOT_SIZE,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
});

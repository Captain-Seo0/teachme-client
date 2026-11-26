import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius, spacing, typography } from '@/theme';

import { AVATAR_OPTIONS, ILLUSTRATIONS, type AvatarId } from '../constants';

// Source: Figma 회원가입 1/4 (nodes 1:127, 1:138). Preview 112 with the teacher illustration, color dots 30,
// and a "사진 등록" pill. Not ported: the pencil badge on the preview (the pill does the same job)
// and the camera icon inside the pill.
const PREVIEW_SIZE = 112;
const PREVIEW_RADIUS = 40; // squircle used by the illustration preview
const ILLUSTRATION = { width: 96, height: 94, left: 8, top: 18 };
const DOT_SIZE = 30;
const DOT_RING = 2;
const PILL_RADIUS = 16;
const DOT_GAP = 10;
const PILL_PADDING_V = 6;

type Props = {
  value: AvatarId;
  onChange: (id: AvatarId) => void;
  /** Local uri of the chosen photo. While set, it replaces the illustration (as a circle). */
  photoUri: string | null;
  onPickPhoto: () => void;
  /** Shown under the row, e.g. when gallery access was denied. */
  message?: string;
};

export function AvatarPicker({ value, onChange, photoUri, onPickPhoto, message }: Props) {
  const selected = AVATAR_OPTIONS.find((o) => o.id === value) ?? AVATAR_OPTIONS[0];

  return (
    <View style={styles.root}>
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          accessibilityLabel="선택한 프로필 사진"
          style={styles.photo}
        />
      ) : (
        <View style={[styles.preview, { backgroundColor: selected.color }]}>
          <Image source={ILLUSTRATIONS.teacher} style={styles.illustration} />
        </View>
      )}

      <View style={styles.row}>
        {AVATAR_OPTIONS.map((option) => {
          // A chosen photo takes over; pressing a color clears it (handled by the parent via onChange).
          const isSelected = !photoUri && option.id === value;
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="사진 등록"
          onPress={onPickPhoto}
          style={[styles.pill, !!photoUri && styles.pillActive]}
        >
          <Text style={styles.pillText}>사진 등록</Text>
        </Pressable>
      </View>

      {message ? (
        <Text accessibilityLiveRegion="polite" style={styles.message}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: spacing[20] },
  preview: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: PREVIEW_RADIUS,
    overflow: 'hidden',
  },
  illustration: {
    position: 'absolute',
    width: ILLUSTRATION.width,
    height: ILLUSTRATION.height,
    left: ILLUSTRATION.left,
    top: ILLUSTRATION.top,
  },
  photo: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.bg.subtle,
  },
  row: { flexDirection: 'row', gap: DOT_GAP, alignItems: 'center' },
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
  pill: {
    paddingHorizontal: spacing[12],
    paddingVertical: PILL_PADDING_V,
    borderRadius: PILL_RADIUS,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: colors.bg.subtle,
  },
  pillActive: { borderColor: colors.green[500] },
  pillText: { ...typography.caption, fontFamily: fontFamily.body.medium, color: colors.text.secondary },
  message: { ...typography.caption, color: colors.semantic.error, textAlign: 'center' },
});

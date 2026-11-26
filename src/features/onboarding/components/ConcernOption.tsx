import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { colors, fontFamily, radius, spacing, typography } from '@/theme';

// Source: Figma 회원가입 4/4 option cards (node 1:188).
const AVATAR_SIZE = 48;
const RADIO_SIZE = 20;
const BORDER = 1;
const BORDER_SELECTED = 1.5;
const CARD_PADDING = 14;

type Props = {
  label: string;
  studentName: string;
  /** The matched AI student's face illustration. */
  studentImage: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
};

export function ConcernOption({ label, studentName, studentImage, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.card,
        selected
          ? { borderColor: colors.green[500], borderWidth: BORDER_SELECTED }
          : { borderColor: colors.border.default, borderWidth: BORDER },
      ]}
    >
      <View style={styles.avatar}>
        <Image source={studentImage} accessibilityLabel={studentName} style={styles.avatarImage} />
      </View>
      <View style={styles.texts}>
        <Text style={[styles.label, selected && { color: colors.green[800] }]}>{label}</Text>
        <Text style={styles.match}>
          {'→ '}
          <Text style={[styles.matchName, selected && { color: colors.green[500] }]}>
            {studentName} 매칭
          </Text>
        </Text>
      </View>
      <View style={[styles.radio, selected && { borderColor: colors.green[500] }]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
    paddingVertical: CARD_PADDING,
    paddingLeft: CARD_PADDING,
    paddingRight: spacing[16],
    borderRadius: radius.xl,
    backgroundColor: colors.bg.surface,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.illustration.skin,
    overflow: 'hidden',
  },
  avatarImage: { width: AVATAR_SIZE, height: AVATAR_SIZE },
  texts: { flex: 1, gap: spacing[4] },
  label: { ...typography.body1, fontFamily: fontFamily.body.bold, color: colors.text.primary },
  match: { ...typography.caption, color: colors.text.tertiary },
  matchName: { color: colors.text.tertiary },
  radio: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    borderWidth: 1.5,
    borderColor: colors.border.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: RADIO_SIZE / 2,
    height: RADIO_SIZE / 2,
    borderRadius: RADIO_SIZE / 4,
    backgroundColor: colors.green[500],
  },
});

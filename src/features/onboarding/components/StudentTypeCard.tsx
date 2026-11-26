import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontFamily, spacing, typography } from '@/theme';

// Source: Figma 회원가입 2/4 student type cards (node 1:264). Two per row.
const CARD_RADIUS = 18;
const BORDER_SELECTED = 1.5;
const LABEL_GAP = 2;

type Props = {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

export function StudentTypeCard({ label, description, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.card,
        selected
          ? { backgroundColor: colors.bg.surface, borderColor: colors.green[500] }
          : { backgroundColor: colors.bg.default, borderColor: 'transparent' },
      ]}
    >
      <Text style={[styles.label, selected && { color: colors.text.brand }]}>{label}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    // Two columns with a gap: each card takes roughly half the row.
    flexBasis: '47%',
    flexGrow: 1,
    gap: LABEL_GAP,
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
    borderRadius: CARD_RADIUS,
    borderWidth: BORDER_SELECTED,
  },
  label: { ...typography.subtitle, fontFamily: fontFamily.body.bold, color: colors.text.secondary },
  description: { ...typography.caption, fontFamily: fontFamily.body.regular, color: colors.text.tertiary },
});

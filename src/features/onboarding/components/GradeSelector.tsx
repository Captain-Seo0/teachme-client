import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import type { Grade } from '@/types/profile';

import { GRADES } from '../constants';

// Source: Figma 회원가입 2/4 학년 chips (node 1:277).
const CHIP_PADDING_V = 9;

type Props = { value: Grade | null; onChange: (grade: Grade) => void };

export function GradeSelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {GRADES.map((grade) => {
        const selected = grade === value;
        return (
          <Pressable
            key={grade}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(grade)}
            style={[styles.chip, selected && { backgroundColor: colors.green[500] }]}
          >
            {selected ? <View style={styles.check} /> : null}
            <Text style={[styles.label, selected && styles.labelSelected]}>{grade}학년</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing[8] },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    paddingVertical: CHIP_PADDING_V,
    paddingHorizontal: spacing[12],
    borderRadius: radius.xl,
    backgroundColor: colors.bg.default,
  },
  // Check glyph drawn with borders (no SVG dependency): rotated L shape.
  check: {
    width: 5,
    height: 9,
    marginTop: -2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.text.onBrand,
    transform: [{ rotate: '45deg' }],
  },
  label: { ...typography.body2, fontFamily: fontFamily.body.medium, color: colors.text.secondary },
  labelSelected: { fontFamily: fontFamily.body.bold, color: colors.text.onBrand },
});

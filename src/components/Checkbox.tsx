import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

// Source: Figma 05 Components · Selection Controls · checkbox (node 1:1366).
// Component-specific sizes that are not part of the spacing/radius scales.
const BOX = 18;
const BOX_BORDER = 1.25;

type Props = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
};

export function Checkbox({ checked, onChange, label, disabled = false }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
      hitSlop={spacing[8]}
      style={styles.row}
    >
      <View
        style={[
          styles.box,
          checked
            ? { backgroundColor: colors.bg.brand, borderColor: colors.bg.brand }
            : { backgroundColor: colors.bg.surface, borderColor: colors.border.strong },
          disabled && { backgroundColor: colors.neutral[150], borderColor: colors.border.default },
        ]}
      >
        {checked ? <View style={styles.check} /> : null}
      </View>
      {label ? (
        <Text style={[styles.label, disabled && { color: colors.neutral[500] }]}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing[8] },
  box: {
    width: BOX,
    height: BOX,
    borderRadius: radius.xs,
    borderWidth: BOX_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
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
  label: { ...typography.body1, color: colors.text.primary },
});

import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, shadow, spacing, typography } from '@/theme';

// Source: Figma 05 Components · Button (node 1:1231).
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'L' | 'M';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

type Palette = { bg: string; pressedBg: string; text: string; border?: string; pressedBorder?: string };

const enabled: Record<ButtonVariant, Palette> = {
  primary: { bg: colors.green[500], pressedBg: colors.green[600], text: colors.text.onBrand },
  secondary: { bg: colors.green[100], pressedBg: colors.green[200], text: colors.green[800] },
  outline: {
    bg: colors.bg.surface,
    pressedBg: colors.neutral[150],
    text: colors.text.primary,
    border: colors.border.default,
    pressedBorder: colors.border.strong,
  },
  text: { bg: 'transparent', pressedBg: colors.neutral[150], text: colors.green[700] },
};

const disabledPalette: Record<ButtonVariant, Palette> = {
  primary: { bg: colors.neutral[300], pressedBg: colors.neutral[300], text: colors.neutral[500] },
  secondary: { bg: colors.neutral[150], pressedBg: colors.neutral[150], text: colors.neutral[500] },
  outline: {
    bg: colors.bg.surface,
    pressedBg: colors.bg.surface,
    text: colors.neutral[500],
    border: colors.neutral[200],
    pressedBorder: colors.neutral[200],
  },
  text: { bg: 'transparent', pressedBg: 'transparent', text: colors.neutral[500] },
};

// Size specs from the design: L = bottom CTA (335 x 56), M = inline action (height 44).
// The M radius (14) is a component value that is not in the radius scale.
const sizes = {
  L: { height: 56, radius: radius.xl, text: typography.title2 },
  M: { height: 44, radius: 14, text: typography.subtitle },
} as const;

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'L',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
}: Props) {
  const inactive = disabled || loading;
  const spec = sizes[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => {
        // While loading the button keeps its default look; only `disabled` greys it out.
        const p = disabled ? disabledPalette[variant] : enabled[variant];
        return [
          styles.base,
          {
            height: spec.height,
            borderRadius: spec.radius,
            backgroundColor: pressed && !inactive ? p.pressedBg : p.bg,
            borderWidth: p.border ? 1 : 0,
            borderColor: pressed && !inactive ? p.pressedBorder : p.border,
          },
          variant === 'primary' && !disabled && shadow.brand,
          fullWidth && styles.fullWidth,
          style,
        ];
      }}
    >
      {() => {
        const color = (disabled ? disabledPalette[variant] : enabled[variant]).text;
        if (loading) return <ActivityIndicator color={color} />;
        return (
          <View style={styles.content}>
            {leftIcon}
            <Text style={[spec.text, { color }]}>{label}</Text>
            {rightIcon}
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[20],
    alignSelf: 'flex-start',
  },
  fullWidth: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing[8] },
});

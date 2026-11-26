import { forwardRef, useState, type ComponentRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, fontFamily, radius, spacing, typography } from '@/theme';

// Source: Figma 06 Components · Input Field (node 1:1415).
// Component-specific sizes that are not part of the spacing/radius scales.
const FIELD_HEIGHT = 52;
const LABEL_GAP = 6;
const BORDER = 1;
const BORDER_ACTIVE = 1.5;
const CLEAR_SIZE = 18;

type Props = Omit<TextInputProps, 'editable' | 'style'> & {
  label?: string;
  helperText?: string;
  /** 'success' colors the helper text green and prefixes a check mark (e.g. "사용할 수 있는 닉네임이에요"). */
  helperTone?: 'default' | 'success';
  /** Shows a clear (X) button while the field is focused and has text. Needs `value` + `onChangeText`. */
  clearable?: boolean;
  /** Error message. When set, the field and helper text switch to the error state. */
  error?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export const TextInput = forwardRef<ComponentRef<typeof RNTextInput>, Props>(function TextInput(
  {
    label,
    helperText,
    helperTone = 'default',
    clearable = false,
    error,
    disabled = false,
    containerStyle,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;
  const message = error ?? helperText;

  const borderColor = hasError
    ? colors.semantic.error
    : focused
      ? colors.border.focus
      : disabled
        ? colors.neutral[200]
        : colors.border.default;

  return (
    <View style={[styles.root, containerStyle]}>
      {label ? (
        <Text style={[styles.label, disabled && { color: colors.neutral[500] }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.field,
          {
            borderColor,
            borderWidth: hasError || focused ? BORDER_ACTIVE : BORDER,
            backgroundColor: disabled ? colors.neutral[50] : colors.bg.surface,
          },
        ]}
      >
        <RNTextInput
          ref={ref}
          editable={!disabled}
          placeholderTextColor={colors.neutral[500]}
          selectionColor={colors.green[500]}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          style={[styles.input, disabled && { color: colors.neutral[400] }]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {clearable && focused && !disabled && !!rest.value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="입력 지우기"
            hitSlop={spacing[8]}
            onPress={() => rest.onChangeText?.('')}
            style={styles.clear}
          >
            <View style={[styles.clearBar, { transform: [{ rotate: '45deg' }] }]} />
            <View style={[styles.clearBar, { transform: [{ rotate: '-45deg' }] }]} />
          </Pressable>
        ) : null}
      </View>
      {message ? (
        <View style={styles.helperRow}>
          {!hasError && helperTone === 'success' ? <View style={styles.helperCheck} /> : null}
          <Text
            style={[
              styles.helper,
              !hasError && helperTone === 'success' && { color: colors.text.brand },
              hasError && { color: colors.semantic.error },
            ]}
          >
            {message}
          </Text>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  root: { gap: LABEL_GAP },
  label: {
    ...typography.body2,
    fontFamily: fontFamily.body.bold,
    color: colors.text.primary,
  },
  field: {
    height: FIELD_HEIGHT,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[16],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  input: {
    ...typography.body1,
    flex: 1,
    color: colors.text.primary,
    padding: 0,
  },
  clear: {
    width: CLEAR_SIZE,
    height: CLEAR_SIZE,
    borderRadius: CLEAR_SIZE / 2,
    backgroundColor: colors.neutral[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBar: {
    position: 'absolute',
    width: 9,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: colors.text.onBrand,
  },
  helperRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[4] },
  // Check glyph drawn with borders (no SVG dependency): rotated L shape.
  helperCheck: {
    width: 4,
    height: 8,
    marginBottom: 2,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.text.brand,
    transform: [{ rotate: '45deg' }],
  },
  helper: {
    ...typography.micro,
    fontFamily: fontFamily.body.medium,
    color: colors.text.tertiary,
  },
});

import { forwardRef, useState, type ComponentRef } from 'react';
import {
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

type Props = Omit<TextInputProps, 'editable' | 'style'> & {
  label?: string;
  helperText?: string;
  /** Error message. When set, the field and helper text switch to the error state. */
  error?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export const TextInput = forwardRef<ComponentRef<typeof RNTextInput>, Props>(function TextInput(
  { label, helperText, error, disabled = false, containerStyle, onFocus, onBlur, ...rest },
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
      </View>
      {message ? (
        <Text style={[styles.helper, hasError && { color: colors.semantic.error }]}>{message}</Text>
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
    justifyContent: 'center',
  },
  input: {
    ...typography.body1,
    color: colors.text.primary,
    padding: 0,
  },
  helper: {
    ...typography.micro,
    fontFamily: fontFamily.body.medium,
    color: colors.text.tertiary,
  },
});

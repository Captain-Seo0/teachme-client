import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { colors, fontFamily, layout, spacing, typography } from '@/theme';

// Source: Figma 회원가입 1/4~4/4 (nodes 1:121, 1:260, 1:181, 1:234): back + 4-step progress,
// title block, content, bottom CTA (335 x 56).
const TOTAL_STEPS = 4;
const SEGMENT = { width: 20, activeWidth: 30, height: 6, gap: 6, radius: 3 };
const BACK_HIT_SIZE = 30;
const TITLE_GAP = 6;

type Props = {
  /** 1~4. Omit to hide the progress bar. */
  step?: 1 | 2 | 3 | 4;
  title: string;
  subtitle?: string;
  /** Omit to hide the back button. */
  onBack?: () => void;
  cta: { label: string; onPress: () => void; disabled?: boolean; loading?: boolean };
  children?: ReactNode;
};

export function OnboardingLayout({ step, title, subtitle, onBack, cta, children }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="뒤로"
              hitSlop={spacing[8]}
              onPress={onBack}
              style={styles.back}
            >
              <View style={styles.chevron} />
            </Pressable>
          ) : null}
          {step ? (
            <View style={styles.progress} accessibilityLabel={`${TOTAL_STEPS}단계 중 ${step}단계`}>
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.segment,
                    i + 1 === step
                      ? { width: SEGMENT.activeWidth, backgroundColor: colors.green[500] }
                      : { backgroundColor: colors.border.default },
                  ]}
                />
              ))}
            </View>
          ) : null}
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          <View style={styles.body}>{children}</View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={cta.label}
            fullWidth
            disabled={cta.disabled}
            loading={cta.loading}
            onPress={cta.onPress}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.canvas },
  flex: { flex: 1 },
  header: {
    height: BACK_HIT_SIZE,
    marginTop: spacing[8],
    paddingHorizontal: layout.screenMargin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    left: layout.screenMargin,
    width: BACK_HIT_SIZE,
    height: BACK_HIT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Chevron drawn with borders (no icon dependency).
  chevron: {
    width: 12,
    height: 12,
    marginLeft: spacing[4],
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: colors.text.primary,
    transform: [{ rotate: '45deg' }],
  },
  progress: { flexDirection: 'row', gap: SEGMENT.gap, alignItems: 'center' },
  segment: { width: SEGMENT.width, height: SEGMENT.height, borderRadius: SEGMENT.radius },
  content: { paddingHorizontal: layout.screenMargin, paddingBottom: spacing[24] },
  titleBlock: { marginTop: spacing[24], gap: TITLE_GAP },
  title: { ...typography.heading2, fontFamily: fontFamily.display, color: colors.text.primary },
  subtitle: { ...typography.body2, color: colors.text.tertiary },
  body: { marginTop: spacing[24] },
  footer: { paddingHorizontal: layout.screenMargin, paddingBottom: spacing[12] },
});

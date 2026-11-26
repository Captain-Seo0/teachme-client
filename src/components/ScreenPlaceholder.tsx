import { StyleSheet, Text, View } from 'react-native';

import { colors, layout, typography } from '@/theme';

type Props = { title: string };

/** Temporary screen body. Replace per screen once the Figma design is ready. */
export function ScreenPlaceholder({ title }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.screenMargin,
    backgroundColor: colors.bg.canvas,
  },
  title: { ...typography.heading2, color: colors.text.primary },
});

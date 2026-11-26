import type { TextStyle } from 'react-native';

// Source: Figma 03 Typography (node 1:960).
// Font family names must match the keys registered in src/theme/fonts.ts.
export const fontFamily = {
  // TODO: swap to Paperlogy Bold once the font file/license is confirmed (see CLAUDE.md "디자인 시스템").
  display: 'NotoSansKR_700Bold',
  body: {
    regular: 'NotoSansKR_400Regular',
    medium: 'NotoSansKR_500Medium',
    bold: 'NotoSansKR_700Bold',
  },
  chalk: 'NanumPenScript_400Regular', // chalkboard illustrations only
} as const;

const { regular, medium, bold } = fontFamily.body;

type Style = Required<Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing'>>;
const t = (family: string, fontSize: number, lineHeight: number, letterSpacingPct: number): Style => ({
  fontFamily: family,
  fontSize,
  lineHeight,
  letterSpacing: Math.round(fontSize * letterSpacingPct * 100) / 100, // % -> px
});

// Weights are encoded in fontFamily (do not set fontWeight with custom fonts).
export const typography = {
  displayLg: t(fontFamily.display, 44, 52, -0.02),
  displayMd: t(fontFamily.display, 32, 40, -0.02),
  heading1: t(bold, 26, 34, -0.01),
  heading2: t(bold, 22, 30, -0.01),
  heading3: t(bold, 20, 28, -0.005),
  title1: t(bold, 18, 26, 0),
  title2: t(bold, 16, 24, 0),
  subtitle: t(bold, 15, 22, 0),
  body1: t(medium, 14, 22, 0),
  body2: t(regular, 13, 20, 0),
  caption: t(medium, 12, 18, 0),
  micro: t(bold, 11, 16, 0),
} as const;

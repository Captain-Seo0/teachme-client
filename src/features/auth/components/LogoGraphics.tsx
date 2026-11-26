import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme';

// Source: Figma "홈 화면" (node 1:419 logo, node 1:426 pieces).
export const LOGO_WIDTH = 250;
export const LOGO_HEIGHT = 83;

/** Final TeachMe logo. */
export function Logo() {
  return (
    <Svg width={LOGO_WIDTH} height={LOGO_HEIGHT} viewBox="0 0 250 83">
      <Path
        d="M137.304 9.00488H167.884L141.857 44.5762H162.337V83H137.73V50.2793H137.726L113.831 83H82.1172L117.104 34.9707L82.1172 35.1211L90.6494 9.1543H112.697V0H137.304V9.00488ZM75.5225 31.1699H24.7021V35.0068H75.5225V57.1689H24.7021V60.7217H75.5225V82.8838H0V9.0127H75.5225V31.1699ZM250 82.5439H174.271V9.12109H250V82.5439ZM202.478 56.7783L225.373 45.832L202.478 34.8867V56.7783Z"
        fill={colors.green[400]}
      />
    </Svg>
  );
}

export const SQUARE_SIZE = { width: 75.5226, height: 73.8707 } as const;
export const TRIANGLE_SIZE = { width: 84.8705, height: 84 } as const;

/** Logo piece: the left/right square. */
export function LogoSquare() {
  return (
    <Svg width={SQUARE_SIZE.width} height={SQUARE_SIZE.height} viewBox="0 0 75.5226 73.8707">
      <Path d="M75.5226 51.7084V22.1623V22.157V0H0V73.8707H75.5226V51.7084Z" fill={colors.green[400]} />
    </Svg>
  );
}

/** Logo piece: the center triangle. */
export function LogoTriangle() {
  return (
    <Svg width={TRIANGLE_SIZE.width} height={TRIANGLE_SIZE.height} viewBox="0 0 84.8705 84">
      <Path d="M42.4352 0L84.8705 84H0L42.4352 0Z" fill={colors.green[400]} />
    </Svg>
  );
}

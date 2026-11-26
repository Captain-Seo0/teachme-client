import type { ViewStyle } from 'react-native';

// Source: Figma Elevation (node 1:1199). CSS blur is converted to RN shadowRadius (blur / 2).
// Android has no colored/offset shadows, so `elevation` is an approximation.
type Shadow = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const ink = '#1B2620';
const brand = '#25B851';

export const shadow: Record<'none' | 'e1' | 'e2' | 'brand', Shadow> = {
  none: {},
  // elevation.1 · 0 4 16 · ink 6% — default card
  e1: {
    shadowColor: ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  // elevation.2 · 0 8 24 · ink 12% — tab bar, dropdown, floating
  e2: {
    shadowColor: ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  // elevation.brand · 0 2 8 · green 25% — selected segment, CTA
  brand: {
    shadowColor: brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
};

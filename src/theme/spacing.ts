// Source: Figma 04 Spacing (node 1:1102). 8pt grid, 4pt helper. Key = px value.
export const spacing = {
  4: 4, // icon-text gap
  8: 8, // chip gap, label-input
  12: 12, // card gap, grid gutter
  16: 16, // card inner gap
  20: 20, // screen horizontal margin, card padding
  24: 24, // large card padding
  32: 32, // section gap
  40: 40, // screen top margin
} as const;

// Source: Figma Mobile Layout 375 x 812 (node 1:1144).
export const layout = {
  screenMargin: 20,
  cardGap: 12,
  ctaHeight: 56,
} as const;

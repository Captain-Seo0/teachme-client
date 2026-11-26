// Source: Figma "TeachMe 개발" design system, 02 Color (node 1:624).

const green = {
  50: '#F2FAF4',
  100: '#E4F6E9',
  200: '#CDEBD6',
  300: '#A7DDB6',
  400: '#2CD05D',
  500: '#25B851', // brand
  600: '#1E9E45',
  700: '#17803A',
  800: '#114320',
  900: '#1B2620', // ink
} as const;

const neutral = {
  0: '#FFFFFF',
  25: '#FFFDFA', // canvas
  50: '#F7FAF8',
  100: '#F4F7F5',
  150: '#F1F5F2',
  200: '#EEF2EF',
  300: '#E4EAE6',
  400: '#C9D3CC',
  500: '#A3AEA7',
  600: '#8A968F',
  700: '#5E6B63',
  800: '#212E29',
} as const;

const semantic = {
  success: '#25B851',
  successBg: '#E4F6E9',
  warning: '#F2B705',
  warningBg: '#FFF7DB',
  error: '#E2553F',
  errorBg: '#FDECEA',
  info: '#2F6FE4',
  infoBg: '#E8F0FD',
} as const;

// Classroom illustration palette.
const illustration = {
  board: '#2F5B2C',
  boardFrame: '#8B6438',
  wood: '#D9A866',
  woodLight: '#EBC68E',
  skin: '#FCEBDD',
  notePink: '#FFB0A8',
  noteYellow: '#FFF1A0',
  lime: '#A6E07A',
} as const;

// Role tokens (light / dark).
export const lightRoles = {
  bg: {
    canvas: '#FFFDFA',
    default: '#F4F7F5',
    surface: '#FFFFFF',
    subtle: '#F1F5F2',
    brand: '#25B851',
    brandSubtle: '#E4F6E9',
  },
  text: {
    primary: '#1B2620',
    secondary: '#5E6B63',
    tertiary: '#8A968F',
    brand: '#17803A',
    onBrand: '#FFFFFF',
  },
  border: {
    default: '#E4EAE6',
    strong: '#C9D3CC',
    focus: '#25B851',
  },
} as const;

type Roles = {
  [G in keyof typeof lightRoles]: { [K in keyof (typeof lightRoles)[G]]: string };
};

export const darkRoles: Roles = {
  bg: {
    canvas: '#121815',
    default: '#161D19',
    surface: '#1F2823',
    subtle: '#26302A',
    brand: '#2CD05D',
    brandSubtle: '#173A24',
  },
  text: {
    primary: '#F1F5F2',
    secondary: '#A3AEA7',
    tertiary: '#7C8A82',
    brand: '#3EC56A',
    onBrand: '#0F1A13',
  },
  border: {
    default: '#2E3933',
    strong: '#445048',
    focus: '#3EC56A',
  },
};

/** Light-mode tokens. Components use these only for now (dark roles are defined but not yet applied). */
export const colors = {
  green,
  neutral,
  semantic,
  illustration,
  ...lightRoles,
} as const;

export const darkColors = { green, neutral, semantic, illustration, ...darkRoles } as const;

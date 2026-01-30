export const colors = {
  // Primary palette
  primary: {
    main: '#4AC7B6',
    light: '#7EDACE',
    dark: '#3AA89A',
    contrast: '#FFFFFF',
  },

  // Secondary palette
  secondary: {
    main: '#FFB08B',
    light: '#FFCDB3',
    dark: '#E89566',
    contrast: '#2D3436',
  },

  // Accent palette
  accent: {
    main: '#A78BFA',
    light: '#C4B5FD',
    dark: '#8B5CF6',
    contrast: '#FFFFFF',
  },

  // Neutral palette (warm grays)
  neutral: {
    50: '#FDFCFB',
    100: '#F7F5F3',
    200: '#EDE9E5',
    300: '#DDD7D0',
    400: '#B8AFA5',
    500: '#8D8478',
    600: '#6B6359',
    700: '#4A453E',
    800: '#2D2A26',
    900: '#1A1816',
  },

  // Mood colors (soft pastels)
  mood: {
    1: '#E8B4B4', // Soft coral for lowest
    2: '#EFCFA6', // Warm peach
    3: '#F5E6A3', // Soft yellow
    4: '#B8E0B8', // Soft green
    5: '#A8D8EA', // Soft blue for highest
  },

  // Semantic colors
  success: '#6BCB77',
  warning: '#FFD93D',
  error: '#FF8080',
  info: '#6FDFDF',

  // Background colors
  background: {
    primary: '#FDFCFB',
    secondary: '#F7F5F3',
    card: '#FFFFFF',
    overlay: 'rgba(45, 42, 38, 0.5)',
  },

  // Text colors
  text: {
    primary: '#2D2A26',
    secondary: '#6B6359',
    tertiary: '#8D8478',
    inverse: '#FDFCFB',
    disabled: '#B8AFA5',
  },

  // Border colors
  border: {
    light: '#EDE9E5',
    medium: '#DDD7D0',
    dark: '#B8AFA5',
  },

  // Gator specific colors (default/legacy)
  gator: {
    body: '#4AC7B6',
    bodyDark: '#3AA89A',
    belly: '#8BDFD1',
    eyes: '#2D2A26',
    cheeks: '#FFB08B',
  },

  // Gator color palette for different gator colors
  gatorColors: {
    teal: { body: '#4AC7B6', dark: '#3AA89A', belly: '#8BDFD1' },
    pink: { body: '#F8A5C2', dark: '#E88BA8', belly: '#FDCFDF' },
    purple: { body: '#A78BFA', dark: '#8B5CF6', belly: '#C4B5FD' },
    orange: { body: '#FFB08B', dark: '#E89566', belly: '#FFCDB3' },
    blue: { body: '#7DD3FC', dark: '#38BDF8', belly: '#BAE6FD' },
    green: { body: '#86EFAC', dark: '#4ADE80', belly: '#BBF7D0' },
    yellow: { body: '#FDE047', dark: '#FACC15', belly: '#FEF08A' },
    coral: { body: '#FDA4AF', dark: '#FB7185', belly: '#FECDD3' },
  },

  // Environment colors
  environment: {
    pond: '#87CEEB',
    garden: '#98D8AA',
    beach: '#FFEAA7',
    forest: '#6B8E23',
    cozy_room: '#DEB887',
    starry_night: '#2C3E50',
  },
} as const;

export type ColorTheme = typeof colors;

export { colors } from './colors';
export { typography, fontSize, fontWeight, lineHeight } from './typography';
export { spacing, borderRadius, shadows, layout } from './spacing';

import { colors } from './colors';
import { typography, fontSize, fontWeight, lineHeight } from './typography';
import { spacing, borderRadius, shadows, layout } from './spacing';

export const theme = {
  colors,
  typography,
  fontSize,
  fontWeight,
  lineHeight,
  spacing,
  borderRadius,
  shadows,
  layout,
  animation: {
    fast: 150,
    normal: 300,
    slow: 400,
    verySlow: 600,
  },
} as const;

export type Theme = typeof theme;
export default theme;

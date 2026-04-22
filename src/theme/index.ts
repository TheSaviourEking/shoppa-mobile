export { colors } from './colors';
export { spacing } from './spacing';
export { radii } from './radii';
export { typography, fontFamilies } from './typography';

import { colors } from './colors';
import { radii } from './radii';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = { colors, spacing, radii, typography } as const;
export type Theme = typeof theme;

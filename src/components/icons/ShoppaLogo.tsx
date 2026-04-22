import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

/**
 * Shoppa shopping-bag glyph that anchors the splash + onboarding eyebrow.
 * Geometry traced from figma/01-splash/01-splash.svg — square viewBox so the
 * caller can scale via `size`.
 */
export function ShoppaLogo({ size = 36, color = '#FFFFFF' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path d="M7 12 H29 V31 A2 2 0 0 1 27 33 H9 A2 2 0 0 1 7 31 Z" fill={color} />
      <Path
        d="M13 12 V9 A5 5 0 0 1 23 9 V12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

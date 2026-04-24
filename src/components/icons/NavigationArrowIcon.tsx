import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

/** Filled paper-plane glyph used to mark the user's current location. */
export function NavigationArrowIcon({ size = 20, color = '#905FF8' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.5 11L20.5 4L13.5 21L11.5 13L3.5 11Z"
        fill={color}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

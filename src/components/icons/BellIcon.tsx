import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function BellIcon({ size = 24, color = '#1A1A1A' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4a5 5 0 0 0-5 5v3.4l-1.3 2.6A1 1 0 0 0 6.6 16h10.8a1 1 0 0 0 .9-1l-1.3-2.6V9a5 5 0 0 0-5-5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path d="M10 19a2 2 0 0 0 4 0" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

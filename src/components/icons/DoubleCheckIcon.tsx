import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function DoubleCheckIcon({ size = 14, color = '#905FF8' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 14" fill="none">
      <Path
        d="M1 8 4 11 10.5 4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M6 8 8 10 14.5 3"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function EyeOffIcon({ size = 20, color = '#1A1A1A' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3l18 18M10.59 10.59A2 2 0 0 0 13.41 13.41M9.88 5.18A10.65 10.65 0 0 1 12 5c5 0 9 4 10 7-.4 1.18-1.21 2.55-2.36 3.83M6.61 6.61C4.61 8.06 3.36 9.93 3 12c1 3 5 7 10 7 1.81 0 3.49-.49 4.96-1.27"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

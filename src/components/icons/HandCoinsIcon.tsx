import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function HandCoinsIcon({ size = 32, color = '#1A1A1A' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Circle cx={20} cy={9} r={4} stroke={color} strokeWidth={1.8} fill="none" />
      <Circle cx={26} cy={13} r={3} stroke={color} strokeWidth={1.8} fill="none" />
      <Path
        d="M5 18l5-2 7 4 6-1c1.1 0 2 .9 2 2l-9 5a4 4 0 0 1-3 0L5 24z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

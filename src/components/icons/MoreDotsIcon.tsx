import Svg, { Circle } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function MoreDotsIcon({ size = 20, color = '#1A1A1A' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx={4.5} cy={10} r={1.5} fill={color} />
      <Circle cx={10} cy={10} r={1.5} fill={color} />
      <Circle cx={15.5} cy={10} r={1.5} fill={color} />
    </Svg>
  );
}

import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function XCircleIcon({ size = 18, color = '#E63047' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Circle cx={9} cy={9} r={9} fill={color} />
      <Path d="M6 6 12 12 M12 6 6 12" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function UserAvatarIcon({ size = 80, color = '#A3A3A3' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <Circle cx={40} cy={32} r={14} fill={color} />
      <Path d="M16 70c0-13.25 10.75-24 24-24s24 10.75 24 24" fill={color} />
    </Svg>
  );
}

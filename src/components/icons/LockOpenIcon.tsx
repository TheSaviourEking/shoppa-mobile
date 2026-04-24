import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Open padlock — used for "Forgot Password"
export function LockOpenIcon({ size = 24, color = '#A3A3A3', strokeWidth = 1.6 }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 11V8a5 5 0 0 1 9.9-1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path
        d="M5 12a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

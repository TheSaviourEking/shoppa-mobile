import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Outlined warning triangle — used for "Report a Problem". Distinct from
// WarningIcon which is the filled variant used inside status toasts.
export function AlertTriangleIcon({
  size = 24,
  color = '#A3A3A3',
  strokeWidth = 1.6,
}: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.27 3.86a2 2 0 0 1 3.46 0l8.3 14.36A2 2 0 0 1 20.3 21H3.7a2 2 0 0 1-1.73-2.78l8.3-14.36Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M12 9v5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M12 17h.01" stroke={color} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" />
    </Svg>
  );
}

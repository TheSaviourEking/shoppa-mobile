import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Speech bubble with a small dot — used for "Feedback"
export function FeedbackIcon({ size = 24, color = '#A3A3A3', strokeWidth = 1.6 }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-4 4v-4H6a2 2 0 0 1-2-2V6Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={10} r={0.9} fill={color} />
    </Svg>
  );
}

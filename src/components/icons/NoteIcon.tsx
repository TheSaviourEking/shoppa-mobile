import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function NoteIcon({ size = 20, color = '#1A1A1A', strokeWidth = 1.8 }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5C5 3.89543 5.89543 3 7 3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M9 9H15M9 13H13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

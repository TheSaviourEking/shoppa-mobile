import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function ChatBubbleIcon({ size = 28, color = '#D7D7D7' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path
        d="M4 12.5C4 8.4 7.4 5 11.5 5h5C20.6 5 24 8.4 24 12.5S20.6 20 16.5 20H10l-3.5 3v-3.5A7.5 7.5 0 0 1 4 12.5Z"
        fill={color}
      />
      <Circle cx={10.5} cy={12.5} r={1.2} fill="#FFFFFF" />
      <Circle cx={14} cy={12.5} r={1.2} fill="#FFFFFF" />
      <Circle cx={17.5} cy={12.5} r={1.2} fill="#FFFFFF" />
    </Svg>
  );
}

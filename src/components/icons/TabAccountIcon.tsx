import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function TabAccountIcon({ size = 19, color = '#DDCFFD' }: Props): React.JSX.Element {
  const width = size * (17 / 19);
  return (
    <Svg width={width} height={size} viewBox="0 0 17 19" fill="none">
      <Path
        d="M11.6146 4.5C11.6146 6.433 10.0476 8 8.11464 8C6.18165 8 4.61464 6.433 4.61464 4.5C4.61464 2.567 6.18165 1 8.11464 1C10.0476 1 11.6146 2.567 11.6146 4.5Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M8.11464 11C4.72349 11 2.15064 13.0143 1.09712 15.8629C0.688321 16.9682 1.63297 18 2.81148 18H13.4178C14.5963 18 15.541 16.9682 15.1322 15.8629C14.0787 13.0143 11.5058 11 8.11464 11Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

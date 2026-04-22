import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function EyeIcon({ size = 18, color = '#333333' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.02761 8.29436C2.96961 4.79129 5.92834 3 9 3C12.0717 3 15.0304 4.79129 16.9724 8.29436C17.2168 8.73479 17.2146 9.26955 16.9717 9.70731C15.0297 13.21 12.0711 15 9 15C5.92886 15 2.97026 13.21 1.02831 9.70731C0.785361 9.26955 0.78324 8.73479 1.02761 8.29436ZM9 12C10.6569 12 12 10.6569 12 9C12 7.34315 10.6569 6 9 6C7.34315 6 6 7.34315 6 9C6 10.6569 7.34315 12 9 12Z"
        fill={color}
      />
    </Svg>
  );
}

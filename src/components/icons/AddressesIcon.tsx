import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Mailbox with raised flag — used for "My Addresses"
export function AddressesIcon({ size = 24, color = '#A3A3A3', strokeWidth = 1.6 }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10c0-2.209 1.79-4 4-4h6c2.21 0 4 1.791 4 4v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M8 10v3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path
        d="M14 6V4.5A.5.5 0 0 1 14.5 4H19a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

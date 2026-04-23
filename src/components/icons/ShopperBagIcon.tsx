import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function ShopperBagIcon({ size = 27, color = '#FFFFFF' }: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 27 27" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.31846 2.81286C1.41728 1.23176 2.72843 0 4.31262 0H22.4943C24.0785 0 25.3896 1.23176 25.4884 2.81287L26.8009 23.8129C26.9089 25.54 25.5372 27 23.8068 27H3.00012C1.26966 27 -0.101982 25.54 0.00596184 23.8129L1.31846 2.81286ZM10.4035 7.5C10.4035 6.67157 9.73188 6 8.90346 6C8.07503 6 7.40346 6.67157 7.40346 7.5C7.40346 10.8137 10.0897 13.5 13.4035 13.5C16.7172 13.5 19.4035 10.8137 19.4035 7.5C19.4035 6.67157 18.7319 6 17.9035 6C17.075 6 16.4035 6.67157 16.4035 7.5C16.4035 9.15685 15.0603 10.5 13.4035 10.5C11.7466 10.5 10.4035 9.15685 10.4035 7.5Z"
        fill={color}
      />
    </Svg>
  );
}

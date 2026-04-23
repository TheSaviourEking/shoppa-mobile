import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function TabShopIcon({ size = 20, color = '#DDCFFD' }: Props): React.JSX.Element {
  const height = size * (18 / 20);
  return (
    <Svg width={size} height={height} viewBox="0 0 20 18" fill="none">
      <Path
        d="M19 5L16.9 2.2C16.3334 1.44458 15.4443 1 14.5 1H5.5C4.55573 1 3.66656 1.44458 3.1 2.2L1 5M19 5V6C19 6.8885 18.6137 7.68679 18 8.23611M19 5H1M1 5V6C1 6.8885 1.38625 7.68679 2 8.23611M13 6C13 7.65685 14.3431 9 16 9C16.7684 9 17.4692 8.71115 18 8.23611M13 6V5M13 6C13 7.65685 11.6569 9 10 9C8.34315 9 7 7.65685 7 6M7 6C7 7.65685 5.65685 9 4 9C3.23165 9 2.53076 8.71115 2 8.23611M7 6V5M12 17L12 14C12 12.8954 11.1046 12 10 12C8.89544 12 8.00001 12.8954 8.00001 14L8 17M2 8.23611V14C2 15.6569 3.34315 17 5 17H15C16.6569 17 18 15.6569 18 14V8.23611"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

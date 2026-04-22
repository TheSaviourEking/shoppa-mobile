import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

const VB_WIDTH = 57;
const VB_HEIGHT = 67;

export function UserAvatarIcon({ size = 67, color = '#D1D1D1' }: Props): React.JSX.Element {
  const width = size * (VB_WIDTH / VB_HEIGHT);
  return (
    <Svg width={width} height={size} viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`} fill="none">
      <Path
        d="M28.3021 0C19.6326 0 12.6045 7.02809 12.6045 15.6977C12.6045 24.3673 19.6326 31.3953 28.3021 31.3953C36.9717 31.3953 43.9998 24.3673 43.9998 15.6977C43.9998 7.02809 36.9717 0 28.3021 0Z"
        fill={color}
      />
      <Path
        d="M28.3073 34.8837C14.9402 34.8837 4.7098 42.8938 0.555803 54.1256C-0.631746 57.3366 0.181309 60.5016 2.06907 62.7514C3.90874 64.9438 6.74863 66.2791 9.80791 66.2791H46.8067C49.866 66.2791 52.7059 64.9438 54.5456 62.7514C56.4333 60.5016 57.2464 57.3366 56.0588 54.1256C51.9048 42.8938 41.6744 34.8837 28.3073 34.8837Z"
        fill={color}
      />
    </Svg>
  );
}

import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
}

const VB_WIDTH = 136;
const VB_HEIGHT = 100;
const CLIP_ID = 'avatarAddImageClip';

export function AvatarAddImagePlaceholder({
  width = VB_WIDTH,
  height = VB_HEIGHT,
}: Props): React.JSX.Element {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`} fill="none">
      <Defs>
        <ClipPath id={CLIP_ID}>
          <Rect width="136" height="100" rx="50" />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${CLIP_ID})`}>
        <Rect width="136" height="100" rx="50" fill="#F5F5F5" />
        <Path
          d="M67.8596 40.6963C59.1901 40.6963 52.162 47.7244 52.162 56.394C52.162 65.0635 59.1901 72.0916 67.8596 72.0916C76.5292 72.0916 83.5573 65.0635 83.5573 56.394C83.5573 47.7244 76.5292 40.6963 67.8596 40.6963Z"
          fill="#D1D1D1"
        />
        <Path
          d="M67.8648 75.58C54.4977 75.58 44.2673 83.5901 40.1133 94.8219C38.9257 98.0329 39.7388 101.198 41.6266 103.448C43.4662 105.64 46.3061 106.975 49.3654 106.975H86.3642C89.4235 106.975 92.2634 105.64 94.1031 103.448C95.9908 101.198 96.8039 98.0329 95.6163 94.8219C91.4623 83.5901 81.2319 75.58 67.8648 75.58Z"
          fill="#D1D1D1"
        />
      </G>
    </Svg>
  );
}

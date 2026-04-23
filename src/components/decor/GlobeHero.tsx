import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { fontFamilies } from '@/theme';

// Pill colors sampled from the Figma reference. Positions are percentages of
// the component's own width/height so the layout holds across device sizes.
interface PillSpec {
  label: string;
  bg: string;
  fg: string;
  top: `${number}%`;
  left?: `${number}%`;
  right?: `${number}%`;
}

const PILLS: PillSpec[] = [
  { label: 'hosts', bg: '#3A5FD9', fg: '#FFFFFF', top: '27%', left: '4%' },
  { label: 'gifters', bg: '#3DAEA3', fg: '#FFFFFF', top: '18%', left: '42%' },
  { label: 'guests', bg: '#D93E6B', fg: '#FFFFFF', top: '10%', right: '10%' },
  { label: 'promoters', bg: '#5FD47A', fg: '#0B1F0F', top: '40%', right: '2%' },
  { label: 'vendors', bg: '#D98F3E', fg: '#FFFFFF', top: '55%', left: '52%' },
  { label: 'planners', bg: '#D9622B', fg: '#FFFFFF', top: '75%', left: '8%' },
];

interface Props {
  style?: ViewStyle;
}

/**
 * Partyverse-style "globe" hero. Dark backdrop with a soft top spotlight, a
 * latitude/longitude grid rendered in SVG, and six category pills positioned
 * over the globe. The grid is a programmatic approximation — drop in the real
 * SVG/PNG export by replacing the <PlaceholderGrid /> with an <Image /> or
 * <Svg /> of the asset.
 */
export function GlobeHero({ style }: Props): React.JSX.Element {
  return (
    <View style={[styles.root, style]}>
      <PlaceholderGrid />

      {PILLS.map((p) => (
        <View
          key={p.label}
          style={[
            styles.pill,
            {
              backgroundColor: p.bg,
              top: p.top,
              ...(p.left !== undefined ? { left: p.left } : {}),
              ...(p.right !== undefined ? { right: p.right } : {}),
            },
          ]}
        >
          <Text style={[styles.pillLabel, { color: p.fg }]}>{p.label}</Text>
        </View>
      ))}
    </View>
  );
}

function PlaceholderGrid(): React.JSX.Element {
  const VB_W = 430;
  const VB_H = 500;
  const HLINES = 8;
  const VLINES = 9;

  return (
    <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid slice">
      <Defs>
        <RadialGradient id="spot" cx="50%" cy="0%" rx="60%" ry="45%">
          <Stop offset="0%" stopColor="#3F2E5A" stopOpacity="0.55" />
          <Stop offset="100%" stopColor="#121212" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      <Rect width={VB_W} height={VB_H} fill="#121212" />
      <Rect width={VB_W} height={VB_H} fill="url(#spot)" />

      {/* Latitude lines — gentle bow that flattens toward the bottom */}
      {Array.from({ length: HLINES }).map((_, i) => {
        const y = 60 + i * ((VB_H - 80) / (HLINES - 1));
        const bow = 18 - i * 2;
        return (
          <Path
            key={`h-${i}`}
            d={`M 0 ${y} Q ${VB_W / 2} ${y + bow} ${VB_W} ${y}`}
            stroke="#2C2C2C"
            strokeWidth={1}
            fill="none"
          />
        );
      })}

      {/* Longitude lines — bow outward from center */}
      {Array.from({ length: VLINES }).map((_, i) => {
        const x = (i / (VLINES - 1)) * VB_W;
        const dx = (x - VB_W / 2) * 0.35;
        return (
          <Path
            key={`v-${i}`}
            d={`M ${x} 0 Q ${x + dx} ${VB_H / 2} ${x} ${VB_H}`}
            stroke="#2C2C2C"
            strokeWidth={1}
            fill="none"
          />
        );
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  // Fill the parent via flex rather than % dimensions — % heights can collapse
  // to zero inside flex containers under RN 0.81 / the new architecture.
  root: {
    flex: 1,
    backgroundColor: '#121212',
    overflow: 'hidden',
  },
  pill: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillLabel: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 13,
    letterSpacing: -0.2,
  },
});

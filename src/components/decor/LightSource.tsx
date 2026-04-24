import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

// ─── Glow ─────────────────────────────────────────────────────────────
// Figma spec:
//   width:  205.16 left: 104.84 → centre x ≈ 207.42
//   height: 205.16 top:  -91.87 → centre y ≈ 10.71
//   background: radial-gradient(50% 50% at 50% 50%, #D4DEFD 36.5%, #263D99 100%)
//   opacity: 0.6
//   filter:  blur(81px)
//
// The 81px CSS blur is roughly a Gaussian with sigma ≈ 40px. Convolving
// the sharp 205px gradient with that kernel diffuses the energy: the
// peak brightness drops sharply, the colour fades smoothly to nothing
// well outside the original footprint, and what's visible is a soft
// glow ~150px across — not a hard 205px disc.
//
// Native blur on RN is platform-flaky (`expo-blur` is iOS-only at quality,
// SVG `<feGaussianBlur>` isn't reliably supported), so we approximate by:
//   1. Stretching the SVG canvas to ~2× the original (room for the halo)
//   2. Pushing the bright core into the inner ~6% of the canvas
//   3. Letting the colour fade to transparent by ~35% of the canvas
//   4. Capping wrapper opacity at 0.35 (not 0.6) — the blur in CSS spreads
//      the same total energy across a wider area, lowering the peak.
const GLOW_CENTER_X = 207.42;
// Centre sits well above the visible top edge so the bright nucleus is
// fully off-screen — what bleeds down is the OUTER mid-band of the
// gradient, which we shape to read as a uniform soft blue wash rather
// than a hot spot.
const GLOW_CENTER_Y = -80;
const GLOW_CANVAS = 640;

// ─── Particles ────────────────────────────────────────────────────────
// All 19 ellipses lifted directly from the figma CSS, in original order.
// `opacity` inherits the parent particle layer's 0.2 multiplier (figma's
// PARTICLES wrapper) — the constant below applies it once at render.
interface Particle {
  size: number;
  left: number;
  top: number;
  /** Per-particle opacity from the figma; defaults to 1. */
  opacity?: number;
}

const PARTICLES: readonly Particle[] = [
  { size: 9.25, left: 206.42, top: 71.76, opacity: 0.4 },
  { size: 9.25, left: 235.87, top: -7.39 },
  { size: 3.7, left: 186.07, top: -11.49 },
  { size: 3.7, left: 149.07, top: -55.89 },
  { size: 3.7, left: 239.72, top: -74.39, opacity: 0.7 },
  { size: 3.7, left: 169.42, top: 53.26 },
  { size: 3.7, left: 182.37, top: 112.46 },
  { size: 3.7, left: 195.32, top: 171.65 },
  { size: 3.7, left: 274.87, top: 90.26, opacity: 0.7 },
  { size: 3.7, left: 110.22, top: 79.16 },
  { size: 3.7, left: 113.92, top: -78.09, opacity: 0.4 },
  { size: 3.7, left: 280.42, top: -39.24, opacity: 0.4 },
  { size: 3.7, left: 75.07, top: -137.29 },
  { size: 3.7, left: 56.57, top: 68.06, opacity: 0.4 },
  { size: 3.7, left: 354.41, top: 8.86 },
  { size: 9.25, left: 145.37, top: 27.36, opacity: 0.7 },
  { size: 9.25, left: 274.87, top: -111.39 },
  { size: 9.25, left: 145.37, top: -153.94, opacity: 0.4 },
  { size: 9.25, left: 311.87, top: -2.24 },
  { size: 9.25, left: 75.07, top: 3.31 },
];

// Figma's PARTICLES wrapper applies opacity: 0.2 across the layer.
const PARTICLE_LAYER_OPACITY = 0.2;

/**
 * Top-of-screen light source: a soft blue glow with 19 specular dots,
 * pixel-positioned per the figma onboarding mockup. Sits above whatever
 * content is below it — pass it a parent that allows overflow so the
 * upper half (which extends past y=0) can paint into the status bar area.
 */
export function LightSource(): React.JSX.Element {
  return (
    <View style={styles.layer} pointerEvents="none">
      {/* Glow */}
      <View
        style={[
          styles.glow,
          {
            left: GLOW_CENTER_X - GLOW_CANVAS / 2,
            top: GLOW_CENTER_Y - GLOW_CANVAS / 2,
            width: GLOW_CANVAS,
            height: GLOW_CANVAS,
          },
        ]}
      >
        <Svg width="100%" height="100%">
          <Defs>
            {/*
              All-blue palette, no white anywhere — the figma reference shows
              a uniform soft wash, not a hot core. The visible portion of the
              gradient is the band from ~12% (just below the off-screen
              centre) outward, so we keep those mid stops at a low,
              consistent opacity instead of a sharp peak.
            */}
            <RadialGradient id="lightGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#D4DEFD" stopOpacity={0.45} />
              <Stop offset="18%" stopColor="#A5B7F4" stopOpacity={0.32} />
              <Stop offset="38%" stopColor="#5D77E8" stopOpacity={0.18} />
              <Stop offset="62%" stopColor="#3A53C0" stopOpacity={0.08} />
              <Stop offset="85%" stopColor="#263D99" stopOpacity={0.02} />
              <Stop offset="100%" stopColor="#263D99" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#lightGlow)" />
        </Svg>
      </View>

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <View
          key={i}
          style={[
            styles.particle,
            {
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              opacity: (p.opacity ?? 1) * PARTICLE_LAYER_OPACITY,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFillObject },
  glow: { position: 'absolute', opacity: 0.7 },
  particle: { position: 'absolute', backgroundColor: '#FFFFFF' },
});

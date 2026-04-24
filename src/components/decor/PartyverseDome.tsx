import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  G,
  Path,
  Pattern,
  Polygon,
  Polyline,
  Rect,
  Image as SvgImage,
  Text as SvgText,
} from 'react-native-svg';

// ── Constants ─────────────────────────────────────────────────────────
const VB_W = 1200;
const VB_H = 720;
const CX = 600;
// Lowered center + larger radius so the dome fills the viewBox taller and
// more enveloping, with the bottom quarter cropped off the viewBox.
const CY = 800;
const R = 620;
const SQ = 1.0;
const ROWS = 4;
const COLS = 8;
const M_TOTAL = 16;
const SLOT = (2 * R) / COLS;
const HALF_PI = Math.PI / 2;

// ── Math helpers ──────────────────────────────────────────────────────
interface Pt {
  x: number;
  y: number;
}

function project(xBase: number, t: number): Pt {
  return {
    x: CX + (xBase - CX) * Math.cos(t * HALF_PI),
    y: CY - R * SQ * Math.sin(t * HALF_PI),
  };
}

function cellPath(r: number, c: number): string {
  const tPole = 1 - r / ROWS;
  const tEq = 1 - (r + 1) / ROWS;
  const xL = CX - R + (c / COLS) * 2 * R;
  const xR = CX - R + ((c + 1) / COLS) * 2 * R;
  const N = 12;
  const pts: Pt[] = [];
  pts.push(project(xL, tPole));
  pts.push(project(xR, tPole));
  for (let i = 1; i <= N; i++) pts.push(project(xR, tPole + ((tEq - tPole) * i) / N));
  pts.push(project(xL, tEq));
  for (let i = 1; i < N; i++) pts.push(project(xL, tEq + ((tPole - tEq) * i) / N));
  return 'M' + pts.map((p, i) => `${i === 0 ? '' : ' L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('') + ' Z';
}

interface BBox {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  cx: number;
  cy: number;
}

function cellBBox(r: number, c: number): BBox {
  const tPole = 1 - r / ROWS;
  const tEq = 1 - (r + 1) / ROWS;
  const xL = CX - R + (c / COLS) * 2 * R;
  const xR = CX - R + ((c + 1) / COLS) * 2 * R;
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (let i = 0; i <= 12; i++) {
    const t = tEq + ((tPole - tEq) * i) / 12;
    const pL = project(xL, t);
    const pR = project(xR, t);
    x0 = Math.min(x0, pL.x, pR.x);
    x1 = Math.max(x1, pL.x, pR.x);
    y0 = Math.min(y0, pL.y, pR.y);
    y1 = Math.max(y1, pL.y, pR.y);
  }
  return { x0, x1, y0, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}

// Label anchors to the top edge of the cell along the projection, so the short
// static tail (see below) drops straight down and visually touches the cell.
// Top-row cells use the cell's midpoint instead, since their top edge is the
// dome pole.
function labelAnchor(r: number, c: number): Pt {
  const tPole = 1 - r / ROWS;
  const tEq = 1 - (r + 1) / ROWS;
  const tTgt = r === 0 ? tPole + (tEq - tPole) * 0.5 : tPole;
  const xL = CX - R + (c / COLS) * 2 * R;
  const xR = CX - R + ((c + 1) / COLS) * 2 * R;
  const cosT = Math.cos(tTgt * HALF_PI);
  return {
    x: CX + ((xL + xR) / 2 - CX) * cosT,
    y: CY - R * SQ * Math.sin(tTgt * HALF_PI),
  };
}

function meridianPts(xBase: number, samples = 30): string {
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const p = project(xBase, i / samples);
    pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  return pts.join(' ');
}

// Matches the HTML's ease/clamp/win helpers. `win(p, s, e)` returns an
// ease-in-out 0→1 ramp as p moves from s to e, clamped outside.
function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}
function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function win(p: number, s: number, e: number): number {
  return ease(clamp((p - s) / (e - s), 0, 1));
}

// ── Cell definitions ──────────────────────────────────────────────────
type CellDefRaw =
  | { type: 'shard'; r: number; c: number; col: string; n: string }
  | { type: 'photo'; r: number; c: number };

const DEF_CELLS_RAW: CellDefRaw[] = [
  { type: 'shard', r: 1, c: 0, col: '#5769E9', n: 'hosts' },
  { type: 'shard', r: 1, c: 4, col: '#00EBE3', n: 'gifters' },
  { type: 'shard', r: 2, c: 1, col: '#F66A00', n: 'planners' },
  { type: 'shard', r: 0, c: 7, col: '#F1006B', n: 'guests' },
  { type: 'shard', r: 3, c: 5, col: '#EE9C2E', n: 'vendors' },
  { type: 'shard', r: 2, c: 7, col: '#85ED91', n: 'promoters' },
  { type: 'photo', r: 0, c: 5 },
  { type: 'photo', r: 1, c: 2 },
  { type: 'photo', r: 2, c: 0 },
  { type: 'photo', r: 2, c: 6 },
  { type: 'photo', r: 3, c: 3 },
];

interface PreparedBase {
  id: string;
  img: string;
  path: string;
  bb: BBox;
  anchor: Pt;
  r: number;
  c: number;
}
type PreparedShard = PreparedBase & { type: 'shard'; col: string; n: string };
type PreparedPhoto = PreparedBase & { type: 'photo' };
type PreparedCell = PreparedShard | PreparedPhoto;

const DEF_CELLS: PreparedCell[] = DEF_CELLS_RAW.map((d, i): PreparedCell => {
  const base = {
    id: `cell-${i}`,
    img: `https://i.pravatar.cc/200?u=${i + 10}`,
    path: cellPath(d.r, d.c),
    bb: cellBBox(d.r, d.c),
    anchor: labelAnchor(d.r, d.c),
    r: d.r,
    c: d.c,
  };
  return d.type === 'shard' ? { ...base, type: 'shard', col: d.col, n: d.n } : { ...base, type: 'photo' };
}).sort((a, b) => a.bb.cx - b.bb.cx);

const N_CELLS = DEF_CELLS.length;

// ── Animated SVG wrappers ─────────────────────────────────────────────
const AnimatedG = Animated.createAnimatedComponent(G);

// ── Sub-components ────────────────────────────────────────────────────
interface MeridianProps {
  baseXOffset: number;
  progress: Animated.Value;
}

function AnimatedMeridian({ baseXOffset, progress }: MeridianProps): React.JSX.Element {
  // Animating the `points` string isn't supported natively, so we subscribe to
  // progress via a JS listener and setState each frame. React 18 batches the
  // 16 meridian updates into a single re-render per tick.
  const [points, setPoints] = useState<string>(() => meridianPts(CX + baseXOffset));
  const [opacity, setOpacity] = useState<number>(0);

  useEffect(() => {
    const id = progress.addListener(({ value }) => {
      // Eased 0→1 over the first 5% of the cycle (≈0.3s of 6s), then held.
      const rotProgress = win(value, 0, 0.05);
      const xBase = CX + baseXOffset + rotProgress * SLOT;
      const absXOff = Math.abs(xBase - CX);
      const limit = R * 0.98;
      if (absXOff > limit) {
        setOpacity(0);
        return;
      }
      const fade = Math.min(1, Math.max(0, (limit - absXOff) / (R * 0.08)));
      setOpacity(0.22 * fade);
      setPoints(meridianPts(xBase));
    });
    return () => progress.removeListener(id);
  }, [baseXOffset, progress]);

  return (
    <Polyline points={points} stroke="#ffffff" strokeWidth={2} strokeOpacity={opacity * 1.5} fill="none" />
  );
}

interface CellProps {
  cell: PreparedCell;
  idx: number;
  progress: Animated.Value;
}

function AnimatedCell({ cell, idx, progress }: CellProps): React.JSX.Element {
  const start = 0.3 + (idx / N_CELLS) * 0.3;
  const opacityAnim = progress.interpolate({
    inputRange: [0, start, start + 0.2, 1],
    outputRange: [0, 0, 1, 1],
  });
  const { bb } = cell;
  return (
    <AnimatedG opacity={opacityAnim}>
      <G clipPath={`url(#clip-${cell.id})`}>
        <Path d={cell.path} fill="#1A1A1A" />
        {cell.type === 'photo' ? (
          <SvgImage
            href={{ uri: cell.img }}
            x={bb.x0}
            y={bb.y0}
            width={bb.x1 - bb.x0}
            height={bb.y1 - bb.y0}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          // Shards are solid colour blocks per the figma — no underlying
          // photo, no colour tint over an image. Just the brand colour.
          <Path d={cell.path} fill={cell.col} />
        )}
        <Path d={cell.path} fill="none" stroke="#ffffff" strokeWidth={1} strokeOpacity={0.1} />
      </G>
    </AnimatedG>
  );
}

interface LabelProps {
  cell: PreparedShard;
  globalIdx: number;
  progress: Animated.Value;
}

function AnimatedLabel({ cell, globalIdx, progress }: LabelProps): React.JSX.Element {
  const lx = cell.anchor.x;
  const ly = Math.max(40, cell.anchor.y - 25);
  const tw = cell.n.length * 9.5 + 26;

  const start = 0.3 + (globalIdx / N_CELLS) * 0.3 + 0.1;
  const anim = progress.interpolate({
    inputRange: [0, start, start + 0.18, 1],
    outputRange: [0, 0, 1, 1],
  });
  // Slide up 12 units as the label fades in.
  const ty = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [ly + 12, ly],
  });

  return (
    <AnimatedG opacity={anim} translateX={lx} translateY={ty}>
      <Rect x={-tw / 2} y={-15} width={tw} height={30} rx={15} fill={cell.col} />
      {/* Short static tail — base on pill bottom (y=15), tip at y=25 so it
          exactly touches the cell top for non-pole rows. */}
      <Polygon points="-6,15 6,15 0,25" fill={cell.col} />
      <SvgText x={0} y={5} textAnchor="middle" fontSize={15} fontWeight="500" fill="#ffffff">
        {cell.n}
      </SvgText>
    </AnimatedG>
  );
}

// ── Public component ──────────────────────────────────────────────────
export function PartyverseDome(): React.JSX.Element {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      }),
    ).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet">
        <Defs>
          <Pattern id="pvd-sp" x={0} y={0} width={28} height={28} patternUnits="userSpaceOnUse">
            <Path
              d="M 14,12 L 14.6,13.4 L 16,14 L 14.6,14.6 L 14,16 L 13.4,14.6 L 12,14 L 13.4,13.4 Z"
              fill="#F1006B"
              fillOpacity={0.28}
            />
          </Pattern>
          {DEF_CELLS.map((cell) => (
            <ClipPath key={`clip-${cell.id}`} id={`clip-${cell.id}`}>
              <Path d={cell.path} />
            </ClipPath>
          ))}
        </Defs>

        {/* Background sparkle pattern */}
        <Rect x={0} y={0} width={VB_W} height={560} fill="url(#pvd-sp)" />

        {/* Dome skeleton: thicker latitudes + static side meridians */}
        <G stroke="#ffffff" strokeWidth={4} strokeOpacity={0.5} fill="none">
          {[0, 1, 2, 3, 4].map((r) => {
            const tP = 1 - r / ROWS;
            const yP = CY - R * SQ * Math.sin(tP * HALF_PI);
            const cosT = Math.cos(tP * HALF_PI);
            return (
              <Polyline
                key={`lat-${r}`}
                points={`${(CX - R * cosT).toFixed(1)},${yP.toFixed(1)} ${(CX + R * cosT).toFixed(1)},${yP.toFixed(1)}`}
              />
            );
          })}
          <Polyline points={meridianPts(CX - R)} />
          <Polyline points={meridianPts(CX + R)} />
        </G>

        {/* Animated meridians — fade in/out as they rotate across the dome */}
        {Array.from({ length: M_TOTAL }).map((_, m) => {
          const baseXOffset = -2 * R + m * ((4 * R) / M_TOTAL);
          return <AnimatedMeridian key={`mer-${m}`} baseXOffset={baseXOffset} progress={progress} />;
        })}

        {/* Cells (photos + colored shards), staggered left→right */}
        {DEF_CELLS.map((cell, idx) => (
          <AnimatedCell key={cell.id} cell={cell} idx={idx} progress={progress} />
        ))}

        {/* Shard labels only — pills sit above their cells, short tail touches */}
        {DEF_CELLS.map((cell, i) =>
          cell.type === 'shard' ? (
            <AnimatedLabel key={`lbl-${cell.id}`} cell={cell} globalIdx={i} progress={progress} />
          ) : null,
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});

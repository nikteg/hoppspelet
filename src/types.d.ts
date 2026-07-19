// Delade typer for hela spelet. Alla kallfiler ar klassiska script (ingen
// modulgrans - exakt som nar de laddas via <script>-taggar), sa typerna
// har ar globala. Motortyperna (Engine, Rect, rectsOverlap) kommer fran
// packages/minimotor/engine.d.ts.

type Ctx = CanvasRenderingContext2D;

interface ThemeHazard {
  top: string;
  mid: string;
  bottom: string;
  glow: string;
  dot: string;
}

interface Theme {
  name: string;
  key: string;
  bg: string;
  groundColor: string;
  crackColor: string;
  crystalColor?: string;
  hazard: ThemeHazard;
  spike: string;
  spikeStroke?: string;
  platform: string;
  platformTop: string;
  ceiling: string;
  ceilingAccent?: string;
  particle: string;
  particleColor: string;
}

type ObstacleType = "spike" | "platform" | "ceiling";

interface Obstacle {
  type: ObstacleType;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Coin {
  x: number;
  y: number;
  r: number;
  phase: number;
  collected: boolean;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
}

interface AmbientParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
}

type GameState = "ready" | "playing" | "gameover";

// Offscreen-canvas for forrenderade mynt: logisk storlek i CSS-pixlar vid
// sidan av backing storens fysiska upplosning (DPR-skalad).
interface SpriteCanvas extends HTMLCanvasElement {
  logicalSize: number;
}

// En 8-takterssektion i den procedurella bakgrundsmusiken (se audio.ts).
interface SongSection {
  mel: (number | null)[];
  prog: number[][];
  lead: OscillatorType;
  leadVol: number;
  drums: number;
  stabs?: boolean;
  pad?: boolean;
  longNotes?: boolean;
}

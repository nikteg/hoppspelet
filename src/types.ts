// Shared types for the game. Engine types (Rect, EngineShape) and helpers
// (Minimotor.Collision.rectsOverlap) are imported from "minimotor" where needed.

export type Ctx = CanvasRenderingContext2D;

export interface ThemeHazard {
  top: string;
  mid: string;
  bottom: string;
  glow: string;
  dot: string;
}

export interface Theme {
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

export type ObstacleType = "spike" | "platform" | "ceiling";

export interface Obstacle {
  type: ObstacleType;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Coin {
  x: number;
  y: number;
  r: number;
  phase: number;
  collected: boolean;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
}

export interface AmbientParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
}

export type GameState = "ready" | "playing" | "gameover";

// Offscreen canvas for pre-rendered coins: logical size in CSS pixels alongside
// the backing store's physical resolution (DPR-scaled).
export interface SpriteCanvas extends HTMLCanvasElement {
  logicalSize: number;
}

// En 8-takterssektion i den procedurella bakgrundsmusiken (se audio.ts).
export interface SongSection {
  mel: (number | null)[];
  prog: number[][];
  lead: OscillatorType;
  leadVol: number;
  drums: number;
  stabs?: boolean;
  pad?: boolean;
  longNotes?: boolean;
}

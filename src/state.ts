// ---------- Game state ----------
// Canvas and everything screen-related lives in stage.ts; here lives only
// the round state. All mutable state is in the `game` object: ES module
// imports are read-only bindings, but properties on an exported object
// may be mutated from other modules.

import type { GameState, Obstacle, Coin, FloatingText } from "./types.js";

export const GRAVITY = 0.7;
export const JUMP_FORCE = -13.5;
export const PLAYER_X = 150;
export const PLAYER_SIZE = 36;

export const game = {
  state: "ready" as GameState, // ready | playing | gameover
  speed: 6,
  distance: 0,
  best: 0,
  spawnTimer: 0,
  nextSpawnAt: 0,
  coinScore: 0,
  coinSpawnTimer: 0,
  coinNextSpawnAt: 0,
  obstacles: [] as Obstacle[],
  coins: [] as Coin[],
  floatingTexts: [] as FloatingText[],
};

try {
  game.best = parseInt(localStorage.getItem("hoppspelet_best") || "0", 10) || 0;
} catch {
  /* localStorage may be unavailable (private mode etc.) - best stays 0 */
}

export const player = {
  x: PLAYER_X,
  y: 0,
  w: PLAYER_SIZE,
  h: PLAYER_SIZE,
  vy: 0,
  onGround: true,
  rotation: 0,
};

export function getScore() {
  return Math.floor(game.distance / 10) + game.coinScore;
}

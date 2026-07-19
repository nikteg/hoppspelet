// ---------- Speltillstånd ----------
// Canvas och allt skärmrelaterat bor i stage.ts; här bor bara rundans
// tillstånd. Allt föränderligt ligger i `game`-objektet: ES-modulers
// imports är read-only-bindningar, men egenskaper på ett exporterat objekt
// får gärna muteras från andra moduler.

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
  /* localStorage kan saknas (privat läge m.m.) - då är bästa bara 0 */
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

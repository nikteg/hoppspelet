// ---------- World ----------
// Theme selection and level progression (every 1000 points the world changes), plus
// resetGame which resets the round state. Theme data lives in themes.ts,
// particles and screen size in stage.ts.

import { THEMES } from "./themes.js";
import { game, getScore, player, PLAYER_SIZE } from "./state.js";
import { GROUND_Y } from "./stage.js";

export const level = {
  offset: 0, // which level the current round starts on
  pending: 0, // level for next round to start on (set on death)
  debugOverride: null as number | null, // set by arrow buttons to browse themes freely
  appliedIndex: -1, // theme currently applied (background etc.)
  announceUntil: 0, // timestamp (ms) when the theme name stops showing
};

export function currentThemeIndex() {
  if (level.debugOverride !== null) return level.debugOverride;
  return (level.offset + Math.floor(getScore() / 1000)) % THEMES.length;
}

// ---------- Debug buttons (temabyte) ----------
export function debugGoToTheme(delta: number) {
  const cur = currentThemeIndex();
  level.debugOverride = (((cur + delta) % THEMES.length) + THEMES.length) % THEMES.length;
}

export function resetGame() {
  player.y = GROUND_Y - PLAYER_SIZE;
  player.vy = 0;
  player.onGround = true;
  player.rotation = 0;
  game.obstacles = [];
  game.coins = [];
  game.floatingTexts = [];
  game.coinScore = 0;
  game.coinSpawnTimer = 0;
  game.coinNextSpawnAt = 40 + Math.random() * 40;
  game.speed = 6;
  game.distance = 0;
  game.spawnTimer = 0;
  game.nextSpawnAt = 60 + Math.random() * 40;
  level.appliedIndex = -1;
  level.announceUntil = 0;
  // If you selected a level with the arrow buttons, start the round there - so
  // you can try a specific level. Otherwise start on the level you last died
  // on. The override is then released so the level continues to change every 1000 points.
  if (level.debugOverride !== null) {
    level.offset = level.debugOverride;
  } else {
    level.offset = level.pending;
  }
  level.debugOverride = null;
}

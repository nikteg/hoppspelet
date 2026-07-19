// ---------- Stage (canvas, resolution, orientation) ----------
// Owns the canvas element and everything screen-related: DPR scaling, safe
// area insets, ground line and the pause in portrait mode. Game logic
// imports dimensions from here instead of computing them itself.

import { Minimotor } from "minimotor";
import { game, player } from "./state.js";
import type { AmbientParticle } from "./types.js";

const vp = Minimotor.Engine.initCanvas("game");
Minimotor.Input.preventTouchFocus(vp.canvas);
Minimotor.Engine.pauseOnPortrait();

export { vp as viewport };
export const canvas = vp.canvas;
export let viewW = vp.w;
export let viewH = vp.h;
export const DPR = vp.dpr;
export let GROUND_Y = 0;
export let safeLeft = vp.safeLeft;
export let safeTop = vp.safeTop;

Minimotor.Engine.onResize = (newVp) => {
  const prevGroundY = GROUND_Y;
  viewW = newVp.w;
  viewH = newVp.h;
  safeLeft = newVp.safeLeft;
  safeTop = newVp.safeTop;
  // Ground strip is 80px on large screens but shrinks on short ones (mobile
  // in landscape) so it doesn't eat up the play area.
  GROUND_Y = viewH - Math.min(80, Math.max(40, Math.round(viewH * 0.12)));

  // Live objects have coordinates relative to the old ground line. Move
  // them on resize, otherwise spikes float in the air and the ceiling gap
  // changes size (could become impassable). Ceiling blocks hang from the
  // top, so their height (distance down to the gap) follows the ground.
  const dy = GROUND_Y - prevGroundY;
  if (dy !== 0 && prevGroundY !== 0) {
    for (const obs of game.obstacles) {
      if (obs.type === "ceiling") {
        obs.h += dy;
      } else {
        obs.y += dy;
      }
    }
    for (const c of game.coins) c.y += dy;
    for (const ft of game.floatingTexts) ft.y += dy;
    if (game.state === "playing") player.y += dy;
  }
  if (game.state !== "playing") {
    player.y = GROUND_Y - player.h;
  }
  initParticles();
};

// Initialize ground line
GROUND_Y = viewH - Math.min(80, Math.max(40, Math.round(viewH * 0.12)));

// Background particles (snow, embers, stars...) that are recreated on resize.
// The const array is refilled instead of replaced, so that
// importing modules always see the same instance.
export const ambientParticles: AmbientParticle[] = [];

export function initParticles() {
  ambientParticles.length = 0;
  for (let i = 0; i < 45; i++) {
    ambientParticles.push({
      x: Math.random() * (viewW || window.innerWidth),
      y: Math.random() * (viewH || window.innerHeight),
      size: 1 + Math.random() * 2.5,
      speed: 0.3 + Math.random() * 1.3,
      drift: (Math.random() - 0.5) * 0.6,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

initParticles();

// World: junk
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { game } from "../state.js";
import {
  drawBird,
  drawDriftingClouds,
  drawFallingStreaks,
  drawFirework,
  drawFish,
  drawFloatingIsland,
  drawFlutterfly,
  drawGroundProp,
  drawHangingVine,
  drawIceberg,
  drawJaggedSilhouette,
  drawLantern,
  drawPillar,
  drawRainbow,
  drawShootingStar,
  drawSwayingTree,
  drawTowerRow,
  drawWavingBanner,
  drawBalloon,
} from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  // Drifting wreckage + a large broken spaceship
  const sx = viewW * 0.65;
  ctx.save();
  ctx.fillStyle = "rgba(80,75,65,0.6)";
  ctx.beginPath();
  ctx.ellipse(sx, viewH * 0.28, 60, 20, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(50,46,40,0.6)";
  ctx.fillRect(sx + 30, viewH * 0.28 - 6, 40, 12);
  ctx.restore();
  for (let i = 0; i < 6; i++) {
    const spd = 8 + i * 3;
    const ax = viewW + 40 - ((t * spd + i * 160) % (viewW + 220));
    const ay = viewH * (0.12 + (i % 4) * 0.1);
    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(t * (0.5 + i * 0.2));
    ctx.fillStyle = "rgba(120,110,95,0.6)";
    ctx.fillRect(-5 - i, -3, 10 + i * 2, 6);
    ctx.restore();
  }
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawNutCoin } from "../coins/nut.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawNutCoin(ctx, r);
}

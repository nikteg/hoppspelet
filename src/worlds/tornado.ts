// World: tornado
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
  // Large swirling tornado + flying debris
  const tx3 = viewW * 0.6;
  ctx.save();
  ctx.fillStyle = "rgba(80,75,55,0.4)";
  ctx.beginPath();
  ctx.moveTo(tx3 - 12, GROUND_Y);
  ctx.quadraticCurveTo(tx3 - 60 + Math.sin(t) * 10, viewH * 0.4, tx3 - 70, 0);
  ctx.lineTo(tx3 + 70, 0);
  ctx.quadraticCurveTo(tx3 + 60 + Math.sin(t) * 10, viewH * 0.4, tx3 + 12, GROUND_Y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(120,110,80,0.4)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const yy = GROUND_Y - i * (GROUND_Y / 8);
    const w = 12 + (GROUND_Y - yy) * 0.2;
    ctx.beginPath();
    ctx.ellipse(tx3 + Math.sin(t * 3 + i) * 8, yy, w, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  // Flying debris
  for (let i = 0; i < 5; i++) {
    const a = t * 3 + i * 1.3;
    const dx = tx3 + Math.cos(a) * (40 + i * 6);
    const dy = viewH * 0.4 + Math.sin(a) * 60 - i * 20;
    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(a);
    ctx.fillStyle = "rgba(90,70,40,0.6)";
    ctx.fillRect(-5, -3, 10, 6);
    ctx.restore();
  }
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawTornadoCoin } from "../coins/tornado.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawTornadoCoin(ctx, r);
}

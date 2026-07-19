// World: ufo
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
  // Multiple UFOs, one with a tractor beam toward the ground
  for (let k = 0; k < 2; k++) {
    const ux = k === 0 ? viewW * 0.3 + Math.sin(t) * 30 : ((t * 30) % (viewW + 200)) - 100;
    const uy = viewH * (0.3 + k * 0.15);
    if (k === 0) {
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = "#7aff9a";
      ctx.beginPath();
      ctx.moveTo(ux - 12, uy);
      ctx.lineTo(ux + 12, uy);
      ctx.lineTo(ux + 40, GROUND_Y);
      ctx.lineTo(ux - 40, GROUND_Y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.fillStyle = "rgba(120,130,100,0.7)";
    ctx.beginPath();
    ctx.ellipse(ux, uy, 40, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(150,255,170,0.6)";
    ctx.beginPath();
    ctx.arc(ux, uy - 7, 14, Math.PI, 0);
    ctx.fill();
    // Blinking lights underneath
    for (let i = -2; i <= 2; i++) {
      ctx.globalAlpha = 0.4 + 0.4 * (0.5 + Math.sin(t * 4 + i) * 0.5);
      ctx.fillStyle = "rgba(180,255,120,0.9)";
      ctx.beginPath();
      ctx.arc(ux + i * 12, uy + 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  // Crop circle pattern on the ground
  ctx.save();
  ctx.strokeStyle = "rgba(120,255,150,0.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(viewW * 0.5, GROUND_Y - 4, 60, 12, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawSaucerCoin } from "../coins/saucer.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawSaucerCoin(ctx, r);
}

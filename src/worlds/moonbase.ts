// World: moonbase
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
  // Large Earth rising over the horizon
  ctx.save();
  ctx.shadowColor = "rgba(80,140,220,0.5)";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "rgba(60,110,180,0.7)";
  ctx.beginPath();
  ctx.arc(viewW * 0.75, viewH * 0.2, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(80,160,110,0.6)";
  ctx.beginPath();
  ctx.arc(viewW * 0.75 - 10, viewH * 0.2 - 6, 10, 0, Math.PI * 2);
  ctx.arc(viewW * 0.75 + 12, viewH * 0.2 + 8, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Dome bases with antennas
  for (let k = 0; k < 2; k++) {
    const bx = viewW * (0.3 + k * 0.35);
    ctx.fillStyle = "rgba(150,160,175,0.6)";
    ctx.beginPath();
    ctx.arc(bx, GROUND_Y, 34, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = "rgba(180,190,200,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx + 20, GROUND_Y - 22);
    ctx.lineTo(bx + 30, GROUND_Y - 45);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,120,120,0.8)";
    ctx.beginPath();
    ctx.arc(bx + 30, GROUND_Y - 47, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Small craters
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = "rgba(120,125,135,0.4)";
    ctx.beginPath();
    ctx.arc(viewW * (0.15 + i * 0.22), GROUND_Y - 6, 8 + i * 2, 0, Math.PI, false);
    ctx.fill();
  }
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawMoonCoin } from "../coins/moon.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawMoonCoin(ctx, r);
}

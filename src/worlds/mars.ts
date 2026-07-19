// World: mars
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
  drawJaggedSilhouette(ctx, GROUND_Y - 10, 25, 60, 230, "rgba(80,25,15,0.5)", 0.04);
  // Two moons
  ctx.save();
  ctx.fillStyle = "rgba(180,140,120,0.6)";
  ctx.beginPath();
  ctx.arc(viewW * 0.7, viewH * 0.16, 12, 0, Math.PI * 2);
  ctx.arc(viewW * 0.82, viewH * 0.24, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Landed rover
  const rx = viewW * 0.35;
  ctx.fillStyle = "rgba(200,190,180,0.6)";
  ctx.fillRect(rx - 16, GROUND_Y - 16, 32, 10);
  ctx.fillStyle = "rgba(60,50,45,0.7)";
  ctx.beginPath();
  ctx.arc(rx - 10, GROUND_Y - 4, 5, 0, Math.PI * 2);
  ctx.arc(rx + 10, GROUND_Y - 4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(200,190,180,0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rx, GROUND_Y - 16);
  ctx.lineTo(rx + 8, GROUND_Y - 30);
  ctx.stroke();
  // Dust devil
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#c86a4a";
  const dwx = ((t * 20) % (viewW + 100)) - 50;
  ctx.beginPath();
  ctx.ellipse(dwx, GROUND_Y - 30, 14, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

import { drawNuggetCoin } from "../coins/nugget.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawNuggetCoin(ctx, r, false);
}

// World: sky
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
  for (let i = 0; i < 3; i++) {
    const ix = ((viewW * 0.4 * i + t * 4) % (viewW + 300)) - 100;
    const iy = viewH * (0.28 + i * 0.12);
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(ix, iy, 55, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(ix + 30, iy - 8, 30, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  drawJaggedSilhouette(ctx, GROUND_Y - 5, 15, 40, 180, "rgba(255,255,255,0.4)", 0.07);

  drawRainbow(ctx, viewW * 0.72, viewH * 0.55, 90);

  // Distant airship
  const airX = viewW * 0.3 + Math.sin(t * 0.3) * 20;
  const airY = viewH * 0.2;
  ctx.save();
  ctx.fillStyle = "rgba(200,60,60,0.6)";
  ctx.beginPath();
  ctx.ellipse(airX, airY, 30, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(80,60,40,0.6)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(airX - 10, airY + 10);
  ctx.lineTo(airX - 10, airY + 18);
  ctx.moveTo(airX + 10, airY + 10);
  ctx.lineTo(airX + 10, airY + 18);
  ctx.stroke();
  ctx.fillStyle = "rgba(140,90,40,0.6)";
  ctx.fillRect(airX - 12, airY + 18, 24, 6);
  ctx.restore();
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawCloudCoin } from "../coins/cloud.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawCloudCoin(ctx, r);
}

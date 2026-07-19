// World: saltflat
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
  drawJaggedSilhouette(ctx, GROUND_Y - 5, 10, 25, 260, "rgba(150,170,170,0.35)", 0.03);
  // Mirror-like surface with reflected sun
  ctx.save();
  ctx.shadowColor = "rgba(255,240,220,0.6)";
  ctx.shadowBlur = 25;
  ctx.fillStyle = "rgba(255,245,225,0.8)";
  ctx.beginPath();
  ctx.arc(viewW * 0.7, viewH * 0.22, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "rgba(255,245,225,0.8)";
  ctx.beginPath();
  ctx.ellipse(viewW * 0.7, GROUND_Y + 10, 18, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Salt polygon pattern on the ground
  ctx.save();
  ctx.strokeStyle = "rgba(180,190,190,0.3)";
  ctx.lineWidth = 1;
  const po = (game.distance * 0.5) % 60;
  for (let x = -po; x < viewW; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y + 20);
    ctx.lineTo(x + 30, GROUND_Y + 8);
    ctx.lineTo(x + 60, GROUND_Y + 20);
    ctx.stroke();
  }
  ctx.restore();
  drawDriftingClouds(ctx, t, "rgba(255,255,255,0.4)", 3, viewH * 0.18, 0.9, 6);
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawSaltCrystalCoin } from "../coins/saltcrystal.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawSaltCrystalCoin(ctx, r);
}

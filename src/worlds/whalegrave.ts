// World: whalegrave
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
  drawJaggedSilhouette(ctx, GROUND_Y - 10, 30, 70, 220, "rgba(10,20,30,0.6)", 0.04);
  // Giant whale skeleton: spine + ribs like a cathedral
  const wx = Math.max(360, viewW * 0.55);
  ctx.save();
  ctx.strokeStyle = "rgba(170,170,155,0.5)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(wx - 90, GROUND_Y - 10);
  ctx.quadraticCurveTo(wx, GROUND_Y - 70, wx + 110, GROUND_Y - 20);
  ctx.stroke();
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const rx = wx - 80 + i * 24;
    const rh = 30 + Math.sin(i * 0.5) * 30;
    ctx.beginPath();
    ctx.moveTo(rx, GROUND_Y);
    ctx.quadraticCurveTo(rx + 6, GROUND_Y - rh, rx + 14, GROUND_Y);
    ctx.stroke();
  }
  // Skull
  ctx.fillStyle = "rgba(170,170,155,0.45)";
  ctx.beginPath();
  ctx.ellipse(wx - 95, GROUND_Y - 14, 24, 14, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Occasional bubbles rising
  for (let i = 0; i < 3; i++) {
    const bx = i * 200 + 60 - ((t * 6) % 200);
    const by = GROUND_Y - ((t * 20 + i * 80) % GROUND_Y);
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#9ac8e6";
    ctx.beginPath();
    ctx.arc(bx, by, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawBoneCoin } from "../coins/bone.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawBoneCoin(ctx, r);
}

// World: candy
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
  drawJaggedSilhouette(ctx, GROUND_Y - 15, 50, 130, 200, "rgba(255,180,210,0.5)", 0.05);
  const lx = Math.max(340, viewW * 0.65);
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(lx, GROUND_Y);
  ctx.lineTo(lx, GROUND_Y - 70);
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = i % 2 === 0 ? "#ff5c8a" : "#ffffff";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(lx, GROUND_Y - 70, 26 - i * 7, 0, Math.PI * 1.4);
    ctx.stroke();
  }
  ctx.restore();

  drawRainbow(ctx, viewW * 0.25, viewH * 0.6, 80);

  // Gumdrop hills
  drawGroundProp(ctx, Math.max(400, viewW * 0.46), GROUND_Y, "gumdrop", "rgba(120,220,180,0.7)");
  drawGroundProp(ctx, Math.max(450, viewW * 0.52), GROUND_Y, "gumdrop", "rgba(255,150,200,0.7)");
  drawGroundProp(ctx, Math.max(500, viewW * 0.58), GROUND_Y, "gumdrop", "rgba(150,180,255,0.7)");

  // Falling candy sprinkles
  drawFallingStreaks(ctx, t, viewW, viewH, 20, "rgba(255,255,255,0.4)", 25, 6);
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawCandyCoin } from "../coins/candycoin.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawCandyCoin(ctx, r);
}

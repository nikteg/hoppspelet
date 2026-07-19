// World: jungle
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
  drawJaggedSilhouette(ctx, GROUND_Y - 20, 60, 170, 240, "rgba(10,30,8,0.85)", 0.045);

  // Flying birds
  for (let i = 0; i < 3; i++) {
    const spd = 20 + i * 8;
    const x = ((t * spd + i * 300) % (viewW + 200)) - 100;
    const y = viewH * 0.12 + i * 30;
    drawBird(ctx, x, y, 8, t, i * 3);
  }

  // Swaying jungle tree (placed far from the character's fixed position)
  ctx.save();
  const tx = Math.max(320, viewW * 0.3);
  const ty = GROUND_Y - 90;
  ctx.translate(tx, GROUND_Y);
  ctx.rotate(Math.sin(t * 0.4) * 0.02);
  ctx.fillStyle = "rgba(30,25,10,0.7)";
  ctx.beginPath();
  ctx.moveTo(-45, 0);
  ctx.lineTo(-30, ty - GROUND_Y);
  ctx.lineTo(30, ty - GROUND_Y);
  ctx.lineTo(45, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Butterflies
  const butterflyColors = ["rgba(255,140,60,0.8)", "rgba(140,200,255,0.8)", "rgba(255,220,80,0.8)"];
  for (let i = 0; i < 3; i++) {
    const bx2 = ((t * (8 + i * 3) + i * 400) % (viewW + 100)) - 50;
    const by2 = viewH * 0.4 + i * 40 + Math.sin(t + i) * 20;
    drawFlutterfly(ctx, bx2, by2, 7, t, i * 4, butterflyColors[i]);
  }

  // Hanging vines from the top edge
  for (let i = 0; i < 3; i++) {
    const vx = viewW * (0.45 + i * 0.18);
    drawHangingVine(ctx, vx, 0, 70 + i * 20, t, i * 2, "rgba(30,60,15,0.6)");
  }

  // Flowers on the ground
  drawGroundProp(ctx, Math.max(380, viewW * 0.5), GROUND_Y, "flower", "rgba(255,120,160,0.7)");
  drawGroundProp(ctx, Math.max(460, viewW * 0.58), GROUND_Y, "flower", "rgba(255,220,80,0.7)");
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawBananaCoin } from "../coins/banana.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawBananaCoin(ctx, r);
}

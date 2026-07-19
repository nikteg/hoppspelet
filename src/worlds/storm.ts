// World: storm
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawDriftingClouds, drawFallingStreaks, drawJaggedSilhouette } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 15, 60, 160, 220, "rgba(10,15,25,0.7)", 0.045);
  // Dark rolling clouds
  drawDriftingClouds(ctx, t, "rgba(30,35,50,0.6)", 4, viewH * 0.15, 1.3, 8);
  const flashCycle = 5;
  const fp = (t % flashCycle) / flashCycle;
  if (fp < 0.06) {
    ctx.save();
    ctx.globalAlpha = (1 - fp / 0.06) * 0.45;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.restore();
    // Lightning zigzag
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,220,0.9)";
    ctx.lineWidth = 2;
    const lx = viewW * (0.3 + (Math.floor(t / flashCycle) % 3) * 0.2);
    ctx.beginPath();
    ctx.moveTo(lx, viewH * 0.15);
    ctx.lineTo(lx - 15, viewH * 0.3);
    ctx.lineTo(lx + 8, viewH * 0.35);
    ctx.lineTo(lx - 12, viewH * 0.55);
    ctx.stroke();
    ctx.restore();
  }
  drawFallingStreaks(ctx, t, viewW, viewH, 40, "rgba(200,220,255,0.4)", 70, 24);
}

import { drawLightningCoin } from "../coins/lightning.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawLightningCoin(ctx, r);
}

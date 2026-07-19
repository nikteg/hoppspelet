// World: shadow
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawJaggedSilhouette, drawShootingStar } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  // Monochrome: layers of black silhouettes against white light + lone silhouette figure
  drawJaggedSilhouette(ctx, GROUND_Y - 15, 100, 240, 260, "rgba(0,0,0,0.4)", 0.02);
  drawJaggedSilhouette(ctx, GROUND_Y - 15, 60, 170, 210, "rgba(0,0,0,0.7)", 0.05);
  // Dead trees in silhouette
  for (let k = 0; k < 3; k++) {
    const tx = viewW * (0.25 + k * 0.28);
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0.85)";
    ctx.lineWidth = 5 - k;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(tx, GROUND_Y);
    ctx.lineTo(tx + 5, GROUND_Y - 80);
    ctx.moveTo(tx + 5, GROUND_Y - 55);
    ctx.lineTo(tx + 26, GROUND_Y - 70);
    ctx.moveTo(tx + 5, GROUND_Y - 62);
    ctx.lineTo(tx - 16, GROUND_Y - 78);
    ctx.stroke();
    ctx.restore();
  }
  drawShootingStar(ctx, t, 15, 2, "rgba(255,255,255,0.95)", viewH * 0.1, viewH * 0.4);
}

import { drawShadowCoin } from "../coins/shadowcoin.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawShadowCoin(ctx, r);
}

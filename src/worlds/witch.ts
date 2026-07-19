// World: witch
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawHangingVine, drawJaggedSilhouette } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 20, 70, 190, 210, "rgba(20,10,25,0.7)", 0.045);
  // Full green moon
  ctx.save();
  ctx.shadowColor = "rgba(150,255,120,0.7)";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "rgba(200,255,170,0.6)";
  ctx.beginPath();
  ctx.arc(viewW * 0.78, viewH * 0.2, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Flying witch on broomstick across the moon
  const hx = ((t * 24) % (viewW + 200)) - 100;
  const hy = viewH * 0.22 + Math.sin(t * 1.5) * 12;
  ctx.save();
  ctx.strokeStyle = "rgba(20,10,25,0.85)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(hx - 18, hy);
  ctx.lineTo(hx + 18, hy - 4);
  ctx.stroke();
  ctx.fillStyle = "rgba(20,10,25,0.85)";
  ctx.beginPath();
  ctx.arc(hx, hy - 6, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hx - 6, hy - 12);
  ctx.lineTo(hx + 6, hy - 12);
  ctx.lineTo(hx, hy - 24);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  for (let i = 0; i < 2; i++) {
    drawHangingVine(
      ctx,
      Math.max(380, viewW * (0.42 + i * 0.18)),
      0,
      65,
      t,
      i * 2,
      "rgba(30,15,35,0.6)",
    );
  }
}

import { drawPotionCoin } from "../coins/potion.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawPotionCoin(ctx, r);
}

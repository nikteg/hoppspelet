// World: phoenix
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawFallingStreaks, drawJaggedSilhouette } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 20, 60, 160, 220, "rgba(60,15,10,0.6)", 0.045);
  // Giant phoenix centered with glowing wings
  const fx = viewW * 0.72;
  const fy = viewH * 0.28;
  const wf = Math.sin(t * 3) * 0.5;
  ctx.save();
  ctx.shadowColor = "rgba(255,140,50,0.9)";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "rgba(255,160,60,0.7)";
  ctx.beginPath();
  ctx.ellipse(fx, fy, 12, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(fx, fy);
  ctx.quadraticCurveTo(fx - 50, fy - 30 - wf * 30, fx - 70, fy + 20);
  ctx.quadraticCurveTo(fx - 30, fy + 10, fx, fy);
  ctx.moveTo(fx, fy);
  ctx.quadraticCurveTo(fx + 50, fy - 30 - wf * 30, fx + 70, fy + 20);
  ctx.quadraticCurveTo(fx + 30, fy + 10, fx, fy);
  ctx.fill();
  // Tail of fire
  ctx.beginPath();
  ctx.moveTo(fx, fy + 18);
  ctx.quadraticCurveTo(fx - 10, fy + 55, fx, fy + 75);
  ctx.quadraticCurveTo(fx + 10, fy + 55, fx, fy + 18);
  ctx.fill();
  ctx.restore();
  // Falling glowing feathers
  drawFallingStreaks(ctx, t, viewW, viewH, 12, "rgba(255,160,70,0.5)", 20, 10);
}

import { drawFeatherCoin } from "../coins/feather.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawFeatherCoin(ctx, r);
}

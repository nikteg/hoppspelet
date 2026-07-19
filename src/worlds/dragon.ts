// World: dragon
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawJaggedSilhouette, drawShootingStar } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 20, 60, 170, 210, "rgba(20,5,5,0.7)", 0.045);
  // Flying dragon with beating wings and fire breath
  const dgx = ((t * 30) % (viewW + 300)) - 150;
  const dgy = viewH * 0.25 + Math.sin(t) * 20;
  ctx.save();
  ctx.fillStyle = "rgba(20,5,5,0.8)";
  ctx.beginPath();
  ctx.ellipse(dgx, dgy, 26, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  const wf = Math.sin(t * 5) * 0.6;
  ctx.beginPath();
  ctx.moveTo(dgx, dgy);
  ctx.quadraticCurveTo(dgx - 20, dgy - 30 - wf * 20, dgx - 40, dgy);
  ctx.quadraticCurveTo(dgx - 20, dgy + 6, dgx, dgy);
  ctx.fill();
  // Long neck + head
  ctx.strokeStyle = "rgba(20,5,5,0.8)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(dgx + 22, dgy - 2);
  ctx.lineTo(dgx + 42, dgy - 10);
  ctx.stroke();
  // Fire breath
  if (Math.sin(t * 2) > 0.6) {
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "rgba(255,140,40,0.8)";
    ctx.beginPath();
    ctx.moveTo(dgx + 44, dgy - 10);
    ctx.lineTo(dgx + 80, dgy - 16);
    ctx.lineTo(dgx + 80, dgy - 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  drawShootingStar(ctx, t, 16, 1, "rgba(255,120,40,0.9)", viewH * 0.15, viewH * 0.4);
}

import { drawFlameCoin } from "../coins/flame.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawFlameCoin(ctx, r);
}

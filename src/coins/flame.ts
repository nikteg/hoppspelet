// Coin: flame
import type { Ctx } from "../types.js";

export function drawFlameCoin(ctx: Ctx, r: number) {
  // Fire flame with hot core
  ctx.save();
  ctx.shadowColor = "rgba(255,110,40,0.9)";
  ctx.shadowBlur = 14;
  const g = ctx.createLinearGradient(0, r, 0, -r);
  g.addColorStop(0, "#ff5a2a");
  g.addColorStop(1, "#ffd94a");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.9);
  ctx.quadraticCurveTo(-r * 0.9, r * 0.1, 0, -r);
  ctx.quadraticCurveTo(r * 0.5, -r * 0.1, r * 0.35, r * 0.3);
  ctx.quadraticCurveTo(r * 0.6, r * 0.55, 0, r * 0.9);
  ctx.fill();
  ctx.fillStyle = "#fff2b0";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.35, r * 0.22, r * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

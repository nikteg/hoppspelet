// Coin: ghost
import type { Ctx } from "../types.js";

export function drawGhostCoin(ctx: Ctx, r: number) {
  ctx.save();
  ctx.shadowColor = "rgba(140,255,170,0.9)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "rgba(210,255,220,0.85)";
  ctx.beginPath();
  ctx.arc(0, -r * 0.2, r * 0.75, Math.PI, 0, false);
  ctx.lineTo(r * 0.75, r * 0.6);
  ctx.lineTo(r * 0.35, r * 0.3);
  ctx.lineTo(0, r * 0.6);
  ctx.lineTo(-r * 0.35, r * 0.3);
  ctx.lineTo(-r * 0.75, r * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#1a1a22";
  ctx.beginPath();
  ctx.arc(-r * 0.25, -r * 0.2, r * 0.12, 0, Math.PI * 2);
  ctx.arc(r * 0.25, -r * 0.2, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

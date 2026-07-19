// Coin: lightning
import type { Ctx } from "../types.js";

export function drawLightningCoin(ctx: Ctx, r: number) {
  // Lightning bolt
  ctx.save();
  ctx.shadowColor = "rgba(255,230,120,0.95)";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#ffe066";
  ctx.beginPath();
  ctx.moveTo(r * 0.25, -r);
  ctx.lineTo(-r * 0.4, r * 0.15);
  ctx.lineTo(-r * 0.02, r * 0.15);
  ctx.lineTo(-r * 0.25, r);
  ctx.lineTo(r * 0.45, -r * 0.1);
  ctx.lineTo(r * 0.05, -r * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

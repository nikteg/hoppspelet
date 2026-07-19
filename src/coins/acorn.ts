// Coin: acorn
import type { Ctx } from "../types.js";

export function drawAcornCoin(ctx: Ctx, r: number) {
  ctx.save();
  ctx.shadowColor = "rgba(230,150,60,0.8)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#8a5a2a";
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.55, r * 0.6, r * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c98a4a";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.15, r * 0.6, r * 0.75, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

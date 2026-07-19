// Coin: fossil
import type { Ctx } from "../types.js";

export function drawFossilCoin(ctx: Ctx, r: number) {
  ctx.save();
  ctx.shadowColor = "rgba(200,255,140,0.8)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#e9dfae";
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.75, r, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(120,150,60,0.6)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, -r * 0.3, r * 0.12, r * 0.18, 0.3, 0, Math.PI * 2);
  ctx.ellipse(r * 0.25, r * 0.1, r * 0.1, r * 0.15, -0.2, 0, Math.PI * 2);
  ctx.ellipse(-r * 0.1, r * 0.4, r * 0.1, r * 0.14, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Default gold coin
import type { Ctx } from "../types.js";

export function drawGoldCoin(ctx: Ctx, r: number) {
  ctx.save();
  ctx.shadowColor = "rgba(255,210,80,0.9)";
  ctx.shadowBlur = 12;
  const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
  g.addColorStop(0, "#fff6c8");
  g.addColorStop(0.5, "#ffd54a");
  g.addColorStop(1, "#c98b1f");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Coin: gemstone
import type { Ctx } from "../types.js";

export function drawGemstoneCoin(ctx: Ctx, r: number, color: string) {
  // Faceted gemstone with white facet lines
  const col = color;
  ctx.save();
  ctx.shadowColor = col;
  ctx.shadowBlur = 14;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r * 0.6, -r * 0.2);
  ctx.lineTo(r * 0.35, r);
  ctx.lineTo(-r * 0.35, r);
  ctx.lineTo(-r * 0.6, -r * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(-r * 0.15, r * 0.2);
  ctx.moveTo(r * 0.6, -r * 0.2);
  ctx.lineTo(-r * 0.15, r * 0.2);
  ctx.stroke();
  ctx.restore();
}

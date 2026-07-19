// Coin: ankh
import type { Ctx } from "../types.js";

export function drawAnkhCoin(ctx: Ctx, r: number) {
  // Ankh in gold
  ctx.save();
  ctx.shadowColor = "rgba(255,220,120,0.9)";
  ctx.shadowBlur = 10;
  ctx.strokeStyle = "#ffd85a";
  ctx.lineWidth = r * 0.22;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.5, r * 0.3, r * 0.38, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.1);
  ctx.lineTo(0, r * 0.9);
  ctx.moveTo(-r * 0.55, r * 0.05);
  ctx.lineTo(r * 0.55, r * 0.05);
  ctx.stroke();
  ctx.restore();
}

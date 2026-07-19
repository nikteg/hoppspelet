// Coin: book
import type { Ctx } from "../types.js";

export function drawBookCoin(ctx: Ctx, r: number) {
  // Book with gold title
  ctx.save();
  ctx.rotate(-0.15);
  ctx.shadowColor = "rgba(230,210,160,0.7)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#7a3428";
  ctx.fillRect(-r * 0.7, -r * 0.9, r * 1.4, r * 1.8);
  ctx.fillStyle = "#a04a38";
  ctx.fillRect(-r * 0.7, -r * 0.9, r * 0.3, r * 1.8);
  ctx.strokeStyle = "#ffd98a";
  ctx.lineWidth = 1.4;
  ctx.strokeRect(-r * 0.25, -r * 0.6, r * 0.75, r * 0.5);
  ctx.beginPath();
  ctx.moveTo(-r * 0.2, r * 0.3);
  ctx.lineTo(r * 0.45, r * 0.3);
  ctx.stroke();
  ctx.restore();
}

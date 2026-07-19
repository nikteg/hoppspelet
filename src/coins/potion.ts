// Coin: potion
import type { Ctx } from "../types.js";

export function drawPotionCoin(ctx: Ctx, r: number) {
  // Potion bottle with bubble
  ctx.save();
  ctx.shadowColor = "rgba(140,230,90,0.9)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "rgba(60,180,80,0.9)";
  ctx.beginPath();
  ctx.arc(0, r * 0.25, r * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(90,150,110,0.9)";
  ctx.fillRect(-r * 0.16, -r * 0.85, r * 0.32, r * 0.55);
  ctx.fillStyle = "#d9c9a0";
  ctx.fillRect(-r * 0.22, -r * 0.98, r * 0.44, r * 0.2);
  ctx.fillStyle = "rgba(220,255,190,0.8)";
  ctx.beginPath();
  ctx.arc(-r * 0.2, r * 0.1, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Coin: chip
import type { Ctx } from "../types.js";

export function drawChipCoin(ctx: Ctx, r: number) {
  // Circuit board chip with legs and glowing core
  ctx.save();
  ctx.shadowColor = "rgba(0,255,200,0.9)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#0a2a2a";
  ctx.fillRect(-r * 0.6, -r * 0.6, r * 1.2, r * 1.2);
  ctx.strokeStyle = "#00ffcc";
  ctx.lineWidth = 1.6;
  ctx.strokeRect(-r * 0.6, -r * 0.6, r * 1.2, r * 1.2);
  ctx.beginPath();
  for (let k = -1; k <= 1; k++) {
    ctx.moveTo(k * r * 0.35, -r * 0.6);
    ctx.lineTo(k * r * 0.35, -r * 0.95);
    ctx.moveTo(k * r * 0.35, r * 0.6);
    ctx.lineTo(k * r * 0.35, r * 0.95);
  }
  ctx.stroke();
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(-r * 0.2, -r * 0.2, r * 0.4, r * 0.4);
  ctx.restore();
}

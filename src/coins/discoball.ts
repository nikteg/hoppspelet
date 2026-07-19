// Coin: discoball
import type { Ctx } from "../types.js";

export function drawDiscoBallCoin(ctx: Ctx, r: number) {
  // Disco ball with mirrored tiles
  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,0.95)";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#cfd6e0";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = "rgba(60,70,90,0.6)";
  ctx.lineWidth = 1;
  for (let k = -2; k <= 2; k++) {
    ctx.beginPath();
    ctx.moveTo(k * r * 0.32, -r * 0.8);
    ctx.lineTo(k * r * 0.32, r * 0.8);
    ctx.moveTo(-r * 0.8, k * r * 0.32);
    ctx.lineTo(r * 0.8, k * r * 0.32);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillRect(-r * 0.32, -r * 0.32, r * 0.3, r * 0.3);
  ctx.fillRect(r * 0.05, r * 0.05, r * 0.25, r * 0.25);
  ctx.restore();
  ctx.restore();
}

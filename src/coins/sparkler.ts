// Coin: sparkler
import type { Ctx } from "../types.js";
import { drawStarShape } from "../sprites.js";

export function drawSparklerCoin(ctx: Ctx, r: number) {
  // Sparkler star with pink sparks
  ctx.save();
  ctx.shadowColor = "rgba(255,220,120,0.95)";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#ffe066";
  drawStarShape(ctx, 0, 0, r * 0.7, r * 0.32);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,150,180,0.9)";
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8 + 0.4;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();
  }
  ctx.restore();
}

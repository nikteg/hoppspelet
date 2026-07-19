// Coin: unicornstar
import type { Ctx } from "../types.js";
import { drawStarShape } from "../sprites.js";

export function drawUnicornStarCoin(ctx: Ctx, r: number) {
  // White star with pink inner outline and pastel glow
  ctx.save();
  ctx.shadowColor = "rgba(255,190,230,0.95)";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#ffffff";
  drawStarShape(ctx, 0, 0, r, r * 0.45);
  ctx.fill();
  ctx.strokeStyle = "#ff9ad0";
  ctx.lineWidth = 1.6;
  drawStarShape(ctx, 0, 0, r * 0.6, r * 0.27);
  ctx.stroke();
  ctx.restore();
}

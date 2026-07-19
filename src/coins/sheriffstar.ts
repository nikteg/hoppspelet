// Coin: sheriffstar
import type { Ctx } from "../types.js";
import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawSheriffStarCoin(ctx: Ctx, r: number) {
  // Sheriff's star
  ctx.save();
  ctx.shadowColor = "rgba(255,210,130,0.9)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#d9a25a";
  drawStarShape(ctx, 0, 0, r, r * 0.5);
  ctx.fill();
  ctx.strokeStyle = "#7a4a20";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

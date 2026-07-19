// Coin: gearcoin
import type { Ctx } from "../types.js";
import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawGearCoin(ctx: Ctx, r: number) {
  ctx.save();
  ctx.shadowColor = "rgba(255,190,60,0.9)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#e8b840";
  drawGearSpike(ctx, { x: -r, y: -r, w: r * 2, h: r * 2 });
  ctx.restore();
}

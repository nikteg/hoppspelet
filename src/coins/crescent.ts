// Coin: crescent
import type { Ctx } from "../types.js";
import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCrescentCoin(ctx: Ctx, r: number) {
  // Crescent moon with a small star (destination-out is safe here -
  // the design is always drawn against its own offscreen-canvas)
  ctx.save();
  ctx.shadowColor = "rgba(255,240,255,0.9)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#fff0d8";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(r * 0.35, -r * 0.2, r * 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#fff0d8";
  drawStarShape(ctx, r * 0.45, -r * 0.35, r * 0.22, r * 0.1);
  ctx.fill();
  ctx.restore();
}

// Coin: shield
import type { Ctx } from "../types.js";

export function drawShieldCoin(ctx: Ctx, r: number) {
  // Knight's shield with cross
  ctx.save();
  ctx.shadowColor = "rgba(230,220,190,0.7)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#b83a3a";
  ctx.beginPath();
  ctx.moveTo(-r * 0.7, -r * 0.7);
  ctx.lineTo(r * 0.7, -r * 0.7);
  ctx.lineTo(r * 0.7, r * 0.1);
  ctx.quadraticCurveTo(r * 0.7, r * 0.6, 0, r * 0.95);
  ctx.quadraticCurveTo(-r * 0.7, r * 0.6, -r * 0.7, r * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#f0e8d0";
  ctx.lineWidth = r * 0.16;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.55);
  ctx.lineTo(0, r * 0.7);
  ctx.moveTo(-r * 0.55, -r * 0.15);
  ctx.lineTo(r * 0.55, -r * 0.15);
  ctx.stroke();
  ctx.restore();
}

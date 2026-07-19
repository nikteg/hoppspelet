// Coin: balloon
import type { Ctx } from "../types.js";

export function drawBalloonCoin(ctx: Ctx, r: number) {
  // Pink balloon with highlight and string
  ctx.save();
  ctx.shadowColor = "rgba(255,150,230,0.9)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#ff5ac0";
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.15, r * 0.65, r * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, -r * 0.4, r * 0.16, r * 0.24, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.65);
  ctx.quadraticCurveTo(r * 0.2, r * 0.85, 0, r * 1.05);
  ctx.stroke();
  ctx.restore();
}

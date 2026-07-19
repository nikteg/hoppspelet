// Coin: doubloon
import type { Ctx } from "../types.js";

export function drawDoubloonCoin(ctx: Ctx, r: number, golden: boolean) {
  // Doubloon - shiny for pirates, tarnished/patinated in sunken Atlantis
  const gold = golden;
  ctx.save();
  ctx.shadowColor = gold ? "rgba(255,210,80,0.9)" : "rgba(90,220,230,0.8)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = gold ? "#d9a92f" : "#3fae9a";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = gold ? "#8a641a" : "#1f6a5a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.42);
  ctx.lineTo(0, r * 0.42);
  ctx.moveTo(-r * 0.42, 0);
  ctx.lineTo(r * 0.42, 0);
  ctx.stroke();
  ctx.restore();
}

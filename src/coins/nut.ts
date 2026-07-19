// Coin: nut
import type { Ctx } from "../types.js";

export function drawNutCoin(ctx: Ctx, r: number) {
  // Hexagonal nut
  ctx.save();
  ctx.shadowColor = "rgba(240,210,170,0.7)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#a99a80";
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    const x = Math.cos(a) * r * 0.85,
      y = Math.sin(a) * r * 0.85;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(20,18,14,0.85)";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

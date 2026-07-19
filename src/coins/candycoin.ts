// Coin: candycoin
import type { Ctx } from "../types.js";

export function drawCandyCoin(ctx: Ctx, r: number) {
  ctx.save();
  ctx.shadowColor = "rgba(255,150,200,0.9)";
  ctx.shadowBlur = 10;
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = i % 2 === 0 ? "#e0325c" : "#ffffff";
    ctx.lineWidth = r * 0.4;
    ctx.beginPath();
    ctx.arc(0, 0, r * (1 - i * 0.32), 0, Math.PI * 1.5);
    ctx.stroke();
  }
  ctx.restore();
}

// Coin: bone
import type { Ctx } from "../types.js";

export function drawBoneCoin(ctx: Ctx, r: number) {
  // Crossed bone
  ctx.save();
  ctx.rotate(-0.6);
  ctx.shadowColor = "rgba(200,230,255,0.6)";
  ctx.shadowBlur = 8;
  ctx.strokeStyle = "#e8e4d4";
  ctx.lineWidth = r * 0.32;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.55);
  ctx.lineTo(0, r * 0.55);
  ctx.stroke();
  ctx.fillStyle = "#e8e4d4";
  for (const e of [-1, 1]) {
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(s * r * 0.22, e * r * 0.62, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

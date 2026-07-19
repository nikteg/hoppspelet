// Coin: flower5
import type { Ctx } from "../types.js";

export function drawFivePetalCoin(ctx: Ctx, r: number, petalColor: string, centerColor: string) {
  // Flower with five petals
  const petal = petalColor;
  const center = centerColor;
  ctx.save();
  ctx.shadowColor = "rgba(255,220,235,0.9)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, r * 0.4, r * 0.28, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

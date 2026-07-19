// Coin: denarius
import type { Ctx } from "../types.js";

export function drawDenariusCoin(ctx: Ctx, r: number) {
  // Denarius with laurel wreath
  ctx.save();
  ctx.shadowColor = "rgba(240,230,210,0.8)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#d9d2c0";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6a8a4a";
  for (const s of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const a = Math.PI / 2 - s * (0.4 + k * 0.36);
      ctx.beginPath();
      ctx.ellipse(
        Math.cos(a) * r * 0.58,
        Math.sin(a) * r * 0.58,
        r * 0.16,
        r * 0.09,
        a + Math.PI / 2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  ctx.restore();
}

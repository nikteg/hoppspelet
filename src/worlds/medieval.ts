// World: medieval
import type { Ctx } from "../types.js";
import { viewW, GROUND_Y } from "../stage.js";
import { drawWavingBanner } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  // Castle with multiple towers + waving banners
  const cx2 = viewW * 0.6;
  ctx.fillStyle = "rgba(90,80,60,0.65)";
  ctx.fillRect(cx2 - 60, GROUND_Y - 90, 120, 90);
  for (let k = -1; k <= 1; k += 2) {
    ctx.fillRect(cx2 + k * 60 - 10, GROUND_Y - 120, 20, 120);
    // merlons
    for (let i = 0; i < 3; i++) ctx.fillRect(cx2 + k * 60 - 10 + i * 8, GROUND_Y - 128, 5, 8);
  }
  // merlons on the middle section
  for (let i = 0; i < 7; i++) ctx.fillRect(cx2 - 56 + i * 16, GROUND_Y - 98, 8, 8);
  drawWavingBanner(ctx, cx2 - 60, GROUND_Y - 120, 22, 14, "rgba(200,60,60,0.6)", t, 0);
  drawWavingBanner(ctx, cx2 + 60, GROUND_Y - 120, 22, 14, "rgba(60,90,200,0.6)", t, 2);
  // Market tent in front
  ctx.fillStyle = "rgba(180,80,60,0.5)";
  ctx.beginPath();
  ctx.moveTo(viewW * 0.22 - 30, GROUND_Y);
  ctx.lineTo(viewW * 0.22, GROUND_Y - 34);
  ctx.lineTo(viewW * 0.22 + 30, GROUND_Y);
  ctx.closePath();
  ctx.fill();
}

import { drawShieldCoin } from "../coins/shield.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawShieldCoin(ctx, r);
}

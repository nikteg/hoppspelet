// World: dream
import type { Ctx } from "../types.js";
import { viewW, viewH } from "../stage.js";
import { drawDriftingClouds, drawFloatingIsland } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  // Floating islands, drifting clouds, sleeping moon and stardust
  drawDriftingClouds(ctx, t, "rgba(255,255,255,0.4)", 4, viewH * 0.25, 1.1, 4);
  for (let k = 0; k < 3; k++) {
    drawFloatingIsland(
      ctx,
      viewW * (0.25 + k * 0.28),
      viewH * (0.5 + (k % 2) * 0.1),
      70 - k * 12,
      "rgba(180,160,255,0.5)",
      "rgba(90,70,150,0.5)",
      t + k,
    );
  }
  // Sleeping moon
  const cx4 = viewW * 0.72,
    cy4 = viewH * 0.22;
  ctx.save();
  ctx.shadowColor = "rgba(255,240,200,0.6)";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "rgba(255,245,210,0.7)";
  ctx.beginPath();
  ctx.arc(cx4, cy4, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "rgba(120,90,150,0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx4 - 6, cy4 - 2, 5, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx4 + 8, cy4 - 2, 5, 0.2, Math.PI - 0.2);
  ctx.stroke();
  // Stardust trail
  for (let i = 0; i < 20; i++) {
    const sx = ((i * 90 + t * 20) % (viewW + 40)) - 20;
    const sy = viewH * 0.4 + Math.sin(i + t) * 40;
    ctx.save();
    ctx.globalAlpha = 0.3 + 0.4 * (0.5 + Math.sin(t * 3 + i) * 0.5);
    ctx.fillStyle = "rgba(255,255,220,0.9)";
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

import { drawCrescentCoin } from "../coins/crescent.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawCrescentCoin(ctx, r);
}

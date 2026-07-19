// World: atlantis
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { game } from "../state.js";
import { drawFish, drawJaggedSilhouette, drawPillar } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 15, 60, 160, 210, "rgba(5,20,30,0.7)", 0.045);
  // Sunken ruins: pillars at different heights (count based on screen width)
  const nPillars = Math.ceil(viewW / 150) + 1;
  for (let k = 0; k < nPillars; k++) {
    const cx = k * 150 + 60 - ((game.distance * 0.05) % 150);
    drawPillar(
      ctx,
      cx,
      GROUND_Y,
      20,
      60 + (k % 3) * 40,
      "rgba(30,80,90,0.55)",
      "rgba(40,100,110,0.6)",
    );
  }
  // Light rays from the water surface above
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#aef0ff";
  for (let i = 0; i < 3; i++) {
    const sx = (viewW / 3) * i + ((t * 8) % viewW);
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx + 50, 0);
    ctx.lineTo(sx - 30, GROUND_Y);
    ctx.lineTo(sx - 90, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  for (let i = 0; i < 3; i++) {
    const spd = 10 + i * 4;
    const x = viewW + 70 - ((t * spd + i * 260) % (viewW + 300));
    drawFish(ctx, x, viewH * 0.25 + i * 55, 8, "rgba(100,220,255,0.5)", t, i * 2);
  }
}

import { drawDoubloonCoin } from "../coins/doubloon.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawDoubloonCoin(ctx, r, false);
}

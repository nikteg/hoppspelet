// World: crystal
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { game } from "../state.js";
import { drawJaggedSilhouette, drawShootingStar } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 15, 50, 140, 200, "rgba(30,10,60,0.6)", 0.045);
  // Giant crystals rising from the ground, glowing
  const cCols = ["#5ff2e0", "#a06fff", "#ff6fd0"];
  // The count scales with screen width - a fixed 5 left the right half empty
  // on wide screens.
  const nCrystals = Math.ceil(viewW / 160) + 1;
  for (let i = 0; i < nCrystals; i++) {
    const cx = i * 160 + 80 - ((game.distance * 0.06) % 160);
    if (cx < -60 || cx > viewW + 60) continue;
    const h = 70 + (i % 3) * 55;
    const w = 16 + (i % 2) * 10;
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.shadowColor = cCols[i % 3];
    ctx.shadowBlur = 18;
    ctx.fillStyle = cCols[i % 3];
    ctx.beginPath();
    ctx.moveTo(cx, GROUND_Y);
    ctx.lineTo(cx - w, GROUND_Y - h * 0.6);
    ctx.lineTo(cx, GROUND_Y - h);
    ctx.lineTo(cx + w, GROUND_Y - h * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  drawShootingStar(ctx, t, 18, 2, "rgba(150,255,240,0.9)", viewH * 0.1, viewH * 0.4);
}

import { drawGemstoneCoin } from "../coins/gemstone.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawGemstoneCoin(ctx, r, "#5ff2e0");
}

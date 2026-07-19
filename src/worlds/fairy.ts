// World: fairy
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawJaggedSilhouette, drawLantern, drawRainbow } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 15, 50, 140, 200, "rgba(40,20,60,0.5)", 0.045);
  drawRainbow(ctx, viewW * 0.7, viewH * 0.6, 70);
  // Glowing mushrooms and large glowing spores
  for (let k = 0; k < 3; k++) {
    const mx = viewW * (0.2 + k * 0.28);
    ctx.save();
    ctx.shadowColor = "rgba(255,180,255,0.8)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "rgba(200,120,255,0.7)";
    ctx.fillRect(mx - 3, GROUND_Y - 18, 6, 18);
    ctx.beginPath();
    ctx.ellipse(mx, GROUND_Y - 20, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Floating fairies (glowing dots with trail)
  for (let i = 0; i < 6; i++) {
    const fx = ((t * 8 + i * 130) % (viewW + 60)) - 30;
    const fy = viewH * 0.4 + Math.sin(t * 2 + i) * 40;
    drawLantern(ctx, fx, fy, "rgba(255,230,150,0.9)", t, i * 3);
  }
}

import { drawGemstoneCoin } from "../coins/gemstone.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawGemstoneCoin(ctx, r, "#ffe08a");
}

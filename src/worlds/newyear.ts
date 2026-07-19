// World: newyear
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawFallingStreaks, drawFirework, drawTowerRow } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  // City silhouette + fireworks + falling sparks
  drawTowerRow(ctx, GROUND_Y, "rgba(20,15,35,0.7)", 0.03, 20);
  drawFirework(ctx, viewW * 0.3, viewH * 0.25, t, 5, 0, "rgba(255,120,190,0.95)");
  drawFirework(ctx, viewW * 0.6, viewH * 0.2, t, 5, 2.2, "rgba(120,220,255,0.95)");
  drawFirework(ctx, viewW * 0.8, viewH * 0.3, t, 5, 3.8, "rgba(255,230,120,0.95)");
  drawFirework(ctx, viewW * 0.45, viewH * 0.15, t, 5, 1.2, "rgba(150,255,180,0.95)");
  drawFallingStreaks(ctx, t, viewW, viewH, 20, "rgba(255,220,150,0.5)", 18, 8);
}

import { drawSparklerCoin } from "../coins/sparkler.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawSparklerCoin(ctx, r);
}

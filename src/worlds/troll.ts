// World: troll
import type { Ctx } from "../types.js";
import { viewW, GROUND_Y } from "../stage.js";
import { drawJaggedSilhouette } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, _t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 25, 110, 240, 260, "rgba(15,20,24,0.55)", 0.03);
  drawJaggedSilhouette(ctx, GROUND_Y - 25, 90, 220, 230, "rgba(20,25,28,0.7)", 0.045);
  // Stone bridge over a chasm
  const bx = viewW * 0.6;
  ctx.save();
  ctx.strokeStyle = "rgba(30,38,42,0.8)";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(bx, GROUND_Y + 30, 70, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.restore();
  // Sleeping troll (round stone with eyes)
  const trx = viewW * 0.3;
  ctx.fillStyle = "rgba(45,55,60,0.7)";
  ctx.beginPath();
  ctx.arc(trx, GROUND_Y - 20, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(180,200,80,0.6)";
  ctx.beginPath();
  ctx.arc(trx - 8, GROUND_Y - 26, 3, 0, Math.PI * 2);
  ctx.arc(trx + 8, GROUND_Y - 26, 3, 0, Math.PI * 2);
  ctx.fill();
}

import { drawRunestoneCoin } from "../coins/runestone.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawRunestoneCoin(ctx, r);
}

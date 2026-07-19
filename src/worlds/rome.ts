// World: rome
import type { Ctx } from "../types.js";
import { viewW, GROUND_Y } from "../stage.js";
import { drawPillar } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, _t: number) {
  // Colosseum archways + colonnade
  const rx = Math.max(360, viewW * 0.62);
  ctx.fillStyle = "rgba(200,170,120,0.6)";
  ctx.fillRect(rx - 80, GROUND_Y - 90, 160, 90);
  ctx.fillStyle = "rgba(90,50,15,0.55)";
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(rx - 64 + i * 32, GROUND_Y - 30 - row * 34, 12, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(rx - 76 + i * 32, GROUND_Y - 30 - row * 34, 4, 30);
    }
  }
  // Free-standing pillars in front
  drawPillar(ctx, viewW * 0.25, GROUND_Y, 18, 80, "rgba(220,200,160,0.6)", "rgba(230,210,170,0.6)");
  drawPillar(
    ctx,
    viewW * 0.33,
    GROUND_Y,
    18,
    64,
    "rgba(215,195,155,0.55)",
    "rgba(225,205,165,0.55)",
  );
}

import { drawDenariusCoin } from "../coins/denarius.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawDenariusCoin(ctx, r);
}

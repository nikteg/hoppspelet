// World: citynight
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { game } from "../state.js";
import { drawTowerRow } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, _t: number) {
  // Two parallax layers of skyscrapers with lit windows + full moon
  ctx.save();
  ctx.fillStyle = "rgba(220,220,210,0.5)";
  ctx.beginPath();
  ctx.arc(viewW * 0.8, viewH * 0.18, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawTowerRow(ctx, GROUND_Y, "rgba(15,12,20,0.7)", 0.025, 100);
  const spacing2 = 140;
  const scroll2 = game.distance * 0.05;
  const offset2 = scroll2 % spacing2;
  // Seeded with world column so buildings don't change shape/windows on wrap
  const colBase2 = Math.floor(scroll2 / spacing2) * spacing2;
  for (let bx3 = -spacing2; bx3 < viewW + spacing2; bx3 += spacing2) {
    const x = bx3 - offset2;
    const wcol = bx3 + colBase2;
    const h = 80 + Math.abs(Math.sin(wcol * 0.02)) * 130;
    ctx.fillStyle = "rgba(20,15,10,0.85)";
    ctx.fillRect(x, GROUND_Y - h, spacing2 * 0.6, h);
    ctx.fillStyle = "rgba(255,200,110,0.6)";
    let row = 0;
    for (let wy = GROUND_Y - h + 10; wy < GROUND_Y - 10; wy += 16) {
      let col = 0;
      for (let wx2 = x + 6; wx2 < x + spacing2 * 0.6 - 6; wx2 += 14) {
        if (Math.sin(wcol * 0.7 + row * 2.1 + col * 1.3) > 0.3) ctx.fillRect(wx2, wy, 6, 8);
        col++;
      }
      row++;
    }
  }
}

import { drawLampCoin } from "../coins/lamp.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawLampCoin(ctx, r);
}

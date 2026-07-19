// World: canopy
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawFlutterfly, drawHangingVine } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  // Ceiling of foliage up top + sunbeams
  ctx.save();
  ctx.fillStyle = "rgba(10,40,10,0.6)";
  ctx.fillRect(0, 0, viewW, 60);
  for (let x = 0; x < viewW; x += 50) {
    ctx.beginPath();
    ctx.arc(x, 60, 30, 0, Math.PI);
    ctx.fill();
  }
  ctx.restore();
  // Sunbeams down through the foliage
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#fff6c0";
  for (let i = 0; i < 4; i++) {
    const sx = (viewW / 4) * i + 60;
    ctx.beginPath();
    ctx.moveTo(sx, 40);
    ctx.lineTo(sx + 40, 40);
    ctx.lineTo(sx - 20, GROUND_Y);
    ctx.lineTo(sx - 80, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  for (let i = 0; i < 3; i++) {
    drawHangingVine(ctx, viewW * (0.2 + i * 0.3), 55, 90, t, i * 2, "rgba(30,70,20,0.6)");
  }
  for (let i = 0; i < 3; i++) {
    drawFlutterfly(
      ctx,
      ((t * (7 + i * 2) + i * 320) % (viewW + 100)) - 50,
      viewH * 0.4 + i * 35,
      7,
      t,
      i * 3,
      ["rgba(255,200,80,0.75)", "rgba(255,120,180,0.75)", "rgba(140,220,255,0.75)"][i],
    );
  }
}

import { drawLeafCoin } from "../coins/leaf.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawLeafCoin(ctx, r, "#8aca5a");
}

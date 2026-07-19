// World: autumn
import type { Ctx } from "../types.js";
import { viewW, GROUND_Y } from "../stage.js";
import { drawGroundProp, drawJaggedSilhouette } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 20, 70, 180, 220, "rgba(60,30,10,0.6)", 0.045);
  const ax = Math.max(340, viewW * 0.66);
  ctx.save();
  ctx.translate(ax, GROUND_Y);
  ctx.rotate(Math.sin(t * 0.35) * 0.03);
  ctx.strokeStyle = "rgba(50,30,15,0.8)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -90);
  ctx.stroke();
  ctx.fillStyle = "rgba(200,110,40,0.75)";
  ctx.beginPath();
  ctx.arc(0, -110, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Two more swaying trees in different sizes
  const extraTrees = [
    { x: Math.max(420, viewW * 0.5), h: 70, r: 38, color: "rgba(220,140,50,0.7)" },
    { x: Math.max(500, viewW * 0.58), h: 55, r: 30, color: "rgba(180,90,40,0.7)" },
  ];
  for (const tr of extraTrees) {
    ctx.save();
    ctx.translate(tr.x, GROUND_Y);
    ctx.rotate(Math.sin(t * 0.4 + tr.x) * 0.025);
    ctx.strokeStyle = "rgba(50,30,15,0.8)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -tr.h);
    ctx.stroke();
    ctx.fillStyle = tr.color;
    ctx.beginPath();
    ctx.arc(0, -tr.h - tr.r * 0.4, tr.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Pumpkins and mushrooms on the ground
  drawGroundProp(ctx, Math.max(400, viewW * 0.46), GROUND_Y, "pumpkin", "#d9720f");
  drawGroundProp(ctx, Math.max(460, viewW * 0.53), GROUND_Y, "mushroom", "#c94a3a");
  drawGroundProp(ctx, Math.max(520, viewW * 0.6), GROUND_Y, "mushroom", "#e8dcc0");
}

import { drawAcornCoin } from "../coins/acorn.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawAcornCoin(ctx, r);
}

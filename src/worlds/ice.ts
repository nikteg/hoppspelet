// World: ice
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawIceberg, drawJaggedSilhouette, drawShootingStar } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  ctx.save();
  ctx.globalAlpha = 0.25;
  const auroraColors = ["#8affc1", "#8ad9ff", "#c58aff"];
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = auroraColors[i];
    ctx.lineWidth = 18;
    ctx.beginPath();
    for (let x = 0; x <= viewW; x += 20) {
      const y = 60 + i * 30 + Math.sin(x * 0.01 + t + i) * 25;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
  drawShootingStar(ctx, t, 26, 4, "rgba(255,255,255,0.95)", viewH * 0.1, viewH * 0.35);
  drawJaggedSilhouette(ctx, GROUND_Y - 10, 70, 190, 210, "rgba(180,220,240,0.5)", 0.05);

  // Icebergs floating by in the distance
  for (let i = 0; i < 2; i++) {
    const ibx = viewW * (0.4 + i * 0.35);
    drawIceberg(ctx, ibx, GROUND_Y - 5, 90 + i * 30, 55 + i * 15, "rgba(210,235,245,0.55)");
  }

  // Penguins wobbling on the ground
  for (let i = 0; i < 2; i++) {
    const pgx = Math.max(400, viewW * (0.5 + i * 0.1));
    const bob = Math.sin(t * 4 + i) * 2;
    ctx.save();
    ctx.translate(pgx, GROUND_Y + bob);
    ctx.fillStyle = "#1a2a30";
    ctx.beginPath();
    ctx.ellipse(0, -14, 9, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f2f8fa";
    ctx.beginPath();
    ctx.ellipse(0, -12, 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = "#0a1418";
    ctx.beginPath();
    ctx.arc(-2.5, -22, 1.2, 0, Math.PI * 2);
    ctx.arc(2.5, -22, 1.2, 0, Math.PI * 2);
    ctx.fill();
    // Orange beak
    ctx.fillStyle = "#f5a623";
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(7, -18);
    ctx.lineTo(0, -16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

import { drawDiamondCoin } from "../coins/diamond.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawDiamondCoin(ctx, r);
}

// World: ocean
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawFish, drawJaggedSilhouette } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#bfe9ff";
  for (let i = 0; i < 4; i++) {
    const bx = (((viewW / 4) * i + t * 6) % (viewW + 200)) - 100;
    ctx.beginPath();
    ctx.moveTo(bx, 0);
    ctx.lineTo(bx + 60, 0);
    ctx.lineTo(bx - 40, GROUND_Y);
    ctx.lineTo(bx - 100, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Swimming schools of fish at different depths
  for (let i = 0; i < 4; i++) {
    const spd = 12 + i * 5;
    const x = viewW + 80 - ((t * spd + i * 260) % (viewW + 300));
    const y = viewH * 0.2 + i * 60;
    drawFish(ctx, x, y, 9 + (i % 2) * 3, "rgba(8,25,35,0.5)", t, i * 2);
  }

  drawJaggedSilhouette(ctx, GROUND_Y - 10, 20, 55, 150, "rgba(6,40,45,0.85)", 0.06);

  // Jellyfish drifting
  for (let i = 0; i < 2; i++) {
    const jx = viewW * (0.35 + i * 0.4);
    const jy = viewH * 0.3 + Math.sin(t * 0.7 + i) * 30;
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "rgba(220,180,255,0.6)";
    ctx.beginPath();
    ctx.arc(jx, jy, 16, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = "rgba(220,180,255,0.5)";
    ctx.lineWidth = 2;
    for (let k = -2; k <= 2; k++) {
      ctx.beginPath();
      ctx.moveTo(jx + k * 6, jy);
      ctx.lineTo(jx + k * 6 + Math.sin(t * 2 + k) * 4, jy + 18);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Seaweed swaying from the seabed
  for (let i = 0; i < 4; i++) {
    const gx = 100 + i * ((viewW - 200) / 4);
    ctx.save();
    ctx.strokeStyle = "rgba(20,80,60,0.6)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let s = 0; s <= 40; s += 8) {
      const yy = GROUND_Y - s;
      const xx = gx + Math.sin(t * 0.9 + i + s * 0.08) * 8;
      if (s === 0) ctx.moveTo(xx, yy);
      else ctx.lineTo(xx, yy);
    }
    ctx.stroke();
    ctx.restore();
  }
}

import { drawPearlCoin } from "../coins/pearl.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawPearlCoin(ctx, r);
}

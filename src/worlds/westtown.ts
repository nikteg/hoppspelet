// World: westtown
import type { Ctx } from "../types.js";
import { viewW, GROUND_Y } from "../stage.js";

export function drawScenery(ctx: Ctx, t: number) {
  // Row of saloon facades + cacti + tumbleweed
  const facades = [
    { x: 0.55, w: 90, h: 70 },
    { x: 0.7, w: 70, h: 90 },
    { x: 0.82, w: 60, h: 60 },
  ];
  for (const f of facades) {
    const fx = viewW * f.x;
    ctx.fillStyle = "rgba(80,50,25,0.65)";
    ctx.fillRect(fx - f.w / 2, GROUND_Y - f.h, f.w, f.h);
    // false high roof
    ctx.beginPath();
    ctx.moveTo(fx - f.w / 2 - 6, GROUND_Y - f.h);
    ctx.lineTo(fx, GROUND_Y - f.h - 16);
    ctx.lineTo(fx + f.w / 2 + 6, GROUND_Y - f.h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(120,90,50,0.5)";
    ctx.fillRect(fx - f.w / 2, GROUND_Y - f.h * 0.4, f.w, 4);
  }
  // Cactus
  ctx.fillStyle = "rgba(50,90,40,0.6)";
  const kx = viewW * 0.22;
  ctx.fillRect(kx - 4, GROUND_Y - 40, 8, 40);
  ctx.fillRect(kx - 16, GROUND_Y - 30, 8, 16);
  ctx.fillRect(kx + 8, GROUND_Y - 36, 8, 18);
  // Tumbleweed
  const twx = viewW - ((t * 45) % (viewW + 60)) - 30;
  ctx.save();
  ctx.translate(twx, GROUND_Y - 10);
  ctx.rotate(t * 5);
  ctx.strokeStyle = "rgba(120,90,40,0.6)";
  ctx.lineWidth = 2;
  for (let a = 0; a < 6; a++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 9);
    ctx.stroke();
  }
  ctx.restore();
}

import { drawSheriffStarCoin } from "../coins/sheriffstar.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawSheriffStarCoin(ctx, r);
}

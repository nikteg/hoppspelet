// World: egypt
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";

export function drawScenery(ctx: Ctx, _t: number) {
  // Three pyramids in depth + sphinx + scorching sun
  ctx.save();
  ctx.shadowColor = "rgba(255,230,160,0.8)";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "rgba(255,235,180,0.85)";
  ctx.beginPath();
  ctx.arc(viewW * 0.5, viewH * 0.2, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  const pyrs = [
    { x: 0.65, s: 90, c: "rgba(90,55,20,0.7)" },
    { x: 0.78, s: 60, c: "rgba(75,45,15,0.6)" },
    { x: 0.4, s: 70, c: "rgba(80,50,18,0.65)" },
  ];
  for (const p of pyrs) {
    const px = viewW * p.x;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.moveTo(px - p.s * 0.7, GROUND_Y);
    ctx.lineTo(px, GROUND_Y - p.s);
    ctx.lineTo(px + p.s * 0.7, GROUND_Y);
    ctx.closePath();
    ctx.fill();
    // sunlit side
    ctx.fillStyle = "rgba(255,230,170,0.15)";
    ctx.beginPath();
    ctx.moveTo(px, GROUND_Y - p.s);
    ctx.lineTo(px + p.s * 0.7, GROUND_Y);
    ctx.lineTo(px, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }
  // Sphinx
  const sfx = viewW * 0.2;
  ctx.fillStyle = "rgba(90,60,25,0.6)";
  ctx.fillRect(sfx - 30, GROUND_Y - 24, 60, 24);
  ctx.fillRect(sfx + 20, GROUND_Y - 44, 20, 24);
}

import { drawAnkhCoin } from "../coins/ankh.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawAnkhCoin(ctx, r);
}

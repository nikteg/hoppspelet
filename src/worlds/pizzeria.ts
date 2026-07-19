// World: pizzeria
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";

export function drawScenery(ctx: Ctx, t: number) {
  // Pizzeria facade with neon sign + smoking chimney + flying pizza
  const px2 = viewW * 0.6;
  ctx.fillStyle = "rgba(150,90,40,0.6)";
  ctx.fillRect(px2 - 60, GROUND_Y - 80, 120, 80);
  // Striped awning
  for (let s = -60; s < 60; s += 20) {
    ctx.fillStyle =
      Math.floor((s + 60) / 20) % 2 === 0 ? "rgba(200,50,50,0.6)" : "rgba(240,240,240,0.6)";
    ctx.fillRect(px2 + s, GROUND_Y - 50, 20, 14);
  }
  // Neon sign
  ctx.save();
  ctx.shadowColor = "rgba(255,90,90,0.9)";
  ctx.shadowBlur = 10;
  ctx.strokeStyle = "rgba(255,120,120,0.9)";
  ctx.lineWidth = 3;
  ctx.strokeRect(px2 - 26, GROUND_Y - 74, 52, 18);
  ctx.restore();
  // Smoking chimney
  for (let i = 0; i < 3; i++) {
    const cyc = (t * 0.5 + i * 2.5) % 9;
    const p3 = cyc / 9;
    ctx.save();
    ctx.globalAlpha = (1 - p3) * 0.3;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.arc(px2 + 40, GROUND_Y - 85 - p3 * 90, 6 + p3 * 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Flying pizza slice
  const pzx = ((t * 40) % (viewW + 80)) - 40;
  ctx.save();
  ctx.translate(pzx, viewH * 0.25);
  ctx.rotate(t * 3);
  ctx.fillStyle = "rgba(240,200,120,0.8)";
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(220,60,40,0.8)";
  ctx.beginPath();
  ctx.arc(-4, -3, 2, 0, Math.PI * 2);
  ctx.arc(4, 2, 2, 0, Math.PI * 2);
  ctx.arc(0, 5, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

import { drawPizzaSliceCoin } from "../coins/pizzaslice.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawPizzaSliceCoin(ctx, r);
}

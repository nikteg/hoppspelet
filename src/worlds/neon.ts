// World: neon
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { game } from "../state.js";

export function drawScenery(ctx: Ctx, t: number) {
  const spacing = 130;
  const scroll = game.distance * 0.06;
  const offset = scroll % spacing;
  // The building's height and window pattern are seeded with its WORLD COLUMN
  // (bx + colBase), not the screen position - otherwise all buildings change shape and
  // windows every time the offset wraps (and the windows "blink").
  const colBase = Math.floor(scroll / spacing) * spacing;
  for (let bx = -spacing; bx < viewW + spacing; bx += spacing) {
    const x = bx - offset;
    const wcol = bx + colBase;
    const h = 90 + Math.abs(Math.sin(wcol * 0.02)) * 140;
    ctx.fillStyle = "rgba(10,5,20,0.85)";
    ctx.fillRect(x, GROUND_Y - h, spacing * 0.6, h);
    let row = 0;
    for (let wy = GROUND_Y - h + 10; wy < GROUND_Y - 10; wy += 16) {
      let col = 0;
      for (let wx = x + 6; wx < x + spacing * 0.6 - 6; wx += 14) {
        if (Math.sin(wcol * 0.7 + row * 2.1 + col * 1.3) > 0.3) {
          ctx.fillStyle = "rgba(0,255,255,0.5)";
        } else {
          ctx.fillStyle = "rgba(255,60,200,0.35)";
        }
        ctx.fillRect(wx, wy, 6, 8);
        col++;
      }
      row++;
    }
  }

  // Flying cars
  for (let i = 0; i < 3; i++) {
    const spd2 = 25 + i * 10;
    const cx3 = ((t * spd2 + i * 260) % (viewW + 100)) - 50;
    const cy3 = viewH * (0.15 + i * 0.1);
    ctx.save();
    ctx.shadowColor = i % 2 === 0 ? "rgba(0,255,255,0.9)" : "rgba(255,0,200,0.9)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = i % 2 === 0 ? "#0ff0fc" : "#ff2fb0";
    ctx.beginPath();
    ctx.ellipse(cx3, cy3, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

import { drawNeonCoin } from "../coins/neoncoin.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawNeonCoin(ctx, r);
}

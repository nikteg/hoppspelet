// World: disco
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";

export function drawScenery(ctx: Ctx, t: number) {
  // Disco ball with rotating light rays + checkered dancefloor glow
  const dx3 = viewW * 0.5,
    dy3 = viewH * 0.22,
    dr = 26;
  // Rays
  for (let i = 0; i < 6; i++) {
    const a = t * 0.8 + ((Math.PI * 2) / 6) * i;
    ctx.save();
    ctx.globalAlpha = 0.09;
    ctx.fillStyle = ["#ff2fb0", "#00ffcc", "#ffe066", "#5ab4ff", "#ff5a5a", "#a06fff"][i];
    ctx.beginPath();
    ctx.moveTo(dx3, dy3);
    ctx.lineTo(dx3 + Math.cos(a) * 500, dy3 + Math.sin(a) * 500 + 200);
    ctx.lineTo(dx3 + Math.cos(a + 0.15) * 500, dy3 + Math.sin(a + 0.15) * 500 + 200);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  // Ball
  ctx.save();
  ctx.translate(dx3, dy3);
  ctx.rotate(t * 0.5);
  ctx.fillStyle = "rgba(200,200,215,0.7)";
  ctx.beginPath();
  ctx.arc(0, 0, dr, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (let ry = -dr; ry < dr; ry += 6)
    for (let rx = -dr; rx < dr; rx += 6) {
      if (rx * rx + ry * ry < dr * dr && (Math.floor(rx / 6) + Math.floor(ry / 6)) % 2 === 0)
        ctx.fillRect(rx, ry, 5, 5);
    }
  ctx.restore();
  // Blinking dancefloor tiles
  ctx.save();
  ctx.globalAlpha = 0.12;
  for (let gx = 0; gx < viewW; gx += 50) {
    ctx.fillStyle = Math.sin(gx * 0.1 + t * 3) > 0 ? "#ff2fb0" : "#00ffcc";
    ctx.fillRect(gx, GROUND_Y - 6, 46, 6);
  }
  ctx.restore();
}

import { drawDiscoBallCoin } from "../coins/discoball.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawDiscoBallCoin(ctx, r);
}

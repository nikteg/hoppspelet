// World: bog
import type { Ctx } from "../types.js";
import { viewW, GROUND_Y } from "../stage.js";
import { drawHangingVine, drawJaggedSilhouette, drawLantern } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 10, 40, 90, 220, "rgba(15,25,10,0.6)", 0.04);
  // Dead twisted trees
  for (let k = 0; k < 3; k++) {
    const tx = Math.max(320, viewW * (0.3 + k * 0.25));
    ctx.save();
    ctx.strokeStyle = "rgba(20,30,15,0.7)";
    ctx.lineWidth = 6 - k;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(tx, GROUND_Y);
    ctx.lineTo(tx + 8, GROUND_Y - 90);
    ctx.moveTo(tx + 8, GROUND_Y - 60);
    ctx.lineTo(tx + 30, GROUND_Y - 75);
    ctx.moveTo(tx + 8, GROUND_Y - 70);
    ctx.lineTo(tx - 16, GROUND_Y - 88);
    ctx.stroke();
    ctx.restore();
  }
  for (let i = 0; i < 2; i++) {
    drawHangingVine(
      ctx,
      Math.max(380, viewW * (0.4 + i * 0.15)),
      0,
      60,
      t,
      i * 3,
      "rgba(20,40,10,0.5)",
    );
  }
  // Glowing will-o'-wisp clouds (count based on screen width)
  const nWisps = Math.ceil(viewW / 220) + 1;
  for (let i = 0; i < nWisps; i++) {
    drawLantern(
      ctx,
      i * 220 + 60 - ((t * 10) % 220),
      GROUND_Y - 30 - (i % 3) * 20,
      "rgba(150,255,120,0.9)",
      t,
      i * 2,
    );
  }
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#7a9a6a";
  const fo = (t * 4) % 220;
  for (let x = -fo; x < viewW; x += 220) {
    ctx.beginPath();
    ctx.ellipse(x, GROUND_Y - 5, 100, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

import { drawWispCoin } from "../coins/wisp.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawWispCoin(ctx, r, "rgba(170,255,140,0.95)");
}

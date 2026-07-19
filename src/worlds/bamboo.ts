// World: bamboo
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { game } from "../state.js";
import { drawFlutterfly } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  // Dense bamboo stalks in multiple parallax layers
  for (let layer = 0; layer < 2; layer++) {
    const col = layer === 0 ? "rgba(40,70,25,0.4)" : "rgba(60,100,35,0.6)";
    const spacing = 34 + layer * 8;
    const off = (game.distance * (0.03 + layer * 0.03)) % spacing;
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = 7 - layer * 2;
    for (let bx = -spacing; bx < viewW + spacing; bx += spacing) {
      const x = bx - off + Math.sin(bx) * 4;
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y);
      ctx.lineTo(x + Math.sin(t * 0.5 + bx) * 6, GROUND_Y - 150 - (bx % 3) * 20);
      ctx.stroke();
    }
    ctx.restore();
  }
  for (let i = 0; i < 3; i++) {
    drawFlutterfly(
      ctx,
      ((t * (6 + i * 2) + i * 350) % (viewW + 100)) - 50,
      viewH * 0.4 + i * 30,
      6,
      t,
      i * 4,
      "rgba(255,255,255,0.7)",
    );
  }
  // Panda silhouette by a bamboo stalk
  const px = viewW * 0.4;
  ctx.fillStyle = "rgba(240,240,240,0.5)";
  ctx.beginPath();
  ctx.arc(px, GROUND_Y - 18, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(20,20,20,0.5)";
  ctx.beginPath();
  ctx.arc(px - 10, GROUND_Y - 28, 5, 0, Math.PI * 2);
  ctx.arc(px + 10, GROUND_Y - 28, 5, 0, Math.PI * 2);
  ctx.fill();
}

import { drawLeafCoin } from "../coins/leaf.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawLeafCoin(ctx, r, "#a9d98a");
}

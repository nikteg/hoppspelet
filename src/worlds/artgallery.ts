// World: artgallery
import type { Ctx } from "../types.js";
import { viewW, GROUND_Y } from "../stage.js";
import { game } from "../state.js";

export function drawScenery(ctx: Ctx, _t: number) {
  // Wall paintings/canvases in frames on the wall + spotlights
  const colors3 = ["#ff5a5a", "#5ab4ff", "#ffe066", "#6fce7a", "#a06fff"];
  const paintScroll = game.distance * 0.05;
  const fo = paintScroll % 160;
  // The painting's motif follows its world column so it doesn't change appearance
  // every time the offset wraps.
  const paintBase = Math.floor(paintScroll / 160);
  for (let bx = -160; bx < viewW + 160; bx += 160) {
    const x = bx - fo;
    const idx = ((((bx / 160 + paintBase) % 5) + 5) % 5) | 0;
    ctx.fillStyle = "rgba(40,30,20,0.5)";
    ctx.fillRect(x, GROUND_Y - 130, 90, 90);
    ctx.fillStyle = colors3[idx];
    ctx.save();
    ctx.globalAlpha = 0.5;
    if (idx % 2 === 0) {
      ctx.beginPath();
      ctx.arc(x + 45, GROUND_Y - 85, 26, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(x + 20, GROUND_Y - 115, 50, 60);
    }
    ctx.restore();
    // Spotlight
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(x + 45, GROUND_Y - 140);
    ctx.lineTo(x + 10, GROUND_Y - 40);
    ctx.lineTo(x + 80, GROUND_Y - 40);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

import { drawPaletteCoin } from "../coins/palette.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawPaletteCoin(ctx, r);
}

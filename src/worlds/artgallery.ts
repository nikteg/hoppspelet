// World: artgallery
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { game } from "../state.js";
import {
  drawBird,
  drawDriftingClouds,
  drawFallingStreaks,
  drawFirework,
  drawFish,
  drawFloatingIsland,
  drawFlutterfly,
  drawGroundProp,
  drawHangingVine,
  drawIceberg,
  drawJaggedSilhouette,
  drawLantern,
  drawPillar,
  drawRainbow,
  drawShootingStar,
  drawSwayingTree,
  drawTowerRow,
  drawWavingBanner,
  drawBalloon,
} from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
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

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Painter's palette with paint dabs
      ctx.save();
      ctx.shadowColor = "rgba(200,100,255,0.7)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#c9a072";
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.arc(r * 0.35, r * 0.3, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
      const dabs: [string, number, number][] = [
        ["#ff5a5a", -0.4, -0.35],
        ["#5ab4ff", 0.05, -0.5],
        ["#ffe066", 0.45, -0.15],
        ["#6fce7a", -0.5, 0.15],
      ];
      for (const d of dabs) {
        ctx.fillStyle = d[0];
        ctx.beginPath();
        ctx.arc(d[1] * r, d[2] * r, r * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
}

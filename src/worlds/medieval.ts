// World: medieval
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
      // Castle with multiple towers + waving banners
      const cx2 = viewW * 0.6;
      ctx.fillStyle = "rgba(90,80,60,0.65)";
      ctx.fillRect(cx2 - 60, GROUND_Y - 90, 120, 90);
      for (let k = -1; k <= 1; k += 2) {
        ctx.fillRect(cx2 + k * 60 - 10, GROUND_Y - 120, 20, 120);
        // merlons
        for (let i = 0; i < 3; i++) ctx.fillRect(cx2 + k * 60 - 10 + i * 8, GROUND_Y - 128, 5, 8);
      }
      // merlons on the middle section
      for (let i = 0; i < 7; i++) ctx.fillRect(cx2 - 56 + i * 16, GROUND_Y - 98, 8, 8);
      drawWavingBanner(ctx, cx2 - 60, GROUND_Y - 120, 22, 14, "rgba(200,60,60,0.6)", t, 0);
      drawWavingBanner(ctx, cx2 + 60, GROUND_Y - 120, 22, 14, "rgba(60,90,200,0.6)", t, 2);
      // Market tent in front
      ctx.fillStyle = "rgba(180,80,60,0.5)";
      ctx.beginPath();
      ctx.moveTo(viewW * 0.22 - 30, GROUND_Y);
      ctx.lineTo(viewW * 0.22, GROUND_Y - 34);
      ctx.lineTo(viewW * 0.22 + 30, GROUND_Y);
      ctx.closePath();
      ctx.fill();
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Knight's shield with cross
      ctx.save();
      ctx.shadowColor = "rgba(230,220,190,0.7)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#b83a3a";
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.7);
      ctx.lineTo(r * 0.7, -r * 0.7);
      ctx.lineTo(r * 0.7, r * 0.1);
      ctx.quadraticCurveTo(r * 0.7, r * 0.6, 0, r * 0.95);
      ctx.quadraticCurveTo(-r * 0.7, r * 0.6, -r * 0.7, r * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#f0e8d0";
      ctx.lineWidth = r * 0.16;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.55);
      ctx.lineTo(0, r * 0.7);
      ctx.moveTo(-r * 0.55, -r * 0.15);
      ctx.lineTo(r * 0.55, -r * 0.15);
      ctx.stroke();
      ctx.restore();
}

// World: unicorn
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
      drawJaggedSilhouette(ctx, GROUND_Y - 10, 20, 55, 220, "rgba(255,255,255,0.35)", 0.05);
      drawRainbow(ctx, viewW * 0.3, viewH * 0.55, 85);
      drawDriftingClouds(ctx, t, "rgba(255,245,255,0.5)", 3, viewH * 0.2, 1, 5);
      // Unicorn on a hill
      const ux = viewW * 0.68;
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath();
      ctx.ellipse(ux, GROUND_Y - 26, 22, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(ux - 20, GROUND_Y - 34, 8, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(ux - 14, GROUND_Y - 18, 5, 18);
      ctx.fillRect(ux + 12, GROUND_Y - 18, 5, 18);
      // Horn
      ctx.strokeStyle = "rgba(255,210,120,0.9)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ux - 24, GROUND_Y - 42);
      ctx.lineTo(ux - 28, GROUND_Y - 56);
      ctx.stroke();
      // Mane in rainbow colors
      ctx.strokeStyle = "rgba(255,150,220,0.7)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ux - 16, GROUND_Y - 38);
      ctx.quadraticCurveTo(ux - 4, GROUND_Y - 30, ux - 2, GROUND_Y - 20);
      ctx.stroke();
      ctx.restore();
      for (let i = 0; i < 2; i++) {
        drawFlutterfly(
          ctx,
          ((t * (6 + i * 2) + i * 300) % (viewW + 100)) - 50,
          viewH * 0.4 + i * 30,
          6,
          t,
          i * 3,
          "rgba(255,200,230,0.8)",
        );
      }
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // White star with pink inner outline and pastel glow
      ctx.save();
      ctx.shadowColor = "rgba(255,190,230,0.95)";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ffffff";
      drawStarShape(ctx, 0, 0, r, r * 0.45);
      ctx.fill();
      ctx.strokeStyle = "#ff9ad0";
      ctx.lineWidth = 1.6;
      drawStarShape(ctx, 0, 0, r * 0.6, r * 0.27);
      ctx.stroke();
      ctx.restore();
}

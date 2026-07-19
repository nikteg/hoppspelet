// World: newyear
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
      // City silhouette + fireworks + falling sparks
      drawTowerRow(ctx, GROUND_Y, "rgba(20,15,35,0.7)", 0.03, 20);
      drawFirework(ctx, viewW * 0.3, viewH * 0.25, t, 5, 0, "rgba(255,120,190,0.95)");
      drawFirework(ctx, viewW * 0.6, viewH * 0.2, t, 5, 2.2, "rgba(120,220,255,0.95)");
      drawFirework(ctx, viewW * 0.8, viewH * 0.3, t, 5, 3.8, "rgba(255,230,120,0.95)");
      drawFirework(ctx, viewW * 0.45, viewH * 0.15, t, 5, 1.2, "rgba(150,255,180,0.95)");
      drawFallingStreaks(ctx, t, viewW, viewH, 20, "rgba(255,220,150,0.5)", 18, 8);
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Sparkler star with pink sparks
      ctx.save();
      ctx.shadowColor = "rgba(255,220,120,0.95)";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ffe066";
      drawStarShape(ctx, 0, 0, r * 0.7, r * 0.32);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,150,180,0.9)";
      ctx.lineWidth = 1.4;
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8 + 0.4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75);
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.stroke();
      }
      ctx.restore();
}

// World: space
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
      ctx.save();
      const ringAngle = -0.3 + Math.sin(t * 0.08) * 0.12;
      ctx.fillStyle = "#5b3a9e";
      ctx.beginPath();
      ctx.arc(viewW * 0.8, viewH * 0.22, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(200,180,255,0.6)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(viewW * 0.8, viewH * 0.22, 52, 14, ringAngle, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#2e6f9e";
      ctx.beginPath();
      ctx.arc(viewW * 0.25, viewH * 0.15, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      drawShootingStar(ctx, t, 20, 0, "rgba(220,200,255,0.95)", viewH * 0.05, viewH * 0.4);

      // Distant space station
      ctx.save();
      const stX = viewW * 0.45;
      const stY = viewH * 0.12;
      ctx.fillStyle = "rgba(180,190,210,0.6)";
      ctx.fillRect(stX - 16, stY - 6, 32, 12);
      ctx.fillStyle = "rgba(120,180,255,0.5)";
      ctx.fillRect(stX - 30, stY - 3, 12, 6);
      ctx.fillRect(stX + 18, stY - 3, 12, 6);
      ctx.restore();

      // Asteroid belt drifting by
      for (let i = 0; i < 5; i++) {
        const spd = 6 + (i % 3) * 3;
        const ax = viewW + 40 - ((t * spd + i * 180) % (viewW + 200));
        const ay = viewH * (0.15 + (i % 4) * 0.08);
        ctx.save();
        ctx.fillStyle = "rgba(90,80,100,0.6)";
        ctx.beginPath();
        ctx.arc(ax, ay, 4 + (i % 3) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      ctx.save();
      ctx.shadowColor = "rgba(255,255,200,0.9)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#fff6c8";
      drawStarShape(ctx, 0, 0, r, r * 0.45);
      ctx.fill();
      ctx.restore();
}

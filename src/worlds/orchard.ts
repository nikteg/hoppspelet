// World: orchard
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
      // Row of fruit trees + falling leaves + basket of fruit
      for (let i = 0; i < 3; i++) {
        const ox = viewW * (0.45 + i * 0.18);
        ctx.save();
        ctx.translate(ox, GROUND_Y);
        ctx.rotate(Math.sin(t * 0.4 + i) * 0.015);
        ctx.strokeStyle = "rgba(80,50,20,0.8)";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -70);
        ctx.stroke();
        ctx.fillStyle = "rgba(120,180,60,0.75)";
        ctx.beginPath();
        ctx.arc(0, -95, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(230,50,50,0.85)";
        for (let f = 0; f < 5; f++) {
          const fa = f * 1.3;
          ctx.beginPath();
          ctx.arc(Math.cos(fa) * 22, -95 + Math.sin(fa) * 18, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      // Falling leaves
      for (let i = 0; i < 10; i++) {
        const seed = i * 80;
        const x = ((seed * 2.1) % viewW) + Math.sin(t + i) * 18;
        const y = ((t * 14 + seed) % (viewH + 40)) - 20;
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "rgba(200,120,50,0.9)";
        ctx.beginPath();
        ctx.ellipse(x, y, 4, 2, i, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Red apple with leaf
      ctx.save();
      ctx.shadowColor = "rgba(255,140,140,0.8)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#e0483a";
      ctx.beginPath();
      ctx.arc(-r * 0.25, r * 0.1, r * 0.55, 0, Math.PI * 2);
      ctx.arc(r * 0.25, r * 0.1, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#6a4a28";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.35);
      ctx.lineTo(0, -r * 0.8);
      ctx.stroke();
      ctx.fillStyle = "#5a8a2a";
      ctx.beginPath();
      ctx.ellipse(r * 0.25, -r * 0.7, r * 0.28, r * 0.14, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
}

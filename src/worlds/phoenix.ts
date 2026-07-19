// World: phoenix
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
      drawJaggedSilhouette(ctx, GROUND_Y - 20, 60, 160, 220, "rgba(60,15,10,0.6)", 0.045);
      // Giant phoenix centered with glowing wings
      const fx = viewW * 0.72;
      const fy = viewH * 0.28;
      const wf = Math.sin(t * 3) * 0.5;
      ctx.save();
      ctx.shadowColor = "rgba(255,140,50,0.9)";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "rgba(255,160,60,0.7)";
      ctx.beginPath();
      ctx.ellipse(fx, fy, 12, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.quadraticCurveTo(fx - 50, fy - 30 - wf * 30, fx - 70, fy + 20);
      ctx.quadraticCurveTo(fx - 30, fy + 10, fx, fy);
      ctx.moveTo(fx, fy);
      ctx.quadraticCurveTo(fx + 50, fy - 30 - wf * 30, fx + 70, fy + 20);
      ctx.quadraticCurveTo(fx + 30, fy + 10, fx, fy);
      ctx.fill();
      // Tail of fire
      ctx.beginPath();
      ctx.moveTo(fx, fy + 18);
      ctx.quadraticCurveTo(fx - 10, fy + 55, fx, fy + 75);
      ctx.quadraticCurveTo(fx + 10, fy + 55, fx, fy + 18);
      ctx.fill();
      ctx.restore();
      // Falling glowing feathers
      drawFallingStreaks(ctx, t, viewW, viewH, 12, "rgba(255,160,70,0.5)", 20, 10);
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Glowing phoenix feather
      ctx.save();
      ctx.rotate(0.5);
      ctx.shadowColor = "rgba(255,170,60,0.9)";
      ctx.shadowBlur = 12;
      const g = ctx.createLinearGradient(0, -r, 0, r);
      g.addColorStop(0, "#ffcf6a");
      g.addColorStop(1, "#ff6a3a");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(r * 0.7, -r * 0.2, 0, r);
      ctx.quadraticCurveTo(-r * 0.7, -r * 0.2, 0, -r);
      ctx.fill();
      ctx.strokeStyle = "rgba(120,40,10,0.7)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.85);
      ctx.lineTo(0, r * 0.9);
      for (let k = 1; k <= 3; k++) {
        const yy = -r * 0.55 + k * r * 0.35;
        ctx.moveTo(0, yy);
        ctx.lineTo(-r * 0.4, yy + r * 0.18);
        ctx.moveTo(0, yy);
        ctx.lineTo(r * 0.4, yy + r * 0.18);
      }
      ctx.stroke();
      ctx.restore();
}

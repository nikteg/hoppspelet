// World: witch
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
      drawJaggedSilhouette(ctx, GROUND_Y - 20, 70, 190, 210, "rgba(20,10,25,0.7)", 0.045);
      // Full green moon
      ctx.save();
      ctx.shadowColor = "rgba(150,255,120,0.7)";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "rgba(200,255,170,0.6)";
      ctx.beginPath();
      ctx.arc(viewW * 0.78, viewH * 0.2, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // Flying witch on broomstick across the moon
      const hx = ((t * 24) % (viewW + 200)) - 100;
      const hy = viewH * 0.22 + Math.sin(t * 1.5) * 12;
      ctx.save();
      ctx.strokeStyle = "rgba(20,10,25,0.85)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(hx - 18, hy);
      ctx.lineTo(hx + 18, hy - 4);
      ctx.stroke();
      ctx.fillStyle = "rgba(20,10,25,0.85)";
      ctx.beginPath();
      ctx.arc(hx, hy - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(hx - 6, hy - 12);
      ctx.lineTo(hx + 6, hy - 12);
      ctx.lineTo(hx, hy - 24);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      for (let i = 0; i < 2; i++) {
        drawHangingVine(
          ctx,
          Math.max(380, viewW * (0.42 + i * 0.18)),
          0,
          65,
          t,
          i * 2,
          "rgba(30,15,35,0.6)",
        );
      }
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Potion bottle with bubble
      ctx.save();
      ctx.shadowColor = "rgba(140,230,90,0.9)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "rgba(60,180,80,0.9)";
      ctx.beginPath();
      ctx.arc(0, r * 0.25, r * 0.62, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(90,150,110,0.9)";
      ctx.fillRect(-r * 0.16, -r * 0.85, r * 0.32, r * 0.55);
      ctx.fillStyle = "#d9c9a0";
      ctx.fillRect(-r * 0.22, -r * 0.98, r * 0.44, r * 0.2);
      ctx.fillStyle = "rgba(220,255,190,0.8)";
      ctx.beginPath();
      ctx.arc(-r * 0.2, r * 0.1, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
}

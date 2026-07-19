// World: icecream
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
      // Ice cream cones and a big ice cream machine + sprinkles
      const ix2 = viewW * 0.6;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillRect(ix2 - 45, GROUND_Y - 80, 90, 80);
      // Three swirled scoops on the roof
      const flav = ["rgba(255,150,200,0.7)", "rgba(150,220,255,0.7)", "rgba(180,255,180,0.7)"];
      for (let k = -1; k <= 1; k++) {
        ctx.fillStyle = flav[k + 1];
        ctx.beginPath();
        ctx.arc(ix2 + k * 26, GROUND_Y - 86, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(ix2 + k * 26, GROUND_Y - 74);
        ctx.lineTo(ix2 + k * 26 - 10, GROUND_Y - 90);
        ctx.lineTo(ix2 + k * 26 + 10, GROUND_Y - 90);
        ctx.closePath();
        ctx.fill();
      }
      // Spotlight sprinkles
      drawFallingStreaks(ctx, t, viewW, viewH, 22, "rgba(255,160,200,0.5)", 22, 6);
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Ice cream cone with strawberry scoop
      ctx.save();
      ctx.shadowColor = "rgba(255,200,225,0.8)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#e8b56a";
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, -r * 0.05);
      ctx.lineTo(r * 0.5, -r * 0.05);
      ctx.lineTo(0, r);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(120,70,20,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-r * 0.3, r * 0.25);
      ctx.lineTo(r * 0.1, -r * 0.02);
      ctx.moveTo(-r * 0.05, r * 0.6);
      ctx.lineTo(r * 0.32, r * 0.12);
      ctx.stroke();
      ctx.fillStyle = "#ffb0d0";
      ctx.beginPath();
      ctx.arc(0, -r * 0.4, r * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff0f8";
      ctx.beginPath();
      ctx.arc(-r * 0.15, -r * 0.55, r * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
}

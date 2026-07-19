// World: cyber
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
      // Grid + neon city silhouette + raining data streams
      ctx.save();
      ctx.strokeStyle = "rgba(0,255,200,0.12)";
      ctx.lineWidth = 1;
      const go = (game.distance * 0.3) % 40;
      for (let x = -go; x < viewW; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, GROUND_Y * 0.5);
        ctx.lineTo(x, GROUND_Y);
        ctx.stroke();
      }
      for (let y = GROUND_Y * 0.5; y < GROUND_Y; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(viewW, y);
        ctx.stroke();
      }
      ctx.restore();
      drawTowerRow(ctx, GROUND_Y, "rgba(5,25,25,0.85)", 0.05, 40);
      // Neon contours on some towers
      ctx.save();
      ctx.strokeStyle = "rgba(0,255,204,0.4)";
      ctx.lineWidth = 1.5;
      const scroll3 = game.distance * 0.05;
      const so = scroll3 % 90;
      const colBase3 = Math.floor(scroll3 / 90) * 90; // stable shape on wrap
      for (let bx = -90; bx < viewW; bx += 90) {
        const x = bx - so;
        const h = 60 + Math.abs(Math.sin((bx + colBase3) * 0.03)) * 120;
        ctx.strokeRect(x, GROUND_Y - h, 40, h);
      }
      ctx.restore();
      drawFallingStreaks(ctx, t, viewW, viewH, 28, "rgba(0,255,200,0.25)", 45, 20);
      drawShootingStar(ctx, t, 14, 0, "rgba(0,255,200,0.9)", viewH * 0.1, viewH * 0.5);
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Circuit board chip with legs and glowing core
      ctx.save();
      ctx.shadowColor = "rgba(0,255,200,0.9)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#0a2a2a";
      ctx.fillRect(-r * 0.6, -r * 0.6, r * 1.2, r * 1.2);
      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 1.6;
      ctx.strokeRect(-r * 0.6, -r * 0.6, r * 1.2, r * 1.2);
      ctx.beginPath();
      for (let k = -1; k <= 1; k++) {
        ctx.moveTo(k * r * 0.35, -r * 0.6);
        ctx.lineTo(k * r * 0.35, -r * 0.95);
        ctx.moveTo(k * r * 0.35, r * 0.6);
        ctx.lineTo(k * r * 0.35, r * 0.95);
      }
      ctx.stroke();
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(-r * 0.2, -r * 0.2, r * 0.4, r * 0.4);
      ctx.restore();
}

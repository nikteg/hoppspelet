// World: troll
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
      drawJaggedSilhouette(ctx, GROUND_Y - 25, 110, 240, 260, "rgba(15,20,24,0.55)", 0.03);
      drawJaggedSilhouette(ctx, GROUND_Y - 25, 90, 220, 230, "rgba(20,25,28,0.7)", 0.045);
      // Stone bridge over a chasm
      const bx = viewW * 0.6;
      ctx.save();
      ctx.strokeStyle = "rgba(30,38,42,0.8)";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(bx, GROUND_Y + 30, 70, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      ctx.restore();
      // Sleeping troll (round stone with eyes)
      const trx = viewW * 0.3;
      ctx.fillStyle = "rgba(45,55,60,0.7)";
      ctx.beginPath();
      ctx.arc(trx, GROUND_Y - 20, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(180,200,80,0.6)";
      ctx.beginPath();
      ctx.arc(trx - 8, GROUND_Y - 26, 3, 0, Math.PI * 2);
      ctx.arc(trx + 8, GROUND_Y - 26, 3, 0, Math.PI * 2);
      ctx.fill();
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Runestone
      ctx.save();
      ctx.shadowColor = "rgba(180,220,220,0.7)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#8a9aa0";
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, r * 0.8);
      ctx.lineTo(-r * 0.7, -r * 0.4);
      ctx.lineTo(0, -r * 0.9);
      ctx.lineTo(r * 0.65, -r * 0.35);
      ctx.lineTo(r * 0.6, r * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#2c3a40";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.5);
      ctx.lineTo(0, r * 0.45);
      ctx.moveTo(0, -r * 0.15);
      ctx.lineTo(r * 0.3, -r * 0.45);
      ctx.moveTo(0, r * 0.05);
      ctx.lineTo(r * 0.3, -r * 0.25);
      ctx.stroke();
      ctx.restore();
}

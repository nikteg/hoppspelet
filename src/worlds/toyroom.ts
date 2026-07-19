// World: toyroom
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
  // Building blocks, spinning top, bouncy ball and a teddy bear silhouette
  const colors2 = ["#ff5a5a", "#5ab4ff", "#ffe066", "#6fce7a", "#ff8ad0"];
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = colors2[i % 5];
    const bx = viewW * 0.5 + i * 30;
    ctx.fillRect(bx, GROUND_Y - 26 - (i % 3) * 26, 24, 26);
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, GROUND_Y - 26 - (i % 3) * 26, 24, 26);
  }
  // Spinning top
  ctx.save();
  ctx.translate(viewW * 0.25, GROUND_Y - 16);
  ctx.rotate(t * 6);
  ctx.fillStyle = "rgba(255,90,140,0.7)";
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(12, 6);
  ctx.lineTo(-12, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  // Bouncy ball
  const ballx = viewW * 0.4;
  const bally = GROUND_Y - Math.abs(Math.sin(t * 3)) * 90 - 10;
  ctx.fillStyle = "rgba(90,180,255,0.8)";
  ctx.beginPath();
  ctx.arc(ballx, bally, 12, 0, Math.PI * 2);
  ctx.fill();
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawDieCoin } from "../coins/diecoin.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawDieCoin(ctx, r);
}

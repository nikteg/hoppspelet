// World: dino
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
  drawJaggedSilhouette(ctx, GROUND_Y - 25, 70, 190, 230, "rgba(20,35,10,0.8)", 0.045);
  const dx = Math.max(360, viewW * 0.66);
  ctx.fillStyle = "rgba(20,30,10,0.7)";
  ctx.beginPath();
  ctx.ellipse(dx, GROUND_Y - 30, 45, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(dx + 30, GROUND_Y - 45);
  ctx.quadraticCurveTo(dx + 70, GROUND_Y - 110, dx + 60, GROUND_Y - 140);
  ctx.lineTo(dx + 50, GROUND_Y - 135);
  ctx.quadraticCurveTo(dx + 60, GROUND_Y - 100, dx + 25, GROUND_Y - 55);
  ctx.closePath();
  ctx.fill();

  // Pterodactyls flying over the valley
  for (let i = 0; i < 2; i++) {
    const spd = 22 + i * 8;
    const px2 = ((t * spd + i * 320) % (viewW + 100)) - 50;
    const py2 = viewH * 0.18 + i * 25;
    drawBird(ctx, px2, py2, 13, t, i * 3, "rgba(30,25,10,0.7)");
  }

  // Ferns in the foreground
  for (let i = 0; i < 3; i++) {
    const fx2 = Math.max(360, viewW * (0.4 + i * 0.08));
    ctx.save();
    ctx.strokeStyle = "rgba(30,60,15,0.6)";
    ctx.lineWidth = 3;
    for (let leaf = -2; leaf <= 2; leaf++) {
      ctx.beginPath();
      ctx.moveTo(fx2, GROUND_Y);
      ctx.quadraticCurveTo(fx2 + leaf * 8, GROUND_Y - 20, fx2 + leaf * 16, GROUND_Y - 5);
      ctx.stroke();
    }
    ctx.restore();
  }
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawFossilCoin } from "../coins/fossil.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawFossilCoin(ctx, r);
}

// World: beach
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
  // Palm trees, sun, sailboat on waves, sandcastle
  ctx.save();
  ctx.shadowColor = "rgba(255,240,180,0.7)";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "rgba(255,245,200,0.9)";
  ctx.beginPath();
  ctx.arc(viewW * 0.8, viewH * 0.2, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  for (let k = 0; k < 2; k++) {
    const px3 = viewW * (0.18 + k * 0.1);
    ctx.strokeStyle = "rgba(90,60,25,0.6)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(px3, GROUND_Y);
    ctx.quadraticCurveTo(px3 + 10, GROUND_Y - 40, px3 + 6, GROUND_Y - 70);
    ctx.stroke();
    ctx.fillStyle = "rgba(60,130,50,0.6)";
    for (let f = -2; f <= 2; f++) {
      ctx.beginPath();
      ctx.ellipse(px3 + 6 + f * 8, GROUND_Y - 72, 16, 6, f * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Sailboat
  const bx = ((t * 14) % (viewW + 100)) - 50;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.moveTo(bx, viewH * 0.42);
  ctx.lineTo(bx, viewH * 0.32);
  ctx.lineTo(bx + 18, viewH * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(120,70,40,0.7)";
  ctx.fillRect(bx - 12, viewH * 0.42, 30, 5);
  // Sandcastle
  ctx.fillStyle = "rgba(220,190,130,0.7)";
  const scx = viewW * 0.4;
  ctx.fillRect(scx - 20, GROUND_Y - 20, 40, 20);
  ctx.fillRect(scx - 24, GROUND_Y - 28, 8, 8);
  ctx.fillRect(scx + 16, GROUND_Y - 28, 8, 8);
  // Waves
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  const wo = (t * 8) % 60;
  ctx.beginPath();
  for (let x = -wo; x <= viewW; x += 60) {
    ctx.moveTo(x, GROUND_Y - 8);
    ctx.quadraticCurveTo(x + 30, GROUND_Y - 14, x + 60, GROUND_Y - 8);
  }
  ctx.stroke();
  ctx.restore();
}

import { drawStripedBallCoin } from "../coins/stripedball.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawStripedBallCoin(ctx, r, ["#ff5a5a", "#ffe24a", "#5ab4ff", "#ffffff"]);
}

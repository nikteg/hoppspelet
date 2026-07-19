// World: mermaid
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
  // Seashell palace with towers
  const px = viewW * 0.62;
  ctx.save();
  ctx.fillStyle = "rgba(255,200,235,0.5)";
  for (let k = -1; k <= 1; k++) {
    const tx = px + k * 55;
    const th = 90 - Math.abs(k) * 25;
    ctx.beginPath();
    ctx.moveTo(tx - 18, GROUND_Y);
    ctx.quadraticCurveTo(tx - 12, GROUND_Y - th, tx, GROUND_Y - th - 14);
    ctx.quadraticCurveTo(tx + 12, GROUND_Y - th, tx + 18, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  // Light rays
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#bff0ff";
  for (let i = 0; i < 3; i++) {
    const sx = (viewW / 3) * i + ((t * 6) % viewW);
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx + 40, 0);
    ctx.lineTo(sx - 30, GROUND_Y);
    ctx.lineTo(sx - 80, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  for (let i = 0; i < 3; i++) {
    const spd = 12 + i * 4;
    const x = viewW + 60 - ((t * spd + i * 250) % (viewW + 280));
    drawFish(ctx, x, viewH * 0.3 + i * 50, 8, "rgba(255,190,230,0.6)", t, i * 2);
  }
}

import { drawShellCoin } from "../coins/shell.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawShellCoin(ctx, r, "#ffb8e0");
}

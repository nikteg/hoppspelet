// World: circus
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
  // Large striped circus tent with flags + acrobat on a wire
  const cx3 = viewW * 0.6;
  ctx.save();
  ctx.fillStyle = "rgba(220,220,220,0.6)";
  ctx.beginPath();
  ctx.moveTo(cx3 - 90, GROUND_Y);
  ctx.quadraticCurveTo(cx3, GROUND_Y - 120, cx3 + 90, GROUND_Y);
  ctx.closePath();
  ctx.clip();
  for (let s = -90; s < 90; s += 24) {
    ctx.fillStyle =
      Math.floor((s + 90) / 24) % 2 === 0 ? "rgba(200,60,70,0.6)" : "rgba(240,240,240,0.6)";
    ctx.fillRect(cx3 + s, GROUND_Y - 130, 24, 130);
  }
  ctx.restore();
  drawWavingBanner(ctx, cx3, GROUND_Y - 122, 18, 10, "rgba(255,224,102,0.8)", t, 0);
  // Side towers
  for (let k = -1; k <= 1; k += 2) {
    ctx.fillStyle = "rgba(200,60,70,0.5)";
    ctx.beginPath();
    ctx.moveTo(cx3 + k * 90 - 20, GROUND_Y);
    ctx.lineTo(cx3 + k * 90, GROUND_Y - 60);
    ctx.lineTo(cx3 + k * 90 + 20, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }
  // Tightrope walker in front
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(viewW * 0.1, viewH * 0.3);
  ctx.lineTo(viewW * 0.45, viewH * 0.3);
  ctx.stroke();
  const ax = viewW * (0.1 + ((t * 0.05) % 0.35));
  ctx.fillStyle = "rgba(30,30,40,0.6)";
  ctx.beginPath();
  ctx.arc(ax, viewH * 0.3 - 8, 5, 0, Math.PI * 2);
  ctx.fill();
}

import { drawStripedBallCoin } from "../coins/stripedball.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawStripedBallCoin(ctx, r, ["#e0325c", "#ffffff"]);
}

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

import { drawIceCreamCoin } from "../coins/icecreamcoin.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawIceCreamCoin(ctx, r);
}

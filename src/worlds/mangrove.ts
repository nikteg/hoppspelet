// World: mangrove
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
  drawJaggedSilhouette(ctx, GROUND_Y - 15, 50, 150, 200, "rgba(10,25,15,0.6)", 0.045);
  // Mangrove tree with prop roots above the waterline
  for (let k = 0; k < 2; k++) {
    const mx = Math.max(340, viewW * (0.4 + k * 0.25));
    ctx.save();
    ctx.strokeStyle = "rgba(25,45,20,0.7)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(mx, GROUND_Y - 70);
    ctx.lineTo(mx, GROUND_Y);
    ctx.stroke();
    ctx.lineWidth = 3;
    for (let r = -2; r <= 2; r++) {
      if (r === 0) continue;
      ctx.beginPath();
      ctx.moveTo(mx, GROUND_Y - 40);
      ctx.quadraticCurveTo(mx + r * 14, GROUND_Y - 15, mx + r * 22, GROUND_Y);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(30,70,25,0.6)";
    ctx.beginPath();
    ctx.arc(mx, GROUND_Y - 82, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  for (let i = 0; i < 3; i++) {
    drawHangingVine(ctx, viewW * (0.2 + i * 0.3), 0, 70, t, i * 2, "rgba(20,40,15,0.6)");
  }
}

import { drawWispCoin } from "../coins/wisp.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawWispCoin(ctx, r, "rgba(170,255,140,0.95)");
}

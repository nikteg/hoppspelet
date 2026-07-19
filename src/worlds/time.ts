// World: time
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
  // Multiple floating clocks in different sizes + drifting roman numerals
  const clocks = [
    { x: 0.75, y: 0.25, r: 44 },
    { x: 0.35, y: 0.18, r: 26 },
    { x: 0.55, y: 0.4, r: 18 },
  ];
  for (const c of clocks) {
    const cx = viewW * c.x,
      cy = viewH * c.y,
      r = c.r;
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = "rgba(255,224,160,0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    for (let m = 0; m < 12; m++) {
      const a = (Math.PI * 2 * m) / 12;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r * 0.85, cy + Math.sin(a) * r * 0.85);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(t * 2) * r * 0.6, cy + Math.sin(t * 2) * r * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(t * 0.3) * r * 0.85, cy + Math.sin(t * 0.3) * r * 0.85);
    ctx.stroke();
    ctx.restore();
  }
  // (The spinning gear at the ground was removed: it drew attention
  // from real obstacles and could itself be mistaken for one.)
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawHourglassCoin } from "../coins/hourglass.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawHourglassCoin(ctx, r);
}

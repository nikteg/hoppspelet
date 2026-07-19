// World: lava
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawJaggedSilhouette } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 30, 50, 140, 220, "rgba(20,6,8,0.9)", 0.05);
  const craterX = viewW * 0.75;
  const craterY = GROUND_Y - 175;

  // Smoke rising from the volcano
  for (let i = 0; i < 4; i++) {
    const cycle = 10;
    const localT = (t * 0.6 + i * 2.5) % cycle;
    const p = localT / cycle;
    ctx.save();
    ctx.globalAlpha = (1 - p) * 0.3;
    ctx.fillStyle = "rgba(90,80,80,0.8)";
    ctx.beginPath();
    ctx.arc(craterX + Math.sin(i * 2) * 8, craterY - p * 150, 8 + p * 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Glowing crater, with periodic eruptions
  const eruptCycle = 24;
  const eruptPhase = (t % eruptCycle) / eruptCycle;
  const eruptBurst = eruptPhase < 0.08 ? 1 - eruptPhase / 0.08 : 0;
  ctx.save();
  ctx.shadowColor = "rgba(255,140,40,0.9)";
  ctx.shadowBlur = 25 + eruptBurst * 30;
  ctx.fillStyle = "rgba(255,150,60,0.6)";
  ctx.beginPath();
  ctx.arc(craterX, craterY, 9 + eruptBurst * 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // A more distant volcano in the background
  const smallVolcX = viewW * 0.4;
  ctx.fillStyle = "rgba(15,5,8,0.7)";
  ctx.beginPath();
  ctx.moveTo(smallVolcX - 35, GROUND_Y - 30);
  ctx.lineTo(smallVolcX, GROUND_Y - 100);
  ctx.lineTo(smallVolcX + 35, GROUND_Y - 30);
  ctx.closePath();
  ctx.fill();

  // Glowing ash/stone debris drifting downward
  for (let i = 0; i < 5; i++) {
    const cycle = 12;
    const localT = (t * 0.4 + i * 2.2) % cycle;
    const p = localT / cycle;
    const ax = (i * 240 + 60) % viewW;
    ctx.save();
    ctx.globalAlpha = (1 - p) * 0.5;
    ctx.fillStyle = "rgba(255,120,50,0.7)";
    ctx.fillRect(ax, viewH * 0.1 + p * viewH * 0.4, 4, 4);
    ctx.restore();
  }
}

import { drawMagmaCoin } from "../coins/magma.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawMagmaCoin(ctx, r, "#ff9a3a");
}

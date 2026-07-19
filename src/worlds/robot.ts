// World: robot
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
  const fx = Math.max(340, viewW * 0.65);
  ctx.fillStyle = "rgba(20,20,25,0.85)";
  ctx.fillRect(fx - 70, GROUND_Y - 90, 140, 90);
  ctx.fillRect(fx - 50, GROUND_Y - 140, 18, 60);
  ctx.fillRect(fx + 30, GROUND_Y - 160, 18, 80);
  for (let i = 0; i < 3; i++) {
    const cycle = 8;
    const p = ((t * 0.5 + i * 2) % cycle) / cycle;
    ctx.save();
    ctx.globalAlpha = (1 - p) * 0.3;
    ctx.fillStyle = "rgba(120,120,120,0.7)";
    ctx.beginPath();
    ctx.arc(fx + 39, GROUND_Y - 160 - p * 90, 8 + p * 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.save();
  ctx.translate(fx, GROUND_Y - 45);
  ctx.rotate(t * 0.3);
  ctx.fillStyle = "rgba(255,191,63,0.5)";
  drawGearSpike(ctx, { x: -22, y: -22, w: 44, h: 44 });
  ctx.restore();

  // Flying drones with blinking lights
  for (let i = 0; i < 2; i++) {
    const spd = 20 + i * 10;
    const dx2 = ((t * spd + i * 300) % (viewW + 100)) - 50;
    const dy2 = viewH * (0.2 + i * 0.12);
    ctx.save();
    ctx.fillStyle = "rgba(80,80,90,0.8)";
    ctx.fillRect(dx2 - 8, dy2 - 3, 16, 6);
    const blink = Math.sin(t * 5 + i * 3) > 0;
    ctx.fillStyle = blink ? "rgba(255,60,60,0.9)" : "rgba(60,20,20,0.5)";
    ctx.beginPath();
    ctx.arc(dx2, dy2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Electric arc flashes on the facade
  const arcCycle = 3;
  const arcPhase = (t % arcCycle) / arcCycle;
  if (arcPhase < 0.15) {
    ctx.save();
    ctx.strokeStyle = "rgba(150,220,255,0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fx - 70, GROUND_Y - 70);
    ctx.lineTo(fx - 55, GROUND_Y - 60);
    ctx.lineTo(fx - 62, GROUND_Y - 50);
    ctx.lineTo(fx - 45, GROUND_Y - 40);
    ctx.stroke();
    ctx.restore();
  }
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

import { drawGearCoin } from "../coins/gearcoin.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawGearCoin(ctx, r);
}

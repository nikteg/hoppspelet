// World: viking
import type { Ctx } from "../types.js";
import { viewW, viewH, GROUND_Y } from "../stage.js";
import { drawBird, drawJaggedSilhouette } from "../render-helpers.js";

export function drawScenery(ctx: Ctx, t: number) {
  drawJaggedSilhouette(ctx, GROUND_Y - 20, 80, 200, 240, "rgba(20,40,50,0.7)", 0.045);
  const shipX = Math.max(340, viewW * 0.68);
  const shipY = GROUND_Y - 40;
  ctx.fillStyle = "rgba(15,12,10,0.75)";
  ctx.beginPath();
  ctx.moveTo(shipX - 40, shipY);
  ctx.quadraticCurveTo(shipX, shipY + 14, shipX + 40, shipY);
  ctx.lineTo(shipX + 30, shipY - 10);
  ctx.lineTo(shipX - 30, shipY - 10);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(15,12,10,0.75)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(shipX, shipY - 10);
  ctx.lineTo(shipX, shipY - 55);
  ctx.stroke();

  // A second, smaller ship further back
  const ship2X = viewW * 0.4;
  const ship2Y = GROUND_Y - 25;
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "rgba(15,12,10,0.75)";
  ctx.beginPath();
  ctx.moveTo(ship2X - 25, ship2Y);
  ctx.quadraticCurveTo(ship2X, ship2Y + 8, ship2X + 25, ship2Y);
  ctx.lineTo(ship2X + 18, ship2Y - 6);
  ctx.lineTo(ship2X - 18, ship2Y - 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Ravens flying
  for (let i = 0; i < 2; i++) {
    const spd = 18 + i * 6;
    const rx = ((t * spd + i * 300) % (viewW + 100)) - 50;
    const ry = viewH * 0.15 + i * 20;
    drawBird(ctx, rx, ry, 7, t, i * 4, "rgba(10,10,10,0.7)");
  }

  // Village huts by the fjord
  const villageX = viewW * 0.2;
  ctx.fillStyle = "rgba(40,30,20,0.6)";
  ctx.fillRect(villageX - 20, GROUND_Y - 30, 40, 30);
  ctx.beginPath();
  ctx.moveTo(villageX - 25, GROUND_Y - 30);
  ctx.lineTo(villageX, GROUND_Y - 50);
  ctx.lineTo(villageX + 25, GROUND_Y - 30);
  ctx.closePath();
  ctx.fill();
}

import { drawRuneCoin } from "../coins/rune.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawRuneCoin(ctx, r);
}

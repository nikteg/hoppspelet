// World: desert
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
      drawJaggedSilhouette(ctx, GROUND_Y - 15, 40, 100, 260, "rgba(150,90,30,0.5)", 0.04);
      ctx.save();
      ctx.shadowColor = "rgba(255,230,150,0.9)";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "rgba(255,240,190,0.9)";
      ctx.beginPath();
      ctx.arc(viewW * 0.82, viewH * 0.18, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      const px = Math.max(340, viewW * 0.65);
      ctx.fillStyle = "rgba(120,70,25,0.7)";
      ctx.beginPath();
      ctx.moveTo(px - 55, GROUND_Y);
      ctx.lineTo(px, GROUND_Y - 95);
      ctx.lineTo(px + 55, GROUND_Y);
      ctx.closePath();
      ctx.fill();

      // Camel caravan wandering in the distance
      ctx.save();
      ctx.fillStyle = "rgba(90,55,20,0.6)";
      for (let i = 0; i < 3; i++) {
        const cx2 = viewW * 0.42 + i * 30;
        const bob = Math.sin(t * 3 + i) * 2;
        ctx.beginPath();
        ctx.ellipse(cx2, GROUND_Y - 12 + bob, 12, 8, 0, 0, Math.PI * 2);
        ctx.ellipse(cx2 + 8, GROUND_Y - 20 + bob, 6, 7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Rolling desert tumbleweeds
      const tumbleX = viewW - ((t * 40) % (viewW + 60)) - 30;
      ctx.save();
      ctx.translate(tumbleX, GROUND_Y - 8);
      ctx.rotate(t * 4);
      ctx.strokeStyle = "rgba(100,70,30,0.7)";
      ctx.lineWidth = 2;
      for (let a = 0; a < 6; a++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos((Math.PI / 3) * a) * 8, Math.sin((Math.PI / 3) * a) * 8);
        ctx.stroke();
      }
      ctx.restore();

      // Oasis with palms far away
      const oasisX = viewW * 0.2;
      ctx.fillStyle = "rgba(80,50,15,0.6)";
      ctx.fillRect(oasisX - 2, GROUND_Y - 45, 4, 45);
      ctx.fillStyle = "rgba(60,110,40,0.6)";
      ctx.beginPath();
      ctx.ellipse(oasisX - 10, GROUND_Y - 48, 12, 6, 0.3, 0, Math.PI * 2);
      ctx.ellipse(oasisX + 10, GROUND_Y - 48, 12, 6, -0.3, 0, Math.PI * 2);
      ctx.fill();
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      ctx.save();
      ctx.shadowColor = "rgba(255,220,120,0.9)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#e8c26a";
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.9, r * 0.7);
      ctx.lineTo(-r * 0.9, r * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(140,90,20,0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(0, r * 0.7);
      ctx.stroke();
      ctx.restore();
}

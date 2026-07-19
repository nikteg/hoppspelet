// World: carnival
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
      // Ferris wheel + carnival tent + string lights
      const fx2 = viewW * 0.68,
        fy2 = viewH * 0.38,
        fr = 50;
      ctx.save();
      ctx.translate(fx2, fy2);
      ctx.strokeStyle = "rgba(255,224,102,0.7)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, fr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.save();
      ctx.rotate(t * 0.15);
      for (let i = 0; i < 8; i++) {
        const a = ((Math.PI * 2) / 8) * i;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * fr, Math.sin(a) * fr);
        ctx.stroke();
        // gondolas
        ctx.fillStyle = ["#ff5a5a", "#5ab4ff", "#ffe066", "#6fce7a"][i % 4];
        ctx.beginPath();
        ctx.arc(Math.cos(a) * fr, Math.sin(a) * fr, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.restore();
      // Supports
      ctx.strokeStyle = "rgba(120,110,90,0.5)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(fx2 - 20, GROUND_Y);
      ctx.lineTo(fx2, fy2);
      ctx.lineTo(fx2 + 20, GROUND_Y);
      ctx.stroke();
      // Carnival tent
      const tx = viewW * 0.25;
      for (let k = -1; k <= 1; k += 2) {
        ctx.fillStyle = k < 0 ? "rgba(230,80,90,0.55)" : "rgba(240,240,240,0.5)";
        ctx.beginPath();
        ctx.moveTo(tx - 40, GROUND_Y);
        ctx.lineTo(tx, GROUND_Y - 40);
        ctx.lineTo(tx + 40, GROUND_Y);
        ctx.closePath();
        if (k < 0) {
          ctx.save();
          ctx.clip();
          for (let s = -40; s < 40; s += 16) {
            ctx.fillRect(tx + s, GROUND_Y - 40, 8, 40);
          }
          ctx.restore();
        } else ctx.fill();
      }
      // String lights up top
      ctx.save();
      for (let i = 0; i < 12; i++) {
        const lx = i * 110 + 40 - ((game.distance * 0.03) % 110);
        drawLantern(
          ctx,
          lx,
          30 + Math.sin(i) * 8,
          ["rgba(255,90,90,0.9)", "rgba(90,180,255,0.9)", "rgba(255,224,102,0.9)"][i % 3],
          t,
          i,
        );
      }
      ctx.restore();
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Pink balloon with highlight and string
      ctx.save();
      ctx.shadowColor = "rgba(255,150,230,0.9)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#ff5ac0";
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.15, r * 0.65, r * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath();
      ctx.ellipse(-r * 0.25, -r * 0.4, r * 0.16, r * 0.24, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.65);
      ctx.quadraticCurveTo(r * 0.2, r * 0.85, 0, r * 1.05);
      ctx.stroke();
      ctx.restore();
}

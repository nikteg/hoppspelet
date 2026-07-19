// World: savanna
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
      drawJaggedSilhouette(ctx, GROUND_Y - 10, 30, 70, 200, "rgba(60,45,15,0.5)", 0.05);
      // Big low-hanging sun with heat shimmer
      ctx.save();
      ctx.shadowColor = "rgba(255,220,140,0.8)";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "rgba(255,225,150,0.85)";
      ctx.beginPath();
      ctx.arc(viewW * 0.78, viewH * 0.22, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // Birds in V-formation
      for (let i = 0; i < 5; i++) {
        const spd = 14;
        const lead = ((t * spd) % (viewW + 200)) - 100;
        const bx2 = lead - Math.abs(i - 2) * 22;
        const by2 = viewH * 0.16 + Math.abs(i - 2) * 12;
        drawBird(ctx, bx2, by2, 8, t, i, "rgba(40,30,15,0.7)");
      }
      // Acacia trees with flat canopies
      for (let k = 0; k < 2; k++) {
        const ax = Math.max(340, viewW * (0.55 + k * 0.2));
        ctx.save();
        ctx.strokeStyle = "rgba(50,35,15,0.7)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(ax, GROUND_Y);
        ctx.lineTo(ax, GROUND_Y - 55);
        ctx.stroke();
        ctx.fillStyle = "rgba(70,90,40,0.7)";
        ctx.beginPath();
        ctx.ellipse(ax, GROUND_Y - 62, 46, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Giraffe silhouette
      const gx = viewW * 0.35;
      ctx.fillStyle = "rgba(50,35,15,0.55)";
      ctx.fillRect(gx, GROUND_Y - 70, 8, 70);
      ctx.beginPath();
      ctx.ellipse(gx + 12, GROUND_Y - 35, 20, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(gx + 26, GROUND_Y - 45, 6, 45);
      ctx.fillRect(gx + 2, GROUND_Y - 78, 5, 14);
}

import { sharedCoin_savanna } from "./_shared.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
  sharedCoin_savanna(ctx, r, "savanna");
}

// World: volcanoisland
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
      drawJaggedSilhouette(ctx, GROUND_Y - 10, 20, 50, 200, "rgba(20,10,10,0.5)", 0.05);
      const vx = viewW * 0.7;
      ctx.fillStyle = "rgba(40,15,10,0.7)";
      ctx.beginPath();
      ctx.moveTo(vx - 60, GROUND_Y);
      ctx.lineTo(vx, GROUND_Y - 130);
      ctx.lineTo(vx + 60, GROUND_Y);
      ctx.closePath();
      ctx.fill();
      // Smoke + lava fountain
      for (let i = 0; i < 4; i++) {
        const cyc = 12;
        const p = ((t * 0.5 + i * 3) % cyc) / cyc;
        ctx.save();
        ctx.globalAlpha = (1 - p) * 0.3;
        ctx.fillStyle = "rgba(80,70,70,0.8)";
        ctx.beginPath();
        ctx.arc(vx + Math.sin(i) * 10, GROUND_Y - 130 - p * 120, 10 + p * 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.save();
      ctx.shadowColor = "rgba(255,140,50,0.9)";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "rgba(255,150,60,0.8)";
      ctx.beginPath();
      ctx.arc(vx, GROUND_Y - 128, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // Palm trees on the beach
      for (let k = 0; k < 2; k++) {
        const px2 = viewW * (0.2 + k * 0.12);
        ctx.strokeStyle = "rgba(40,25,10,0.6)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(px2, GROUND_Y);
        ctx.quadraticCurveTo(px2 + 8, GROUND_Y - 40, px2 + 4, GROUND_Y - 60);
        ctx.stroke();
        ctx.fillStyle = "rgba(40,90,40,0.6)";
        for (let f = -2; f <= 2; f++) {
          ctx.beginPath();
          ctx.ellipse(px2 + 4 + f * 8, GROUND_Y - 62, 16, 5, f * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
}

import { sharedCoin_lava } from "./_shared.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
  sharedCoin_lava(ctx, r, "volcanoisland");
}

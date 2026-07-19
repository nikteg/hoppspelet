// World: pirate
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
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = "#dff4ff";
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const wy = GROUND_Y - 20 - i * 14;
        const wOffset = (t * (6 + i * 2)) % 60;
        ctx.beginPath();
        for (let x = -wOffset; x <= viewW; x += 60) {
          ctx.moveTo(x, wy);
          ctx.quadraticCurveTo(x + 30, wy - 8, x + 60, wy);
        }
        ctx.stroke();
      }
      ctx.restore();
      const sx = Math.max(340, viewW * 0.68);
      const sy = GROUND_Y - 35;
      ctx.fillStyle = "rgba(10,10,10,0.7)";
      ctx.beginPath();
      ctx.moveTo(sx - 40, sy);
      ctx.quadraticCurveTo(sx, sy + 12, sx + 40, sy);
      ctx.lineTo(sx + 30, sy - 12);
      ctx.lineTo(sx - 30, sy - 12);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(sx, sy - 12);
      ctx.lineTo(sx, sy - 60);
      ctx.lineTo(sx + 25, sy - 30);
      ctx.closePath();
      ctx.fill();

      // Seagulls flying
      for (let i = 0; i < 3; i++) {
        const spd = 18 + i * 7;
        const gx2 = ((t * spd + i * 260) % (viewW + 100)) - 50;
        const gy2 = viewH * 0.15 + i * 20;
        drawBird(ctx, gx2, gy2, 7, t, i * 4, "rgba(255,255,255,0.75)");
      }

      // Treasure chest on the beach
      drawGroundProp(ctx, Math.max(400, viewW * 0.45), GROUND_Y, "chest", "rgba(90,55,20,0.7)");

      // Distant island with palm tree
      const islandX = viewW * 0.22;
      ctx.fillStyle = "rgba(180,160,100,0.5)";
      ctx.beginPath();
      ctx.ellipse(islandX, GROUND_Y - 3, 40, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(80,50,15,0.6)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(islandX, GROUND_Y - 5);
      ctx.lineTo(islandX + 5, GROUND_Y - 35);
      ctx.stroke();
      ctx.fillStyle = "rgba(50,110,40,0.6)";
      ctx.beginPath();
      ctx.ellipse(islandX - 8, GROUND_Y - 38, 10, 5, 0.3, 0, Math.PI * 2);
      ctx.ellipse(islandX + 14, GROUND_Y - 38, 10, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();
}

import { sharedCoin_pirate } from "./_shared.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
  sharedCoin_pirate(ctx, r, "pirate");
}

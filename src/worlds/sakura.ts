// World: sakura
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
      // Multiple cherry trees + pagoda + falling petals
      for (let k = 0; k < 2; k++) {
        const tx2 = viewW * (0.45 + k * 0.28);
        ctx.save();
        ctx.translate(tx2, GROUND_Y);
        ctx.rotate(Math.sin(t * 0.3 + k) * 0.02);
        ctx.strokeStyle = "rgba(60,35,30,0.8)";
        ctx.lineWidth = 8 - k * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -80 + k * 15);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,190,215,0.75)";
        ctx.beginPath();
        ctx.arc(0, -100 + k * 15, 45 - k * 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Pagod
      const pgx = viewW * 0.2;
      ctx.fillStyle = "rgba(140,40,50,0.5)";
      for (let r = 0; r < 3; r++) {
        const w = 46 - r * 12;
        ctx.fillRect(pgx - w / 2, GROUND_Y - 30 - r * 26, w, 16);
        ctx.beginPath();
        ctx.moveTo(pgx - w / 2 - 6, GROUND_Y - 30 - r * 26);
        ctx.lineTo(pgx, GROUND_Y - 40 - r * 26);
        ctx.lineTo(pgx + w / 2 + 6, GROUND_Y - 30 - r * 26);
        ctx.closePath();
        ctx.fill();
      }
      // Falling petals
      for (let i = 0; i < 14; i++) {
        const seed = i * 90;
        const x = ((seed * 2.3) % viewW) + Math.sin(t + i) * 20;
        const y = ((t * 15 + seed) % (viewH + 40)) - 20;
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "rgba(255,190,215,0.9)";
        ctx.beginPath();
        ctx.ellipse(x, y, 4, 2.5, i, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
}

import { sharedCoin_sakura } from "./_shared.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
  sharedCoin_sakura(ctx, r, "sakura");
}

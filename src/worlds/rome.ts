// World: rome
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
      // Colosseum archways + colonnade
      const rx = Math.max(360, viewW * 0.62);
      ctx.fillStyle = "rgba(200,170,120,0.6)";
      ctx.fillRect(rx - 80, GROUND_Y - 90, 160, 90);
      ctx.fillStyle = "rgba(90,50,15,0.55)";
      for (let row = 0; row < 2; row++) {
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(rx - 64 + i * 32, GROUND_Y - 30 - row * 34, 12, Math.PI, 0);
          ctx.fill();
          ctx.fillRect(rx - 76 + i * 32, GROUND_Y - 30 - row * 34, 4, 30);
        }
      }
      // Free-standing pillars in front
      drawPillar(
        ctx,
        viewW * 0.25,
        GROUND_Y,
        18,
        80,
        "rgba(220,200,160,0.6)",
        "rgba(230,210,170,0.6)",
      );
      drawPillar(
        ctx,
        viewW * 0.33,
        GROUND_Y,
        18,
        64,
        "rgba(215,195,155,0.55)",
        "rgba(225,205,165,0.55)",
      );
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Denarius with laurel wreath
      ctx.save();
      ctx.shadowColor = "rgba(240,230,210,0.8)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#d9d2c0";
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6a8a4a";
      for (const s of [-1, 1]) {
        for (let k = 0; k < 4; k++) {
          const a = Math.PI / 2 - s * (0.4 + k * 0.36);
          ctx.beginPath();
          ctx.ellipse(
            Math.cos(a) * r * 0.58,
            Math.sin(a) * r * 0.58,
            r * 0.16,
            r * 0.09,
            a + Math.PI / 2,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
      ctx.restore();
}

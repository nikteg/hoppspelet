// World: giant
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
      // Giant boot and table legs disappearing upward
      for (let k = 0; k < 2; k++) {
        const lx = viewW * (0.35 + k * 0.4);
        ctx.fillStyle = "rgba(60,40,20,0.6)";
        ctx.fillRect(lx - 30, 0, 60, GROUND_Y);
        ctx.fillStyle = "rgba(75,52,28,0.6)";
        ctx.fillRect(lx - 30, 0, 12, GROUND_Y);
      }
      // Enormous table leg in the back middle
      const gx = Math.max(360, viewW * 0.62);
      ctx.fillStyle = "rgba(50,34,16,0.5)";
      ctx.fillRect(gx - 10, 0, 20, GROUND_Y);
      // Giant ball/toy on the ground
      ctx.fillStyle = "rgba(200,60,60,0.5)";
      ctx.beginPath();
      ctx.arc(viewW * 0.2, GROUND_Y - 40, 40, 0, Math.PI * 2);
      ctx.fill();
}

import { sharedCoin_giant } from "./_shared.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
  sharedCoin_giant(ctx, r, "giant");
}

// World: aztec
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
      // Step pyramid + surrounding jungle + fire bowls
      const ax = viewW * 0.62;
      ctx.fillStyle = "rgba(60,80,35,0.7)";
      for (let i = 0; i < 5; i++) {
        const w = 130 - i * 22;
        ctx.fillRect(ax - w / 2, GROUND_Y - 22 - i * 24, w, 24);
      }
      // stairs
      ctx.fillStyle = "rgba(40,55,20,0.6)";
      ctx.fillRect(ax - 8, GROUND_Y - 120, 16, 120);
      // fire bowls on top
      ctx.save();
      ctx.shadowColor = "rgba(255,140,40,0.9)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "rgba(255,150,50,0.8)";
      ctx.beginPath();
      ctx.arc(ax - 30, GROUND_Y - 124, 4 + Math.sin(t * 4) * 2, 0, Math.PI * 2);
      ctx.arc(ax + 30, GROUND_Y - 124, 4 + Math.cos(t * 4) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      drawSwayingTree(
        ctx,
        viewW * 0.2,
        GROUND_Y,
        50,
        30,
        "rgba(40,30,15,0.6)",
        "rgba(30,70,25,0.6)",
        t,
        1,
      );
}

import { sharedCoin_savanna } from "./_shared.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
  sharedCoin_savanna(ctx, r, "aztec");
}

// World: spring
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
      // Flower meadow, butterflies, rainbow and drifting clouds
      drawDriftingClouds(ctx, t, "rgba(255,255,255,0.5)", 3, viewH * 0.2, 1, 5);
      drawRainbow(ctx, viewW * 0.72, viewH * 0.55, 80);
      const fcols = [
        "rgba(255,150,190,0.75)",
        "rgba(255,230,110,0.75)",
        "rgba(190,150,255,0.75)",
        "rgba(255,255,255,0.75)",
      ];
      for (let i = 0; i < 6; i++) {
        const fx = viewW * (0.15 + i * 0.13);
        drawGroundProp(ctx, fx, GROUND_Y, "flower", fcols[i % 4]);
      }
      for (let i = 0; i < 3; i++) {
        drawFlutterfly(
          ctx,
          ((t * (7 + i * 2) + i * 300) % (viewW + 100)) - 50,
          viewH * 0.42 + i * 25,
          7,
          t,
          i * 3,
          ["rgba(255,140,190,0.8)", "rgba(140,210,255,0.8)", "rgba(255,220,120,0.8)"][i],
        );
      }
}

import { sharedCoin_sakura } from "./_shared.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
  sharedCoin_sakura(ctx, r, "spring");
}

// World: reef
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
      drawJaggedSilhouette(ctx, GROUND_Y - 5, 15, 45, 130, "rgba(255,150,180,0.4)", 0.06);
      // Coral formations on the seabed
      const coralCols = ["rgba(255,110,150,0.6)", "rgba(255,180,90,0.6)", "rgba(180,120,255,0.6)"];
      const nCorals = Math.ceil(viewW / 150) + 1; // cover the full width
      for (let i = 0; i < nCorals; i++) {
        const cx = i * 150 + 50 - ((game.distance * 0.05) % 150);
        ctx.save();
        ctx.strokeStyle = coralCols[i % 3];
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        for (let b = -1; b <= 1; b++) {
          ctx.beginPath();
          ctx.moveTo(cx, GROUND_Y);
          ctx.quadraticCurveTo(cx + b * 18, GROUND_Y - 30, cx + b * 26, GROUND_Y - 55);
          ctx.stroke();
        }
        ctx.restore();
      }
      for (let i = 0; i < 4; i++) {
        const spd = 14 + i * 5;
        const x = viewW + 70 - ((t * spd + i * 240) % (viewW + 280));
        drawFish(
          ctx,
          x,
          viewH * 0.28 + i * 45,
          8 + (i % 2) * 3,
          [
            "rgba(255,140,60,0.75)",
            "rgba(120,200,255,0.75)",
            "rgba(255,220,80,0.75)",
            "rgba(255,120,200,0.75)",
          ][i],
          t,
          i * 2,
        );
      }
}

import { sharedCoin_reef } from "./_shared.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
  sharedCoin_reef(ctx, r, "reef");
}

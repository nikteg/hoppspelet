// World: fog
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
  // Multiple fog layers + ghostly tree silhouettes peeking through
  for (let k = 0; k < 3; k++) {
    const tx = viewW * (0.25 + k * 0.28);
    ctx.save();
    ctx.globalAlpha = 0.3;
    drawSwayingTree(
      ctx,
      tx,
      GROUND_Y,
      60 + k * 10,
      32,
      "rgba(40,50,48,0.8)",
      "rgba(50,62,58,0.8)",
      t,
      k,
    );
    ctx.restore();
  }
  for (let layer = 0; layer < 3; layer++) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#c8d4d4";
    const fo2 = (t * (3 + layer * 2)) % 240;
    for (let x = -fo2; x < viewW; x += 240) {
      ctx.beginPath();
      ctx.ellipse(x, GROUND_Y - 15 - layer * 40, 130, 22, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

import { drawWispCoin } from "../coins/wisp.js";
export function drawCoinDesign(ctx: Ctx, r: number) {
  drawWispCoin(ctx, r, "rgba(220,235,225,0.95)");
}

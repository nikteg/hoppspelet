// World: steppe
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
      drawJaggedSilhouette(ctx, GROUND_Y - 15, 40, 110, 240, "rgba(80,90,90,0.45)", 0.03);
      drawJaggedSilhouette(ctx, GROUND_Y - 15, 30, 70, 200, "rgba(60,70,70,0.5)", 0.05);
      // Woolly mammoth
      const mx = Math.max(360, viewW * 0.62);
      ctx.fillStyle = "rgba(70,55,40,0.65)";
      ctx.beginPath();
      ctx.ellipse(mx, GROUND_Y - 30, 40, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(mx - 34, GROUND_Y - 34, 18, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(mx - 20, GROUND_Y - 20, 8, 20);
      ctx.fillRect(mx + 12, GROUND_Y - 20, 8, 20);
      // Trunk + tusk
      ctx.strokeStyle = "rgba(70,55,40,0.65)";
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(mx - 48, GROUND_Y - 28);
      ctx.quadraticCurveTo(mx - 60, GROUND_Y - 12, mx - 52, GROUND_Y - 4);
      ctx.stroke();
      ctx.strokeStyle = "rgba(230,220,200,0.7)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(mx - 46, GROUND_Y - 22);
      ctx.quadraticCurveTo(mx - 58, GROUND_Y - 6, mx - 40, GROUND_Y - 2);
      ctx.stroke();
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Amber lump with prehistoric insect
      ctx.save();
      ctx.shadowColor = "rgba(255,190,90,0.8)";
      ctx.shadowBlur = 10;
      const g = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 1, 0, 0, r * 0.85);
      g.addColorStop(0, "#ffd98a");
      g.addColorStop(1, "#b86a1f");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(60,30,10,0.75)";
      ctx.beginPath();
      ctx.ellipse(0, r * 0.05, r * 0.16, r * 0.24, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
}

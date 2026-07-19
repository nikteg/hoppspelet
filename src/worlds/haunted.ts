// World: haunted
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
      ctx.fillStyle = "rgba(230,230,220,0.5)";
      ctx.beginPath();
      ctx.arc(viewW * 0.78, viewH * 0.18, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      const cx = Math.max(340, viewW * 0.62);
      ctx.fillStyle = "rgba(20,18,25,0.85)";
      ctx.fillRect(cx - 60, GROUND_Y - 110, 120, 110);
      ctx.fillRect(cx - 80, GROUND_Y - 80, 20, 80);
      ctx.fillRect(cx + 60, GROUND_Y - 80, 20, 80);
      ctx.beginPath();
      ctx.moveTo(cx - 80, GROUND_Y - 80);
      ctx.lineTo(cx - 70, GROUND_Y - 105);
      ctx.lineTo(cx - 60, GROUND_Y - 80);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 60, GROUND_Y - 80);
      ctx.lineTo(cx + 70, GROUND_Y - 105);
      ctx.lineTo(cx + 80, GROUND_Y - 80);
      ctx.closePath();
      ctx.fill();

      // Bats
      for (let i = 0; i < 4; i++) {
        const spd = 15 + i * 6;
        const bx3 = ((t * spd + i * 220) % (viewW + 100)) - 50;
        const by3 = viewH * 0.2 + Math.sin(t * 2 + i) * 20 + i * 15;
        drawBird(ctx, bx3, by3, 7, t, i * 5, "rgba(10,10,15,0.8)");
      }

      // Tombstones
      drawGroundProp(ctx, Math.max(400, viewW * 0.48), GROUND_Y, "tombstone", "rgba(60,60,65,0.7)");
      drawGroundProp(ctx, Math.max(460, viewW * 0.55), GROUND_Y, "tombstone", "rgba(60,60,65,0.7)");

      // Fog along the ground
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#a8c9a8";
      const fogOffset = (t * 5) % 200;
      for (let x = -fogOffset; x < viewW; x += 200) {
        ctx.beginPath();
        ctx.ellipse(x, GROUND_Y - 5, 110, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      ctx.save();
      ctx.shadowColor = "rgba(140,255,170,0.9)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "rgba(210,255,220,0.85)";
      ctx.beginPath();
      ctx.arc(0, -r * 0.2, r * 0.75, Math.PI, 0, false);
      ctx.lineTo(r * 0.75, r * 0.6);
      ctx.lineTo(r * 0.35, r * 0.3);
      ctx.lineTo(0, r * 0.6);
      ctx.lineTo(-r * 0.35, r * 0.3);
      ctx.lineTo(-r * 0.75, r * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#1a1a22";
      ctx.beginPath();
      ctx.arc(-r * 0.25, -r * 0.2, r * 0.12, 0, Math.PI * 2);
      ctx.arc(r * 0.25, -r * 0.2, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
}

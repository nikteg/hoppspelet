// World: library
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
      // Walls of bookshelves in back + floating books + ladder
      const shelfCols = [
        "rgba(120,50,40,0.5)",
        "rgba(50,80,110,0.5)",
        "rgba(90,110,50,0.5)",
        "rgba(130,100,40,0.5)",
      ];
      const shelfScroll = game.distance * 0.05;
      const so = shelfScroll % 26;
      const shelfBase = Math.floor(shelfScroll / 26) * 26; // stable book colors on wrap
      for (let bx = -26; bx < viewW; bx += 26) {
        const x = bx - so;
        const wcol = bx + shelfBase;
        for (let row = 0; row < 4; row++) {
          ctx.fillStyle = shelfCols[((Math.floor(wcol / 26) % 4) + 4 + row) % 4];
          const bh = 60 + ((((wcol + row) % 3) + 3) % 3) * 12;
          ctx.fillRect(x, GROUND_Y - 40 - row * 62 - bh + 60, 20, bh);
        }
      }
      // Horizontal shelves
      ctx.fillStyle = "rgba(50,30,15,0.5)";
      for (let row = 0; row < 4; row++) ctx.fillRect(0, GROUND_Y - 40 - row * 62, viewW, 5);
      // Floating books
      for (let i = 0; i < 4; i++) {
        const bx = ((t * (10 + i * 3) + i * 200) % (viewW + 60)) - 30;
        const by = viewH * 0.3 + Math.sin(t + i) * 20;
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(Math.sin(t + i) * 0.2);
        ctx.fillStyle = shelfCols[i % 4].replace("0.5", "0.8");
        ctx.fillRect(-8, -6, 16, 12);
        ctx.strokeStyle = "rgba(255,240,200,0.6)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(0, 6);
        ctx.stroke();
        ctx.restore();
      }
}

import { drawStarShape, drawGearSpike } from "../sprites.js";

export function drawCoinDesign(ctx: Ctx, r: number) {
      // Book with gold title
      ctx.save();
      ctx.rotate(-0.15);
      ctx.shadowColor = "rgba(230,210,160,0.7)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#7a3428";
      ctx.fillRect(-r * 0.7, -r * 0.9, r * 1.4, r * 1.8);
      ctx.fillStyle = "#a04a38";
      ctx.fillRect(-r * 0.7, -r * 0.9, r * 0.3, r * 1.8);
      ctx.strokeStyle = "#ffd98a";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(-r * 0.25, -r * 0.6, r * 0.75, r * 0.5);
      ctx.beginPath();
      ctx.moveTo(-r * 0.2, r * 0.3);
      ctx.lineTo(r * 0.45, r * 0.3);
      ctx.stroke();
      ctx.restore();
}

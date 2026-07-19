// Coin: nugget
import type { Ctx } from "../types.js";

export function drawNuggetCoin(ctx: Ctx, r: number, golden: boolean) {
  // Angular chunk - gold nugget for the giant, red ore on Mars
  const gold = golden;
  ctx.save();
  ctx.shadowColor = gold ? "rgba(255,220,120,0.9)" : "rgba(255,150,90,0.8)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = gold ? "#e8b33a" : "#c05a2e";
  ctx.beginPath();
  ctx.moveTo(-r * 0.8, r * 0.4);
  ctx.lineTo(-r * 0.5, -r * 0.5);
  ctx.lineTo(r * 0.15, -r * 0.8);
  ctx.lineTo(r * 0.8, -r * 0.2);
  ctx.lineTo(r * 0.6, r * 0.55);
  ctx.lineTo(-r * 0.2, r * 0.75);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = gold ? "#fff0b0" : "rgba(60,20,10,0.5)";
  ctx.beginPath();
  ctx.arc(-r * 0.15, -r * 0.15, r * 0.16, 0, Math.PI * 2);
  ctx.arc(r * 0.3, r * 0.15, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

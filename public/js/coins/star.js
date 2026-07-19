import { drawStarShape } from "../sprites.js";
export function drawStarCoin(ctx, r) {
    ctx.save();
    ctx.shadowColor = "rgba(255,255,200,0.9)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#fff6c8";
    drawStarShape(ctx, 0, 0, r, r * 0.45);
    ctx.fill();
    ctx.restore();
}
